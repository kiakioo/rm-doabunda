const db = require('../utils/db');

const checkoutTransaction = async (req, res) => {
  const userId = req.user.id;
  const { payment_method, source, items } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ success: false, message: 'Keranjang kosong' });
  }

  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.qty), 0);

    const [trxResult] = await connection.query(
      `INSERT INTO transactions (user_id, payment_method, source, total_amount) VALUES (?, ?, ?, ?)`,
      [userId, payment_method, source || 'POS', totalAmount]
    );

    const transactionId = trxResult.insertId;

    for (const item of items) {
      await connection.query(
        `INSERT INTO transaction_items (transaction_id, menu_id, qty, price) VALUES (?, ?, ?, ?)`,
        [transactionId, item.menu_id, item.qty, item.price]
      );
    }

    await connection.commit();
    res.json({ success: true, message: 'Transaksi berhasil', transaction_id: transactionId });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Checkout error:', error);
    res.status(500).json({ success: false, message: 'Gagal memproses transaksi' });
  } finally {
    if (connection) connection.release();
  }
};

const getTransactions = async (req, res) => {
  try {
    const { date } = req.query;
    const user = req.user;

    let query = `
      SELECT t.id, t.payment_method, t.source, t.total_amount, t.created_at, u.name AS cashier
      FROM transactions t JOIN users u ON u.id = t.user_id
    `;
    const params = [];

    // Jika yang login kasir, hanya lihat transaksinya sendiri
    if (user.role === 'kasir') {
      query += ` WHERE t.user_id = ?`;
      params.push(user.id);
      if (date) { query += ` AND DATE(t.created_at) = ?`; params.push(date); }
    } else {
      if (date) { query += ` WHERE DATE(t.created_at) = ?`; params.push(date); }
    }

    query += ` ORDER BY t.created_at DESC`;

    const [rows] = await db.query(query, params);
    res.json({ success: true, data: rows });

  } catch (error) {
    console.error('History error:', error);
    res.status(500).json({ success: false, message: 'Gagal mengambil histori transaksi' });
  }
};

// ==========================================
// FUNGSI BARU: HAPUS TRANSAKSI
// ==========================================
const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  let connection;

  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    // 1. Hapus isi detail transaksi terlebih dahulu (mencegah error Foreign Key)
    await connection.query('DELETE FROM transaction_items WHERE transaction_id = ?', [id]);

    // 2. Hapus transaksi utama
    const [result] = await connection.query('DELETE FROM transactions WHERE id = ?', [id]);

    if (result.affectedRows === 0) {
      await connection.rollback();
      return res.status(404).json({ success: false, message: 'Data transaksi tidak ditemukan' });
    }

    await connection.commit();
    res.json({ success: true, message: 'Transaksi berhasil dihapus' });

  } catch (error) {
    if (connection) await connection.rollback();
    console.error('Delete transaction error:', error);
    res.status(500).json({ success: false, message: 'Gagal menghapus transaksi', error_detail: error.message });
  } finally {
    if (connection) connection.release();
  }
};

// Pastikan deleteTransaction ikut di-export!
module.exports = { checkoutTransaction, getTransactions, deleteTransaction };