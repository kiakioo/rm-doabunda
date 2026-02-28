const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: '*', 
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API RM DOA BUNDA Running' });
});

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/menus', require('./routes/menuRoutes'));
app.use('/api/transactions', require('./routes/transaksiRoutes'));
app.use('/api/rekap', require('./routes/rekapRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/expenses', require('./routes/expenseRoutes'));

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;