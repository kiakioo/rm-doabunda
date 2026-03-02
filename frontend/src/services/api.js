import axios from 'axios';

// 🛠️ PERBAIKAN URL: Memastikan tidak ada double slash atau rute yang salah
const rawBaseUrl = import.meta.env.VITE_API_URL || 'https://rm-doabunda.vercel.app';
export const API_URL = `${rawBaseUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL: API_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach token otomatis dengan interceptor yang lebih stabil
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      // Menggunakan cara penulisan header yang lebih aman bagi Axios
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Tambahkan interceptor respon untuk menangani error 401 (Token Expired) secara global
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = '/'; // Lempar ke login jika token tidak valid
    }
    return Promise.reject(error);
  }
);

export default api;