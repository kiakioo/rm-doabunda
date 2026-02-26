import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Receipt, Plus, Trash2, TrendingDown } from 'lucide-react';
import Swal from 'sweetalert2';

const Pengeluaran = () => {
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({ description: '', amount: '' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/expenses', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setExpenses(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil data", error);
    }
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/expenses', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFormData({ description: '', amount: '' });
      fetchExpenses();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: 'Sistem gagal mencatat pengeluaran.', confirmButtonColor: '#7D0A0A' });
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
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
        
        {/* Form Input */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <Plus size={24} className="text-doabunda-primary" />
              <h2 className="text-xl font-bold text-gray-800">Catat Belanja</h2>
            </div>
            
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Keterangan Belanja</label>
                <input type="text" required value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-doabunda-primary outline-none transition-colors font-medium" placeholder="Contoh: Beli Beras 10kg" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nominal (Rp)</label>
                <input type="number" required value={formData.amount} onChange={(e) => setFormData({...formData, amount: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-doabunda-primary outline-none transition-colors font-medium" placeholder="Contoh: 150000" />
              </div>
              <button type="submit" className="w-full mt-4 bg-doabunda-dark hover:bg-doabunda-primary text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95">
                SIMPAN CATATAN
              </button>
            </form>

            <div className="mt-8 p-6 bg-red-50 rounded-xl border border-red-100">
              <p className="text-xs font-bold text-red-600 uppercase tracking-wider mb-1">Total Pengeluaran Hari Ini</p>
              <p className="text-3xl font-black text-red-700">Rp {totalExpense.toLocaleString('id-ID')}</p>
            </div>
          </div>
        </div>

        {/* Tabel Daftar Pengeluaran */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <Receipt size={22} className="text-doabunda-primary" />
              <h2 className="text-lg font-bold text-gray-800">Rincian Belanja Hari Ini</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest">
                    <th className="p-5 font-bold border-b border-gray-100">Waktu</th>
                    <th className="p-5 font-bold border-b border-gray-100">Keterangan</th>
                    <th className="p-5 font-bold border-b border-gray-100 text-right">Nominal</th>
                    <th className="p-5 font-bold border-b border-gray-100 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {expenses.length === 0 ? (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-gray-400 font-medium">Belum ada catatan belanja hari ini.</td>
                    </tr>
                  ) : (
                    expenses.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-colors">
                        <td className="p-5 text-sm text-gray-500 font-medium">
                          {new Date(item.created_at).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })}
                        </td>
                        <td className="p-5 font-bold text-gray-800">{item.description}</td>
                        <td className="p-5 text-right font-bold text-red-600 flex items-center justify-end gap-2">
                          <TrendingDown size={14} /> Rp {Number(item.amount).toLocaleString('id-ID')}
                        </td>
                        <td className="p-5 text-center">
                          <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 transition-colors">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
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