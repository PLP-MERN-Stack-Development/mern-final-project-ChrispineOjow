import axios from "axios";

const NOMINATIM_BASE = 'https://nominatim.openstreetmap.org/reverse';
const USER_AGENT = 'WaterTrackingApp/1.0 (wameyochrispine@gmail.com)';

export async function getReportLocationName(lon, lat) {
    if (!lon || !lat) return 'Invalid Coordinates';
    
    try {
        const response = await axios.get(NOMINATIM_BASE, {
            params: {
                lat: lat,
                lon: lon,
                format: 'json',
                addressdetails: 1,
            },
            headers: {
                'User-Agent': USER_AGENT 
            }
        });
        const data = response.data;
        
        if (data && data.display_name) {
           
            return data.display_name; 
            
        }

        return 'Location Name Not Found';

    }catch(error){
        console.error("Backend Geocoding Error:", error.message);
        // Fallback to coordinates
        return `(${lat.toFixed(4)}, ${lon.toFixed(4)})`;
    };
}

