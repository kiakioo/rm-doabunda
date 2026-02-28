const Rekap = require('../models/Rekap');
const db = require('../utils/db');

// ===============================
// 1. GENERATE DAILY RECAP (ADMIN ONLY)
// ===============================
const generateDailyRecap = async (req, res) => {
    try {
        const adminId = req.user.id;
        
        const dateLocal = new Date();
        dateLocal.setMinutes(dateLocal.getMinutes() - dateLocal.getTimezoneOffset());
        const today = dateLocal.toISOString().slice(0, 10);

        const [expenseResult] = await db.query(
            'SELECT SUM(amount) as total FROM expenses WHERE expense_date = ?',
            [today]
        );

        const totalExpense = expenseResult[0]?.total ? parseFloat(expenseResult[0].total) : 0;
        const summary = await Rekap.getSummaryByDate(today);

        let totalCash = 0; let totalQris = 0; let totalGrab = 0;

        summary.forEach(item => {
            if (item.payment_method === 'Cash') totalCash = parseFloat(item.total) || 0;
            if (item.payment_method === 'QRIS') totalQris = parseFloat(item.total) || 0;
            if (item.payment_method === 'Grab') totalGrab = parseFloat(item.total) || 0;
        });

        const totalRevenue = totalCash + totalQris + totalGrab;
        const netProfit = totalRevenue - totalExpense;

        await db.query(
            `INSERT INTO daily_recaps 
            (admin_id, recap_date, total_cash, total_qris, total_grab, total_revenue, total_expense, net_profit) 
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [adminId, today, totalCash, totalQris, totalGrab, totalRevenue, totalExpense, netProfit]
        );

        res.json({ message: 'Rekap berhasil!' });

    } catch (error) {
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ message: 'Tutup shift untuk hari ini sudah dilakukan!' });
        }
        res.status(500).json({ message: 'Gagal melakukan rekap harian' });
    }
};

// ===============================
// 2. GET SUMMARY (UNTUK DASHBOARD ADMIN)
// ===============================
const getSummary = async (req, res) => {
    try {
        const dateLocal = new Date();
        dateLocal.setMinutes(dateLocal.getMinutes() - dateLocal.getTimezoneOffset());
        const today = dateLocal.toISOString().slice(0, 10);

        const [revenueResult] = await db.query(
            `SELECT 
                SUM(total_amount) as totalRevenue,
                COUNT(id) as totalTransactions
             FROM transactions 
             WHERE DATE(created_at) = ?`,
            [today]
        );

        // Mencegah error 500 jika belum ada transaksi (null)
        const totalRevenue = revenueResult[0]?.totalRevenue ? parseFloat(revenueResult[0].totalRevenue) : 0;
        const totalTransactions = revenueResult[0]?.totalTransactions || 0;

        res.json({
            totalRevenue,
            totalTransactions
        });

    } catch (error) {
        console.error("SUMMARY ERROR:", error);
        res.status(500).json({ message: 'Gagal mengambil data statistik' });
    }
};

// ===============================
// 3. GET HISTORY (UNTUK ARSIP KEUANGAN)
// ===============================
const getHistory = async (req, res) => {
    try {
        // Mengambil semua data dari tabel daily_recaps urut dari yang terbaru
        const [rows] = await db.query('SELECT * FROM daily_recaps ORDER BY recap_date DESC');
        res.json({ data: rows });
    } catch (error) {
        console.error("HISTORY ERROR:", error);
        res.status(500).json({ message: 'Gagal mengambil arsip rekap' });
    }
};

module.exports = {
    generateDailyRecap,
    getSummary,
    getHistory
};