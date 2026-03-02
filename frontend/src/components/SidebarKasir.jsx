import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MonitorSmartphone, Receipt, LogOut } from 'lucide-react';

const SidebarKasir = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { path: '/kasir/dashboard', label: 'Ringkasan', icon: <LayoutDashboard size={20} /> },
    { path: '/kasir', label: 'Buka Kasir', icon: <MonitorSmartphone size={20} /> },
    { path: '/history-transaksi', label: 'Riwayat Transaksi', icon: <Receipt size={20} /> },
  ];

  return (
    <div className="w-64 bg-doabunda-dark text-white flex flex-col min-h-screen shrink-0 shadow-xl">
      <div className="p-8 text-center border-b border-white/10">
        <h2 className="text-2xl font-black text-doabunda-gold tracking-widest uppercase">DOA BUNDA</h2>
        <p className="text-[10px] text-white/50 tracking-widest mt-2 uppercase font-bold">Kasir Panel</p>
      </div>
      <nav className="flex-1 px-4 py-8 space-y-2">
        {menuItems.map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link key={item.path} to={item.path} className={`flex items-center gap-4 px-5 py-4 rounded-2xl transition-all ${isActive ? 'bg-doabunda-primary text-white shadow-lg' : 'text-white/60 hover:bg-white/5'}`}>
              <span className={isActive ? 'text-white' : 'text-doabunda-gold'}>{item.icon}</span>
              <span className="text-sm font-bold">{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="p-6 border-t border-white/10">
        <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white/5 rounded-2xl text-white/70 hover:bg-red-600/20 hover:text-white transition-all font-bold text-sm">
          <LogOut size={18} /> Keluar
        </button>
      </div>
    </div>
  );
};

export default SidebarKasir;