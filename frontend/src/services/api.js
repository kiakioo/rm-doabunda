import axios from 'axios';

// Pastikan tidak ada double slash di URL
const getBaseURL = () => {
    const url = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    return url.endsWith('/') ? url.slice(0, -1) : url;
};

const api = axios.create({
    baseURL: `${getBaseURL()}/api`,
});

// Interceptor untuk memastikan Token JWT selalu ikut di setiap input data
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default api;