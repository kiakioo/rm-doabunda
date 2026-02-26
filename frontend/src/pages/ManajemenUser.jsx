import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, UserPlus, Trash2, Shield, User } from 'lucide-react';
import Swal from 'sweetalert2';

const ManajemenUser = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', role: 'kasir' });
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil data pengguna", error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/users', formData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Pengguna baru telah ditambahkan.', confirmButtonColor: '#7D0A0A' });
      setFormData({ name: '', username: '', password: '', role: 'kasir' });
      fetchUsers();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: error.response?.data?.message || 'Terjadi kesalahan sistem', confirmButtonColor: '#7D0A0A' });
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser.id) {
      return Swal.fire({ icon: 'warning', title: 'Akses Ditolak', text: 'Anda tidak dapat menghapus akun Anda sendiri.', confirmButtonColor: '#7D0A0A' });
    }

    Swal.fire({
      title: 'Hapus Pengguna?',
      text: 'Akun ini tidak akan bisa mengakses sistem lagi.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#7D0A0A',
      cancelButtonColor: '#9CA3AF',
      confirmButtonText: 'Ya, Hapus'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await axios.delete(`http://localhost:5000/api/users/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          Swal.fire({ icon: 'success', title: 'Terhapus!', text: 'Akun telah dihapus.', confirmButtonColor: '#7D0A0A' });
          fetchUsers();
        } catch (error) {
          Swal.fire({ icon: 'error', title: 'Gagal', text: 'Tidak dapat menghapus pengguna.', confirmButtonColor: '#7D0A0A' });
        }
      }
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 font-sans p-8">
      <div className="max-w-6xl mx-auto mb-8 flex justify-between items-center">
        <button onClick={() => navigate('/admin')} className="flex items-center gap-2 text-gray-500 hover:text-doabunda-dark transition-colors font-medium">
          <ChevronLeft size={20} />
          <span>Kembali ke Dashboard</span>
        </button>
        <div className="text-right">
          <h1 className="text-3xl font-black text-doabunda-dark tracking-wide uppercase">Manajemen Pengguna</h1>
          <p className="text-gray-500 text-sm mt-1">Pengaturan Akses Karyawan</p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form Tambah Karyawan */}
        <div className="lg:col-span-1">
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 sticky top-8">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-gray-100">
              <UserPlus size={24} className="text-doabunda-primary" />
              <h2 className="text-xl font-bold text-gray-800">Akun Baru</h2>
            </div>
            
            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Nama Lengkap</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-doabunda-primary outline-none transition-colors font-medium" placeholder="Contoh: Budi Santoso" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Username Login</label>
                <input type="text" required value={formData.username} onChange={(e) => setFormData({...formData, username: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-doabunda-primary outline-none transition-colors font-medium" placeholder="Contoh: kasir_budi" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Password</label>
                <input type="password" required value={formData.password} onChange={(e) => setFormData({...formData, password: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-doabunda-primary outline-none transition-colors font-medium" placeholder="Masukkan password kuat" />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">Hak Akses (Role)</label>
                <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})} className="w-full mt-1 p-3 bg-gray-50 border border-gray-200 rounded-xl focus:border-doabunda-primary outline-none transition-colors font-medium cursor-pointer">
                  <option value="kasir">Kasir (Transaksi Saja)</option>
                  <option value="admin">Administrator (Akses Penuh)</option>
                </select>
              </div>
              <button type="submit" className="w-full mt-4 bg-doabunda-dark hover:bg-doabunda-primary text-white font-bold py-4 rounded-xl transition-all shadow-md active:scale-95">
                SIMPAN PENGGUNA
              </button>
            </form>
          </div>
        </div>

        {/* Tabel Daftar Pengguna */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100 flex items-center gap-3">
              <Users size={22} className="text-doabunda-primary" />
              <h2 className="text-lg font-bold text-gray-800">Daftar Karyawan Aktif</h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 text-gray-500 text-xs uppercase tracking-widest">
                    <th className="p-5 font-bold border-b border-gray-100">Nama Karyawan</th>
                    <th className="p-5 font-bold border-b border-gray-100">Username</th>
                    <th className="p-5 font-bold border-b border-gray-100 text-center">Akses</th>
                    <th className="p-5 font-bold border-b border-gray-100 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {users.map((user) => (
                    <tr key={user.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="p-5 font-bold text-gray-800">{user.name}</td>
                      <td className="p-5 text-gray-500 font-medium">{user.username}</td>
                      <td className="p-5 text-center">
                        {user.role === 'admin' ? (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-doabunda-dark/10 text-doabunda-dark text-xs font-bold uppercase tracking-wider">
                            <Shield size={12} /> Admin
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-200 text-gray-700 text-xs font-bold uppercase tracking-wider">
                            <User size={12} /> Kasir
                          </span>
                        )}
                      </td>
                      <td className="p-5 text-center">
                        {user.id !== currentUser.id && (
                          <button onClick={() => handleDelete(user.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Hapus Pengguna">
                            <Trash2 size={18} />
                          </button>
                        )}
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

export default ManajemenUser;