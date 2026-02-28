const db = require('../utils/db');

const Rekap = {
    // Fungsi untuk menghitung total uang berdasarkan metode pembayaran hari ini
    getSummaryByDate: async (date) => {
        const [rows] = await db.query(`
            SELECT 
                payment_method, 
                SUM(total_amount) as total 
            FROM transactions 
            WHERE DATE(created_at) = ? 
            GROUP BY payment_method`, 
        [date]);
        return rows;
    },

    // Menyimpan hasil rekap permanen ke database
    saveRecap: async (data) => {
        const { admin_id, recap_date, total_cash, total_qris, total_grab, total_revenue } = data;
        const [result] = await db.query(
            `INSERT INTO daily_recaps (admin_id, recap_date, total_cash, total_qris, total_grab, total_revenue) 
             VALUES (?, ?, ?, ?, ?, ?)`,
            [admin_id, recap_date, total_cash, total_qris, total_grab, total_revenue]
        );
        return result;
    },

    // Melihat histori rekap (untuk laporan bulanan/mingguan)
    getHistory: async () => {
        const [rows] = await db.query('SELECT * FROM daily_recaps ORDER BY recap_date DESC');
        return rows;
    }
};

module.exports = Rekap;