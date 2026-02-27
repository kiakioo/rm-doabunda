import React, { useState, useEffect } from 'react';
import api from '../services/api';
import {
  LayoutDashboard,
  Utensils,
  ClipboardList,
  LogOut,
  TrendingUp,
  MonitorSmartphone,
  Receipt,
  Users,
  Wallet,
  Menu as MenuIcon,
  X
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalTransactions: 0 });
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  const SidebarContent = () => (
    <>
      <div>
        <div className="text-center mb-8 pb-6 border-b border-white/10">
          <h2 className="text-3xl font-black text-doabunda-gold tracking-widest">
            DOA BUNDA
          </h2>
          <p className="text-xs text-white/60 tracking-widest mt-2 uppercase">
            Administrator Panel
          </p>
        </div>

        <nav className="space-y-2">
          <button className="flex items-center gap-4 w-full p-4 bg-doabunda-primary text-white rounded-xl font-bold">
            <LayoutDashboard size={22} />
            Ringkasan
          </button>

          <button onClick={() => navigate('/kasir')} className="nav-btn">
            <MonitorSmartphone size={22} /> Buka Mesin Kasir
          </button>

          <button onClick={() => navigate('/kelola-menu')} className="nav-btn">
            <Utensils size={22} /> Manajemen Menu
          </button>

          <button onClick={() => navigate('/rekap')} className="nav-btn">
            <ClipboardList size={22} /> Laporan Harian
          </button>

          <button onClick={() => navigate('/pengeluaran')} className="nav-btn">
            <Wallet size={22} /> Buku Pengeluaran
          </button>

          <button onClick={() => navigate('/manajemen-user')} className="nav-btn">
            <Users size={22} /> Manajemen Karyawan
          </button>
        </nav>
      </div>

      <button onClick={handleLogout} className="flex items-center gap-4 text-white/60 hover:text-white p-4">
        <LogOut size={22} /> Keluar
      </button>
    </>
  );

  return (
    <div className="flex min-h-screen bg-doabunda-light">

      {/* DESKTOP SIDEBAR */}
      <div className="hidden md:flex md:w-72 bg-doabunda-dark text-white p-6 flex-col justify-between shadow-2xl">
        <SidebarContent />
      </div>

      {/* MOBILE SIDEBAR */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 md:hidden">
          <div className="w-72 bg-doabunda-dark h-full text-white p-6 flex flex-col justify-between">
            <div>
              <button onClick={() => setSidebarOpen(false)} className="mb-6">
                <X size={24} />
              </button>
              <SidebarContent />
            </div>
          </div>
        </div>
      )}

      {/* CONTENT */}
      <div className="flex-1 p-4 md:p-10">

        {/* HEADER */}
        <div className="flex justify-between items-center mb-8">
          <button onClick={() => setSidebarOpen(true)} className="md:hidden">
            <MenuIcon size={26} />
          </button>

          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-800">
              Ringkasan Bisnis
            </h1>
            <p className="text-gray-500 text-sm">
              Pantau performa penjualan hari ini
            </p>
          </div>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow">
            <h3 className="text-sm text-gray-500 uppercase mb-2">
              Total Pendapatan
            </h3>
            <h2 className="text-3xl md:text-5xl font-black text-gray-800">
              Rp {stats.totalRevenue.toLocaleString('id-ID')}
            </h2>
          </div>

          <div className="bg-gradient-to-br from-doabunda-gold to-[#d4b97a] p-6 md:p-8 rounded-2xl shadow">
            <h3 className="text-sm uppercase mb-2">
              Transaksi Hari Ini
            </h3>
            <h2 className="text-3xl md:text-5xl font-black">
              {stats.totalTransactions}
            </h2>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;