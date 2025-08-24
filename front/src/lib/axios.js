import axios from "axios";
const SETUP = import.meta.env.VITE_SETUP;

export const axiosInstance = axios.create({
    baseURL:SETUP=="DEVELOPMENT"?import.meta.env.VITE_API_URL_LOCAL:import.meta.env.VITE_API_URL_PUBLIC,
    withCredentials:true
});