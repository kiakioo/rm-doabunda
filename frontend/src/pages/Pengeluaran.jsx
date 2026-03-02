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
      // Kirim tanggal eksplisit agar sinkron dengan laporan
      const payload = { ...formData, date: new Date().toISOString().split('T')[0] };
      await api.post('/expenses', payload);
      setFormData({ description: '', amount: '' });
      fetchExpenses();
      Swal.fire('Berhasil', 'Pengeluaran dicatat.', 'success');
    } catch (error) { Swal.fire('Gagal', 'Sistem gagal mencatat.', 'error'); }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) { Swal.fire('Gagal', 'Gagal menghapus.', 'error'); }
  };

  const totalExpense = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  return (
    <div className="flex min-h-screen bg-gray-50">
      <SidebarAdmin />
      <div className="flex-1 p-8">
        <header className="flex justify-between items-center mb-10">
          <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-gray-500 font-bold"><ChevronLeft size={20} /> Kembali</button>
          <h1 className="text-3xl font-black text-red-900 uppercase">Buku Pengeluaran</h1>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="bg-white p-8 rounded-3xl shadow-sm border-t-8 border-red-700 h-fit">
            <h2 className="text-xl font-bold mb-6 flex gap-2"><Plus className="text-red-700"/> Catat Belanja</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input type="text" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-xl outline-none" placeholder="Keterangan" />
              <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full p-4 bg-gray-50 border rounded-xl outline-none" placeholder="Nominal (Rp)" />
              <button type="submit" className="w-full bg-red-800 text-white font-bold py-4 rounded-xl hover:bg-red-700 transition-all">SIMPAN</button>
            </form>
            <div className="mt-8 p-6 bg-red-50 rounded-2xl text-center font-black text-red-700">
               Total: Rp {totalExpense.toLocaleString('id-ID')}
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-3xl shadow-sm border overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400 border-b">
                <tr><th className="p-5">Waktu</th><th className="p-5">Keterangan</th><th className="p-5 text-right">Nominal</th><th className="p-5 text-center">Hapus</th></tr>
              </thead>
              <tbody className="divide-y text-sm">
                {expenses.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50">
                    <td className="p-5 text-gray-500 italic">{new Date(item.created_at).toLocaleTimeString('id-ID')}</td>
                    <td className="p-5 font-bold uppercase">{item.description}</td>
                    <td className="p-5 text-right font-black text-red-600">Rp {Number(item.amount).toLocaleString('id-ID')}</td>
                    <td className="p-5 text-center"><button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button></td>
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
export default Pengeluaran;