import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarKasir from '../components/SidebarKasir';
import { TrendingUp, Receipt, Clock, ChevronRight, MonitorSmartphone, Sparkles } from 'lucide-react';
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
      const today = new Date().toISOString().slice(0, 10);
      const res = await api.get('/transactions', { params: { date: today } });
      const transactions = res.data.data || [];
      const totalRev = transactions.reduce((sum, trx) => sum + parseFloat(trx.total_amount), 0);
      setStats({ totalRevenue: totalRev, totalTransactions: transactions.length });
      setRecentTransactions(transactions.slice(0, 5));
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-doabunda-light font-sans">
      <SidebarKasir />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-white to-red-50/30">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-red-100 text-red-600 rounded-2xl"><Sparkles size={32} /></div>
            <div>
              <h1 className="text-3xl font-black text-gray-800">Halo, <span className="text-doabunda-primary">{user.name}</span>!</h1>
              <p className="text-gray-500 font-medium">Pantau performa harianmu di RM. Doa Bunda.</p>
            </div>
          </div>
          <button onClick={() => navigate('/kasir')} className="bg-doabunda-primary hover:bg-doabunda-dark text-white px-8 py-4 rounded-2xl font-bold shadow-lg transform hover:-translate-y-1 transition-all flex items-center gap-2">
            <MonitorSmartphone size={20} /> Buka Mesin Kasir
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-emerald-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-4 text-emerald-600"><TrendingUp size={24} /><h3 className="font-bold uppercase tracking-wider text-xs">Penjualanmu Hari Ini</h3></div>
            <h2 className="text-4xl font-black text-gray-800">Rp {stats.totalRevenue.toLocaleString('id-ID')}</h2>
          </div>
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-amber-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-4 text-amber-600"><Receipt size={24} /><h3 className="font-bold uppercase tracking-wider text-xs">Total Transaksi</h3></div>
            <h2 className="text-4xl font-black text-gray-800">{stats.totalTransactions} <span className="text-lg font-medium text-gray-400">Transaksi</span></h2>
          </div>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 border-b border-gray-50 flex justify-between items-center">
            <h3 className="font-bold text-xl flex items-center gap-3"><Clock className="text-gray-400" size={20}/> Aktivitas Terakhir</h3>
            <button onClick={() => navigate('/history-transaksi')} className="text-sm font-bold text-doabunda-primary hover:underline flex items-center gap-1">Riwayat Lengkap <ChevronRight size={16}/></button>
          </div>
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest"><tr className="border-b"><th className="p-5">Waktu</th><th className="p-5">Metode</th><th className="p-5 text-right">Total</th></tr></thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {recentTransactions.length > 0 ? recentTransactions.map(t => (
                <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-5 text-gray-500 font-medium">{new Date(t.created_at).toLocaleTimeString('id-ID')}</td>
                  <td className="p-5"><span className="px-3 py-1 rounded-full bg-gray-100 text-[10px] font-bold uppercase">{t.payment_method}</span></td>
                  <td className="p-5 text-right font-black">Rp {parseInt(t.total_amount).toLocaleString('id-ID')}</td>
                </tr>
              )) : (<tr><td colSpan="3" className="p-10 text-center text-gray-400">Belum ada transaksi hari ini.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KasirDashboard;