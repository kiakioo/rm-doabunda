import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Receipt, Plus, Trash2 } from 'lucide-react';
import SidebarAdmin from '../components/SidebarAdmin';
import Swal from 'sweetalert2';

const Pengeluaran = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ description: '', amount: '' });
  const navigate = useNavigate();

  useEffect(() => { fetchExpenses(); }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data.data || []);
    } catch (error) { console.error(error); }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...formData, date: new Date().toISOString().split('T')[0] };
      await api.post('/expenses', payload);
      Swal.fire('Berhasil', 'Pengeluaran dicatat dan laporan diperbarui.', 'success');
      setFormData({ description: '', amount: '' });
      fetchExpenses();
    } catch (error) {
      Swal.fire('Gagal', 'Sistem gagal mencatat pengeluaran.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus pengeluaran?',
      text: "Laporan keuangan akan otomatis menyesuaikan nominal pengeluaran.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7D0A0A',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/expenses/${id}`);
        fetchExpenses();
        Swal.fire('Terhapus!', 'Catatan telah dihilangkan.', 'success');
      } catch (error) {
        Swal.fire('Gagal', 'Gagal menghapus data.', 'error');
      }
    }
  };

  const totalExpense = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-doabunda-light font-sans">
      <SidebarAdmin />
      <div className="flex-1 p-5 md:p-10 overflow-y-auto">
        <header className="max-w-6xl mx-auto mb-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-gray-500 hover:text-doabunda-dark transition-colors font-bold"><ChevronLeft size={20} /> Kembali ke Dashboard</button>
          <div className="text-left md:text-right">
            <h1 className="text-3xl font-black text-doabunda-dark tracking-tighter uppercase">Buku Pengeluaran</h1>
            <p className="text-gray-500 font-medium italic">Catatan Belanja Operasional RM. Doa Bunda</p>
          </div>
        </header>

        <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white p-8 rounded-3xl shadow-sm border border-gray-100 md:sticky md:top-8 border-t-8 border-doabunda-primary">
              <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-50">
                <Plus size={24} className="text-doabunda-primary" />
                <h2 className="text-xl font-black text-gray-800 tracking-tighter">CATAT BELANJA</h2>
              </div>
              <form onSubmit={handleAdd} className="space-y-4">
                <input type="text" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-gray-50 border-transparent rounded-xl outline-none focus:ring-2 focus:ring-doabunda-primary" placeholder="Keterangan Belanja" />
                <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full p-4 bg-gray-50 border-transparent rounded-xl outline-none focus:ring-2 focus:ring-doabunda-primary" placeholder="Nominal (Rp)" />
                <button type="submit" className="w-full bg-doabunda-dark text-white font-bold py-4 rounded-xl shadow-lg hover:bg-doabunda-primary transition-all">SIMPAN CATATAN</button>
              </form>
              <div className="mt-8 p-6 bg-red-50 rounded-2xl border border-red-100 text-center">
                <p className="text-xs font-bold text-red-600 uppercase mb-1 tracking-widest">Total Pengeluaran Hari Ini</p>
                <p className="text-3xl font-black text-red-700">Rp {totalExpense.toLocaleString('id-ID')}</p>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
              <div className="p-6 border-b flex items-center gap-3 bg-gray-50/50">
                <Receipt size={20} className="text-doabunda-primary" />
                <h2 className="text-lg font-bold text-gray-800">Rincian Pengeluaran Harian</h2>
              </div>
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-white text-[10px] uppercase text-gray-400 font-bold tracking-widest border-b">
                    <th className="p-5">Waktu</th>
                    <th className="p-5">Keterangan</th>
                    <th className="p-5 text-right">Nominal</th>
                    <th className="p-5 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-sm">
                  {expenses.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-5 text-gray-500 italic font-medium">{new Date(item.created_at).toLocaleTimeString('id-ID', {hour:'2-digit', minute:'2-digit'})} WIB</td>
                      <td className="p-5 font-bold text-gray-700 uppercase tracking-tight">{item.description}</td>
                      <td className="p-5 text-right font-black text-red-600">Rp {Number(item.amount).toLocaleString('id-ID')}</td>
                      <td className="p-5 text-center"><button onClick={() => handleDelete(item.id)} className="p-2 text-gray-300 hover:text-red-500 transition-colors transition-all"><Trash2 size={18} /></button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Pengeluaran;