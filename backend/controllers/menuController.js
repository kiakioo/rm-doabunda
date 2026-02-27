const db = require('../utils/db');

// GET all menus
exports.getMenus = async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM menus ORDER BY id DESC');
    res.json(rows);
  } catch (error) {
    console.error('Error getMenus:', error);
    res.status(500).json({ message: 'Gagal mengambil data menu' });
  }
};

// CREATE menu
exports.createMenu = async (req, res) => {
  try {
    const { name, category, price } = req.body;

    if (!name || !category || !price) {
      return res.status(400).json({ message: 'Semua field wajib diisi' });
    }

    await db.query(
      'INSERT INTO menus (name, category, price) VALUES (?, ?, ?)',
      [name, category, price]
    );

    res.status(201).json({ message: 'Menu berhasil ditambahkan' });
  } catch (error) {
    console.error('Error createMenu:', error);
    res.status(500).json({ message: 'Gagal menambahkan menu' });
  }
};

// DELETE menu
exports.deleteMenu = async (req, res) => {
  try {
    const { id } = req.params;

    await db.query('DELETE FROM menus WHERE id = ?', [id]);

    res.json({ message: 'Menu berhasil dihapus' });
  } catch (error) {
    console.error('Error deleteMenu:', error);
    res.status(500).json({ message: 'Gagal menghapus menu' });
  }
};