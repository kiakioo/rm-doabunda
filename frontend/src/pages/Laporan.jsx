import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { FileText, ArrowUpCircle, ArrowDownCircle, Banknote, PlusCircle, Loader2 } from 'lucide-react';

const Laporan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAddDana, setShowAddDana] = useState(false);
  const [extraDana, setExtraDana] = useState({ amount: '', note: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    fetchFinancialReport();
  }, []);

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

  const handleAddExtra = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/rekap/extra-income', extraDana);
      alert("Dana tambahan berhasil diinput!");
      setShowAddDana(false);
      fetchFinancialReport();
    } catch (err) {
      alert("Gagal input dana tambahan.");
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-doabunda-light font-sans">
      <SidebarAdmin />
      
      <div className="flex-1 p-5 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl font-black text-gray-800 flex items-center gap-3">
              <FileText className="text-doabunda-primary" size={32} />
              LAPORAN KEUANGAN
            </h1>
            <p className="text-gray-500 mt-1">Analisa omzet, pengeluaran, dan laba bersih operasional.</p>
          </div>
          <button 
            onClick={() => setShowAddDana(true)}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all"
          >
            <PlusCircle size={20} /> Dana Masuk Tambahan
          </button>
        </header>

        {/* Modal Dana Tambahan */}
        {showAddDana && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border-t-8 border-emerald-600">
              <h2 className="text-2xl font-black text-gray-800 mb-6">Input Dana Tambahan</h2>
              <form onSubmit={handleAddExtra} className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400 block mb-2">Nominal (Rp)</label>
                  <input type="number" required className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none" 
                    onChange={(e) => setExtraDana({...extraDana, amount: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400 block mb-2">Keterangan (Sisa Uang Pasar, dll)</label>
                  <input type="text" required className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none"
                    onChange={(e) => setExtraDana({...extraDana, note: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddDana(false)} className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600">Batal</button>
                  <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all">Simpan Dana</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-doabunda-dark text-white text-[10px] uppercase font-bold tracking-widest">
                <tr>
                  <th className="p-5">Tanggal Rekap</th>
                  <th className="p-5 text-right text-emerald-400">Total Pendapatan</th>
                  <th className="p-5 text-right text-red-400">Total Pengeluaran</th>
                  <th className="p-5 text-right text-doabunda-gold">Laba Bersih</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm md:text-base">
                {loading ? (
                  <tr><td colSpan="4" className="p-10 text-center text-gray-400">Memuat data...</td></tr>
                ) : data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5 font-bold text-gray-700">
                      {new Date(item.recap_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
                    </td>
                    <td className="p-5 text-right font-bold text-emerald-600">
                      Rp {(parseFloat(item.total_revenue) + parseFloat(item.extra_income || 0)).toLocaleString('id-ID')}
                    </td>
                    <td className="p-5 text-right font-bold text-red-500">
                      Rp {parseFloat(item.total_expense || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="p-5 text-right font-black bg-doabunda-light/30 text-doabunda-dark">
                      Rp {(parseFloat(item.total_revenue) + parseFloat(item.extra_income || 0) - parseFloat(item.total_expense || 0)).toLocaleString('id-ID')}
                    </td>
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

export default Laporan;