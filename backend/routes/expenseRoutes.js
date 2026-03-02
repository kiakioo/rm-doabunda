const express = require('express');
const router = express.Router();
const { getExpenses, addExpense, deleteExpense } = require('../controllers/expenseController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, verifyAdmin, getExpenses);
router.post('/', verifyToken, verifyAdmin, addExpense);
router.delete('/:id', verifyToken, verifyAdmin, deleteExpense);

module.exports = router;