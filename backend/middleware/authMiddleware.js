const jwt = require('jsonwebtoken');
require('dotenv').config();

// 1. Satpam Pintu Utama: Cek apakah user sudah login (punya Token)
const verifyToken = (req, res, next) => {
    // Mengambil token dari header request (Format: "Bearer <token_acak>")
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Anda belum login!' });
    }

    try {
        // Membongkar token untuk melihat isinya (id dan role)
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Menyimpan data user ke dalam request agar bisa dibaca nanti
        next(); // Silakan masuk ke rute selanjutnya
    } catch (error) {
        return res.status(403).json({ message: 'Sesi telah habis atau token tidak valid. Silakan login ulang!' });
    }
};

// 2. Satpam Ruang VIP: Cek apakah jabatannya Admin
const verifyAdmin = (req, res, next) => {
    // Memastikan data user ada dan role-nya adalah admin
    if (!req.user || req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Akses ditolak. Hanya Admin yang boleh melakukan tindakan ini!' });
    }
    next(); // Silakan masuk jika Anda Admin
};

module.exports = { verifyToken, verifyAdmin };