import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { FileText, PlusCircle, Trash2, ArrowUpCircle, ArrowDownCircle, Banknote } from 'lucide-react';
import Swal from 'sweetalert2';

const Laporan = () => {
  const [data, setData] = useState([]);
  const [showAddDana, setShowAddDana] = useState(false);
  const [extraDana, setExtraDana] = useState({ amount: '', note: '', date: new Date().toISOString().split('T')[0] });

  useEffect(() => {
    fetchFinancialReport();
  }, []);

  const fetchFinancialReport = async () => {
    try {
      const res = await api.get('/rekap');
      setData(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddExtra = async (e) => {
    e.preventDefault();
    try {
      await api.patch('/rekap/extra-income', extraDana);
      Swal.fire('Berhasil', 'Dana tambahan diinput!', 'success');
      setShowAddDana(false);
      fetchFinancialReport();
    } catch (err) {
      Swal.fire('Gagal', 'Pastikan riwayat tanggal tsb sudah ditutup.', 'error');
    }
  };

  const handleDeleteRekap = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus laporan?',
      text: "Anda dapat melakukan 'Tutup Buku' ulang setelah menghapus data ini.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#BF3131',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/rekap/${id}`);
        fetchFinancialReport();
        Swal.fire('Terhapus', 'Baris laporan berhasil dihapus.', 'success');
      } catch (err) {
        Swal.fire('Gagal', 'Gagal menghapus laporan.', 'error');
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-doabunda-light font-sans">
      <SidebarAdmin />
      <div className="flex-1 p-6 md:p-10 overflow-y-auto">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 text-gray-800">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3 tracking-tighter"><FileText className="text-doabunda-primary" size={32} /> LAPORAN KEUANGAN</h1>
            <p className="text-gray-500 font-medium">Rekapitulasi Omzet & Laba Bersih RM. Doa Bunda</p>
          </div>
          <button onClick={() => setShowAddDana(true)} className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 shadow-lg transition-all"><PlusCircle size={20} /> Dana Tambahan</button>
        </header>

        {showAddDana && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-3xl p-8 w-full max-w-md shadow-2xl border-t-8 border-emerald-600">
              <h2 className="text-2xl font-black text-gray-800 mb-6">Input Dana Tambahan</h2>
              <form onSubmit={handleAddExtra} className="space-y-5">
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400 block mb-2">Nominal (Rp)</label>
                  <input type="number" required className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none" onChange={(e) => setExtraDana({...extraDana, amount: e.target.value})} />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase text-gray-400 block mb-2">Keterangan</label>
                  <input type="text" required className="w-full p-4 bg-gray-50 rounded-xl border border-gray-100 focus:ring-2 focus:ring-emerald-500 outline-none" onChange={(e) => setExtraDana({...extraDana, note: e.target.value})} />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setShowAddDana(false)} className="flex-1 py-4 font-bold text-gray-400 hover:text-gray-600 transition-colors">Batal</button>
                  <button type="submit" className="flex-1 py-4 bg-emerald-600 text-white rounded-2xl font-bold hover:bg-emerald-700 transition-all">Simpan Dana</button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-doabunda-dark text-white text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="p-5 text-doabunda-gold">Tanggal</th>
                <th className="p-5 text-right text-emerald-400">Total Pendapatan</th>
                <th className="p-5 text-right text-red-400">Total Pengeluaran</th>
                <th className="p-5 text-right text-white">Laba Bersih</th>
                <th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {data.map((item) => {
                const totalIncome = parseFloat(item.total_revenue) + parseFloat(item.extra_income || 0);
                const totalExp = parseFloat(item.total_expense || 0);
                return (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="p-5 font-bold text-gray-700">{new Date(item.recap_date).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}</td>
                    <td className="p-5 text-right font-bold text-emerald-600">Rp {totalIncome.toLocaleString('id-ID')}</td>
                    <td className="p-5 text-right font-bold text-red-500">Rp {totalExp.toLocaleString('id-ID')}</td>
                    <td className="p-5 text-right font-black bg-doabunda-light/30 text-doabunda-dark">Rp {(totalIncome - totalExp).toLocaleString('id-ID')}</td>
                    <td className="p-5 text-center"><button onClick={() => handleDeleteRekap(item.id)} className="p-2 text-gray-300 hover:text-red-600 transition-colors"><Trash2 size={18}/></button></td>
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