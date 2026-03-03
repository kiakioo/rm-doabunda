const express = require('express');
const router = express.Router();
const { getKasInfo, addPayout, deletePayout } = require('../controllers/payoutController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

router.get('/', verifyToken, verifyAdmin, getKasInfo);
router.post('/', verifyToken, verifyAdmin, addPayout);
router.delete('/:id', verifyToken, verifyAdmin, deletePayout);

module.exports = router;