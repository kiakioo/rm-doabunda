const Menu = require('../models/Menu');

// Mengambil semua menu
const getMenus = async (req, res) => {
    try {
        const menus = await Menu.getAll();
        res.json({ message: 'Berhasil mengambil data menu', data: menus });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Terjadi kesalahan pada server' });
    }
};

// Menambah menu baru
const createMenu = async (req, res) => {
    try {
        const { name, category, price, is_available } = req.body;
        if (!name || !price) {
            return res.status(400).json({ message: 'Nama dan harga menu wajib diisi!' });
        }
        
        const result = await Menu.create({ name, category, price, is_available });
        res.status(201).json({ message: 'Menu berhasil ditambahkan!', insertId: result.insertId });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menambah menu' });
    }
};

// Mengubah menu
const updateMenu = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, category, price, is_available } = req.body;
        
        await Menu.update(id, { name, category, price, is_available });
        res.json({ message: 'Menu berhasil diperbarui!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal memperbarui menu' });
    }
};

// Menghapus menu
const deleteMenu = async (req, res) => {
    try {
        const { id } = req.params;
        await Menu.delete(id);
        res.json({ message: 'Menu berhasil dihapus!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal menghapus menu' });
    }
};

module.exports = { getMenus, createMenu, updateMenu, deleteMenu };