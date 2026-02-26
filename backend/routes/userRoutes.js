const express = require('express');
const router = express.Router();
const { getUsers, createUser, deleteUser } = require('../controllers/userController');
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// Semua rute user hanya boleh diakses oleh Admin
router.get('/', verifyToken, verifyAdmin, getUsers);
router.post('/', verifyToken, verifyAdmin, createUser);
router.delete('/:id', verifyToken, verifyAdmin, deleteUser);

module.exports = router;