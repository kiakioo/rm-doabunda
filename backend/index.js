const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
allowedHeaders: '*'
}));
app.use(express.json());

app.get('/', (req, res) => {
    res.json({ 
        message: 'API RM DOA BUNDA Berjalan Lancar!',
        database_status: process.env.DB_HOST ? 'Terhubung (Environment Variables Terbaca)' : 'KOSONG (Cek brankas Vercel!)'
    });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menus', require('./routes/menuRoutes'));
app.use('/api/transactions', require('./routes/transaksiRoutes'));
app.use('/api/rekap', require('./routes/rekapRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

app.use((err, req, res, next) => {
    console.error("Backend Error Terdeteksi:", err);
    res.status(500).json({ success: false, message: 'Server Backend Error', error: err.message });
});

app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

module.exports = app;