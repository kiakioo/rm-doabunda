// frontend/src/services/api.js
import axios from 'axios';

const getBaseURL = () => {
  // VITE_API_URL harus diset di Vercel (Project > Environment Variables)
  const envUrl = import.meta.env.VITE_API_URL;
  const fallback = 'http://localhost:5000';
  const url = envUrl || fallback;
  return url.endsWith('/') ? url.slice(0, -1) : url;
};

const api = axios.create({
  baseURL: `${getBaseURL()}/api`,
  timeout: 10000
});

// Request: attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response: uniform error handling + logging
api.interceptors.response.use((response) => {
  return response;
}, (error) => {
  console.error('[API ERROR]', error?.response?.status, error?.response?.data || error.message);
  // Optional: you can transform some statuses to user-friendly messages here
  return Promise.reject(error);
});

export default api;