const express = require('express');
const router = express.Router();
const { checkout, getHistory } = require('../controllers/transaksiController');
const { verifyToken } = require('../middleware/authMiddleware');

// URL Endpoint (Semua fitur kasir harus login dulu, jadi kita pakai verifyToken)
router.post('/checkout', verifyToken, checkout); // Endpoint untuk klik Bayar
router.get('/history', verifyToken, getHistory); // Endpoint untuk lihat riwayat hari ini

module.exports = router;