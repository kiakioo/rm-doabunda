const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors()); // Mengizinkan frontend React mengakses backend
app.use(express.json()); // Membaca format JSON dari frontend

app.get('/', (req, res) => {
    res.json({ message: 'Selamat datang di API POS RM. DOA BUNDA!' });
});

const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const menuRoutes = require('./routes/menuRoutes');
app.use('/api/menus', menuRoutes);

const transaksiRoutes = require('./routes/transaksiRoutes');
app.use('/api/transactions', transaksiRoutes);

const rekapRoutes = require('./routes/rekapRoutes');
app.use('/api/rekap', rekapRoutes);

const userRoutes = require('./routes/userRoutes');
app.use('/api/users', userRoutes);

const expenseRoutes = require('./routes/expenseRoutes');
app.use('/api/expenses', expenseRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`=========================================`);
    console.log(`🚀 Server POS berjalan di port ${PORT}`);
    console.log(`=========================================`);
module.exports = app;
});