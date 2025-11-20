import axios from "axios";

const rawBaseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const normalizedBaseUrl = rawBaseUrl.endsWith('/api')
    ? rawBaseUrl
    : `${rawBaseUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
    baseURL: normalizedBaseUrl,
    headers: {
        'Content-Type': 'application/json'
    }
});


export const reportsAPI = {
    
    //Get all reports
    getAll: async ()=>{
        const response = await api.get('/reports');
        return response.data
    },

    //Get a single report
    getById: async (id)=>{

        const response = await api.get(`/reports/${id}`);
        return response.data;

    },

    // Create report
    create: async (reportData)=>{

        const response = await api.post('/reports',reportData);
        return response.data;
    },

    //Update report
    update: async(id, reportData) =>{

        const response = await api.put(`/reports/${id}`, reportData)
        return response.data

    },

    //Delete Report

    delete: async(id) =>{
        const response = await api.delete(`/reports/${id}`);
        return response.data
    },

    //Get nearby reports
    getNearby: async(lat, lng, radius=5)=>{
        const response = await api.get(`/reports/nearby?lat=${lat}&lng=${lng}&radius=${radius}`);
        return response.data;
    },

    //Get statistics
    getStats: async()=>{
        const response = await api.get('/reports');
        const reports = response.data.reports || response.data || []

        return{
            total: reports.length,
            waterAvailable: reports.filter(r=> r.waterAvailable).length,
            cleanWater: reports.filter(r => r.waterClean).length,
            availableAndClean: reports.filter(r => r.waterAvailable && r.waterClean).length,
            availableButNotClean: reports.filter(r => r.waterAvailable && !r.waterClean).length,
            noWater: reports.filter(r => !r.waterAvailable).length,
            notCleanWater: reports.filter(r => !r.waterClean).length
        }
    }

}

export const userAPI = {
    // Get or create user by clerkId
    getOrCreateUser: async(clerkId, name, email, coordinates) => {
        try {
            // First try to get user by clerkId
            const response = await api.get(`/user/clerk/${clerkId}`);
            return response.data;
        } catch (error) {
            // If user doesn't exist, create one
            if (error.response?.status === 404) {
                try {
                    const createResponse = await api.post('/user', {
                        clerkId,
                        name,
                        email,
                        coordinates: coordinates || [0, 0], // [longitude, latitude] for MongoDB
                        role: 'user'
                    });
                    return createResponse.data;
                } catch (createError) {
                    // If creation fails (e.g., duplicate email), try to get user again
                    if (createError.response?.status === 400 || createError.response?.status === 409) {
                        const retryResponse = await api.get(`/user/clerk/${clerkId}`);
                        return retryResponse.data;
                    }
                    throw createError;
                }
            }
            throw error;
        }
    },

    // Get user by clerkId
    getUserByClerkId: async(clerkId) => {
        const response = await api.get(`/user/clerk/${clerkId}`);
        return response.data;
    }
}

export default api;