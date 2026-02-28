const db = require('../utils/db');

const getExpenses = async (req, res) => {
    const today = new Date().toISOString().slice(0, 10);
    try {
        const [expenses] = await db.query('SELECT * FROM expenses WHERE expense_date = ? ORDER BY id DESC', [today]);
        res.json({ data: expenses });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mengambil data pengeluaran' });
    }
};

const addExpense = async (req, res) => {
    const { description, amount } = req.body;
    const adminId = req.user.id;
    const today = new Date().toISOString().slice(0, 10);
    
    try {
        await db.query(
            'INSERT INTO expenses (admin_id, expense_date, description, amount) VALUES (?, ?, ?, ?)', 
            [adminId, today, description, amount]
        );
        res.json({ message: 'Pengeluaran berhasil dicatat' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal mencatat pengeluaran' });
    }
};

const deleteExpense = async (req, res) => {
    try {
        await db.query('DELETE FROM expenses WHERE id = ?', [req.params.id]);
        res.json({ message: 'Data pengeluaran dihapus' });
    } catch (error) {
        res.status(500).json({ message: 'Gagal menghapus pengeluaran' });
    }
};

module.exports = { getExpenses, addExpense, deleteExpense };