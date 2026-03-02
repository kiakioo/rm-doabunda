const Rekap = require('../models/Rekap');
const db = require('../utils/db');

// ===============================
// 1. GENERATE DAILY RECAP (Tutup Buku)
// ===============================
const generateDailyRecap = async (req, res) => {
    try {
        const adminId = req.user.id;
        const dateLocal = new Date();
        dateLocal.setMinutes(dateLocal.getMinutes() - dateLocal.getTimezoneOffset());
        const today = dateLocal.toISOString().slice(0, 10);

        // Ambil Total Pengeluaran hari ini
        const [expenseResult] = await db.query(
            'SELECT SUM(amount) as total FROM expenses WHERE DATE(expense_date) = ?',
            [today]
        );
        const totalExpense = expenseResult[0]?.total ? parseFloat(expenseResult[0].total) : 0;

        // Ambil Ringkasan Transaksi secara Real-time
        const [trxSummary] = await db.query(
            `SELECT 
                COUNT(id) as totalTransactions, 
                SUM(total_amount) as totalRevenue,
                SUM(CASE WHEN payment_method = 'Cash' THEN total_amount ELSE 0 END) as totalCash,
                SUM(CASE WHEN payment_method = 'QRIS' THEN total_amount ELSE 0 END) as totalQris,
                SUM(CASE WHEN payment_method = 'Grab' THEN total_amount ELSE 0 END) as totalGrab
             FROM transactions WHERE DATE(created_at) = ?`,
            [today]
        );

        const { totalTransactions, totalRevenue, totalCash, totalQris, totalGrab } = trxSummary[0];
        const revenue = parseFloat(totalRevenue) || 0;

        // Logika UPSERT: Mengupdate jika tanggal sudah ada (butuh UNIQUE INDEX di DB)
        const query = `
            INSERT INTO daily_recaps 
            (admin_id, recap_date, total_cash, total_qris, total_grab, total_revenue, total_expense, total_transactions, net_profit) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
            total_cash = VALUES(total_cash),
            total_qris = VALUES(total_qris),
            total_grab = VALUES(total_grab),
            total_revenue = VALUES(total_revenue),
            total_expense = VALUES(total_expense),
            total_transactions = VALUES(total_transactions),
            net_profit = (VALUES(total_revenue) + extra_income) - VALUES(total_expense)
        `;

        await db.query(query, [
            adminId, today, totalCash || 0, totalQris || 0, totalGrab || 0, 
            revenue, totalExpense, totalTransactions || 0, (revenue - totalExpense)
        ]);

        res.json({ success: true, message: 'Tutup buku harian berhasil disinkronkan!' });
    } catch (error) {
        console.error("Generate recap error:", error);
        res.status(500).json({ success: false, message: 'Gagal melakukan rekap harian' });
    }
};

// ===============================
// 2. ADD EXTRA INCOME (Uang Tambahan: Sisa Pasar, dll)
// ===============================
const addExtraIncome = async (req, res) => {
    const { amount, source_name, date } = req.body;
    const dateTarget = date || new Date().toISOString().slice(0, 10);
    const valAmount = parseFloat(amount) || 0;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        const [rekapExist] = await connection.query(
            'SELECT id FROM daily_recaps WHERE recap_date = ?', [dateTarget]
        );

        if (rekapExist.length === 0) {
            throw new Error('Lakukan Tutup Buku terlebih dahulu sebelum menambah uang tambahan!');
        }

        await connection.query(
            'INSERT INTO extra_income_logs (recap_date, amount, source_name) VALUES (?, ?, ?)',
            [dateTarget, valAmount, source_name]
        );

        await connection.query(
            `UPDATE daily_recaps 
             SET extra_income = extra_income + ?, 
                 net_profit = (total_revenue + extra_income + ?) - total_expense
             WHERE recap_date = ?`,
            [valAmount, valAmount, dateTarget]
        );

        await connection.commit();
        res.json({ success: true, message: `Berhasil mencatat ${source_name}` });
    } catch (error) {
        if (connection) await connection.rollback();
        res.status(400).json({ success: false, message: error.message });
    } finally {
        if (connection) connection.release();
    }
};

const getSummary = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);
        const [revenueResult] = await db.query(
            'SELECT SUM(total_amount) as totalRevenue, COUNT(id) as totalTransactions FROM transactions WHERE DATE(created_at) = ?',
            [today]
        );
        res.json({
            totalRevenue: parseFloat(revenueResult[0]?.totalRevenue) || 0,
            totalTransactions: revenueResult[0]?.totalTransactions || 0
        });
    } catch (error) { res.status(500).json({ message: 'Gagal ambil summary' }); }
};

const getHistory = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM daily_recaps ORDER BY recap_date DESC');
        res.json({ data: rows });
    } catch (error) { res.status(500).json({ message: 'Gagal ambil histori' }); }
};

const deleteRekap = async (req, res) => {
    try {
        await db.query('DELETE FROM daily_recaps WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Data laporan berhasil dihapus' });
    } catch (error) { res.status(500).json({ message: 'Gagal menghapus' }); }
};

module.exports = { generateDailyRecap, addExtraIncome, getSummary, getHistory, deleteRekap };