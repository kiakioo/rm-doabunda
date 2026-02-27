import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, Users, UserPlus, Trash2, Shield, User } from 'lucide-react';
import Swal from 'sweetalert2';
import api from '../services/api'; // Menggunakan file api.js yang baru dibuat

const ManajemenUser = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', username: '', password: '', role: 'kasir' });
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem('user'));

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users'); // Lebih simpel, tidak perlu URL panjang & header manual
      setUsers(res.data.data);
    } catch (error) {
      console.error("Gagal mengambil data pengguna", error);
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    try {
      await api.post('/users', formData);
      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Pengguna baru telah ditambahkan.', confirmButtonColor: '#7D0A0A' });
      setFormData({ name: '', username: '', password: '', role: 'kasir' });
      fetchUsers();
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Gagal', text: error.response?.data?.message || 'Terjadi kesalahan sistem', confirmButtonColor: '#7D0A0A' });
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser?.id) {
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
          await api.delete(`/users/${id}`);
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
      {/* ... bagian tampilan/JSX tetap sama seperti kode sebelumnya ... */}
    </div>
  );
};

export default ManajemenUser;