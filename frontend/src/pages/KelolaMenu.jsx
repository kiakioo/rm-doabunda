import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Plus, Pencil, Trash2, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const KelolaMenu = () => {
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({ name: '', category: 'Makanan', price: '' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => { fetchMenus(); }, []);

  const fetchMenus = async () => {
    const res = await axios.get('http://localhost:5000/api/menus', { headers: { Authorization: `Bearer ${token}` } });
    setMenus(res.data.data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/menus', form, { headers: { Authorization: `Bearer ${token}` } });
      Swal.fire('Berhasil!', 'Menu ditambahkan', 'success');
      setForm({ name: '', category: 'Makanan', price: '' });
      fetchMenus();
    } catch (err) { Swal.fire('Gagal!', 'Cek akses admin Anda', 'error'); }
  };

  const deleteMenu = async (id) => {
    Swal.fire({
      title: 'Hapus menu?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#BF3131', confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        await axios.delete(`http://localhost:5000/api/menus/${id}`, { headers: { Authorization: `Bearer ${token}` } });
        fetchMenus();
      }
    });
  };

  return (
    <div className="min-h-screen bg-doabunda-light p-8">
      <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-doabunda-dark font-bold mb-6 hover:underline">
        <ArrowLeft size={20} /> Kembali ke Dashboard
      </button>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Tambah Menu */}
        <div className="bg-white p-6 rounded-3xl shadow-xl h-fit border-t-8 border-doabunda-primary">
          <h2 className="text-xl font-black text-doabunda-dark mb-4 uppercase">Tambah Menu Baru</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input type="text" placeholder="Nama Menu (Contoh: Rendang)" className="w-full p-3 border rounded-xl outline-doabunda-primary" 
              value={form.name} onChange={e => setForm({...form, name: e.target.value})} required />
            <select className="w-full p-3 border rounded-xl outline-doabunda-primary" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              <option value="Makanan">Makanan</option>
              <option value="Minuman">Minuman</option>
            </select>
            <input type="number" placeholder="Harga (Rp)" className="w-full p-3 border rounded-xl outline-doabunda-primary" 
              value={form.price} onChange={e => setForm({...form, price: e.target.value})} required />
            <button className="w-full bg-doabunda-primary text-white font-bold py-3 rounded-xl hover:bg-doabunda-dark transition">SIMPAN MENU</button>
          </form>
        </div>

        {/* Tabel Daftar Menu */}
        <div className="md:col-span-2 bg-white rounded-3xl shadow-xl overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-doabunda-dark text-doabunda-gold uppercase text-sm">
              <tr>
                <th className="p-4">Menu</th>
                <th className="p-4">Kategori</th>
                <th className="p-4">Harga</th>
                <th className="p-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {menus.map(menu => (
                <tr key={menu.id} className="border-b hover:bg-doabunda-light/50 transition">
                  <td className="p-4 font-bold text-gray-800">{menu.name}</td>
                  <td className="p-4"><span className="bg-gray-100 px-3 py-1 rounded-full text-xs">{menu.category}</span></td>
                  <td className="p-4 font-bold text-doabunda-primary">Rp {Number(menu.price).toLocaleString()}</td>
                  <td className="p-4 flex justify-center gap-2">
                    <button onClick={() => deleteMenu(menu.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg"><Trash2 size={18} /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default KelolaMenu;