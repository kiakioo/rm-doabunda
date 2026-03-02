const express = require('express');
const router = express.Router();
const {
  getMenus,
  createMenu,
  updateMenu,
  deleteMenu
} = require('../controllers/menuController');
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, getMenus);
router.put('/:id', verifyToken, updateMenu);
router.post('/', verifyToken, createMenu);
router.delete('/:id', verifyToken, deleteMenu);

module.exports = router;