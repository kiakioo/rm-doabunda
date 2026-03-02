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

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

const RoleRoute = ({ children, allowedRoles }) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (!user) return <Navigate to="/" />;
  if (!allowedRoles.includes(user.role)) {
    return user.role === 'admin' ? <Navigate to="/admin" /> : <Navigate to="/kasir/dashboard" />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />

        {/* AREA BERSAMA (Admin & Kasir) */}
        <Route path="/kasir/dashboard" element={<PrivateRoute><RoleRoute allowedRoles={['admin', 'kasir']}><KasirDashboard /></RoleRoute></PrivateRoute>} />
        <Route path="/kasir" element={<PrivateRoute><RoleRoute allowedRoles={['admin', 'kasir']}><Kasir /></RoleRoute></PrivateRoute>} />
        <Route path="/history-transaksi" element={<PrivateRoute><RoleRoute allowedRoles={['admin', 'kasir']}><HistoryTransaksi /></RoleRoute></PrivateRoute>} />

        {/* AREA KHUSUS ADMIN */}
        <Route path="/admin" element={<PrivateRoute><RoleRoute allowedRoles={['admin']}><AdminDashboard /></RoleRoute></PrivateRoute>} />
        <Route path="/kelola-menu" element={<PrivateRoute><RoleRoute allowedRoles={['admin']}><KelolaMenu /></RoleRoute></PrivateRoute>} />
        <Route path="/rekap" element={<PrivateRoute><RoleRoute allowedRoles={['admin']}><RekapHarian /></RoleRoute></PrivateRoute>} />
        <Route path="/manajemen-user" element={<PrivateRoute><RoleRoute allowedRoles={['admin']}><ManajemenUser /></RoleRoute></PrivateRoute>} />
        <Route path="/pengeluaran" element={<PrivateRoute><RoleRoute allowedRoles={['admin']}><Pengeluaran /></RoleRoute></PrivateRoute>} />
        <Route path="/admin/laporan" element={<PrivateRoute><RoleRoute allowedRoles={['admin']}><Laporan /></RoleRoute></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;