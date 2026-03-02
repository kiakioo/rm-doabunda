import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarKasir from '../components/SidebarKasir';
import { 
  TrendingUp, 
  Receipt, 
  Clock, 
  ChevronRight, 
  MonitorSmartphone, 
  Sparkles 
} from 'lucide-react';
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
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        
        {/* HEADER GREETING */}
        <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 mb-8 flex flex-col md:flex-row justify-between items-center gap-6 bg-gradient-to-r from-white to-red-50/30">
          <div className="flex items-center gap-4">
            <div className="p-4 bg-red-100 text-red-600 rounded-2xl">
              <Sparkles size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-black text-gray-800">
                Halo, <span className="text-red-700">{user.name || 'Kasir'}</span>
              </h1>
              <p className="text-gray-500 font-medium">Selamat bertugas di RM. Doa Bunda hari ini.</p>
            </div>
          </div>
          <button 
            onClick={() => navigate('/kasir')}
            className="bg-red-700 hover:bg-red-800 text-white px-8 py-4 rounded-2xl font-bold shadow-lg shadow-red-200 transform hover:-translate-y-1 transition-all flex items-center gap-3"
          >
            <MonitorSmartphone size={22} />
            Buka Mesin Kasir
          </button>
        </div>

        {/* STATISTIK RINGKAS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-4 text-emerald-600">
              <TrendingUp size={24} />
              <h3 className="font-bold uppercase tracking-wider text-xs">Penjualan Anda (Hari Ini)</h3>
            </div>
            <h2 className="text-4xl font-black text-gray-800">
              Rp {stats.totalRevenue.toLocaleString('id-ID')}
            </h2>
          </div>

          <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 flex flex-col justify-center transition-all hover:shadow-md">
            <div className="flex items-center gap-3 mb-4 text-amber-600">
              <Receipt size={24} />
              <h3 className="font-bold uppercase tracking-wider text-xs">Total Struk</h3>
            </div>
            <h2 className="text-4xl font-black text-gray-800">
              {stats.totalTransactions} <span className="text-lg font-medium text-gray-400 italic">Transaksi</span>
            </h2>
          </div>
        </div>

        {/* TABEL AKTIVITAS TERAKHIR */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="p-6 md:p-8 border-b border-gray-50 flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 text-gray-600 rounded-lg">
                <Clock size={20} />
              </div>
              <h3 className="text-xl font-bold text-gray-800">Aktivitas Terakhir</h3>
            </div>
            <button 
              onClick={() => navigate('/kasir/laporan')} 
              className="text-sm font-bold text-red-700 hover:text-red-900 flex items-center gap-1 group"
            >
              Riwayat Lengkap 
              <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50/50 text-gray-400 text-[10px] uppercase font-bold tracking-widest">
                  <th className="p-5">Waktu</th>
                  <th className="p-5">Metode</th>
                  <th className="p-5 text-right">Total Tagihan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-sm">
                {recentTransactions.length > 0 ? (
                  recentTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-gray-50/30 transition-colors">
                      <td className="p-5 text-gray-500 font-medium">{formatWaktu(trx.created_at)}</td>
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
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-10 text-center text-gray-400 italic">
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