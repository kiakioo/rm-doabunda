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
    <div className="flex min-h-screen bg-doabunda-light font-sans">

      {/* SIDEBAR */}
      <div className="w-72 bg-doabunda-dark text-white p-6 flex flex-col justify-between shadow-2xl">

        <div>
          <div className="text-center mb-10 pb-6 border-b border-white/10">
            <h2 className="text-3xl font-black text-doabunda-gold tracking-widest">
              DOA BUNDA
            </h2>
            <p className="text-xs text-white/60 tracking-widest mt-2 uppercase">
              Administrator Panel
            </p>
          </div>

          <nav className="space-y-2">

            <button className="flex items-center gap-4 w-full p-4 bg-doabunda-primary rounded-xl font-bold">
              <LayoutDashboard size={22} />
              Ringkasan
            </button>

            <button onClick={() => navigate('/kasir')} className="flex items-center gap-4 w-full p-4 text-white/70 hover:bg-white/5 rounded-xl">
              <MonitorSmartphone size={22} />
              Buka Mesin Kasir
            </button>

            <button onClick={() => navigate('/kelola-menu')} className="flex items-center gap-4 w-full p-4 text-white/70 hover:bg-white/5 rounded-xl">
              <Utensils size={22} />
              Manajemen Menu
            </button>

            <button onClick={() => navigate('/rekap')} className="flex items-center gap-4 w-full p-4 text-white/70 hover:bg-white/5 rounded-xl">
              <ClipboardList size={22} />
              Laporan Harian
            </button>

            <button onClick={() => navigate('/pengeluaran')} className="flex items-center gap-4 w-full p-4 text-white/70 hover:bg-white/5 rounded-xl">
              <Wallet size={22} />
              Buku Pengeluaran
            </button>

            <button onClick={() => navigate('/manajemen-user')} className="flex items-center gap-4 w-full p-4 text-white/70 hover:bg-white/5 rounded-xl">
              <Users size={22} />
              Manajemen Karyawan
            </button>

          </nav>
        </div>

        <button onClick={handleLogout} className="flex items-center gap-4 text-white/50 hover:text-white p-4">
          <LogOut size={22} />
          Keluar
        </button>
      </div>

      {/* CONTENT */}
      <div className="flex-1 p-10 overflow-y-auto">

        <header className="mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Ringkasan Bisnis
          </h1>
          <p className="text-gray-500 mt-1">
            Pantau performa penjualan hari ini.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4 text-gray-500">
              <TrendingUp size={20} className="text-doabunda-primary" />
              <h3 className="font-bold uppercase text-sm">
                Total Pendapatan
              </h3>
            </div>
            <h2 className="text-5xl font-black text-gray-800">
              Rp {stats.totalRevenue.toLocaleString('id-ID')}
            </h2>
          </div>

          <div className="bg-gradient-to-br from-doabunda-gold to-[#d4b97a] p-8 rounded-2xl shadow-sm">
            <div className="flex items-center gap-3 mb-4 text-doabunda-dark/80">
              <Receipt size={20} />
              <h3 className="font-bold uppercase text-sm">
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