const Rekap = require('../models/Rekap');
const db = require('../utils/db');

// ===============================
// GENERATE DAILY RECAP (ADMIN ONLY)
// ===============================
const generateDailyRecap = async (req, res) => {
    try {
        const adminId = req.user.id;
        const today = new Date().toISOString().slice(0, 10);

        const [expenseResult] = await db.query(
            'SELECT SUM(amount) as total FROM expenses WHERE expense_date = ?',
            [today]
        );

        const totalExpense = expenseResult[0].total ? parseFloat(expenseResult[0].total) : 0;

        const summary = await Rekap.getSummaryByDate(today);

        let totalCash = 0, totalQris = 0, totalGrab = 0;

        summary.forEach(item => {
            if (item.payment_method === 'Cash') totalCash = parseFloat(item.total);
            if (item.payment_method === 'QRIS') totalQris = parseFloat(item.total);
            if (item.payment_method === 'Grab') totalGrab = parseFloat(item.total);
        });

        const totalRevenue = totalCash + totalQris + totalGrab;
        const netProfit = totalRevenue - totalExpense;

        await db.query(
            `INSERT INTO daily_recaps 
            (admin_id, recap_date, total_cash, total_qris, total_grab, total_revenue, total_expense, net_profit) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [adminId, today, totalCash, totalQris, totalGrab, totalRevenue, totalExpense, netProfit]
        );

        res.json({
            message: 'Rekap harian dan perhitungan laba berhasil disimpan!',
            data: { today, totalRevenue, totalExpense, netProfit }
        });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Tutup shift untuk hari ini sudah dilakukan!' });
        }
        console.error(error);
        res.status(500).json({ message: 'Gagal melakukan rekap harian' });
    }
};

// ===============================
// GET SUMMARY (ADMIN + KASIR)
// ===============================
const getRecapHistory = async (req, res) => {
    try {
        const today = new Date().toISOString().slice(0, 10);

        // Total revenue hari ini dari tabel transactions
        const [revenueResult] = await db.query(
            'SELECT SUM(total_price) as totalRevenue, COUNT(id) as totalTransactions FROM transactions WHERE DATE(created_at) = ?',
            [today]
        );

        const totalRevenue = revenueResult[0].totalRevenue ? parseFloat(revenueResult[0].totalRevenue) : 0;
        const totalTransactions = revenueResult[0].totalTransactions || 0;

        // History recap
        const history = await Rekap.getHistory();

        res.json({
            totalRevenue,
            totalTransactions,
            data: history
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil histori rekap' });
    }
};

module.exports = { generateDailyRecap, getRecapHistory };