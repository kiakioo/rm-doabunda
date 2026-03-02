import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Utensils } from 'lucide-react';
import Swal from 'sweetalert2';
import SidebarAdmin from '../components/SidebarAdmin';

const KelolaMenu = () => {
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({ name: '', category: 'Makanan', price: '' });

  useEffect(() => { fetchMenus(); }, []);

  const fetchMenus = async () => {
    try {
      const res = await api.get('/menus');
      setMenus(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/menus', form);
      Swal.fire('Berhasil!', 'Menu ditambahkan', 'success');
      setForm({ name: '', category: 'Makanan', price: '' });
      fetchMenus();
    } catch (err) {
      Swal.fire('Gagal!', 'Terjadi kesalahan sistem', 'error');
    }
  };

  const deleteMenu = async (id) => {
    Swal.fire({
      title: 'Hapus menu?', 
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#BF3131', 
      confirmButtonText: 'Ya, Hapus!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/menus/${id}`);
          fetchMenus();
        } catch (err) {
          Swal.fire('Gagal!', 'Gagal menghapus menu', 'error');
        }
      }
    });
  };

  return (
    // Membungkus dengan layout flex Sidebar (Kiri) dan Konten (Kanan)
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans w-full">
      
      {/* Memanggil komponen navigasi samping */}
      <SidebarAdmin />

      {/* Area Konten Utama - pt-24 wajib agar tidak tertutup header navigasi di HP */}
      <div className="flex-1 p-4 pt-20 md:p-8 md:pt-8 w-full overflow-x-hidden">
        
        <header className="mb-6 md:mb-8 flex items-center gap-3">
          <Utensils className="text-doabunda-primary" size={32} />
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-wide">KELOLA MENU</h1>
            <p className="text-gray-500 text-sm mt-1">Atur daftar makanan dan harga untuk Kasir.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          
          {/* ================= FORM TAMBAH MENU ================= */}
          <div className="bg-white p-5 md:p-6 rounded-2xl shadow-sm h-fit border border-gray-100 border-t-8 border-t-doabunda-primary">
            <h2 className="text-lg md:text-xl font-black text-doabunda-dark mb-4 flex items-center gap-2">
              <Plus size={20} /> Tambah Menu Baru
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input 
                type="text" 
                placeholder="Nama Menu" 
                className="w-full p-3 md:p-3.5 text-sm border border-gray-200 rounded-xl focus:border-doabunda-primary focus:ring-1 focus:ring-doabunda-primary outline-none transition-all" 
                value={form.name} 
                onChange={e => setForm({...form, name: e.target.value})} 
                required 
              />
              <select 
                className="w-full p-3 md:p-3.5 text-sm border border-gray-200 rounded-xl focus:border-doabunda-primary focus:ring-1 focus:ring-doabunda-primary outline-none transition-all" 
                value={form.category} 
                onChange={e => setForm({...form, category: e.target.value})}
              >
                <option value="Makanan">Makanan</option>
                <option value="Minuman">Minuman</option>
              </select>
              <input 
                type="number" 
                placeholder="Harga (Rp)" 
                className="w-full p-3 md:p-3.5 text-sm border border-gray-200 rounded-xl focus:border-doabunda-primary focus:ring-1 focus:ring-doabunda-primary outline-none transition-all" 
                value={form.price} 
                onChange={e => setForm({...form, price: e.target.value})} 
                required 
              />
              <button className="w-full bg-doabunda-dark text-white font-bold py-3.5 rounded-xl hover:bg-doabunda-primary transition-all text-sm tracking-wide mt-2">
                SIMPAN MENU
              </button>
            </form>
          </div>

          {/* ================= TABEL MENU ================= */}
          <div className="xl:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {/* Wrapper overflow-x-auto agar tabel bisa digeser di layar kecil */}
            <div className="overflow-x-auto w-full">
              {/* min-w-[600px] memaksa tabel mempertahankan bentuk aslinya dan tidak gepeng di HP */}
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-doabunda-dark text-doabunda-gold uppercase text-[11px] md:text-xs tracking-wider">
                  <tr>
                    <th className="p-4 font-black">Nama Menu</th>
                    <th className="p-4 font-black">Kategori</th>
                    <th className="p-4 font-black">Harga</th>
                    <th className="p-4 font-black text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {menus.length > 0 ? menus.map(menu => (
                    <tr key={menu.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 font-bold text-gray-800">{menu.name}</td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {menu.category}
                        </span>
                      </td>
                      <td className="p-4 font-black text-doabunda-primary">
                        Rp {Number(menu.price).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 flex justify-center">
                        <button 
                          onClick={() => deleteMenu(menu.id)} 
                          className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all"
                          title="Hapus Menu"
                        >
                          <Trash2 size={18} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan="4" className="p-10 text-center text-gray-400 text-sm font-medium">
                        Belum ada menu yang didaftarkan.
                      </td>
                    </tr>
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

export default KelolaMenu;