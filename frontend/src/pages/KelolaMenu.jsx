import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { Plus, Trash2, Edit2, Utensils, X } from 'lucide-react';
import Swal from 'sweetalert2';

// Import kedua Sidebar
import SidebarAdmin from '../components/SidebarAdmin';
import SidebarKasir from '../components/SidebarKasir';

const KelolaMenu = () => {
  const [menus, setMenus] = useState([]);
  const [form, setForm] = useState({ name: '', category: 'Makanan', price: '' });
  const [editingId, setEditingId] = useState(null);

  // Ambil data user yang sedang login untuk mengecek role
  const user = JSON.parse(localStorage.getItem('user')) || {};

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
      if (editingId) {
        await api.put(`/menus/${editingId}`, form);
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Data menu diperbarui', confirmButtonColor: '#BF3131' });
        setEditingId(null);
      } else {
        await api.post('/menus', form);
        Swal.fire({ icon: 'success', title: 'Berhasil!', text: 'Menu ditambahkan', confirmButtonColor: '#BF3131' });
      }
      setForm({ name: '', category: 'Makanan', price: '' });
      fetchMenus();
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Gagal!', text: 'Terjadi kesalahan sistem', confirmButtonColor: '#BF3131' });
    }
  };

  const handleEdit = (menu) => {
    setForm({ name: menu.name, category: menu.category, price: menu.price });
    setEditingId(menu.id);
  };

  const cancelEdit = () => {
    setForm({ name: '', category: 'Makanan', price: '' });
    setEditingId(null);
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
    // 1. KUNCI HALAMAN: Mencegah scroll pada body utama
    <div className="flex h-[100dvh] bg-gray-50 font-sans w-full overflow-hidden">
      
      {/* MENAMPILKAN SIDEBAR SECARA CERDAS BERDASARKAN ROLE */}
      {user.role === 'admin' ? <SidebarAdmin /> : <SidebarKasir />}

      {/* 2. AREA KONTEN: Flex Column dengan Tinggi 100dvh */}
      <div className="flex-1 flex flex-col h-[100dvh] p-4 pt-20 md:p-8 md:pt-8 w-full overflow-hidden">
        
        {/* Header - Shrink 0 agar ukurannya tidak mengecil */}
        <header className="mb-4 md:mb-6 flex items-center gap-3 shrink-0">
          <Utensils className="text-doabunda-primary" size={32} />
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-wide uppercase">KELOLA MENU</h1>
            <p className="text-gray-500 text-sm mt-1">Atur daftar makanan, kategori, dan harga.</p>
          </div>
        </header>

        {/* 3. WADAH GRID: Mengambil sisa ruang layar dan memotong konten yang berlebih */}
        <div className="flex flex-col xl:flex-row gap-6 md:gap-8 flex-1 overflow-hidden">
          
          {/* KOLOM KIRI (Form) - Bisa di-scroll jika layar HP terlalu pendek */}
          <div className="w-full xl:w-[35%] shrink-0 overflow-y-auto pb-4 xl:pb-0">
            <div className={`p-5 md:p-6 rounded-2xl shadow-sm h-fit border border-gray-100 border-t-8 transition-all ${editingId ? 'bg-blue-50 border-t-blue-500' : 'bg-white border-t-doabunda-primary'}`}>
              <h2 className={`text-lg md:text-xl font-black mb-4 flex items-center gap-2 ${editingId ? 'text-blue-700' : 'text-doabunda-dark'}`}>
                {editingId ? <Edit2 size={20} /> : <Plus size={20} />}
                {editingId ? 'Edit Data Menu' : 'Tambah Menu Baru'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <input 
                  type="text" placeholder="Nama Menu" required
                  className="w-full p-3 md:p-3.5 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-doabunda-primary outline-none transition-all bg-white" 
                  value={form.name} onChange={e => setForm({...form, name: e.target.value})} 
                />
                <select 
                  className="w-full p-3 md:p-3.5 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-doabunda-primary outline-none transition-all bg-white" 
                  value={form.category} onChange={e => setForm({...form, category: e.target.value})}
                >
                  <option value="Makanan">Makanan</option>
                  <option value="Minuman">Minuman</option>
                </select>
                <input 
                  type="number" placeholder="Harga (Rp)" required
                  className="w-full p-3 md:p-3.5 text-sm border border-gray-200 rounded-xl focus:ring-1 focus:ring-doabunda-primary outline-none transition-all bg-white" 
                  value={form.price} onChange={e => setForm({...form, price: e.target.value})} 
                />
                
                <div className="flex flex-col gap-2 mt-2">
                  <button type="submit" className={`w-full text-white font-bold py-3.5 rounded-xl transition-all text-sm tracking-wide ${editingId ? 'bg-blue-600 hover:bg-blue-700' : 'bg-doabunda-dark hover:bg-doabunda-primary'}`}>
                    {editingId ? 'UPDATE MENU' : 'SIMPAN MENU'}
                  </button>
                  {editingId && (
                    <button type="button" onClick={cancelEdit} className="w-full bg-white text-gray-500 border border-gray-300 font-bold py-3.5 rounded-xl hover:bg-gray-100 transition-all text-sm flex items-center justify-center gap-2">
                      <X size={18} /> BATAL EDIT
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* KOLOM KANAN (Tabel) */}
          <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            
            {/* 4. AREA SCROLL TABEL */}
            <div className="flex-1 overflow-auto w-full relative">
              <table className="w-full text-left min-w-[600px]">
                
                {/* 5. STICKY HEADER */}
                <thead className="bg-doabunda-dark text-doabunda-gold uppercase text-[11px] md:text-xs tracking-wider sticky top-0 z-10 shadow-sm border-b border-doabunda-primary/30">
                  <tr>
                    <th className="p-4 font-black">Nama Menu</th>
                    <th className="p-4 font-black">Kategori</th>
                    <th className="p-4 font-black">Harga</th>
                    <th className="p-4 font-black text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-100">
                  {menus.length > 0 ? menus.map(menu => (
                    <tr key={menu.id} className={`transition-colors ${editingId === menu.id ? 'bg-blue-50/50' : 'hover:bg-gray-50'}`}>
                      <td className="p-4 font-bold text-gray-800">{menu.name}</td>
                      <td className="p-4">
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider">
                          {menu.category}
                        </span>
                      </td>
                      <td className="p-4 font-black text-doabunda-primary">
                        Rp {Number(menu.price).toLocaleString('id-ID')}
                      </td>
                      <td className="p-4 flex justify-center gap-2">
                        <button onClick={() => handleEdit(menu)} className="p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-100 rounded-lg transition-all" title="Edit Menu">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => deleteMenu(menu.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all" title="Hapus Menu">
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