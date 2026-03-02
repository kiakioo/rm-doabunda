import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { FileText, ArrowUpCircle, ArrowDownCircle, Banknote } from 'lucide-react';

const Laporan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchFinancialReport();
  }, []);

  const fetchFinancialReport = async () => {
    setLoading(true);
    try {
      const res = await api.get('/rekap'); // Memanggil endpoint rekap harian
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50 font-sans text-gray-800">
      <SidebarAdmin />
      <div className="flex-1 p-6 md:p-10">
        <header className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-red-600 rounded-xl text-white"><FileText size={24}/></div>
            <h1 className="text-3xl font-black italic uppercase tracking-tighter">Laporan Keuangan</h1>
          </div>
          <p className="text-gray-500">Analisa pendapatan, pengeluaran, dan laba bersih operasional.</p>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-900 text-white text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="p-5">Tanggal Rekap</th>
                <th className="p-5 text-right"><div className="flex items-center justify-end gap-2 text-emerald-400"><ArrowUpCircle size={14}/> Pendapatan</div></th>
                <th className="p-5 text-right"><div className="flex items-center justify-end gap-2 text-red-400"><ArrowDownCircle size={14}/> Pengeluaran</div></th>
                <th className="p-5 text-right"><div className="flex items-center justify-end gap-2 text-amber-400"><Banknote size={14}/> Laba Bersih</div></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-5 font-bold text-gray-600">{new Date(item.recap_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                  <td className="p-5 text-right font-bold text-emerald-600">Rp {Number(item.total_revenue).toLocaleString('id-ID')}</td>
                  <td className="p-5 text-right font-bold text-red-500">Rp {Number(item.total_expense || 0).toLocaleString('id-ID')}</td>
                  <td className="p-5 text-right font-black text-gray-900 bg-gray-50/50">Rp {Number(item.net_profit || item.total_revenue).toLocaleString('id-ID')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Laporan;