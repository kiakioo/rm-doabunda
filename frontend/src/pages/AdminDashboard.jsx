import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { TrendingUp, Receipt, Clock, ChevronRight, Wallet, Users } from 'lucide-react';
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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
      <SidebarAdmin />
      <div className="flex-1 p-6 md:p-10">
        <header className="mb-8">
          <h1 className="text-3xl font-black text-gray-800">Ringkasan Bisnis</h1>
          <p className="text-gray-500">Pantau performa RM. Doa Bunda hari ini.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-10">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <TrendingUp size={24} />
              <span className="font-bold uppercase tracking-wider text-xs">Total Pendapatan kotor</span>
            </div>
            <h2 className="text-4xl font-black text-gray-800">Rp {stats.totalRevenue.toLocaleString('id-ID')}</h2>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <Receipt size={24} />
              <span className="font-bold uppercase tracking-wider text-xs">Transaksi Berhasil</span>
            </div>
            <h2 className="text-4xl font-black text-gray-800">{stats.totalTransactions} <span className="text-lg font-medium text-gray-400">Struk</span></h2>
          </div>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-3 text-gray-800">
              <Clock size={20} className="text-red-600" />
              <h3 className="font-bold">Aktivitas Transaksi Terakhir</h3>
            </div>
            <button onClick={() => navigate('/history-transaksi')} className="text-xs font-bold text-red-600 hover:underline flex items-center gap-1">
              Lihat Semua <ChevronRight size={14} />
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="p-4">Waktu</th>
                  <th className="p-4">Kasir</th>
                  <th className="p-4">Metode</th>
                  <th className="p-4 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {recentTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-4 text-gray-500">{new Date(trx.created_at).toLocaleTimeString('id-ID')}</td>
                    <td className="p-4 font-bold text-gray-700">{trx.cashier}</td>
                    <td className="p-4"><span className="px-2 py-1 rounded-lg bg-gray-100 text-[10px] font-bold uppercase">{trx.payment_method}</span></td>
                    <td className="p-4 text-right font-black text-gray-800">Rp {parseInt(trx.total_amount).toLocaleString('id-ID')}</td>
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

export default AdminDashboard;