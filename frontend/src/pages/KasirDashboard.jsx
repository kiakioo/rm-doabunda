import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarKasir from '../components/SidebarKasir';
import { TrendingUp, Receipt, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const KasirDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalTransactions: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const dateToday = new Date().toISOString().slice(0, 10);
      const res = await api.get(`/transactions?date=${dateToday}`);
      
      const transactions = res.data.data || [];
      const totalRev = transactions.reduce((sum, trx) => sum + parseFloat(trx.total_amount), 0);
      
      setStats({
        totalRevenue: totalRev,
        totalTransactions: transactions.length
      });

      // Ambil 5 transaksi teratas untuk ditampilkan
      setRecentTransactions(transactions.slice(0, 5));
    } catch (error) {
      console.error("Gagal mengambil data statistik kasir", error);
    }
  };

  const formatWaktu = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
      
      <SidebarKasir />

      {/* KONTEN UTAMA */}
      <div className="flex-1 p-5 md:p-10 overflow-y-auto">
        
        {/* HEADER */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-white to-red-50/30">
          <div>
            <h1 className="text-3xl md:text-4xl font-black text-gray-800 mb-2">
              Halo, <span className="text-doabunda-primary">{user.name || 'Kasir'}</span>! 👋
            </h1>
            <p className="text-gray-500 font-medium">Semangat melayani pelanggan DOA BUNDA hari ini.</p>
          </div>
          <button 
            onClick={() => navigate('/kasir')}
            className="bg-doabunda-primary hover:bg-red-800 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-red-200 transform hover:-translate-y-1 transition-all flex items-center gap-2"
          >
            <MonitorSmartphone size={20} />
            Buka Mesin Kasir
          </button>
        </div>

        {/* KARTU STATISTIK */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-gradient-to-br from-red-50 to-white p-8 rounded-3xl shadow-sm border border-red-100 flex flex-col justify-center transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 text-red-800">
              <TrendingUp size={24} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Pendapatan Anda (Hari Ini)</h3>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-red-900 break-words">
              Rp {stats.totalRevenue.toLocaleString('id-ID')}
            </h2>
          </div>

          <div className="bg-gradient-to-br from-yellow-50 to-white p-8 rounded-3xl shadow-sm border border-yellow-100 flex flex-col justify-center transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center gap-3 mb-4 text-yellow-700">
              <Receipt size={24} />
              <h3 className="font-bold uppercase tracking-wider text-sm">Struk Selesai (Hari Ini)</h3>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-yellow-800">
              {stats.totalTransactions} <span className="text-2xl font-semibold opacity-70">Transaksi</span>
            </h2>
          </div>
        </div>

        {/* TABEL TRANSAKSI KASIR */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-red-50 rounded-xl text-doabunda-primary"><Clock size={20} /></div>
              <h3 className="text-xl font-bold text-gray-800">Riwayat Transaksi Anda</h3>
            </div>
            <button onClick={() => navigate('/kasir/laporan')} className="text-sm font-bold text-doabunda-primary hover:text-red-800 hover:underline flex items-center gap-1">
              Lihat Selengkapnya <ChevronRight size={16}/>
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/80 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-5 font-semibold">Waktu</th>
                  <th className="p-5 font-semibold">Metode Pembayaran</th>
                  <th className="p-5 font-semibold text-right">Total Belanja</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-5 text-gray-600 font-medium whitespace-nowrap">{formatWaktu(trx.created_at)}</td>
                      <td className="p-5 whitespace-nowrap">
                        <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${trx.payment_method === 'Cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {trx.payment_method}
                        </span>
                      </td>
                      <td className="p-5 text-right font-black text-gray-800 text-lg whitespace-nowrap">
                        Rp {parseInt(trx.total_amount).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-10 text-center text-gray-400 font-medium">
                      Anda belum melakukan transaksi hari ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default KasirDashboard;