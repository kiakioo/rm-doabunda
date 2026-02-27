import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Receipt, Plus, Trash2, TrendingDown } from 'lucide-react';
import Swal from 'sweetalert2';

const Pengeluaran = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ description: '', amount: '' });
  const navigate = useNavigate();

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await api.get('/expenses');
      setExpenses(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await api.post('/expenses', formData);
      setFormData({ description: '', amount: '' });
      fetchExpenses();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Sistem gagal mencatat pengeluaran.', confirmButtonColor: '#7D0A0A' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/expenses/${id}`);
      fetchExpenses();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Gagal menghapus data.', confirmButtonColor: '#7D0A0A' });
    }
  };

  const totalExpense = expenses.reduce((sum, item) => sum + parseFloat(item.amount), 0);

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-8">
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-gray-500 hover:text-doabunda-dark transition-colors font-medium">
          <ChevronLeft size={20} />
          <span>Kembali ke Dashboard</span>
        </button>
        <div className="text-right">
          <h1 className="text-3xl font-black text-doabunda-dark tracking-wide uppercase">Buku Pengeluaran</h1>
          <p className="text-gray-500 text-sm mt-1">Catatan Belanja Operasional Hari Ini</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <Plus size={24} className="text-doabunda-primary" />
              <h2 className="text-xl font-bold text-gray-800">Catat Belanja</h2>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <input type="text" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" placeholder="Keterangan Belanja" />
              <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full p-3 bg-gray-50 border rounded-xl outline-none" placeholder="Nominal (Rp)" />
              <button type="submit" className="w-full bg-doabunda-dark text-white font-bold py-4 rounded-xl">SIMPAN CATATAN</button>
            </form>

            <div className="mt-8 p-6 bg-red-50 rounded-xl">
              <p className="text-xs font-bold text-red-600 uppercase mb-1">Total Hari Ini</p>
              <p className="text-3xl font-black text-red-700">Rp {totalExpense.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-6 border-b flex items-center gap-3">
              <Receipt size={22} className="text-doabunda-primary" />
              <h2 className="text-lg font-bold">Rincian Belanja</h2>
            </div>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-50 text-xs uppercase text-gray-400">
                  <th className="p-5 font-bold">Waktu</th>
                  <th className="p-5 font-bold">Keterangan</th>
                  <th className="p-5 font-bold text-right">Nominal</th>
                  <th className="p-5 font-bold text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {expenses.map((item) => (
                  <tr key={item.id}>
                    <td className="p-5 text-sm text-gray-500">{new Date(item.created_at).toLocaleTimeString('id-ID')}</td>
                    <td className="p-5 font-bold">{item.description}</td>
                    <td className="p-5 text-right font-bold text-red-600">Rp {Number(item.amount).toLocaleString('id-ID')}</td>
                    <td className="p-5 text-center">
                      <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500"><Trash2 size={18} /></button>
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

export default Pengeluaran;