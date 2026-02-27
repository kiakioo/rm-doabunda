// backend/server.js
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Untuk Vercel / reverse proxy
app.set('trust proxy', true);

// Konfigurasi CORS — jika ingin lebih aman, ganti origin ke domain production Anda
app.use(cors({
  origin: '*', // contoh: 'https://rm-doabunda1.vercel.app'
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

// Cek koneksi backend
app.get('/', (req, res) => {
  res.json({ message: 'API RM. DOA BUNDA Berjalan di Vercel' });
});

// Import & Gunakan Routes (Pastikan case-sensitive sesuai repo)
try {
  app.use('/api/auth', require('./routes/authRoutes'));
  app.use('/api/menus', require('./routes/menuRoutes'));
  app.use('/api/transactions', require('./routes/transaksiRoutes'));
  app.use('/api/rekap', require('./routes/rekapRoutes'));
  app.use('/api/users', require('./routes/userRoutes'));
  app.use('/api/expenses', require('./routes/expenseRoutes'));
} catch (err) {
  console.error('Error while mounting routes:', err);
}

// Global Error Handler untuk menangkap detail error database
app.use((err, req, res, next) => {
  console.error("Backend Error:", err && err.stack ? err.stack : err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err && err.message ? err.message : 'unknown'
  });
});

// EKSPOR UNTUK VERCEL (jangan panggil app.listen di produksi Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;