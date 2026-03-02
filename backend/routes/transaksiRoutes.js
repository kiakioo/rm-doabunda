const express = require('express');
const router = express.Router();

// Import verifyAdmin juga agar hanya Admin yang bisa menghapus transaksi (opsional tapi disarankan)
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');
const {
  checkoutTransaction,
  getTransactions,
  deleteTransaction // Import fungsi baru
} = require('../controllers/transaksiController');

router.post('/checkout', verifyToken, checkoutTransaction);
router.get('/', verifyToken, getTransactions);

// Rute baru untuk menghapus transaksi
router.delete('/:id', verifyToken, verifyAdmin, deleteTransaction);

module.exports = router;