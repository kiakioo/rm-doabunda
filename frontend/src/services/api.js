// frontend/src/services/api.js
import axios from 'axios';

const getBaseURL = () => {
  const envUrl = import.meta.env.VITE_API_URL;

  // 🔥 Jika di production Vercel dan belum set env, pakai backend project langsung
  if (import.meta.env.PROD) {
    const prodURL = envUrl || 'https://rm-doabunda.vercel.app';
    return prodURL.endsWith('/') ? prodURL.slice(0, -1) : prodURL;
  }

  // Local development
  const localURL = envUrl || 'http://localhost:5000';
  return localURL.endsWith('/') ? localURL.slice(0, -1) : localURL;
};

const api = axios.create({
  baseURL: `${getBaseURL()}/api`,
  timeout: 10000
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

// Logging error rapi
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