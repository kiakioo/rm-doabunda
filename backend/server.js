const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// PERBAIKAN: Konfigurasi CORS agar menerima request dari domain Vercel Anda
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Cek koneksi backend
app.get('/', (req, res) => {
    res.json({ message: 'API RM. DOA BUNDA Berjalan di Vercel' });
});

// Import & Gunakan Routes (Pastikan penulisan file case-sensitive sesuai GitHub)
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menus', require('./routes/menuRoutes'));
app.use('/api/transactions', require('./routes/transaksiRoutes'));
app.use('/api/rekap', require('./routes/rekapRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

// Global Error Handler untuk menangkap detail error database
app.use((err, req, res, next) => {
    console.error("Backend Error:", err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Internal Server Error', 
        error: err.message 
    });
});

// EKSPOR UNTUK VERCEL (Hapus app.listen untuk produksi)
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;