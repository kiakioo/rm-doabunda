const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db'); // Menggunakan koneksi DB langsung agar lebih aman
require('dotenv').config();

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 1. Ambil data user beserta password-nya dari database
        const [users] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        
        // Jika username tidak ada di database
        if (users.length === 0) {
            return res.status(404).json({ message: 'Username tidak ditemukan!' });
        }

        const user = users[0]; // Ambil data user yang ditemukan

        // 2. Bandingkan password yang diketik dengan yang ada di database
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah!' });
        }

        // 3. Jika cocok, buatkan Token (Kunci Masuk)
        const secretKey = process.env.JWT_SECRET || 'rahasia_doa_bunda_123';
        const token = jwt.sign(
            { id: user.id, role: user.role },
            secretKey,
            { expiresIn: '1d' }
        );

        // 4. Izinkan masuk
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