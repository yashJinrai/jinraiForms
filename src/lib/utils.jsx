export const BASE_URL = import.meta.env.VITE_API_URL 
    ? import.meta.env.VITE_API_URL.replace('/api/v1/jinraiForm', '') 
    : "http://localhost:5002";

export const API_URL = `${BASE_URL}/api/v1/jinraiForm`;

export const getImageUrl = (url) => {
    if (!url) return '';
    if (url.startsWith('http')) return url;
    // Ensure relative paths start with /
    const path = url.startsWith('/') ? url : `/${url}`;
    return `${BASE_URL}${path}`;
};
