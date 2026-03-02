import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MonitorSmartphone, Utensils, FileText, Wallet, Users, Receipt } from 'lucide-react';

const SidebarAdmin = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Fungsi untuk Logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/'); // Kembali ke halaman Login
  };

const menuItems = [
  { path: '/admin', label: 'Ringkasan', icon: <LayoutDashboard size={20}/> },
  { path: '/kasir', label: 'Buka Kasir', icon: <MonitorSmartphone size={20}/> },
  { path: '/kelola-menu', label: 'Menu', icon: <Utensils size={20}/> },
  { path: '/history-transaksi', label: 'Riwayat Transaksi', icon: <Receipt size={20}/> }, // Riwayat dipisah
  { path: '/admin/laporan', label: 'Laporan Keuangan', icon: <FileText size={20}/> },
  { path: '/pengeluaran', label: 'Pengeluaran', icon: <Wallet size={20}/> },
  { path: '/manajemen-user', label: 'Karyawan', icon: <Users size={20}/> }
];

  return (
    <div style={{ width: '250px', backgroundColor: '#8B0000', color: 'white', display: 'flex', flexDirection: 'column', minHeight: '100vh', flexShrink: 0 }}>
      {/* Header / Logo */}
      <div style={{ padding: '30px 20px', textAlign: 'center', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
        <h2 style={{ color: '#F1C40F', margin: 0, letterSpacing: '2px' }}>DOA BUNDA</h2>
        <p style={{ fontSize: '11px', color: '#ccc', margin: '5px 0 0 0', letterSpacing: '1px' }}>ADMINISTRATOR PANEL</p>
      </div>

      {/* Navigasi Menu */}
      <nav style={{ flex: 1, padding: '20px 10px', display: 'flex', flexDirection: 'column', gap: '5px' }}>
        {menuItems.map((item) => {
          // Deteksi apakah menu ini sedang aktif (sedang dibuka)
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              style={{
                textDecoration: 'none',
                color: 'white',
                padding: '12px 20px',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                gap: '15px',
                backgroundColor: isActive ? '#C0392B' : 'transparent', // Warna merah lebih terang jika aktif
                transition: '0.3s'
              }}
            >
              <span style={{ fontSize: '18px' }}>{item.icon}</span>
              <span style={{ fontWeight: isActive ? 'bold' : 'normal' }}>{item.label}</span>
            </Link>
          )
        })}
      </nav>

      {/* Tombol Keluar (Logout) */}
      <div style={{ padding: '20px' }}>
        <button 
          onClick={handleLogout}
          style={{
            width: '100%', padding: '12px', backgroundColor: 'transparent', color: 'white', 
            border: '1px solid rgba(255,255,255,0.3)', borderRadius: '8px', cursor: 'pointer', 
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', fontSize: '16px'
          }}
        >
          <span>🚪</span> Keluar
        </button>
      </div>
    </div>
  );
};

// WAJIB ADA INI: Agar error "default is not exported" musnah!
export default SidebarAdmin;