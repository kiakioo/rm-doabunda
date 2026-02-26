import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/Login';
import Kasir from './pages/Kasir';
import AdminDashboard from './pages/AdminDashboard';
import KelolaMenu from './pages/KelolaMenu';
import RekapHarian from './pages/RekapHarian';
import ManajemenUser from './pages/ManajemenUser';
import Pengeluaran from './pages/Pengeluaran';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        
        <Route path="/kasir" element={<PrivateRoute><Kasir /></PrivateRoute>} />
        <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
        <Route path="/kelola-menu" element={<PrivateRoute><KelolaMenu /></PrivateRoute>} />
        <Route path="/rekap" element={<PrivateRoute><RekapHarian /></PrivateRoute>} />
        <Route path="/manajemen-user" element={<PrivateRoute><ManajemenUser /></PrivateRoute>} />
        <Route path="/pengeluaran" element={<PrivateRoute><Pengeluaran /></PrivateRoute>} />
        
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

export default App;