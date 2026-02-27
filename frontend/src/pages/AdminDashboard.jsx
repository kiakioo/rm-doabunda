import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { LayoutDashboard, Utensils, ClipboardList, LogOut, TrendingUp, MonitorSmartphone, Receipt, Users, Wallet } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalTransactions: 0 });
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await api.get('/rekap/summary');
      setStats({
        totalRevenue: res.data.totalRevenue || 0,
        totalTransactions: res.data.totalTransactions || 0
      });
    } catch (error) {
      console.error("Gagal mengambil data statistik", error);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-doabunda-light font-sans">

      {/* SIDEBAR: Di HP jadi menu atas, di Laptop jadi menu samping */}
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

          {/* Grid agar di HP menu sejajar 2 baris, di laptop menurun */}
          <nav className="grid grid-cols-2 md:grid-cols-1 gap-2 md:space-y-2">

            <button className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 w-full p-3 md:p-4 bg-doabunda-primary rounded-xl font-bold text-xs md:text-base text-center md:text-left">
              <LayoutDashboard size={20} className="md:w-[22px] md:h-[22px]" />
              <span>Ringkasan</span>
            </button>

            <button onClick={() => navigate('/kasir')} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 w-full p-3 md:p-4 text-white/70 hover:bg-white/5 rounded-xl text-xs md:text-base text-center md:text-left">
              <MonitorSmartphone size={20} className="md:w-[22px] md:h-[22px]" />
              <span>Buka Kasir</span>
            </button>

            <button onClick={() => navigate('/kelola-menu')} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 w-full p-3 md:p-4 text-white/70 hover:bg-white/5 rounded-xl text-xs md:text-base text-center md:text-left">
              <Utensils size={20} className="md:w-[22px] md:h-[22px]" />
              <span>Menu</span>
            </button>

            <button onClick={() => navigate('/rekap')} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 w-full p-3 md:p-4 text-white/70 hover:bg-white/5 rounded-xl text-xs md:text-base text-center md:text-left">
              <ClipboardList size={20} className="md:w-[22px] md:h-[22px]" />
              <span>Laporan</span>
            </button>

            <button onClick={() => navigate('/pengeluaran')} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 w-full p-3 md:p-4 text-white/70 hover:bg-white/5 rounded-xl text-xs md:text-base text-center md:text-left">
              <Wallet size={20} className="md:w-[22px] md:h-[22px]" />
              <span>Pengeluaran</span>
            </button>

            <button onClick={() => navigate('/manajemen-user')} className="flex flex-col md:flex-row items-center justify-center md:justify-start gap-2 md:gap-4 w-full p-3 md:p-4 text-white/70 hover:bg-white/5 rounded-xl text-xs md:text-base text-center md:text-left">
              <Users size={20} className="md:w-[22px] md:h-[22px]" />
              <span>Karyawan</span>
            </button>

          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center justify-center md:justify-start gap-3 text-white/50 hover:text-white p-4 mt-6 md:mt-0 bg-white/5 md:bg-transparent rounded-xl md:rounded-none">
          <LogOut size={20} />
          <span className="font-bold md:font-normal">Keluar</span>
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-5 md:p-10 overflow-y-auto">

        <header className="mb-8 md:mb-10 text-center md:text-left">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
            Ringkasan Bisnis
          </h1>
          <p className="text-sm md:text-base text-gray-500 mt-1">
            Pantau performa penjualan hari ini.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 flex flex-col justify-center text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4 text-gray-500">
              <TrendingUp size={20} className="text-doabunda-primary" />
              <h3 className="font-bold uppercase text-xs md:text-sm">
                Total Pendapatan
              </h3>
            </div>
            <h2 className="text-3xl md:text-5xl lg:text-4xl xl:text-5xl font-black text-gray-800 break-words">
              Rp {stats.totalRevenue.toLocaleString('id-ID')}
            </h2>
          </div>

          <div className="bg-gradient-to-br from-doabunda-gold to-[#d4b97a] p-6 md:p-8 rounded-2xl shadow-sm flex flex-col justify-center text-center md:text-left">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4 text-doabunda-dark/80">
              <Receipt size={20} />
              <h3 className="font-bold uppercase text-xs md:text-sm">
                Transaksi Hari Ini
              </h3>
            </div>
            <h2 className="text-5xl font-black text-doabunda-dark">
              {stats.totalTransactions}
            </h2>
          </div>

        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;