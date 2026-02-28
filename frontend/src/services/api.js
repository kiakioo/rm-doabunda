import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL}/api` 
    : 'https://rm-doabunda.vercel.app/api';

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
});

// Attach token otomatis
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Logging error
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error(
      '[API ERROR]',
      error?.response?.status,
      error?.response?.data || error.message
    );
    return Promise.reject(error);
  }
);

export default api;