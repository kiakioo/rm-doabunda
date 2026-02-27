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
    <div className="min-h-screen bg-gray-50 p-8">
      <button
        onClick={() => navigate('/admin')}
        className="mb-6 text-red-800 font-semibold"
      >
        ← Kembali ke Dashboard
      </button>

      <div className="grid md:grid-cols-2 gap-8">

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Tambah Karyawan</h2>

          <form onSubmit={handleAddUser} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Nama Lengkap"
              value={formData.name}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded"
            />

            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full p-3 border rounded"
            />

            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full p-3 border rounded"
            >
              <option value="kasir">Kasir</option>
              <option value="admin">Admin</option>
            </select>

            <button
              type="submit"
              className="w-full bg-red-800 text-white py-3 rounded font-bold"
            >
              Simpan User
            </button>
          </form>
        </div>

        <div className="bg-white p-6 rounded-xl shadow">
          <h2 className="text-xl font-bold mb-4">Daftar Karyawan</h2>

          <div className="space-y-3">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex justify-between items-center p-3 border rounded"
              >
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-gray-500">
                    {user.username} • {user.role}
                  </p>
                </div>

                <button
                  onClick={() => handleDelete(user.id)}
                  className="text-red-600 font-semibold"
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