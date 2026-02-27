// backend/middleware/authMiddleware.js
const jwt = require('jsonwebtoken');
require('dotenv').config();

// 1. Satpam Pintu Utama: Cek apakah user sudah login (punya Token)
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'] || req.headers['Authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      console.warn('[authMiddleware] No token provided - request:', req.method, req.originalUrl);
      return res.status(401).json({ message: 'Akses ditolak. Anda belum login!' });
    }

    const secret = process.env.JWT_SECRET || 'rahasia_doa_bunda_123';
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('[authMiddleware] Token verify error:', err && err.message ? err.message : err);
    return res.status(403).json({ message: 'Sesi telah habis atau token tidak valid. Silakan login ulang!' });
  }
};

// 2. Satpam Ruang VIP: Cek apakah jabatannya Admin
const verifyAdmin = (req, res, next) => {
  try {
    if (!req.user || req.user.role !== 'admin') {
      console.warn('[authMiddleware] Access denied for non-admin:', req.user ? req.user : 'no user');
      return res.status(403).json({ message: 'Akses ditolak. Hanya Admin yang boleh melakukan tindakan ini!' });
    }
    next();
  } catch (err) {
    console.error('[authMiddleware] verifyAdmin error:', err);
    return res.status(500).json({ message: 'Terjadi kesalahan otorisasi' });
  }
};

module.exports = { verifyToken, verifyAdmin };