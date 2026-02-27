import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CalendarCheck, FileText, Lock, TrendingUp, TrendingDown } from 'lucide-react';
import Swal from 'sweetalert2';

const RekapHarian = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/rekap');
      setHistory(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil data rekap", error);
    }
  };

  const handleTutupShift = async () => {
    const { value: expense } = await Swal.fire({
      title: 'Tutup Shift Kasir',
      input: 'number',
      inputLabel: 'Masukkan total pengeluaran hari ini (Rp)',
      showCancelButton: true,
      confirmButtonColor: '#7D0A0A',
    });

    if (expense !== undefined) {
      setIsLoading(true);
      try {
        await api.post('/rekap/generate', { total_expense: expense || 0 });
        Swal.fire({ icon: 'success', title: 'Shift Ditutup', confirmButtonColor: '#7D0A0A' });
        fetchHistory();
      } catch (error) {
        Swal.fire({ icon: 'error', title: 'Gagal', text: error.response?.data?.message || 'Terjadi kesalahan sistem.', confirmButtonColor: '#7D0A0A' });
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-8">
      <div className="max-w-7xl mx-auto mb-8 flex justify-between items-center">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-gray-500 hover:text-doabunda-dark transition-colors font-medium">
          <ChevronLeft size={20} />
          <span>Kembali ke Dashboard</span>
        </button>
        <div className="text-right">
          <h1 className="text-3xl font-black text-doabunda-dark tracking-wide uppercase">Buku Besar</h1>
          <p className="text-gray-500 text-sm mt-1">Laporan Omzet & Laba Bersih</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            <Lock size={32} className="text-doabunda-dark mb-4" />
            <h2 className="text-xl font-bold mb-2">Tutup Shift Kasir</h2>
            <button 
              onClick={handleTutupShift} 
              disabled={isLoading}
              className={`w-full py-4 rounded-xl font-bold text-white transition-all ${isLoading ? 'bg-gray-400' : 'bg-doabunda-dark hover:bg-doabunda-primary'}`}
            >
              <CalendarCheck size={20} className="inline mr-2" />
              <span>{isLoading ? 'MEMPROSES...' : 'TUTUP SHIFT SEKARANG'}</span>
            </button>
          </div>
        </div>

        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b flex items-center gap-3 bg-gray-50">
              <FileText size={22} className="text-doabunda-primary" />
              <h2 className="text-lg font-bold">Arsip Keuangan</h2>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-white text-gray-400 text-xs uppercase border-b">
                  <th className="p-5 font-bold">Tanggal</th>
                  <th className="p-5 font-bold text-right">Omzet</th>
                  <th className="p-5 font-bold text-right">Pengeluaran</th>
                  <th className="p-5 font-bold text-right text-doabunda-dark">Laba Bersih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {history.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="p-5 font-bold text-sm">{new Date(item.recap_date).toLocaleDateString('id-ID')}</td>
                    <td className="p-5 text-right font-bold text-green-600">Rp {Number(item.total_revenue).toLocaleString('id-ID')}</td>
                    <td className="p-5 text-right font-medium text-red-500">Rp {Number(item.total_expense || 0).toLocaleString('id-ID')}</td>
                    <td className="p-5 text-right font-black text-doabunda-primary bg-doabunda-light/20">Rp {Number(item.net_profit || item.total_revenue).toLocaleString('id-ID')}</td>
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

export default RekapHarian;