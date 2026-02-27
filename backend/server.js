const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Konfigurasi CORS yang lebih fleksibel untuk Vercel
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());

// Jalur Utama
app.get('/', (req, res) => {
    res.json({ message: 'Selamat datang di API POS RM. DOA BUNDA!' });
});

// Import & Gunakan Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menus', require('./routes/menuRoutes'));
app.use('/api/transactions', require('./routes/transaksiRoutes'));
app.use('/api/rekap', require('./routes/rekapRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

// EKSPOR UNTUK VERCEL (Paling Penting)
module.exports = app;