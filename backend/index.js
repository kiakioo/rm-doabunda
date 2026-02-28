const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ 
    message: 'API RM DOA BUNDA Berjalan!',
    status: 'Online',
    time: new Date().toISOString()
    });
});

const authRoutes = require(path.resolve(__dirname, 'routes/authRoutes'));
const menuRoutes = require(path.resolve(__dirname, 'routes/menuRoutes'));
const transaksiRoutes = require(path.resolve(__dirname, 'routes/transaksiRoutes'));
const rekapRoutes = require(path.resolve(__dirname, 'routes/rekapRoutes'));
const userRoutes = require(path.resolve(__dirname, 'routes/userRoutes'));
const expenseRoutes = require(path.resolve(__dirname, 'routes/expenseRoutes'));

app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/transactions', transaksiRoutes);
app.use('/api/rekap', rekapRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes);

app.use((err, req, res, next) => {
    console.error("Backend Error Terdeteksi:", err);
    res.status(500).json({ success: false, message: 'Server Backend Error', error: err.message });
});

app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

app.use((err, req, res, next) => {
    console.error("DETAIL ERROR:", err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Terjadi kesalahan pada server', 
        error: err.message 
    });
});

module.exports = app;