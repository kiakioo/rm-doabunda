const express = require('express');
const router = express.Router();

const { verifyToken } = require('../middleware/authMiddleware');
const {
  checkoutTransaction,
  getTransactions
} = require('../controllers/transaksiController');

router.post('/checkout', verifyToken, checkoutTransaction);
router.get('/', verifyToken, getTransactions);

module.exports = router;