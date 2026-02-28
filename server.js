const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API RM DOA BUNDA Running' });
});

app.use('/api/auth', require('./backend/routes/authRoutes'));
app.use('/api/menus', require('./backend/routes/menuRoutes'));
app.use('/api/transactions', require('./backend/routes/transaksiRoutes'));
app.use('/api/rekap', require('./backend/routes/rekapRoutes'));
app.use('/api/users', require('./backend/routes/userRoutes'));
app.use('/api/expenses', require('./backend/routes/expenseRoutes'));

module.exports = app;