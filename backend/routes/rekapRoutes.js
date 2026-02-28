const express = require('express');
const router = express.Router();

const { 
    generateDailyRecap, 
    getSummary, 
    getHistory 
} = require('../controllers/rekapController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// 1. POST /api/rekap/generate -> Untuk tombol "Tutup Shift"
router.post('/generate', verifyToken, verifyAdmin, generateDailyRecap);

// 2. GET /api/rekap/summary -> Untuk Ringkasan di Admin Dashboard
router.get('/summary', verifyToken, getSummary);

// 3. GET /api/rekap -> Untuk tabel Arsip Keuangan di halaman Rekap Harian
router.get('/', verifyToken, getHistory);

module.exports = router;