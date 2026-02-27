const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db'); // Kita panggil DB langsung seperti di userController
require('dotenv').config();

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 1. Ambil data langsung dari database (Dijamin bawa kolom password)
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        
        // Jika array users kosong (username tidak ada)
        if (users.length === 0) {
            return res.status(404).json({ message: 'Username tidak ditemukan!' });
        }

        const user = users[0]; // Ambil data user pertama yang cocok

        // 2. Cek apakah password cocok
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah!' });
        }

        // 3. Buat Token JWT (Berlaku 1 Hari)
        // Gunakan nilai default rahasia jika JWT_SECRET di .env tidak terbaca
        const secretKey = process.env.JWT_SECRET || 'rahasia_doa_bunda_123';
        const token = jwt.sign(
            { id: user.id, role: user.role },
            secretKey,
            { expiresIn: '1d' }
        );

        // 4. Kirim respon sukses
        res.json({
            message: 'Login berhasil',
            token,
            user: { id: user.id, name: user.name, role: user.role }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

module.exports = { login };