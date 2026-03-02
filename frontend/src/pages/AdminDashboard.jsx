import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { LayoutDashboard, Utensils, ClipboardList, LogOut, TrendingUp, MonitorSmartphone, Receipt, Users, Wallet, Clock } from 'lucide-react';
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
      // Ambil data ringkasan pendapatan
      const resStats = await api.get('/rekap/summary');
      setStats({
        totalRevenue: resStats.data.totalRevenue || 0,
        totalTransactions: resStats.data.totalTransactions || 0
      });

      // Ambil data transaksi terbaru (Maksimal 5)
      const resTrx = await api.get('/transactions');
      if (resTrx.data.success) {
        setRecentTransactions(resTrx.data.data.slice(0, 5));
      }
    } catch (error) {
      console.error("Gagal mengambil data statistik", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const formatWaktu = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }) + ' WIB';
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-doabunda-light font-sans">

      {/* SIDEBAR */}
      <div className="w-full md:w-72 bg-doabunda-dark text-white p-4 md:p-6 flex flex-col justify-between shadow-2xl md:sticky md:top-0 md:h-screen z-20">
        <div>
          <div className="text-center mb-6 md:mb-10 pb-4 md:pb-6 border-b border-white/10">
            <h2 className="text-2xl md:text-3xl font-black text-doabunda-gold tracking-widest">
              DOA BUNDA
            </h2>
            <p className="text-[10px] md:text-xs text-white/60 tracking-widest mt-1 md:mt-2 uppercase">
              Administrator Panel
            </p>
          </div>

          <nav className="grid grid-cols-2 md:grid-cols-1 gap-2 md:space-y-2">
            <button className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 w-full p-3 md:p-4 bg-doabunda-primary rounded-xl font-bold text-xs md:text-base text-center md:text-left shadow-lg">
              <LayoutDashboard size={20} className="md:w-[22px] md:h-[22px]" />
              <span>Ringkasan</span>
            </button>
            <button onClick={() => navigate('/kasir')} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 w-full p-3 md:p-4 text-white/70 hover:bg-white/5 hover:text-white transition-all rounded-xl text-xs md:text-base text-center md:text-left">
              <MonitorSmartphone size={20} className="md:w-[22px] md:h-[22px]" />
              <span>Buka Kasir</span>
            </button>
            <button onClick={() => navigate('/kelola-menu')} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 w-full p-3 md:p-4 text-white/70 hover:bg-white/5 hover:text-white transition-all rounded-xl text-xs md:text-base text-center md:text-left">
              <Utensils size={20} className="md:w-[22px] md:h-[22px]" />
              <span>Menu</span>
            </button>
            <button onClick={() => navigate('/admin/laporan')} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 w-full p-3 md:p-4 text-white/70 hover:bg-white/5 hover:text-white transition-all rounded-xl text-xs md:text-base text-center md:text-left">
              <ClipboardList size={20} className="md:w-[22px] md:h-[22px]" />
              <span>Laporan</span>
            </button>
            <button onClick={() => navigate('/pengeluaran')} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 w-full p-3 md:p-4 text-white/70 hover:bg-white/5 hover:text-white transition-all rounded-xl text-xs md:text-base text-center md:text-left">
              <Wallet size={20} className="md:w-[22px] md:h-[22px]" />
              <span>Pengeluaran</span>
            </button>
            <button onClick={() => navigate('/manajemen-user')} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 w-full p-3 md:p-4 text-white/70 hover:bg-white/5 hover:text-white transition-all rounded-xl text-xs md:text-base text-center md:text-left">
              <Users size={20} className="md:w-[22px] md:h-[22px]" />
              <span>Karyawan</span>
            </button>
          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center justify-center md:justify-start gap-3 text-white/50 hover:text-white p-4 mt-6 md:mt-0 bg-white/5 md:bg-transparent rounded-xl md:rounded-none transition-all">
          <LogOut size={20} />
          <span className="font-bold md:font-normal">Keluar</span>
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-5 md:p-10 overflow-y-auto bg-gray-50">
        <header className="mb-8 md:mb-10 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Ringkasan Bisnis</h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">Pantau performa penjualan keseluruhan hari ini.</p>
        </header>

        {/* STATISTIK KARTU */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8 mb-8">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center text-center md:text-left transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4 text-gray-500">
              <TrendingUp size={20} className="text-doabunda-primary" />
              <h3 className="font-bold uppercase text-xs md:text-sm tracking-wider">Total Pendapatan</h3>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-4xl xl:text-5xl font-black text-gray-800 break-words">
              Rp {stats.totalRevenue.toLocaleString('id-ID')}
            </h2>
          </div>

          <div className="bg-gradient-to-br from-doabunda-gold to-[#c2a665] p-6 md:p-8 rounded-2xl shadow-md flex flex-col justify-center text-center md:text-left transform hover:-translate-y-1 transition-all duration-300">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4 text-doabunda-dark/80">
              <Receipt size={20} />
              <h3 className="font-bold uppercase text-xs md:text-sm tracking-wider">Transaksi Hari Ini</h3>
            </div>
            <h2 className="text-5xl md:text-6xl font-black text-doabunda-dark">
              {stats.totalTransactions} <span className="text-xl md:text-2xl font-semibold opacity-80">Struk</span>
            </h2>
          </div>
        </div>

        {/* TABEL TRANSAKSI TERBARU */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-100 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-red-50 rounded-lg text-doabunda-primary"><Clock size={20} /></div>
              <h3 className="text-lg md:text-xl font-bold text-gray-800">Transaksi Terbaru</h3>
            </div>
            <button onClick={() => navigate('/admin/laporan')} className="text-sm font-bold text-doabunda-primary hover:text-red-800 hover:underline">
              Lihat Semua →
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 text-gray-500 text-sm uppercase tracking-wider">
                  <th className="p-4 md:p-5 font-semibold">Waktu</th>
                  <th className="p-4 md:p-5 font-semibold">Kasir</th>
                  <th className="p-4 md:p-5 font-semibold">Metode</th>
                  <th className="p-4 md:p-5 font-semibold text-right">Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 md:p-5 text-gray-600 font-medium whitespace-nowrap">{formatWaktu(trx.created_at)}</td>
                      <td className="p-4 md:p-5 text-gray-800 font-semibold whitespace-nowrap">{trx.cashier}</td>
                      <td className="p-4 md:p-5 whitespace-nowrap">
                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${trx.payment_method === 'Cash' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'}`}>
                          {trx.payment_method}
                        </span>
                      </td>
                      <td className="p-4 md:p-5 text-right font-black text-gray-800 whitespace-nowrap">
                        Rp {parseInt(trx.total_amount).toLocaleString('id-ID')}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-8 text-center text-gray-400 italic">Belum ada transaksi hari ini.</td>
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