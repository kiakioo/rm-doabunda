import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Kasir from './pages/Kasir';
import KasirDashboard from './pages/KasirDashboard';
import AdminDashboard from './pages/AdminDashboard';
import KelolaMenu from './pages/KelolaMenu';
import RekapHarian from './pages/RekapHarian';
import ManajemenUser from './pages/ManajemenUser';
import Pengeluaran from './pages/Pengeluaran';
import HistoryTransaksi from './pages/HistoryTransaksi';
import Laporan from './pages/Laporan';

// 🔒 Cek Login: Memastikan token tersedia di localStorage
const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

// 🔐 Cek Role: Memastikan pengguna mengakses halaman yang sesuai dengan hak aksesnya
const RoleRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (!user) return <Navigate to="/" />;

  // Jika role pengguna tidak diizinkan di rute ini, arahkan ke dashboard masing-masing
  if (!allowedRoles.includes(user.role)) {
    return user.role === 'admin' 
      ? <Navigate to="/admin" /> 
      : <Navigate to="/kasir/dashboard" />;
  }

  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* Halaman Login Utama */}
        <Route path="/" element={<Login />} />

        {/* ===================== AREA KASIR (Akses: Admin & Kasir) ===================== */}
        <Route 
          path="/kasir/dashboard" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['admin', 'kasir']}>
                <KasirDashboard />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/kasir" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['admin', 'kasir']}>
                <Kasir />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/kasir/laporan" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['admin', 'kasir']}>
                <Laporan />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        {/* ===================== AREA ADMIN (Akses: Khusus Admin) ===================== */}
        <Route 
          path="/admin" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['admin']}>
                <AdminDashboard />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/kelola-menu" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['admin']}>
                <KelolaMenu />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/rekap" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['admin']}>
                <RekapHarian />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/manajemen-user" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['admin']}>
                <ManajemenUser />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/pengeluaran" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['admin']}>
                <Pengeluaran />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        <Route 
          path="/admin/laporan" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['admin']}>
                <Laporan />
              </RoleRoute>
            </PrivateRoute>
          }
        />

        <Route 
          path="/history-transaksi" 
          element={
            <PrivateRoute>
              <RoleRoute allowedRoles={['admin']}>
                <HistoryTransaksi />
              </RoleRoute>
            </PrivateRoute>
          } 
        />

        {/* Penanganan rute yang tidak ditemukan arahkan kembali ke Login */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;