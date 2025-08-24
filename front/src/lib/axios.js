import axios from "axios";
const SETUP = import.meta.env.VITE_SETUP;

export const axiosInstance = axios.create({
    baseURL:SETUP=="DEVELOPMENT"?import.meta.env.VITE_API_URL_LOCAL:import.meta.env.VITE_API_URL_PUBLIC,
    withCredentials:true
});

// Add token to requests if stored in localStorage (fallback for blocked cookies)
axiosInstance.interceptors.request.use((config) => {
    const token = localStorage.getItem('jwt');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});