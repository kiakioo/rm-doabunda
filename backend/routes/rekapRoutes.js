const express = require('express');
const router = express.Router();

const { generateDailyRecap, getRecapHistory } = require('../controllers/rekapController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.post('/generate', verifyToken, verifyAdmin, generateDailyRecap);

router.get('/summary', verifyToken, getRecapHistory);

module.exports = router;