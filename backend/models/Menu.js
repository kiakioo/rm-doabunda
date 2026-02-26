const db = require('../utils/db');

const Menu = {
    // Menampilkan semua menu untuk layar kasir
    getAll: async () => {
        const [rows] = await db.query('SELECT * FROM menus');
        return rows;
    },
    
    // Menambah menu baru (misal: "Gulai Tunjang")
    create: async (data) => {
        const { name, category, price, is_available } = data;
        const [result] = await db.query(
            'INSERT INTO menus (name, category, price, is_available) VALUES (?, ?, ?, ?)',
            [name, category, price, is_available !== undefined ? is_available : true]
        );
        return result;
    },

    // Mengubah data menu (misal: update harga)
    update: async (id, data) => {
        const { name, category, price, is_available } = data;
        const [result] = await db.query(
            'UPDATE menus SET name=?, category=?, price=?, is_available=? WHERE id=?',
            [name, category, price, is_available, id]
        );
        return result;
    },

    // Menghapus menu
    delete: async (id) => {
        const [result] = await db.query('DELETE FROM menus WHERE id=?', [id]);
        return result;
    }
};

module.exports = Menu;