import axios from 'axios';

// Mengambil URL dari Environment Variable Vercel (VITE_API_URL)
// Jika sedang di komputer lokal dan variabel tidak ada, otomatis pakai localhost:5000
const api = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api` || 'http://localhost:5000/api',
});

// Interceptor: Otomatis menempelkan token keamanan di setiap request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;