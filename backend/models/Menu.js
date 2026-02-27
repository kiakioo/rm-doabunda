const db = require('../utils/db');

class Menu {

    // Ambil semua menu
    static async getAll() {
        try {
            const [rows] = await db.query(
                'SELECT id, name, category, price, image, created_at FROM menus ORDER BY id DESC'
            );
            return rows;
        } catch (error) {
            console.error('Menu.getAll error:', error);
            throw error;
        }
    }

    // Tambah menu baru
    static async create({ name, category, price }) {
        try {
            const [result] = await db.query(
                'INSERT INTO menus (name, category, price) VALUES (?, ?, ?)',
                [name, category, price]
            );
            return result;
        } catch (error) {
            console.error('Menu.create error:', error);
            throw error;
        }
    }

    // Update menu
    static async update(id, { name, category, price }) {
        try {
            await db.query(
                'UPDATE menus SET name = ?, category = ?, price = ? WHERE id = ?',
                [name, category, price, id]
            );
        } catch (error) {
            console.error('Menu.update error:', error);
            throw error;
        }
    }

    // Hapus menu
    static async delete(id) {
        try {
            await db.query(
                'DELETE FROM menus WHERE id = ?',
                [id]
            );
        } catch (error) {
            console.error('Menu.delete error:', error);
            throw error;
        }
    }
}

module.exports = Menu;