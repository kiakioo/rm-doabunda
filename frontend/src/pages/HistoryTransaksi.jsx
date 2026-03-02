import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import SidebarKasir from '../components/SidebarKasir';
import { Receipt, CheckCircle2, Clock, Search, Calendar, Loader2 } from 'lucide-react';

const HistoryTransaksi = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  // Default ke tanggal hari ini (YYYY-MM-DD)
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    fetchTransactions();
  }, [selectedDate]); // Refresh setiap kali tanggal berubah

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get(`/transactions?date=${selectedDate}`);
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClosing = async () => {
    if (!window.confirm(`Tutup riwayat untuk tanggal ${selectedDate}?`)) return;
    setIsClosing(true);
    try {
      const totalRevenue = transactions.reduce((sum, trx) => sum + parseFloat(trx.total_amount), 0);
      
      await api.post('/rekap', {
        recap_date: selectedDate, // Mengikuti tanggal yang difilter
        total_revenue: totalRevenue,
        total_transactions: transactions.length,
        status: 'closed'
      });
      
      alert(`Berhasil! Rekap tanggal ${selectedDate} telah masuk ke Laporan.`);
      fetchTransactions();
    } catch (err) {
      alert("Gagal closing. Pastikan rekap untuk tanggal ini belum pernah dibuat.");
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-doabunda-light font-sans">
      {user.role === 'admin' ? <SidebarAdmin /> : <SidebarKasir />}

      <div className="flex-1 p-5 md:p-10 overflow-y-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
              <Receipt className="text-doabunda-primary" size={32} />
              RIWAYAT TRANSAKSI
            </h1>
            <p className="text-gray-500 mt-1">Kelola penutupan buku harian RM. Doa Bunda.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="date" 
                value={selectedDate}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-doabunda-primary/20 text-sm font-bold text-gray-700"
                onChange={(e) => setSelectedDate(e.target.value)}
              />
            </div>
            {user.role === 'admin' && (
              <button 
                onClick={handleClosing}
                disabled={isClosing || transactions.length === 0}
                className="bg-doabunda-dark hover:bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-900/20 disabled:opacity-50"
              >
                {isClosing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                Tutup Buku Tanggal Ini
              </button>
            )}
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          {/* ... isi tabel tetap konsisten menggunakan filtered transactions ... */}
        </div>
      </div>
    </div>
  );
};

export default HistoryTransaksi;