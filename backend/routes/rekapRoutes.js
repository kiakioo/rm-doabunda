const express = require('express');
const router = express.Router();
const { 
  generateDailyRecap, 
  getSummary, 
  getHistory, 
  deleteRekap, 
  addExtraIncome 
} = require('../controllers/rekapController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Endpoint Tutup Buku (Closing)
router.post('/', verifyToken, verifyAdmin, generateDailyRecap);

// Endpoint Uang Tambahan (Sisa Pasar, dll)
router.post('/extra-income-log', verifyToken, verifyAdmin, addExtraIncome);

// Laporan & Statistik
router.get('/', verifyToken, verifyAdmin, getHistory);
router.get('/summary', verifyToken, getSummary);
router.delete('/:id', verifyToken, verifyAdmin, deleteRekap);

module.exports = router;