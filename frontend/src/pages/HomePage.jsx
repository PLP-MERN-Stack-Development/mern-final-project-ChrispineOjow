import { Button } from "@/components/ui/button";
import StatisticCard from "../components/StatisticCard";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { reportsAPI } from "../lib/api";
import { Spinner } from "@/components/ui/spinner";


function HomePage(){

    //This is to navigate to the reports page
    const navigate = useNavigate();

    // State for statistics
    const [statistics, setStatistics] = useState({
        total: 0,
        waterAvailable: 0,
        cleanWater: 0,
        availableAndClean: 0,
        availableButNotClean: 0,
        noWater: 0,
        notCleanWater: 0
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch statistics on component mount
    useEffect(() => {
        const fetchStatistics = async () => {
            try {
                setLoading(true);
                const stats = await reportsAPI.getStats();
                setStatistics(stats);
                setError(null);
            } catch (err) {
                console.error("Error fetching statistics:", err);
                setError("Failed to load statistics");
            } finally {
                setLoading(false);
            }
        };

        fetchStatistics();
    }, []);

    const handleViewReports = () =>  {
        
        navigate("/reports");
    }

    const handleAddReport = () =>{
        navigate("/addReports");
    }

    return(
        <>

          
            <div className="p-10 text-center h-screen w-full bg-gray-200 bg-center bg-cover bg-no-repeat [background-image:url('/images/HomeBackground.jpg')]">
                <h1 className=" font-bold text-4xl">Community Water Tracking</h1>
                <h2 className="mt-15 font-semibold text-2xl">Track water availability and quality in your area</h2>

                <div className="mt-10">
                    <Button className="bg-black text-white m-5 hover:cursor-pointer h-10" onClick={handleAddReport}>Add Water Report</Button>
                    <Button className="bg-black text-white m-5 hover:cursor-pointer h-10" onClick={handleViewReports}>View Reports</Button>
                </div>
            </div>


            <div className="py-12">
                <h1 className="text-center mt-5 font-bold text-2xl">Recent Statistics</h1>
                {error && (
                    <p className="text-center text-red-500 mt-4">{error}</p>
                )}
                <div className="flex justify-center flex-wrap gap-4">

                    <StatisticCard>
                        <h3 className="text-center font-semibold text-xl mb-4">Total Reports</h3>
                        {loading ? (
                            <div className="flex justify-center">
                             <Spinner/>
                            </div>
                        ) : (
                            <p className="text-center text-3xl font-bold">{statistics.total}</p>
                        )}
                    </StatisticCard>

                    <StatisticCard>
                        <h3 className="text-center font-semibold text-xl mb-4">Water Available</h3>
                        {loading ? (
                            <div className="flex justify-center">
                             <Spinner/>
                            </div>
                        ) : (
                            <p className="text-center text-3xl font-bold">{statistics.waterAvailable}</p>
                        )}
                    </StatisticCard>

                    <StatisticCard>
                        <h3 className="text-center font-semibold text-xl mb-4">Clean Water</h3>
                        {loading ? (
                            <div className="flex justify-center">
                             <Spinner/>
                            </div>
                        ) : (
                            <p className="text-center text-3xl font-bold">{statistics.cleanWater}</p>
                        )}
                    </StatisticCard>

                    <StatisticCard>
                        <h3 className="text-center font-semibold text-xl mb-4">No Water</h3>
                        {loading ? (
                            <div className="flex justify-center">
                             <Spinner/>
                            </div>
                        ) : (
                            <p className="text-center text-3xl font-bold">{statistics.noWater}</p>
                        )}
                    </StatisticCard>

                    <StatisticCard>
                        <h3 className="text-center font-semibold text-xl mb-4">Not Clean Water</h3>
                        {loading ? (
                            <div className="flex justify-center">
                             <Spinner/>
                            </div>
                        ) : (
                            <p className="text-center text-3xl font-bold">{statistics.notCleanWater}</p>
                        )}
                    </StatisticCard>
                </div>

            </div> 


            <div className="py-12 ">
                <h1 className="text-center font-bold text-2xl ">Recent Reports from Your Area</h1>
                <div className="flex items-center justify-center gap-4">
                    <StatisticCard className="w-[70%] flex flex-col items-center justify-center">
                        <h2 className="font-semibold text-center text-lg mb-4">Water Available and Clean</h2>
                        {loading ? (
                           <div className="flex justify-center">
                             <Spinner/>
                            </div>
                        ) : (
                            <p className="text-center text-3xl font-bold">{statistics.availableAndClean}</p>
                        )}
                    </StatisticCard>

                    <StatisticCard className="w-[70%] flex flex-col items-center justify-center">
                        <h2 className="font-semibold text-center text-lg mb-4">Water Available but Not Clean</h2>
                        {loading ? (
                            <div className="flex justify-center">
                             <Spinner/>
                            </div>
                        ) : (
                            <p className="text-center text-3xl font-bold">{statistics.availableButNotClean}</p>
                        )}
                    </StatisticCard>
                </div>

            
            </div>   
        
        
        </>
    )
}

export default HomePage;