import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import SidebarKasir from '../components/SidebarKasir';
import { Receipt, CheckCircle2, Calendar, Clock, Loader2, ChevronLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const HistoryTransaksi = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const user = JSON.parse(localStorage.getItem('user')) || {};
  const navigate = useNavigate();

  useEffect(() => { fetchTransactions(); }, [selectedDate]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions', { params: { date: selectedDate } });
      setTransactions(res.data.data || []);
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleClosing = async () => {
    const result = await Swal.fire({
      title: 'Tutup Buku Tanggal Ini?',
      text: `Data tanggal ${selectedDate} akan difinalisasi ke Laporan Keuangan.`,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#7D0A0A',
    });

    if (result.isConfirmed) {
      setIsClosing(true);
      try {
        const totalRev = transactions.reduce((sum, t) => sum + parseFloat(t.total_amount), 0);
        await api.post('/rekap', { 
          recap_date: selectedDate, 
          total_revenue: totalRev, 
          total_transactions: transactions.length 
        });
        Swal.fire('Berhasil!', 'Data telah masuk ke Laporan Keuangan.', 'success');
      } catch (err) {
        Swal.fire('Gagal', 'Rekap mungkin sudah ada. Hapus rekap lama di menu Laporan jika ingin mengulang.', 'error');
      } finally { setIsClosing(false); }
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({ title: 'Hapus Transaksi?', icon: 'warning', showCancelButton: true });
    if (res.isConfirmed) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (err) { Swal.fire('Error', 'Gagal menghapus.', 'error'); }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      {user.role === 'admin' ? <SidebarAdmin /> : <SidebarKasir />}
      <div className="flex-1 p-6 md:p-10">
        <header className="flex flex-col lg:flex-row justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(user.role === 'admin' ? '/admin' : '/kasir/dashboard')} className="p-2 bg-white rounded-full shadow text-gray-400"><ChevronLeft size={24}/></button>
            <h1 className="text-3xl font-black flex items-center gap-3"><Receipt className="text-red-700" size={32} /> RIWAYAT</h1>
          </div>
          <div className="flex gap-4">
            <input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} className="p-3 border rounded-2xl font-bold shadow-sm" />
            {user.role === 'admin' && (
              <button onClick={handleClosing} disabled={isClosing || transactions.length === 0} className="bg-red-800 text-white px-6 py-3 rounded-2xl font-bold flex gap-2 items-center">
                {isClosing ? <Loader2 className="animate-spin" /> : <CheckCircle2 />} Tutup Buku
              </button>
            )}
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-400 text-xs uppercase font-bold tracking-widest border-b">
              <tr>
                <th className="p-5">Waktu</th><th className="p-5">Kasir</th><th className="p-5">Metode</th><th className="p-5 text-right">Total</th><th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {transactions.map((trx) => (
                <tr key={trx.id} className="hover:bg-gray-50">
                  <td className="p-5 text-gray-500 font-medium flex items-center gap-2"><Clock size={14}/> {new Date(trx.created_at).toLocaleTimeString('id-ID')}</td>
                  <td className="p-5 font-bold text-gray-700">{trx.cashier}</td>
                  <td className="p-5"><span className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-[10px] font-bold uppercase">{trx.payment_method}</span></td>
                  <td className="p-5 text-right font-black text-gray-800">Rp {parseInt(trx.total_amount).toLocaleString('id-ID')}</td>
                  <td className="p-5 text-center">
                    <button onClick={() => handleDelete(trx.id)} className="text-gray-300 hover:text-red-600"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default HistoryTransaksi;