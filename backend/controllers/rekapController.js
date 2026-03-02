const Rekap = require('../models/Rekap');
const db = require('../utils/db');

// ===============================
// 1. GENERATE DAILY RECAP (Tutup Buku)
// ===============================
const generateDailyRecap = async (req, res) => {
    try {
        const adminId = req.user.id;
        
        // Perbaikan Zona Waktu Vercel: Memaksa server Vercel (UTC) menjadi WITA (UTC+8)
        const dateLocal = new Date();
        dateLocal.setHours(dateLocal.getHours() + 8);
        const today = dateLocal.toISOString().slice(0, 10);

        // Ambil Total Pengeluaran hari ini
        const [expenseResult] = await db.query(
            'SELECT SUM(amount) as total FROM expenses WHERE DATE(expense_date) = ?',
            [today]
        );
        const totalExpense = parseFloat(expenseResult[0]?.total) || 0;

        // MENGGUNAKAN MODEL REKAP: Ambil ringkasan berdasarkan metode pembayaran
        const summary = await Rekap.getSummaryByDate(today);
        
        let totalCash = 0, totalQris = 0, totalGrab = 0, revenue = 0;
        
        summary.forEach(item => {
            const amount = parseFloat(item.total) || 0;
            revenue += amount;
            if (item.payment_method === 'Cash') totalCash = amount;
            if (item.payment_method === 'QRIS') totalQris = amount;
            if (item.payment_method === 'Grab') totalGrab = amount;
        });

        // Ambil total count transaksi (struk) secara terpisah
        const [countResult] = await db.query(
            'SELECT COUNT(id) as totalTransactions FROM transactions WHERE DATE(created_at) = ?',
            [today]
        );
        const totalTransactions = parseInt(countResult[0]?.totalTransactions, 10) || 0;

        const netProfitInitial = revenue - totalExpense;

        // Logika UPSERT (Update jika recap_date sudah ada)
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
            net_profit = (VALUES(total_revenue) + COALESCE(extra_income, 0)) - VALUES(total_expense)
        `;

        await db.query(query, [
            adminId, today, totalCash, totalQris, totalGrab, 
            revenue, totalExpense, totalTransactions, netProfitInitial
        ]);

        res.json({ success: true, message: 'Tutup buku harian berhasil disinkronkan!' });
    } catch (error) {
        console.error("Generate recap error:", error);
        res.status(500).json({ success: false, message: 'Gagal melakukan rekap harian', error_detail: error.message });
    }
};

// ===============================
// 2. ADD EXTRA INCOME (Sisa Pasar, dll)
// ===============================
const addExtraIncome = async (req, res) => {
    const { amount, source_name, date } = req.body;
    
    // Pastikan mengikuti zona waktu lokal jika parameter date kosong
    const dateLocal = new Date();
    dateLocal.setHours(dateLocal.getHours() + 8);
    const dateTarget = date || dateLocal.toISOString().slice(0, 10);
    
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

// ===============================
// 3. GET SUMMARY (Dashboard Admin)
// ===============================
const getSummary = async (req, res) => {
    try {
        const dateLocal = new Date();
        dateLocal.setHours(dateLocal.getHours() + 8);
        const today = dateLocal.toISOString().slice(0, 10);

        const [revenueResult] = await db.query(
            'SELECT SUM(total_amount) as totalRevenue, COUNT(id) as totalTransactions FROM transactions WHERE DATE(created_at) = ?',
            [today]
        );
        res.json({
            totalRevenue: parseFloat(revenueResult[0]?.totalRevenue) || 0,
            totalTransactions: parseInt(revenueResult[0]?.totalTransactions, 10) || 0
        });
    } catch (error) { 
        res.status(500).json({ message: 'Gagal ambil summary', error_detail: error.message }); 
    }
};

// ===============================
// 4. GET HISTORY & DELETE
// ===============================
const getHistory = async (req, res) => {
    try {
        // MENGGUNAKAN MODEL REKAP: Mengambil seluruh riwayat laporan keuangan
        const rows = await Rekap.getHistory();
        res.json({ data: rows });
    } catch (error) { 
        res.status(500).json({ message: 'Gagal ambil histori', error_detail: error.message }); 
    }
};

const deleteRekap = async (req, res) => {
    try {
        await db.query('DELETE FROM daily_recaps WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Data laporan berhasil dihapus' });
    } catch (error) { 
        res.status(500).json({ message: 'Gagal menghapus laporan', error_detail: error.message }); 
    }
};

module.exports = { generateDailyRecap, addExtraIncome, getSummary, getHistory, deleteRekap };