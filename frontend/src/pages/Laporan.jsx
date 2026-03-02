import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { FileText, Trash2, PlusCircle } from 'lucide-react';
import Swal from 'sweetalert2';

const Laporan = () => {
  const [data, setData] = useState([]);

  useEffect(() => { fetchFinancialReport(); }, []);

  const fetchFinancialReport = async () => {
    try {
      const res = await api.get('/rekap');
      setData(res.data.data || []);
    } catch (err) { console.error(err); }
  };

  const handleDeleteRekap = async (id) => {
    const result = await Swal.fire({ title: 'Hapus Laporan?', icon: 'warning', showCancelButton: true });
    if (result.isConfirmed) {
      try {
        await api.delete(`/rekap/${id}`);
        fetchFinancialReport();
      } catch (err) { Swal.fire('Error', 'Gagal menghapus.', 'error'); }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50">
      <SidebarAdmin />
      <div className="flex-1 p-6 md:p-10">
        <header className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-black flex gap-3 italic tracking-tighter"><FileText className="text-red-700" size={32}/> LAPORAN KEUANGAN</h1>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-red-900 text-white text-xs uppercase font-bold tracking-widest">
              <tr>
                <th className="p-5 text-yellow-400">Tanggal</th>
                <th className="p-5 text-right">Pendapatan</th>
                <th className="p-5 text-right">Pengeluaran</th>
                <th className="p-5 text-right">Laba Bersih</th>
                <th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => {
                const totalIncome = parseFloat(item.total_revenue) + parseFloat(item.extra_income || 0);
                const totalExp = parseFloat(item.total_expense || 0);
                return (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-5 font-bold text-gray-700">{new Date(item.recap_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                    <td className="p-5 text-right text-green-600 font-bold">Rp {totalIncome.toLocaleString('id-ID')}</td>
                    <td className="p-5 text-right text-red-500 font-bold">Rp {totalExp.toLocaleString('id-ID')}</td>
                    <td className="p-5 text-right font-black bg-gray-50">Rp {(totalIncome - totalExp).toLocaleString('id-ID')}</td>
                    <td className="p-5 text-center"><button onClick={() => handleDeleteRekap(item.id)} className="text-gray-300 hover:text-red-600"><Trash2 size={18}/></button></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Laporan;