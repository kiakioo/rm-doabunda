import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { FileText, Trash2, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const Laporan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFinancialReport(); }, []);

  const fetchFinancialReport = async () => {
    setLoading(true);
    try {
      const res = await api.get('/rekap');
      setData(res.data.data || []);
    } catch (err) { 
      console.error(err); 
    } finally { 
      setLoading(false); 
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({
      title: 'Hapus baris laporan?',
      text: "Anda bisa melakukan Tutup Buku ulang setelah ini.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#BF3131'
    });

    if (res.isConfirmed) {
      try {
        await api.delete(`/rekap/${id}`);
        fetchFinancialReport();
        Swal.fire('Terhapus', 'Data dibersihkan.', 'success');
      } catch (err) { 
        Swal.fire('Gagal', 'Gagal menghapus.', 'error'); 
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <SidebarAdmin />
      <div className="flex-1 p-6 md:p-10">
        <header className="mb-10 text-doabunda-dark">
          <h1 className="text-3xl font-black flex items-center gap-3 tracking-tighter italic">
            <FileText size={32} /> LAPORAN KEUANGAN
          </h1>
          <p className="text-gray-500 font-medium">Analisa omzet, pengeluaran, dan laba operasional.</p>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-doabunda-dark text-white text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="p-5">Tanggal Rekap</th>
                <th className="p-5 text-right">Pendapatan</th>
                <th className="p-5 text-right">Pengeluaran</th>
                <th className="p-5 text-right">Laba Bersih</th>
                <th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr><td colSpan="5" className="p-10 text-center"><Loader2 className="animate-spin inline" /></td></tr>
              ) : data.length > 0 ? data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-5 font-bold">{new Date(item.recap_date).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</td>
                  <td className="p-5 text-right text-emerald-600 font-bold">Rp {Number(item.total_revenue).toLocaleString('id-ID')}</td>
                  <td className="p-5 text-right text-red-500 font-bold">Rp {Number(item.total_expense || 0).toLocaleString('id-ID')}</td>
                  <td className="p-5 text-right font-black bg-gray-50 text-doabunda-dark">Rp {(item.total_revenue - item.total_expense).toLocaleString('id-ID')}</td>
                  <td className="p-5 text-center">
                    <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-600 transition-colors"><Trash2 size={18}/></button>
                  </td>
                </tr>
              )) : (
                <tr><td colSpan="5" className="p-10 text-center text-gray-400 italic">Belum ada data laporan tersedia.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Laporan;