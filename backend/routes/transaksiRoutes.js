const express = require('express');
const router = express.Router();
const { checkoutTransaction, getTransactions } = require('../controllers/transactionController');
const { verifyToken } = require('../middleware/authMiddleware');

router.post('/checkout', verifyToken, checkoutTransaction);
router.get('/', verifyToken, getTransactions);

module.exports = router;