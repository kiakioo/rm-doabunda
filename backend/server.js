const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.set('trust proxy', true);

app.use(cors({
  origin: 'https://rm-doabunda1.vercel.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));

app.use(express.json());

app.get('/', (req, res) => {
  res.json({ message: 'API RM. DOA BUNDA Berjalan di Vercel' });
});

try {
  app.use('/api/auth', require('./backend/routes/authRoutes'));
  app.use('/api/menus', require('./backend/routes/menuRoutes'));
  app.use('/api/transactions', require('./backend/routes/transaksiRoutes'));
  app.use('/api/rekap', require('./backend/routes/rekapRoutes'));
  app.use('/api/users', require('./backend/routes/userRoutes'));
  app.use('/api/expenses', require('./backend/routes/expenseRoutes'));
} catch (err) {
  console.error('Error while mounting routes:', err);
}

app.use((err, req, res, next) => {
  console.error("Backend Error:", err && err.stack ? err.stack : err);
  res.status(500).json({
    success: false,
    message: 'Internal Server Error',
    error: err && err.message ? err.message : 'unknown'
  });
});

if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}

module.exports = app;