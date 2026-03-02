import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import SidebarKasir from '../components/SidebarKasir';
import { Receipt, CheckCircle2, Clock, Search, Loader2 } from 'lucide-react';

const HistoryTransaksi = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions');
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClosing = async () => {
    if (!window.confirm("Tutup riwayat hari ini? Data akan dipindahkan ke Laporan Keuangan.")) return;
    setIsClosing(true);
    try {
      const totalRevenue = transactions.reduce((sum, trx) => sum + parseFloat(trx.total_amount), 0);
      await api.post('/rekap', {
        recap_date: new Date().toISOString().split('T')[0],
        total_revenue: totalRevenue,
        total_transactions: transactions.length,
        status: 'closed'
      });
      alert("Riwayat berhasil ditutup!");
      fetchTransactions();
    } catch (err) {
      alert("Gagal melakukan closing.");
    } finally {
      setIsClosing(false);
    }
  };

  const filteredData = transactions.filter(t => 
    t.cashier?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.payment_method?.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
            <p className="text-gray-500 mt-1">Daftar transaksi pelanggan hari ini.</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input 
                type="text" placeholder="Cari kasir/metode..."
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none focus:ring-2 focus:ring-doabunda-primary/20 text-sm font-medium"
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            {user.role === 'admin' && (
              <button 
                onClick={handleClosing}
                disabled={isClosing || transactions.length === 0}
                className="bg-doabunda-dark hover:bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all shadow-lg"
              >
                {isClosing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                Tutup Riwayat
              </button>
            )}
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b">
                <tr>
                  <th className="p-5">Waktu</th>
                  <th className="p-5">Kasir</th>
                  <th className="p-5">Metode</th>
                  <th className="p-5 text-right">Total Tagihan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm md:text-base">
                {loading ? (
                  <tr><td colSpan="4" className="p-10 text-center text-gray-400">Memuat data...</td></tr>
                ) : filteredData.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5 text-gray-500 font-medium">
                      <div className="flex items-center gap-2 italic">
                        <Clock size={14} /> {new Date(trx.created_at).toLocaleTimeString('id-ID', {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="p-5 font-bold text-gray-700">{trx.cashier}</td>
                    <td className="p-5">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                        trx.payment_method === 'Cash' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'
                      }`}>
                        {trx.payment_method}
                      </span>
                    </td>
                    <td className="p-5 text-right font-black text-gray-800">
                      Rp {parseInt(trx.total_amount).toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryTransaksi;