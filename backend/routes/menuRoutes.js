const express = require('express');
const router = express.Router();
const {
  getMenus,
  createMenu,
  deleteMenu
} = require('../controllers/menuController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getMenus);
router.post('/', verifyToken, createMenu);
router.delete('/:id', verifyToken, deleteMenu);

module.exports = router;