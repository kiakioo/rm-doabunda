const db = require('../utils/db');
const bcrypt = require('bcryptjs');

const getUsers = async (req, res) => {
    try {
        const [users] = await db.query('SELECT id, name, username, role, created_at FROM users');
        res.json({ data: users });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil data pengguna' });
    }
};

const createUser = async (req, res) => {
    try {
        const { name, username, password, role } = req.body;
        
        // Cek apakah username sudah ada
        const [existing] = await db.query('SELECT id FROM users WHERE username = ?', [username]);
        if (existing.length > 0) {
            return res.status(400).json({ message: 'Username sudah digunakan' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        await db.query(
            'INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)',
            [name, username, hashedPassword, role || 'kasir']
        );
        res.json({ message: 'Pengguna berhasil ditambahkan' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menambahkan pengguna' });
    }
};

const deleteUser = async (req, res) => {
    try {
        // Mencegah admin menghapus dirinya sendiri
        if (req.user.id === parseInt(req.params.id)) {
            return res.status(400).json({ message: 'Anda tidak dapat menghapus akun Anda sendiri' });
        }
        
        await db.query('DELETE FROM users WHERE id = ?', [req.params.id]);
        res.json({ message: 'Pengguna berhasil dihapus' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menghapus pengguna' });
    }
};

module.exports = { getUsers, createUser, deleteUser };