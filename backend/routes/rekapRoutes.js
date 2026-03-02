const express = require('express');
const router = express.Router();
const { generateDailyRecap, getSummary, getHistory, deleteRekap } = require('../controllers/rekapController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/', verifyToken, verifyAdmin, generateDailyRecap); // Tutup Buku
router.get('/', verifyToken, verifyAdmin, getHistory); // Ambil List Laporan
router.get('/summary', verifyToken, getSummary); // Dashboard Stats
router.delete('/:id', verifyToken, verifyAdmin, deleteRekap); // Hapus Laporan

module.exports = router;