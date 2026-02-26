const Transaksi = require('../models/Transaksi');

const checkout = async (req, res) => {
    try {
        // req.user.id didapat dari Middleware Auth (Satpam) yang kita buat sebelumnya
        const userId = req.user.id; 
        const { payment_method, source, items } = req.body;

        if (!items || items.length === 0) {
            return res.status(400).json({ message: 'Keranjang belanja tidak boleh kosong!' });
        }

        const transactionId = await Transaksi.create(userId, { payment_method, source, items });
        
        res.status(201).json({ 
            message: 'Transaksi berhasil disimpan!', 
            transaction_id: transactionId 
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal memproses transaksi.' });
    }
};

const getHistory = async (req, res) => {
    try {
        const history = await Transaksi.getTodayHistory();
        res.json({ message: 'Berhasil mengambil riwayat transaksi', data: history });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Gagal mengambil riwayat transaksi' });
    }
};

module.exports = { checkout, getHistory };