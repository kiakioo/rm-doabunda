const express = require('express');
const router = express.Router();

const { generateDailyRecap, getRecapHistory } = require('../controllers/rekapController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// POST /api/rekap/generate
router.post('/generate', verifyToken, verifyAdmin, generateDailyRecap);

// GET /api/rekap/summary
router.get('/summary', verifyToken, verifyAdmin, getRecapHistory);

module.exports = router;