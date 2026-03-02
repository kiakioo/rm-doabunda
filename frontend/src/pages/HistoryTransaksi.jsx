import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import SidebarKasir from '../components/SidebarKasir';
import { Receipt, CheckCircle2, Calendar, Clock, Loader2, ChevronLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const HistoryTransaksi = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, [selectedDate]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions', { params: { date: selectedDate } });
      setTransactions(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleClosing = async () => {
    if (!window.confirm(`Tutup buku untuk tanggal ${selectedDate}?`)) return;
    setIsClosing(true);
    try {
      const totalRev = transactions.reduce((sum, t) => sum + parseFloat(t.total_amount), 0);
      await api.post('/rekap', { recap_date: selectedDate, total_revenue: totalRev, total_transactions: transactions.length, status: 'closed' });
      alert("Berhasil tutup buku!");
      fetchTransactions();
    } catch (err) {
      alert("Gagal closing. Rekap mungkin sudah ada.");
    } finally {
      setIsClosing(false);
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-doabunda-light font-sans text-gray-800">
      {user.role === 'admin' ? <SidebarAdmin /> : <SidebarKasir />}
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm text-gray-400 hover:text-doabunda-dark"><ChevronLeft size={24}/></button>
            <div>
              <h1 className="text-3xl font-black flex items-center gap-3"><Receipt className="text-doabunda-primary" size={32} /> RIWAYAT TRANSAKSI</h1>
              <p className="text-gray-500 font-medium">Laporan transaksi per tanggal {selectedDate}</p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
            <div className="relative flex-1 sm:w-64">
              <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="w-full pl-12 pr-4 py-3 bg-white border border-gray-100 rounded-2xl outline-none font-bold shadow-sm" />
            </div>
            {user.role === 'admin' && (
              <button onClick={handleClosing} disabled={isClosing || transactions.length === 0} className="bg-doabunda-dark hover:bg-black text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg disabled:opacity-50">
                {isClosing ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />} Tutup Buku Tanggal Ini
              </button>
            )}
          </div>
        </header>
        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-[10px] uppercase font-bold tracking-widest border-b">
              <tr><th className="p-5">Waktu</th><th className="p-5">Kasir</th><th className="p-5">Metode</th><th className="p-5 text-right">Total</th></tr>
            </thead>
            <tbody className="divide-y divide-gray-50 text-sm">
              {loading ? (<tr><td colSpan="4" className="p-10 text-center text-gray-400">Memuat data...</td></tr>) : 
                transactions.length > 0 ? transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-5 text-gray-500 font-medium flex items-center gap-2"><Clock size={14}/>{new Date(trx.created_at).toLocaleTimeString('id-ID')}</td>
                  <td className="p-5 font-bold text-gray-700">{trx.cashier}</td>
                  <td className="p-5"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${trx.payment_method === 'Cash' ? 'bg-emerald-50 text-emerald-700' : 'bg-blue-50 text-blue-700'}`}>{trx.payment_method}</span></td>
                  <td className="p-5 text-right font-black text-gray-800">Rp {parseInt(trx.total_amount).toLocaleString('id-ID')}</td>
                </tr>
              )) : (<tr><td colSpan="4" className="p-10 text-center text-gray-400 font-medium">Tidak ada transaksi pada tanggal ini.</td></tr>)}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HistoryTransaksi;