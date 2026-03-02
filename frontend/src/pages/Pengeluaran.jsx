import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Receipt, Plus, Trash2 } from 'lucide-react';
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
    const payload = {
      ...formData,
      date: new Date().toISOString().split('T')[0] // Mengunci tanggal input ke hari ini
    };
    await api.post('/expenses', payload);
    setFormData({ description: '', amount: '' });
    fetchExpenses();
  } catch (error) {
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
    <div className="min-h-screen bg-gray-50 font-sans p-4 md:p-8">
      <div className="max-w-6xl mx-auto mb-6 md:mb-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-gray-500 hover:text-doabunda-dark transition-colors font-medium text-sm md:text-base">
          <ChevronLeft size={20} />
          <span>Kembali ke Dashboard</span>
        </button>
        <div className="text-left md:text-right">
          <h1 className="text-2xl md:text-3xl font-black text-doabunda-dark tracking-wide uppercase">Buku Pengeluaran</h1>
          <p className="text-gray-500 text-xs md:text-sm mt-1">Catatan Belanja Operasional Hari Ini</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <div className="lg:col-span-1">
          <div className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-gray-100 md:sticky md:top-8">
            <div className="flex items-center gap-3 mb-4 md:mb-6 pb-4 border-b border-gray-100">
              <Plus size={24} className="text-doabunda-primary" />
              <h2 className="text-lg md:text-xl font-bold text-gray-800">Catat Belanja</h2>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <input type="text" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full p-3 text-sm bg-gray-50 border rounded-xl outline-none" placeholder="Keterangan Belanja" />
              <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full p-3 text-sm bg-gray-50 border rounded-xl outline-none" placeholder="Nominal (Rp)" />
              <button type="submit" className="w-full bg-doabunda-dark text-white font-bold py-3 md:py-4 rounded-xl text-sm md:text-base transition-colors hover:bg-doabunda-primary">SIMPAN CATATAN</button>
            </form>

            <div className="mt-6 md:mt-8 p-5 md:p-6 bg-red-50 rounded-xl">
              <p className="text-[10px] md:text-xs font-bold text-red-600 uppercase mb-1">Total Hari Ini</p>
              <p className="text-2xl md:text-3xl font-black text-red-700 truncate">Rp {totalExpense.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
            <div className="p-5 md:p-6 border-b flex items-center gap-3">
              <Receipt size={20} className="text-doabunda-primary md:w-6 md:h-6" />
              <h2 className="text-base md:text-lg font-bold">Rincian Belanja</h2>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left whitespace-nowrap">
                <thead>
                  <tr className="bg-gray-50 text-[10px] md:text-xs uppercase text-gray-400">
                    <th className="p-4 md:p-5 font-bold">Waktu</th>
                    <th className="p-4 md:p-5 font-bold">Keterangan</th>
                    <th className="p-4 md:p-5 font-bold text-right">Nominal</th>
                    <th className="p-4 md:p-5 font-bold text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y text-xs md:text-sm">
                  {expenses.map((item) => (
                    <tr key={item.id}>
                      <td className="p-4 md:p-5 text-gray-500">{new Date(item.created_at).toLocaleTimeString('id-ID')}</td>
                      <td className="p-4 md:p-5 font-bold">{item.description}</td>
                      <td className="p-4 md:p-5 text-right font-bold text-red-600">Rp {Number(item.amount).toLocaleString('id-ID')}</td>
                      <td className="p-4 md:p-5 text-center">
                        <button onClick={() => handleDelete(item.id)} className="text-gray-400 hover:text-red-500 transition-colors p-2"><Trash2 size={18} /></button>
                      </td>
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