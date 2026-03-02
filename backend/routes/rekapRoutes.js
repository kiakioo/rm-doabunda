const express = require('express');
const router = express.Router();

// Mengambil semua fungsi yang diperlukan dari controller
const { 
    generateDailyRecap, 
    updateExtraIncome, 
    getSummary, 
    getHistory, 
    deleteRekap 
} = require('../controllers/rekapController');

// Menggunakan middleware proteksi yang Anda miliki
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// 1. POST: Melakukan Tutup Buku / Generate Rekap (Hanya Admin)
// Endpoint diubah dari '/generate' ke '/' agar sesuai dengan panggilan api.post('/rekap') di Frontend
router.post('/', verifyToken, verifyAdmin, generateDailyRecap);

// 2. GET: Mengambil Ringkasan Pendapatan & Transaksi Hari Ini (Admin & Kasir)
router.get('/summary', verifyToken, getSummary);

// 3. GET: Mengambil Semua Arsip Laporan Keuangan (Admin)
router.get('/', verifyToken, verifyAdmin, getHistory);

// 4. PATCH: Menambahkan Dana Masuk Tambahan (Sisa uang pasar, dll)
// Menangani error CORS Method PATCH yang sebelumnya Anda alami
router.patch('/extra-income', verifyToken, verifyAdmin, updateExtraIncome);

// 5. DELETE: Menghapus Baris Laporan Keuangan (Untuk keperluan uji coba)
router.delete('/:id', verifyToken, verifyAdmin, deleteRekap);

module.exports = router;