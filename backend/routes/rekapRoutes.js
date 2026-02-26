const express = require('express');
const router = express.Router();

// PASTIKAN KEDUA FUNGSI DI-IMPORT DI SINI
const { generateDailyRecap, getRecapHistory } = require('../controllers/rekapController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Rute untuk melakukan rekap harian (Tutup Shift)
router.post('/generate', verifyToken, verifyAdmin, generateDailyRecap);

// Rute untuk membaca histori rekap harian
router.get('/', verifyToken, verifyAdmin, getRecapHistory);

module.exports = router;