const express = require('express');
const router = express.Router();
const { login, register, getMe } = require('../controllers/authController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Hanya berisi rute untuk Otentikasi
router.post('/login', login);
router.post('/register', verifyToken, verifyAdmin, register);
router.get('/me', verifyToken, getMe);

module.exports = router;