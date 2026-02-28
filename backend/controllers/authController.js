const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../utils/db');
require('dotenv').config();

const login = async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res.status(400).json({ success: false, message: 'Username dan Password wajib diisi' });
        }

        // Query database secara langsung untuk menghindari error dari folder models
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);

        if (users.length === 0) {
            return res.status(401).json({ success: false, message: 'Username atau password salah' });
        }

        const user = users[0];

        // Cek kecocokan password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Username atau password salah' });
        }

        // Generate Token
        const secretKey = process.env.JWT_SECRET || 'rahasia_doa_bunda_123';
        const token = jwt.sign(
            { id: user.id, username: user.username, role: user.role },
            secretKey,
            { expiresIn: '1d' }
        );

        res.json({
            success: true,
            message: 'Login Berhasil',
            token,
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });

    } catch (error) {
        // INI BAGIAN PALING PENTING: Mencegah crash dan mengirim error aslinya
        console.error("DB LOGIN ERROR:", error);
        res.status(500).json({ 
            success: false, 
            message: 'Server Error 500', 
            error_detail: error.message // Ini akan membocorkan apa yang salah
        });
    }
};

// Fungsi getMe dan register standar agar route tidak error
const getMe = async (req, res) => {
    res.json({ success: true, message: 'Data user', user: req.user });
};

const register = async (req, res) => {
    res.status(200).json({ success: true, message: 'Register sementara dimatikan untuk perbaikan' });
};

module.exports = { login, getMe, register };