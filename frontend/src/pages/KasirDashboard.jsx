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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans w-full">
      <SidebarKasir />
      
      {/* Area Konten: pt-20 untuk HP agar tidak tertutup Navbar */}
      <div className="flex-1 p-4 pt-20 md:p-8 md:pt-8 w-full overflow-x-hidden">
        
        {/* Banner Ucapan Selamat Datang */}
        <div className="bg-white p-5 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-center gap-4 md:gap-6 bg-gradient-to-r from-white to-red-50/50">
          <div className="flex items-center gap-3 md:gap-4 w-full md:w-auto">
            <div className="p-3 md:p-4 bg-red-100 text-doabunda-primary rounded-xl md:rounded-2xl shrink-0">
              <Sparkles size={28} className="md:w-8 md:h-8" />
            </div>
            <div>
              <h1 className="text-xl md:text-3xl font-black text-gray-800 tracking-wide">Halo, <span className="text-doabunda-primary">{user.name}</span>!</h1>
              <p className="text-gray-500 font-medium text-xs md:text-sm mt-0.5 md:mt-1">Siap melayani pelanggan RM. Doa Bunda hari ini?</p>
            </div>
          </div>
          
          <button 
            onClick={() => navigate('/kasir')} 
            className="w-full md:w-auto bg-doabunda-primary hover:bg-doabunda-dark text-white px-6 py-3 md:py-4 rounded-xl md:rounded-2xl font-bold shadow-md md:shadow-lg transform hover:-translate-y-1 transition-all flex items-center justify-center gap-2 text-sm md:text-base tracking-wide shrink-0"
          >
            <MonitorSmartphone size={20} /> Buka Mesin Kasir
          </button>
        </div>

        {/* Kartu Statistik */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-6 md:mb-8">
          <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-emerald-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-3 md:mb-4 text-emerald-600">
              <TrendingUp size={24} />
              <h3 className="font-bold uppercase tracking-wider text-[10px] md:text-xs">Penjualanmu Hari Ini</h3>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">Rp {stats.totalRevenue.toLocaleString('id-ID')}</h2>
          </div>
          
          <div className="bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-sm border border-amber-100 transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-3 md:mb-4 text-amber-600">
              <Receipt size={24} />
              <h3 className="font-bold uppercase tracking-wider text-[10px] md:text-xs">Total Transaksi</h3>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-gray-800 tracking-tight">{stats.totalTransactions} <span className="text-base md:text-lg font-medium text-gray-400">Transaksi</span></h2>
          </div>
        </div>

        {/* Tabel Aktivitas Terakhir */}
        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-4 md:p-6 border-b border-gray-50 flex justify-between items-center bg-gray-50/50">
            <h3 className="font-bold text-sm md:text-base flex items-center gap-2 md:gap-3 text-gray-800">
              <Clock className="text-doabunda-primary" size={20}/> Aktivitas Terakhir
            </h3>
            <button onClick={() => navigate('/history-transaksi')} className="text-[10px] md:text-xs font-bold text-doabunda-primary hover:underline flex items-center gap-1 transition-all">
              Riwayat Lengkap <ChevronRight size={14}/>
            </button>
          </div>
          
          {/* Wadah pembungkus tabel (Anti Pecah di Layar HP) */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[500px]">
              {/* Desain Header Konsisten dengan halaman Admin */}
              <thead className="bg-doabunda-dark text-doabunda-gold text-[10px] md:text-xs uppercase font-bold tracking-widest border-b border-doabunda-primary/30">
                <tr>
                  <th className="p-4 md:p-5 font-black">Waktu</th>
                  <th className="p-4 md:p-5 font-black">Metode</th>
                  <th className="p-4 md:p-5 text-right font-black">Total Transaksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs md:text-sm">
                {recentTransactions.length > 0 ? recentTransactions.map(t => (
                  <tr key={t.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-4 md:p-5 text-gray-500 font-medium whitespace-nowrap">
                      {new Date(t.created_at).toLocaleTimeString('id-ID')}
                    </td>
                    <td className="p-4 md:p-5">
                      <span className="px-3 py-1.5 rounded-full bg-gray-100 text-[9px] md:text-[10px] font-bold uppercase tracking-wider text-gray-600">
                        {t.payment_method}
                      </span>
                    </td>
                    <td className="p-4 md:p-5 text-right font-black text-doabunda-primary">
                      Rp {parseInt(t.total_amount).toLocaleString('id-ID')}
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" className="p-10 text-center text-gray-400 font-medium text-sm">
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

export default KasirDashboard;