import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from '../services/api';

const ManajemenUser = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    username: '',
    password: '',
    role: 'kasir'
  });

  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data.data || []);
    } catch (error) {
      console.error('Gagal mengambil data pengguna', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', formData);
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Pengguna baru telah ditambahkan.'
      });
      setFormData({ name: '', username: '', password: '', role: 'kasir' });
      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: error.response?.data?.message || 'Terjadi kesalahan sistem'
      });
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser?.id) {
      return Swal.fire({
        icon: 'warning',
        title: 'Akses Ditolak',
        text: 'Anda tidak dapat menghapus akun Anda sendiri.'
      });
    }

    try {
      await api.delete(`/users/${id}`);
      Swal.fire({
        icon: 'success',
        title: 'Terhapus',
        text: 'Pengguna berhasil dihapus'
      });
      fetchUsers();
    } catch (error) {
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Tidak dapat menghapus pengguna'
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <button
        onClick={() => navigate('/admin')}
        className="mb-6 text-red-800 font-semibold hover:underline text-sm md:text-base"
      >
        ← Kembali ke Dashboard
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-8">

        {/* Form Tambah Karyawan */}
        <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-xl shadow border border-gray-100 h-fit">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-800">Tambah Karyawan Baru</h2>

          <form onSubmit={handleAddUser} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Nama Lengkap"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 md:p-4 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-800"
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 md:p-4 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-800"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 md:p-4 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-800"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 md:p-4 text-sm bg-gray-50 border border-gray-200 rounded-xl outline-none focus:border-red-800"
            >
              <option value="kasir">Kasir</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="w-full bg-red-800 hover:bg-red-900 transition-colors text-white py-3 md:py-4 rounded-xl font-bold text-sm md:text-base mt-2"
            >
              Simpan Data Karyawan
            </button>
          </form>
        </div>

        {/* Daftar Karyawan */}
        <div className="bg-white p-5 md:p-6 rounded-2xl md:rounded-xl shadow border border-gray-100">
          <h2 className="text-lg md:text-xl font-bold mb-4 md:mb-6 text-gray-800">Daftar Karyawan</h2>

          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-4 bg-gray-50 border border-gray-100 rounded-xl hover:shadow-sm transition-shadow"
              >
                <div>
                  <p className="font-bold text-gray-800 text-sm md:text-base">{user.name}</p>
                  <div className="flex gap-2 items-center mt-1">
                    <p className="text-xs text-gray-500">{user.username}</p>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-gray-200 text-gray-600 uppercase">
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-500 hover:bg-red-50 hover:text-red-600 font-bold px-3 py-2 rounded-lg text-xs md:text-sm transition-colors"
                >
                  Hapus
                </button>
              </div>
            ))}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ManajemenUser;