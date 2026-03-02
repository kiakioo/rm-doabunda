const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 🛠️ PERBAIKAN CORS: Mendukung semua metode yang dibutuhkan Frontend
app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));

app.use(express.json());

// Rute Cek Kesehatan
app.get('/', (req, res) => {
  res.json({ 
    message: 'API RM DOA BUNDA Berjalan Normal!',
    status: 'Online'
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

// Penanganan 404
app.use((req, res) => {
    res.status(404).json({ 
        success: false, 
        message: `Endpoint ${req.originalUrl} tidak ditemukan pada server.` 
    });
});

// Error Handler Global
app.use((err, req, res, next) => {
    console.error("DETAIL ERROR:", err);
    res.status(err.status || 500).json({ 
        success: false, 
        message: 'Internal Server Error', 
        error: err.message 
    });
});

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;