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

        const [expenseResult] = await db.query(
            'SELECT SUM(amount) as total FROM expenses WHERE DATE(expense_date) = ?',
            [today]
        );
        const totalExpense = expenseResult[0]?.total ? parseFloat(expenseResult[0].total) : 0;

        const summary = await Rekap.getSummaryByDate(today);
        
        const [countResult] = await db.query(
            'SELECT COUNT(id) as total_count FROM transactions WHERE DATE(created_at) = ?',
            [today]
        );
        const totalTransactions = countResult[0]?.total_count || 0;

        let totalCash = 0; let totalQris = 0; let totalGrab = 0;
        summary.forEach(item => {
            if (item.payment_method === 'Cash') totalCash = parseFloat(item.total) || 0;
            if (item.payment_method === 'QRIS') totalQris = parseFloat(item.total) || 0;
            if (item.payment_method === 'Grab') totalGrab = parseFloat(item.total) || 0;
        });

        const totalRevenue = totalCash + totalQris + totalGrab;

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

        const netProfitInitial = totalRevenue - totalExpense;

        await db.query(query, [
            adminId, today, totalCash, totalQris, totalGrab, totalRevenue, totalExpense, totalTransactions, netProfitInitial
        ]);

        res.json({ success: true, message: 'Tutup buku harian berhasil diproses dan disinkronkan!' });
    } catch (error) {
        console.error("Generate recap error:", error);
        res.status(500).json({ success: false, message: 'Gagal melakukan rekap harian' });
    }
};

// ===============================
// 2. ADD EXTRA INCOME LOG (Uang Tambahan: Sisa Pasar, dll)
// ===============================
const addExtraIncome = async (req, res) => {
    const { amount, source_name, date } = req.body;
    const dateTarget = date || new Date().toISOString().slice(0, 10);
    const valAmount = parseFloat(amount) || 0;

    let connection;
    try {
        connection = await db.getConnection();
        await connection.beginTransaction();

        // 1. Cek apakah rekap hari tersebut sudah ada
        const [rekapExist] = await connection.query(
            'SELECT id FROM daily_recaps WHERE recap_date = ?',
            [dateTarget]
        );

        if (rekapExist.length === 0) {
            throw new Error('Harus melakukan Tutup Buku terlebih dahulu sebelum menambah uang tambahan!');
        }

        // 2. Masukkan ke tabel log histori
        await connection.query(
            'INSERT INTO extra_income_logs (recap_date, amount, source_name) VALUES (?, ?, ?)',
            [dateTarget, valAmount, source_name]
        );

        // 3. Update total extra_income dan net_profit di tabel daily_recaps
        await connection.query(
            `UPDATE daily_recaps 
             SET extra_income = extra_income + ?, 
                 net_profit = (total_revenue + extra_income + ?) - total_expense
             WHERE recap_date = ?`,
            [valAmount, valAmount, dateTarget]
        );

        await connection.commit();
        res.json({ 
            success: true, 
            message: `Berhasil menambahkan ${source_name} sebesar Rp ${valAmount.toLocaleString('id-ID')}` 
        });
    } catch (error) {
        if (connection) await connection.rollback();
        console.error("ADD EXTRA INCOME ERROR:", error);
        res.status(400).json({ success: false, message: error.message });
    } finally {
        if (connection) connection.release();
    }
};

// ===============================
// 3. GET SUMMARY (Dashboard Admin)
// ===============================
const getSummary = async (req, res) => {
    try {
        const dateLocal = new Date();
        dateLocal.setMinutes(dateLocal.getMinutes() - dateLocal.getTimezoneOffset());
        const today = dateLocal.toISOString().slice(0, 10);

        const [revenueResult] = await db.query(
            `SELECT SUM(total_amount) as totalRevenue, COUNT(id) as totalTransactions 
             FROM transactions WHERE DATE(created_at) = ?`,
            [today]
        );

        res.json({
            totalRevenue: parseFloat(revenueResult[0]?.totalRevenue) || 0,
            totalTransactions: revenueResult[0]?.totalTransactions || 0
        });
    } catch (error) {
        console.error("SUMMARY ERROR:", error);
        res.status(500).json({ message: 'Gagal mengambil data statistik' });
    }
};

// ===============================
// 4. GET HISTORY & DELETE
// ===============================
const getHistory = async (req, res) => {
    try {
        const [rows] = await db.query('SELECT * FROM daily_recaps ORDER BY recap_date DESC');
        res.json({ data: rows });
    } catch (error) {
        console.error("GET HISTORY ERROR:", error);
        res.status(500).json({ message: 'Gagal mengambil arsip rekap' });
    }
};

const deleteRekap = async (req, res) => {
    const { id } = req.params;
    try {
        await db.query('DELETE FROM daily_recaps WHERE id = ?', [id]);
        res.json({ success: true, message: 'Data laporan berhasil dihapus' });
    } catch (error) {
        console.error("DELETE REKAP ERROR:", error);
        res.status(500).json({ message: 'Gagal menghapus laporan' });
    }
};

module.exports = {
    generateDailyRecap,
    addExtraIncome, // Sudah ter-export sekarang
    getSummary,
    getHistory,
    deleteRekap
};