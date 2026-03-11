import axios from 'axios';
import { API_URL } from './utils';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || API_URL,
    withCredentials: true, // Important for cookies/sessions
});

export default api;
