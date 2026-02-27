import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, CalendarCheck, FileText, Lock, TrendingUp, TrendingDown, DollarSign } from 'lucide-react';
import Swal from 'sweetalert2';
import Layout from '../components/Layout';

const RekapHarian = () => {
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/rekap', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil data rekap", error);
    }
  };

  const handleTutupShift = async () => {
    const { value: formValues } = await Swal.fire({
      title: 'Tutup Shift & Hitung Laba',
      html: `
        <div class="text-left mb-4 text-sm text-gray-500">
          Masukkan total pengeluaran hari ini (contoh: belanja bahan baku, operasional). Kosongkan jika tidak ada.
        </div>
        <input id="swal-expense" type="number" class="swal2-input w-full mx-0 font-bold" placeholder="Total Pengeluaran (Rp)">
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#7D0A0A',
      cancelButtonColor: '#9CA3AF',
      confirmButtonText: 'Simpan Rekapitulasi',
      cancelButtonText: 'Batal',
      preConfirm: () => {
        const expense = document.getElementById('swal-expense').value;
        return expense ? parseInt(expense) : 0;
      }
    });

    if (formValues !== undefined) {
      setIsLoading(true);
      try {
        const res = await axios.post('http://localhost:5000/api/rekap/generate', 
          { total_expense: formValues }, 
          { headers: { Authorization: `Bearer ${token}` } }
        );
        
        Swal.fire({
          icon: 'success',
          title: 'Shift Ditutup',
          text: 'Rekapitulasi dan perhitungan laba berhasil diarsipkan.',
          confirmButtonColor: '#7D0A0A'
        });
        fetchHistory();
      } catch (error) {
        Swal.fire({
          icon: 'error',
          title: 'Tutup Shift Gagal',
          text: error.response?.data?.message || 'Terjadi kesalahan sistem.',
          confirmButtonColor: '#7D0A0A'
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
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
          <p className="text-gray-500 text-sm mt-1">Laporan Omzet & Laba Bersih RM. Doa Bunda</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Panel Aksi Tutup Shift */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            <div className="w-16 h-16 bg-doabunda-light rounded-full flex items-center justify-center mb-6 text-doabunda-dark">
              <Lock size={32} strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-bold text-gray-800 mb-2">Tutup Shift Kasir</h2>
            <p className="text-gray-500 text-sm mb-8 leading-relaxed">
              Kalkulasi otomatis total pendapatan kasir dikurangi pengeluaran operasional hari ini.
            </p>
            
            <button 
              onClick={handleTutupShift} 
              disabled={isLoading}
              className={`w-full flex items-center justify-center gap-3 py-4 rounded-xl font-bold text-white transition-all shadow-md hover:shadow-lg active:scale-95 ${isLoading ? 'bg-gray-400 cursor-not-allowed' : 'bg-doabunda-dark hover:bg-doabunda-primary'}`}
            >
              <CalendarCheck size={20} />
              <span>{isLoading ? 'MEMPROSES...' : 'TUTUP SHIFT SEKARANG'}</span>
            </button>
          </div>
        </div>

        {/* Panel Tabel Histori (Diperlebar untuk menampung kolom baru) */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3 bg-gray-50">
              <FileText size={22} className="text-doabunda-primary" />
              <h2 className="text-lg font-bold text-gray-800">Arsip Keuangan</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-white text-gray-400 text-xs uppercase tracking-widest border-b border-gray-200">
                    <th className="p-5 font-bold">Tanggal</th>
                    <th className="p-5 font-bold text-right">Laba Kotor (Omzet)</th>
                    <th className="p-5 font-bold text-right">Pengeluaran</th>
                    <th className="p-5 font-bold text-right text-doabunda-dark">Laba Bersih</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {history.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-gray-400">
                        Belum ada arsip keuangan yang tersimpan.
                      </td>
                    </tr>
                  ) : (
                    history.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-5">
                          <p className="font-bold text-gray-800 text-sm">{formatDate(item.recap_date)}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Cash: {Number(item.total_cash).toLocaleString('id-ID')} | QRIS: {Number(item.total_qris).toLocaleString('id-ID')}
                          </p>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2 text-green-600 font-bold">
                            <TrendingUp size={16} />
                            Rp {Number(item.total_revenue).toLocaleString('id-ID')}
                          </div>
                        </td>
                        <td className="p-5 text-right">
                          <div className="flex items-center justify-end gap-2 text-red-500 font-medium">
                            <TrendingDown size={16} />
                            Rp {Number(item.total_expense || 0).toLocaleString('id-ID')}
                          </div>
                        </td>
                        <td className="p-5 text-right font-black text-doabunda-primary bg-doabunda-light/20 text-lg">
                          Rp {Number(item.net_profit || item.total_revenue).toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RekapHarian;