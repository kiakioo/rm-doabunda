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

// Rute Cek Kesehatan
app.get('/', (req, res) => {
  res.json({ 
    message: 'API RM DOA BUNDA Berjalan!',
    status: 'Online'
  });
});

const authRoutes = require(path.join(__dirname, 'routes/authRoutes'));
const menuRoutes = require(path.join(__dirname, 'routes/menuRoutes'));
const transaksiRoutes = require(path.join(__dirname, 'routes/transaksiRoutes'));
const rekapRoutes = require(path.join(__dirname, 'routes/rekapRoutes'));
const userRoutes = require(path.join(__dirname, 'routes/userRoutes'));
const expenseRoutes = require(path.join(__dirname, 'routes/expenseRoutes')); 

app.use('/api/auth', authRoutes);
app.use('/api/menus', menuRoutes);
app.use('/api/transactions', transaksiRoutes);
app.use('/api/rekap', rekapRoutes);
app.use('/api/users', userRoutes);
app.use('/api/expenses', expenseRoutes); 

app.use((err, req, res, next) => {
    console.error("DETAIL ERROR:", err.stack);
    res.status(500).json({ 
        success: false, 
        message: 'Server Error', 
        error: err.message 
    });
});

app.use('*', (req, res) => {
    res.status(404).json({ success: false, message: 'Endpoint tidak ditemukan' });
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;