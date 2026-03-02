const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🛠️ PERBAIKAN CORS: Vercel melarang origin '*' jika credentials true
// Gunakan konfigurasi yang lebih aman agar tidak error di production
const allowedOrigins = [
  'https://rm-doabunda1.vercel.app', // Domain Frontend Anda
  'http://localhost:5173'           // Local development
];

app.use(cors({
    origin: function (origin, callback) {
        // Izinkan request tanpa origin (seperti mobile apps atau curl)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            return callback(new Error('CORS Policy: Origin not allowed'), false);
        }
        return callback(null, true);
    },
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Rute Cek Kesehatan (Gunakan rute dasar agar Vercel dashboard mendeteksi status online)
app.get('/api/health', (req, res) => {
  res.json({ 
    message: 'API RM DOA BUNDA Berjalan Normal!',
    status: 'Online',
    timestamp: new Date()
  });
});

// Import Rute 
const authRoutes = require('./routes/authRoutes');
const menuRoutes = require('./routes/menuRoutes');
const transaksiRoutes = require('./routes/transaksiRoutes');
const rekapRoutes = require('./routes/rekapRoutes');
const userRoutes = require('./routes/userRoutes');
const expenseRoutes = require('./routes/expenseRoutes');

// Gunakan Rute
app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/transactions', transaksiRoutes);
app.use('/api/rekap', rekapRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

// Penanganan 404 - Harus diletakkan SETELAH rute API
app.use('/api/*', (req, res) => {
    res.status(404).json({ 
        success: false, 
        message: `Endpoint ${req.originalUrl} tidak ditemukan pada server.` 
    });
});

// Error Handler Global
app.use((err, req, res, next) => {
    console.error("🔥 DETAIL ERROR SERVER:", err);
    const statusCode = err.status || 500;
    res.status(statusCode).json({ 
        success: false, 
        message: statusCode === 500 ? 'Internal Server Error' : err.message,
        error: process.env.NODE_ENV === 'development' ? err.message : undefined 
    });
});

// PENTING: Untuk Vercel, jangan gunakan app.listen di rute utama
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;