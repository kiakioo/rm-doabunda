const Rekap = require('../models/Rekap');
const db = require('../utils/db');

// ===============================
// 1. GENERATE DAILY RECAP (Tutup Buku)
// ===============================
const generateDailyRecap = async (req, res) => {
    try {
        const adminId = req.user.id;
        
        // Penentuan Tanggal Lokal (YYYY-MM-DD)
        const dateLocal = new Date();
        dateLocal.setMinutes(dateLocal.getMinutes() - dateLocal.getTimezoneOffset());
        const today = dateLocal.toISOString().slice(0, 10);

        // 1. Ambil Total Pengeluaran hari ini
        // Menggunakan DATE() agar sinkron dengan format YYYY-MM-DD
        const [expenseResult] = await db.query(
            'SELECT SUM(amount) as total FROM expenses WHERE DATE(expense_date) = ?',
            [today]
        );
        const totalExpense = expenseResult[0]?.total ? parseFloat(expenseResult[0].total) : 0;

        // 2. Ambil Ringkasan Transaksi & Total Struk dari database
        const summary = await Rekap.getSummaryByDate(today);
        
        // LOGIKA TAMBAHAN: Mengambil total count transaksi agar struk tidak nol di laporan
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

        // 3. Simpan atau Update jika sudah ada (Upsert Logic)
        // Pastikan total_transactions masuk ke query agar laporan keuangan lengkap
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

        // Eksekusi Upsert
        await db.query(query, [
            adminId, 
            today, 
            totalCash, 
            totalQris, 
            totalGrab, 
            totalRevenue, 
            totalExpense, 
            totalTransactions, 
            netProfitInitial
        ]);

        res.json({ success: true, message: 'Tutup buku harian berhasil diproses dan disinkronkan!' });

    } catch (error) {
        console.error("Generate recap error:", error);
        res.status(500).json({ success: false, message: 'Gagal melakukan rekap harian' });
    }
};

// ===============================
// 2. UPDATE EXTRA INCOME (Dana Tambahan)
// ===============================
const updateExtraIncome = async (req, res) => {
    const { amount, date } = req.body; // 'note' bisa ditambahkan jika ada kolomnya di tabel
    try {
        const valAmount = parseFloat(amount) || 0;
        
        // Update extra income dan hitung ulang net_profit secara otomatis
        // Rumus: (revenue + extra_income baru) - expense
        const [result] = await db.query(
            `UPDATE daily_recaps 
             SET extra_income = extra_income + ?, 
                 net_profit = (total_revenue + extra_income + ?) - total_expense
             WHERE recap_date = ?`,
            [valAmount, valAmount, date]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Data rekap untuk tanggal tersebut tidak ditemukan. Lakukan Tutup Buku dulu!' 
            });
        }

        res.json({ success: true, message: `Dana tambahan sebesar Rp ${valAmount.toLocaleString('id-ID')} berhasil dicatat.` });
    } catch (error) {
        console.error("EXTRA INCOME ERROR:", error);
        res.status(500).json({ success: false, message: 'Gagal menambahkan dana masuk tambahan' });
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
        // Mengambil histori dari tabel daily_recaps
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
    updateExtraIncome,
    getSummary,
    getHistory,
    deleteRekap
};