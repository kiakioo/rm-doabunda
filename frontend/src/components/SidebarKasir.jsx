import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { LayoutDashboard, MonitorSmartphone, Receipt, Utensils, LogOut, Menu, X } from 'lucide-react';

const SidebarKasir = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const menuItems = [
    { path: '/kasir/dashboard', label: 'Ringkasan', icon: <LayoutDashboard size={20} /> },
    { path: '/kasir', label: 'Buka Kasir', icon: <MonitorSmartphone size={20} /> },
    { path: '/kelola-menu', label: 'Kelola Menu', icon: <Utensils size={20} /> }, // FITUR BARU UNTUK KASIR
    { path: '/history-transaksi', label: 'Riwayat Transaksi', icon: <Receipt size={20} /> },
  ];

  return (
    <>
      <div className="md:hidden fixed top-0 left-0 w-full bg-doabunda-dark text-white h-16 flex justify-between items-center px-4 z-40 shadow-md">
        <h2 className="text-xl font-black text-doabunda-gold tracking-widest">DOA BUNDA</h2>
        <button onClick={() => setIsOpen(!isOpen)} className="text-white p-2">
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {isOpen && (
        <div className="fixed inset-0 bg-black/60 z-40 md:hidden backdrop-blur-sm" onClick={() => setIsOpen(false)} />
      )}

      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-doabunda-dark text-white flex flex-col h-[100dvh] shrink-0 shadow-2xl transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="h-16 md:hidden border-b border-white/10 flex items-center justify-between px-4 bg-doabunda-dark">
           <h2 className="text-lg font-black text-doabunda-gold tracking-widest uppercase">MENU KASIR</h2>
           <button onClick={() => setIsOpen(false)} className="text-white p-2"><X size={24} /></button>
        </div>

        <div className="hidden md:block p-8 text-center border-b border-white/10">
          <h2 className="text-2xl font-black text-doabunda-gold tracking-widest uppercase">DOA BUNDA</h2>
          <p className="text-[10px] text-white/50 tracking-widest mt-2 uppercase font-bold">Kasir Panel</p>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link key={item.path} to={item.path} onClick={() => setIsOpen(false)}
                className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all ${isActive ? 'bg-doabunda-primary text-white shadow-lg font-bold' : 'text-white/70 hover:bg-white/10 hover:text-white font-medium'}`}
              >
                <span className={isActive ? 'text-white' : 'text-doabunda-gold'}>{item.icon}</span>
                <span className="text-sm">{item.label}</span>
              </Link>
            )
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-3 px-4 py-4 bg-white/5 rounded-xl text-white/70 hover:bg-red-600 hover:text-white transition-all font-bold text-sm">
            <LogOut size={18} /> Keluar
          </button>
        </div>
      </div>
    </>
  );
};

export default SidebarKasir;