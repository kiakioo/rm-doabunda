const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
require('dotenv').config();

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // 1. Cek apakah user ada di database
        const user = await User.findByUsername(username);
        if (!user) {
            return res.status(404).json({ message: 'Username tidak ditemukan!' });
        }

        // 2. Cek apakah password cocok
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Password salah!' });
        }

        // 3. Buat Token JWT (Berlaku 1 Hari)
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
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