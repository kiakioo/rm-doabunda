import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { Wallet, Plus, Trash2 } from 'lucide-react';
import Swal from 'sweetalert2';

const Pengeluaran = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ description: '', amount: '' });

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
      setFormData({ description: '', amount: '' });
      fetchExpenses();
      Swal.fire({ icon: 'success', title: 'Berhasil dicatat', timer: 1500, showConfirmButton: false });
    } catch (error) { Swal.fire('Gagal', 'Sistem gagal mencatat.', 'error'); }
  };

  const handleDelete = async (id) => {
    try { await api.delete(`/expenses/${id}`); fetchExpenses(); } 
    catch (error) { Swal.fire('Gagal', 'Gagal menghapus.', 'error'); }
  };

  const totalExpense = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans w-full">
      <SidebarAdmin />
      <div className="flex-1 p-4 pt-24 md:p-8 md:pt-8 overflow-x-hidden">
        
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-3">
            <Wallet className="text-doabunda-primary" size={32} /> Buku Pengeluaran
          </h1>
          <p className="text-gray-500 text-sm mt-1">Catat belanja operasional harian seperti bahan baku dan lainnya.</p>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-fit">
            <h2 className="text-lg font-bold mb-4 flex items-center gap-2 text-gray-800"><Plus size={20}/> Catat Belanja Baru</h2>
            <form onSubmit={handleAdd} className="space-y-4">
              <input type="text" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3.5 bg-gray-50 border rounded-xl outline-doabunda-primary text-sm" placeholder="Keterangan Belanja" />
              <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full p-3.5 bg-gray-50 border rounded-xl outline-doabunda-primary text-sm" placeholder="Nominal Uang (Rp)" />
              <button type="submit" className="w-full bg-doabunda-dark text-white font-bold py-3.5 rounded-xl hover:bg-doabunda-primary transition-all text-sm mt-2">SIMPAN DATA</button>
            </form>
            <div className="mt-6 p-4 bg-red-50 rounded-xl text-center border border-red-100">
               <p className="text-xs text-red-600 font-bold uppercase tracking-wider mb-1">Total Hari Ini</p>
               <p className="font-black text-xl text-red-800">Rp {totalExpense.toLocaleString('id-ID')}</p>
            </div>
          </div>

          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left min-w-[500px]">
                <thead className="bg-gray-50 text-xs uppercase font-bold text-gray-400 border-b">
                  <tr><th className="p-4">Waktu</th><th className="p-4">Keterangan</th><th className="p-4 text-right">Nominal</th><th className="p-4 text-center">Aksi</th></tr>
                </thead>
                <tbody className="divide-y divide-gray-50 text-sm">
                  {expenses.length > 0 ? expenses.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="p-4 text-gray-500 text-xs">{new Date(item.created_at).toLocaleTimeString('id-ID')}</td>
                      <td className="p-4 font-bold text-gray-700">{item.description}</td>
                      <td className="p-4 text-right font-bold text-red-600">Rp {Number(item.amount).toLocaleString('id-ID')}</td>
                      <td className="p-4 text-center"><button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-600"><Trash2 size={18} /></button></td>
                    </tr>
                  )) : (<tr><td colSpan="4" className="p-10 text-center text-gray-400">Belum ada pengeluaran hari ini.</td></tr>)}
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