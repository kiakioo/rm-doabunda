import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { TrendingUp, Receipt, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalTransactions: 0 });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const resStats = await api.get('/rekap/summary');
      setStats({
        totalRevenue: resStats.data.totalRevenue || 0,
        totalTransactions: resStats.data.totalTransactions || 0
      });

      const resTrx = await api.get('/transactions');
      if (resTrx.data.success) {
        setRecentTransactions(resTrx.data.data.slice(0, 5));
      }
    } catch (error) {
      console.error("Gagal mengambil data statistik", error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans w-full">
      <SidebarAdmin />
      
      {/* Container utama dengan pt-20 agar tidak tertutup menu HP */}
      <div className="flex-1 p-4 pt-20 md:p-8 md:pt-8 w-full overflow-x-hidden">
        
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-wide uppercase">RINGKASAN BISNIS</h1>
          <p className="text-gray-500 text-sm mt-1">Pantau performa harian RM. Doa Bunda.</p>
        </header>

        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-8 md:mb-10">
          <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-emerald-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3 md:mb-4 text-emerald-600">
              <TrendingUp size={24} />
              <span className="font-bold uppercase tracking-wider text-[10px] md:text-xs">Total Pendapatan Kotor</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">Rp {stats.totalRevenue.toLocaleString('id-ID')}</h2>
          </div>

          <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-amber-100 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-3 mb-3 md:mb-4 text-amber-600">
              <Receipt size={24} />
              <span className="font-bold uppercase tracking-wider text-[10px] md:text-xs">Transaksi Berhasil</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">{stats.totalTransactions} <span className="text-base md:text-lg font-medium text-gray-400">Struk</span></h2>
          </div>
        </div>

        {/* Tabel Aktivitas */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <div className="flex items-center gap-2 md:gap-3 text-gray-800">
              <Clock size={20} className="text-doabunda-primary" />
              <h3 className="font-bold text-sm md:text-base tracking-wide">Aktivitas Transaksi Terakhir</h3>
            </div>
            <button onClick={() => navigate('/history-transaksi')} className="text-[10px] md:text-xs font-bold text-doabunda-primary hover:underline flex items-center gap-1 transition-all">
              Lihat Semua <ChevronRight size={14} />
            </button>
          </div>
          
          {/* Pembungkus agar tabel bisa di-scroll di HP */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[500px]">
              <thead className="bg-doabunda-dark text-doabunda-gold text-[10px] md:text-xs uppercase font-bold tracking-widest border-b border-doabunda-primary/30">
                <tr>
                  <th className="p-4 font-black">Waktu</th>
                  <th className="p-4 font-black">Kasir</th>
                  <th className="p-4 font-black">Metode</th>
                  <th className="p-4 text-right font-black">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs md:text-sm">
                {recentTransactions.length > 0 ? recentTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 text-gray-500 font-medium">{new Date(trx.created_at).toLocaleTimeString('id-ID')}</td>
                    <td className="p-4 font-bold text-gray-700">{trx.cashier}</td>
                    <td className="p-4">
                      <span className="px-3 py-1.5 rounded-full bg-gray-100 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-gray-600">
                        {trx.payment_method}
                      </span>
                    </td>
                    <td className="p-4 text-right font-black text-doabunda-primary">Rp {parseInt(trx.total_amount).toLocaleString('id-ID')}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="4" className="p-10 text-center text-gray-400 font-medium text-sm">
                      Belum ada transaksi hari ini.
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

export default AdminDashboard;