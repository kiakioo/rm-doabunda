import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
// Mengimpor ikon dari lucide-react untuk menggantikan emoji
import { LayoutDashboard, MonitorSmartphone, Receipt, LogOut } from 'lucide-react';

const SidebarKasir = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  // Daftar Menu untuk Kasir menggunakan komponen ikon lucide-react
  const menuItems = [
    { path: '/kasir/dashboard', label: 'Ringkasan', icon: <LayoutDashboard size={20} /> },
    { path: '/kasir', label: 'Buka Kasir', icon: <MonitorSmartphone size={20} /> },
    { path: '/kasir/laporan', label: 'Riwayat Transaksi', icon: <Receipt size={20} /> },
  ];

  return (
    <div className="w-64 bg-doabunda-dark text-white flex flex-col min-h-screen shrink-0 shadow-xl border-r border-white/5">
      {/* Header / Logo Section */}
      <div className="p-8 text-center border-b border-white/10">
        <h2 className="text-2xl font-black text-doabunda-gold tracking-widest uppercase">
          DOA BUNDA
        </h2>
        <p className="text-[10px] text-white/50 tracking-[0.2em] mt-2 font-bold uppercase">
          Kasir Panel
        </p>
      </div>

      {/* Navigasi Menu */}
      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link 
              key={item.path} 
              to={item.path} 
              className={`
                flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-300 group
                ${isActive 
                  ? 'bg-doabunda-primary text-white shadow-lg shadow-black/20 font-bold' 
                  : 'text-white/60 hover:bg-white/5 hover:text-white'}
              `}
            >
              <span className={`${isActive ? 'text-white' : 'text-doabunda-gold group-hover:scale-110 transition-transform'}`}>
                {item.icon}
              </span>
              <span className="text-sm tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Tombol Keluar (Logout) */}
      <div className="p-6">
        <button 
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white/5 hover:bg-red-600/20 text-white/70 hover:text-white border border-white/10 rounded-2xl transition-all duration-300 group font-bold text-sm"
        >
          <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
          Keluar
        </button>
      </div>
    </div>
  );
};

export default SidebarKasir;