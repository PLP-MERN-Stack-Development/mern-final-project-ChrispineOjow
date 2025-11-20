import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@clerk/clerk-react";
import { reportsAPI, userAPI } from "../lib/api";
import { Loader2 } from "lucide-react";


function AddReport(){
    const { userId: clerkId, isSignedIn, isLoaded, user } = useAuth();
    const navigate = useNavigate();
    
    const [isAvailable, setIsAvailable] = useState("available")
    const [isClean, setIsClean] = useState("clean")
    const [description, setDescription] = useState("")
    const [latitude, setLatitude] = useState(null)
    const [longitude, setLongitude] = useState(null)
    const [loading, setLoading] = useState(false)
    const [locationLoading, setLocationLoading] = useState(true)
    const [error, setError] = useState(null)
    const [locationError, setLocationError] = useState(null)

    // Get user's location automatically on component mount
    useEffect(() => {
        if (!navigator.geolocation) {
            setLocationError("Geolocation is not supported by your browser");
            setLocationLoading(false);
            return;
        }

        setLocationLoading(true);
        navigator.geolocation.getCurrentPosition(
            (position) => {
                setLatitude(position.coords.latitude);
                setLongitude(position.coords.longitude);
                setLocationError(null);
                setLocationLoading(false);
            },
            (err) => {
                console.error("Error getting location:", err);
                setLocationError("Unable to retrieve your location. Please enable location access or enter coordinates manually.");
                setLocationLoading(false);
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0
            }
        );
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Wait for auth to load
        if (!isLoaded) {
            setError("Loading authentication...");
            return;
        }

        // Check if user is signed in
        if (!isSignedIn || !clerkId) {
            setError("You must be signed in to submit a report. Please sign in first.");
            return;
        }

        if (!latitude || !longitude) {
            setError("Location is required. Please allow location access or enter coordinates manually.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            // Get user email and name from Clerk
            const userEmail = user?.primaryEmailAddress?.emailAddress || user?.emailAddresses?.[0]?.emailAddress || '';
            const userName = user?.fullName || user?.firstName || user?.username || 'User';

            // Get or create user in backend database
            const userData = await userAPI.getOrCreateUser(
                clerkId,
                userName,
                userEmail,
                [longitude, latitude] // [longitude, latitude] for MongoDB
            );

            if (!userData || !userData.user || !userData.user._id) {
                setError("Failed to get or create user. Please try again.");
                setLoading(false);
                return;
            }

            // Create report with userId from backend
            const reportData = {
                userId: userData.user._id,
                location: {
                    coordinates: [longitude, latitude] // [longitude, latitude] as per MongoDB format
                },
                waterAvailable: isAvailable === "available",
                waterClean: isClean === "clean",
                description: description.trim()
            };

            await reportsAPI.create(reportData);
            
            // Navigate to reports page on success
            navigate("/reports");
        } catch (err) {
            console.error("Error submitting report:", err);
            const errorMessage = err.response?.data?.message || 
                                err.response?.data?.error || 
                                err.message || 
                                "Failed to submit report. Please try again.";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        navigate("/reports");
    };

    return(
        <>

            <div className="flex justify-center bg-gray-300 p-12 min-h-screen">
                <div className="text-center w-[90%] bg-white rounded-4xl p-5">
                    <h1 className="text-3xl font-bold mb-6">Submit Water Report</h1>
                    
                    {error && (
                        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit}>
                        <div>
                            <h2 className="m-2 font-semibold text-2xl">Location</h2>
                            {locationLoading ? (
                                <div className="flex items-center justify-center my-5">
                                    <Loader2 className="animate-spin mr-2" />
                                    <span>Getting your location...</span>
                                </div>
                            ) : locationError ? (
                                <div className="mb-4 p-3 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded">
                                    {locationError}
                                </div>
                            ) : (
                                <div className="text-green-600 mb-2">
                                    ✓ Location detected automatically
                                </div>
                            )}
                            
                            <div className="flex justify-center gap-4">
                                <div className="w-[40%]">
                                    <Label>Latitude</Label>
                                    <Input 
                                        type="number" 
                                        step="any"
                                        placeholder="Latitude" 
                                        className="my-2 w-full"
                                        value={latitude || ""}
                                        onChange={(e) => setLatitude(parseFloat(e.target.value) || null)}
                                        required
                                    />
                                </div>
                                <div className="w-[40%]">
                                    <Label>Longitude</Label>
                                    <Input 
                                        type="number" 
                                        step="any"
                                        placeholder="Longitude" 
                                        className="my-2 w-full"
                                        value={longitude || ""}
                                        onChange={(e) => setLongitude(parseFloat(e.target.value) || null)}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="m-4 py-5 ">
                            <h2 className="m-2 font-semibold text-xl">Water Status</h2>
                            <RadioGroup 
                                value={isAvailable}
                                onValueChange={setIsAvailable}
                                className="flex space-x-4 justify-center"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="available" id="waterAvailable" />
                                    <Label htmlFor="waterAvailable">Water is Available</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="unavailable" id="waterUnAvailable" />
                                    <Label htmlFor="waterUnAvailable">Water is not Available</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="m-4 py-3">
                            <h2 className="m-2 font-semibold text-xl">Water Cleanliness</h2>
                            <RadioGroup 
                                value={isClean}
                                onValueChange={setIsClean}
                                className="flex space-x-4 justify-center"
                            >
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="clean" id="waterIsClean" />
                                    <Label htmlFor="waterIsClean">Water is Clean</Label>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <RadioGroupItem value="notClean" id="waterIsNotClean" />
                                    <Label htmlFor="waterIsNotClean">Water is not Clean</Label>
                                </div>
                            </RadioGroup>
                        </div>

                        <div className="m-4 p-5 ">
                            <Label className="text-center mb-5 flex justify-center text-2xl">Description (Optional)</Label>
                            <Textarea 
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Add any additional details about the water condition..."
                                maxLength={500}
                            />
                            <p className="text-sm text-gray-500 mt-1">{description.length}/500</p>
                        </div>

                        <div>
                            <Button 
                                type="button"
                                variant="outline" 
                                className="p-4 m-5 text-gray-700 border-gray-300 hover:cursor-pointer hover:bg-gray-100"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Cancel
                            </Button>
                            <Button 
                                type="submit"
                                className="p-4 m-5 bg-green-600 text-white hover:bg-green-700 hover:cursor-pointer"
                                disabled={loading || locationLoading || !latitude || !longitude}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin mr-2 inline" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Report"
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        
        </>
    )
}


export default AddReport;