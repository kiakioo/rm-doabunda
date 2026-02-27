const jwt = require('jsonwebtoken');

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // JALAN PINTAS SEMENTARA AGAR BISA LOGIN & ISTIRAHAT
        if (username === 'admin' && password === 'admin123') {
            const token = jwt.sign(
                { id: 1, role: 'admin' },
                process.env.JWT_SECRET || 'rahasia_doa_bunda_123',
                { expiresIn: '1d' }
            );

            return res.json({
                message: 'Login berhasil',
                token,
                user: { id: 1, name: 'Administrator', role: 'admin' }
            });
        }

        // Jika bukan admin / password beda
        return res.status(400).json({ message: 'Password salah!' });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

module.exports = { login };