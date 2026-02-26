const express = require('express');
const router = express.Router();
const { getMenus, createMenu, updateMenu, deleteMenu } = require('../controllers/menuController');

// --- IMPORT SATPAM (MIDDLEWARE) ---
const { verifyToken, verifyAdmin } = require('../middleware/authMiddleware');

// URL Endpoint
// Kasir & Admin boleh melihat daftar menu (Cukup verifyToken)
router.get('/', verifyToken, getMenus);          

// HANYA Admin yang boleh tambah, edit, dan hapus (Butuh verifyToken + verifyAdmin)
router.post('/', verifyToken, verifyAdmin, createMenu);       
router.put('/:id', verifyToken, verifyAdmin, updateMenu);     
router.delete('/:id', verifyToken, verifyAdmin, deleteMenu);  

module.exports = router;