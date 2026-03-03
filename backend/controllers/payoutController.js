const db = require('../utils/db');

// 1. Ambil Info Saldo Kas & Riwayat Penarikan
const getKasInfo = async (req, res) => {
    try {
        // Hitung total semua laba bersih dari tabel rekap
        const [recap] = await db.query('SELECT SUM(net_profit) as total_laba FROM daily_recaps');
        // Hitung total uang yang sudah ditarik untuk gaji/owner
        const [payoutOut] = await db.query('SELECT SUM(amount) as total_payout FROM payouts');
        
        const totalLaba = parseFloat(recap[0]?.total_laba) || 0;
        const totalPayout = parseFloat(payoutOut[0]?.total_payout) || 0;
        const saldoKas = totalLaba - totalPayout; // Uang riil yang harusnya ada sekarang

        // Ambil riwayat tabel payouts
        const [history] = await db.query('SELECT * FROM payouts ORDER BY payout_date DESC, id DESC');

        res.json({
            success: true,
            data: {
                saldo_kas: saldoKas,
                total_laba: totalLaba,
                total_payout: totalPayout,
                history: history
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mengambil data kas' });
    }
};

// 2. Tambah Penarikan Dana (Gaji / Owner)
const addPayout = async (req, res) => {
    const { amount, category, description, date } = req.body;
    const adminId = req.user.id;
    const payoutDate = date || new Date().toISOString().slice(0, 10);

    try {
        await db.query(
            'INSERT INTO payouts (admin_id, amount, category, description, payout_date) VALUES (?, ?, ?, ?, ?)',
            [adminId, amount, category, description, payoutDate]
        );
        res.json({ success: true, message: 'Penarikan dana berhasil dicatat' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Gagal mencatat penarikan' });
    }
};

// 3. Hapus Riwayat
const deletePayout = async (req, res) => {
    try {
        await db.query('DELETE FROM payouts WHERE id = ?', [req.params.id]);
        res.json({ success: true, message: 'Data penarikan dihapus' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Gagal menghapus data' });
    }
};

module.exports = { getKasInfo, addPayout, deletePayout };