const express = require('express');
const router = express.Router();
const { login } = require('../controllers/authController');

// URL Endpoint: POST http://localhost:5000/api/auth/login
router.post('/login', login);

module.exports = router;