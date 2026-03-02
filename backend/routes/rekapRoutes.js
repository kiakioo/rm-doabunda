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

router.post('/', verifyToken, verifyAdmin, generateDailyRecap);
router.post('/extra-income-log', verifyToken, verifyAdmin, addExtraIncome);
router.get('/', verifyToken, verifyAdmin, getHistory);
router.get('/summary', verifyToken, getSummary);
router.delete('/:id', verifyToken, verifyAdmin, deleteRekap);

module.exports = router;