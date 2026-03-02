const express = require('express');
const cors = require('cors');

// Hanya load dotenv di lokal. Vercel sudah memiliki Environment Variables-nya sendiri.
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}

const app = express();

const allowedOrigins = [
  'https://rm-doabunda1.vercel.app', // Domain Frontend Anda
  'http://localhost:5173'           // Local development (Vite)
];

app.use(cors({
    origin: function (origin, callback) {
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

// 1. RUTE UTAMA (Mencegah error saat membuka URL rm-doabunda.vercel.app secara langsung)
app.get('/', (req, res) => {
    res.status(200).json({
        message: "Selamat datang di API POS RM Doa Bunda",
        status: "Server is Running"
    });
});

// 2. RUTE CEK KESEHATAN
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

// Registrasi Rute API
app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/transactions', transaksiRoutes);
app.use('/api/rekap', rekapRoutes); 
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

// 🛠️ PERBAIKAN CRITICAL VERCEL (Khusus Express 5.x)
// Menghapus penggunaan string `*` atau `(.*)` yang membuat server Vercel crash.
// Middleware tanpa path ini otomatis menangkap SEMUA URL yang tidak terdaftar di atas.
app.use((req, res, next) => {
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
        error: process.env.NODE_ENV !== 'production' ? err.message : undefined 
    });
});

// Mencegah app.listen berjalan ganda di dalam environment Vercel
if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
}

module.exports = app;