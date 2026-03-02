import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import SidebarKasir from '../components/SidebarKasir';
import { Receipt, CheckCircle2, Clock, Loader2, ChevronLeft, Trash2, List } from 'lucide-react';
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
      confirmButtonColor: '#BF3131',
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
    const res = await Swal.fire({ 
      title: 'Hapus Transaksi?', 
      text: "Data pesanan ini akan terhapus permanen.",
      icon: 'warning', 
      showCancelButton: true,
      confirmButtonColor: '#BF3131'
    });
    
    if (res.isConfirmed) {
      try {
        await api.delete(`/transactions/${id}`);
        fetchTransactions();
      } catch (err) { Swal.fire('Error', 'Gagal menghapus.', 'error'); }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans w-full">
      {user.role === 'admin' ? <SidebarAdmin /> : <SidebarKasir />}
      
      {/* Area Konten */}
      <div className="flex-1 p-4 pt-20 md:p-8 md:pt-8 w-full overflow-x-hidden">
        
        <header className="flex flex-col lg:flex-row justify-between lg:items-end gap-6 mb-6 md:mb-10">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => navigate(user.role === 'admin' ? '/admin' : '/kasir/dashboard')} className="p-2 md:p-2.5 bg-white rounded-full shadow-sm text-gray-400 hover:text-doabunda-dark transition-colors">
              <ChevronLeft size={24}/>
            </button>
            <div>
              <h1 className="text-2xl md:text-3xl font-black flex items-center gap-3 text-gray-800 tracking-wide uppercase">
                <Receipt className="text-doabunda-primary" size={32} /> RIWAYAT
              </h1>
              <p className="text-gray-500 font-medium text-xs md:text-sm mt-1">Cek riwayat dan detail pesanan hari ini.</p>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3">
            <input 
              type="date" 
              value={selectedDate} 
              onChange={(e) => setSelectedDate(e.target.value)} 
              className="p-3 bg-white border border-gray-200 rounded-xl outline-doabunda-primary text-sm font-bold shadow-sm" 
            />
            {user.role === 'admin' && (
              <button 
                onClick={handleClosing} 
                disabled={isClosing || transactions.length === 0} 
                className={`px-6 py-3 rounded-xl font-bold flex gap-2 items-center justify-center text-sm transition-all shadow-sm ${transactions.length === 0 ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-doabunda-dark text-white hover:bg-doabunda-primary'}`}
              >
                {isClosing ? <Loader2 className="animate-spin" /> : <CheckCircle2 size={18} />} TUTUP BUKU
              </button>
            )}
          </div>
        </header>

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Wadah pembungkus tabel (Anti Pecah di HP) */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[800px]">
              <thead className="bg-doabunda-dark text-doabunda-gold text-[10px] md:text-xs uppercase font-bold tracking-widest border-b border-doabunda-primary/30">
                <tr>
                  <th className="p-4 md:p-5 font-black">Waktu</th>
                  <th className="p-4 md:p-5 font-black">Kasir</th>
                  <th className="p-4 md:p-5 font-black">Detail Pesanan</th>
                  <th className="p-4 md:p-5 font-black">Metode</th>
                  <th className="p-4 md:p-5 text-right font-black">Total Tagihan</th>
                  <th className="p-4 md:p-5 text-center font-black">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs md:text-sm">
                {loading ? (
                  <tr><td colSpan="6" className="p-10 text-center"><Loader2 className="animate-spin inline w-8 h-8 text-doabunda-primary" /></td></tr>
                ) : transactions.length > 0 ? transactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-gray-50 transition-colors align-top">
                    
                    {/* Waktu */}
                    <td className="p-4 md:p-5 text-gray-500 font-medium whitespace-nowrap">
                      <div className="flex items-center gap-1.5">
                        <Clock size={14}/> {new Date(trx.created_at).toLocaleTimeString('id-ID')}
                      </div>
                    </td>
                    
                    {/* Nama Kasir */}
                    <td className="p-4 md:p-5 font-bold text-gray-700 whitespace-nowrap">{trx.cashier}</td>
                    
                    {/* DETAIL ITEM PESANAN */}
                    <td className="p-4 md:p-5">
                      {trx.items && trx.items.length > 0 ? (
                        <ul className="space-y-1">
                          {trx.items.map((item, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-gray-600">
                              <span className="font-black text-doabunda-primary w-5 text-right">{item.qty}x</span>
                              <span className="font-medium">{item.name}</span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <span className="text-gray-400 italic text-xs">Tanpa detail</span>
                      )}
                    </td>

                    {/* Metode Pembayaran */}
                    <td className="p-4 md:p-5 whitespace-nowrap">
                      <span className="px-3 py-1.5 bg-gray-100 text-gray-600 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider">
                        {trx.payment_method}
                      </span>
                    </td>

                    {/* Total Harga */}
                    <td className="p-4 md:p-5 text-right font-black text-doabunda-dark whitespace-nowrap">
                      Rp {parseInt(trx.total_amount).toLocaleString('id-ID')}
                    </td>
                    
                    {/* Tombol Hapus */}
                    <td className="p-4 md:p-5 text-center">
                      <button 
                        onClick={() => handleDelete(trx.id)} 
                        className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Hapus Transaksi"
                      >
                        <Trash2 size={18}/>
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="p-10 text-center text-gray-400 font-medium">Belum ada transaksi di tanggal ini.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};
export default HistoryTransaksi;