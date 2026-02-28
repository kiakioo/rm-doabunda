const db = require('../utils/db');

// ==========================
// CHECKOUT
// ==========================
const checkoutTransaction = async (req, res) => {
  const connection = await db.getConnection();
  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const { payment_method, source, items } = req.body;

    const totalAmount = items.reduce(
      (sum, item) => sum + (item.price * item.qty),
      0
    );

    const [trxResult] = await connection.query(
      `INSERT INTO transactions 
       (user_id, payment_method, source, total_amount) 
       VALUES (?, ?, ?, ?)`,
      [userId, payment_method, source || 'POS', totalAmount]
    );

    const transactionId = trxResult.insertId;

    for (const item of items) {
      await connection.query(
        `INSERT INTO transaction_items 
         (transaction_id, menu_id, qty, price)
         VALUES (?, ?, ?, ?)`,
        [transactionId, item.menu_id, item.qty, item.price]
      );
    }

    await connection.commit();

    res.json({ message: 'Transaksi berhasil', transactionId });

  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ message: 'Gagal memproses transaksi' });
  } finally {
    connection.release();
  }
};

// ==========================
// HISTORY
// ==========================
const getTransactions = async (req, res) => {
  try {
    const { date } = req.query;
    const user = req.user;

    let query = `
      SELECT 
        t.id,
        t.payment_method,
        t.source,
        t.total_amount,
        t.created_at,
        u.name AS cashier
      FROM transactions t
      JOIN users u ON u.id = t.user_id
    `;

    const params = [];

    if (user.role === 'kasir') {
      query += ` WHERE t.user_id = ?`;
      params.push(user.id);

      if (date) {
        query += ` AND DATE(t.created_at) = ?`;
        params.push(date);
      }

    } else {
      if (date) {
        query += ` WHERE DATE(t.created_at) = ?`;
        params.push(date);
      }
    }

    query += ` ORDER BY t.created_at DESC`;

    const [rows] = await db.query(query, params);

    res.json({ data: rows });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Gagal mengambil history transaksi' });
  }
};

module.exports = { checkoutTransaction, getTransactions };