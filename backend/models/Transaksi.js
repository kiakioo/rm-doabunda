const db = require('../utils/db');

const Transaksi = {
    // Fungsi untuk memproses pembayaran kasir
    create: async (userId, data) => {
        const { payment_method, source, items } = data;
        
        // Menghitung total belanja dari frontend secara ulang di backend untuk keamanan
        const total_amount = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

        const connection = await db.getConnection();
        try {
            await connection.beginTransaction(); // Mulai mode aman

            // 1. Simpan ke tabel transactions
            const [transResult] = await connection.query(
                'INSERT INTO transactions (user_id, total_amount, payment_method, source) VALUES (?, ?, ?, ?)',
                [userId, total_amount, payment_method, source || 'POS']
            );
            const transactionId = transResult.insertId;

            // 2. Simpan setiap menu yang dipesan ke tabel transaction_details
            for (let item of items) {
                const subtotal = item.price * item.qty;
                await connection.query(
                    'INSERT INTO transaction_details (transaction_id, menu_id, qty, price, subtotal) VALUES (?, ?, ?, ?, ?)',
                    [transactionId, item.menu_id, item.qty, item.price, subtotal]
                );
            }

            await connection.commit(); // Simpan permanen jika semua sukses
            return transactionId;

        } catch (error) {
            await connection.rollback(); // Batalkan semua jika ada error di tengah jalan
            throw error;
        } finally {
            connection.release();
        }
    },

    // Menampilkan riwayat transaksi hari ini (untuk kasir / admin)
    getTodayHistory: async () => {
        const [rows] = await db.query(`
            SELECT t.id, u.name as kasir, t.total_amount, t.payment_method, t.created_at 
            FROM transactions t
            JOIN users u ON t.user_id = u.id
            WHERE DATE(t.created_at) = CURDATE()
            ORDER BY t.created_at DESC
        `);
        return rows;
    }
};

module.exports = Transaksi;