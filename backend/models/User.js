const db = require('../utils/db');

const User = {
    // Alat untuk mencari user berdasarkan username saat login
    findByUsername: async (username) => {
        const [rows] = await db.query('SELECT * FROM users WHERE username = ?', [username]);
        return rows[0]; // Mengembalikan data user yang cocok
    },

    // Alat untuk menyimpan user baru (opsional, untuk seeder/register)
    create: async (userData) => {
        const { name, username, password, role } = userData;
        const [result] = await db.query(
            'INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)',
            [name, username, password, role]
        );
        return result;
    }
};

module.exports = User;