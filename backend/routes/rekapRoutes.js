const express = require('express');
const router = express.Router();

const { 
    generateDailyRecap, 
    getSummary, 
    getHistory 
} = require('../controllers/rekapController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/generate', verifyToken, verifyAdmin, generateDailyRecap);

router.get('/summary', verifyToken, getSummary);
router.get('/', verifyToken, getHistory);

module.exports = router;