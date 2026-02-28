const db = require('../utils/db');

const checkoutTransaction = async (req, res, next) => {
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    const userId = req.user.id;
    const { payment_method, source, items } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Keranjang kosong'
      });
    }

    const totalAmount = items.reduce(
      (sum, item) => sum + (item.price * item.qty),
      0
    );

    // Insert ke tabel transactions
    const [trxResult] = await connection.query(
      `INSERT INTO transactions 
       (user_id, payment_method, source, total_amount)
       VALUES (?, ?, ?, ?)`,
      [userId, payment_method, source || 'POS', totalAmount]
    );

    const transactionId = trxResult.insertId;

    // Insert ke transaction_items
    for (const item of items) {
      await connection.query(
        `INSERT INTO transaction_items 
         (transaction_id, menu_id, qty, price)
         VALUES (?, ?, ?, ?)`,
        [transactionId, item.menu_id, item.qty, item.price]
      );
    }

    await connection.commit();

    res.json({
      success: true,
      message: 'Transaksi berhasil',
      transaction_id: transactionId
    });

  } catch (error) {
    await connection.rollback();
    next(error);
  } finally {
    connection.release();
  }
};

const getTransactions = async (req, res, next) => {
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

    res.json({
      success: true,
      data: rows
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  checkoutTransaction,
  getTransactions
};