import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LayoutDashboard, MonitorSmartphone, Utensils, Users, LogOut, Menu, X } from 'lucide-react'; // Pastikan lucide-react sudah di-install

const Layout = ({ children }) => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden font-sans">
            
            {/* Tombol Hamburger untuk HP */}
            <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="md:hidden fixed top-4 left-4 z-50 p-2 bg-red-800 text-white rounded-md shadow-lg"
            >
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

            {/* Sidebar (Menu Samping) */}
            <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-red-900 text-white transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 shadow-xl`}>
                <div className="flex flex-col h-full">
                    {/* Header Sidebar */}
                    <div className="p-6 text-center border-b border-red-800 mt-10 md:mt-0">
                        <h2 className="text-2xl font-bold text-yellow-400">RM. DOA BUNDA</h2>
                        <p className="text-xs text-red-200 mt-1">Sistem Point of Sale</p>
                    </div>

                    {/* Link Navigasi */}
                    <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                        <button onClick={() => navigate('/dashboard')} className="flex items-center w-full p-3 rounded-lg hover:bg-red-800 transition-colors">
                            <LayoutDashboard size={20} className="mr-3" />
                            <span>Ringkasan</span>
                        </button>
                        <button onClick={() => navigate('/kasir')} className="flex items-center w-full p-3 rounded-lg hover:bg-red-800 transition-colors">
                            <MonitorSmartphone size={20} className="mr-3" />
                            <span>Buka Mesin Kasir</span>
                        </button>
                        <button onClick={() => navigate('/menu')} className="flex items-center w-full p-3 rounded-lg hover:bg-red-800 transition-colors">
                            <Utensils size={20} className="mr-3" />
                            <span>Manajemen Menu</span>
                        </button>
                        <button onClick={() => navigate('/users')} className="flex items-center w-full p-3 rounded-lg hover:bg-red-800 transition-colors">
                            <Users size={20} className="mr-3" />
                            <span>Manajemen User</span>
                        </button>
                    </nav>

                    {/* Tombol Keluar */}
                    <div className="p-4 border-t border-red-800">
                        <button onClick={handleLogout} className="flex items-center justify-center w-full p-3 bg-red-950 hover:bg-black rounded-lg transition-colors text-red-200 hover:text-white">
                            <LogOut size={20} className="mr-2" />
                            <span>Keluar Sistem</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Background Gelap saat menu HP terbuka */}
            {isMobileMenuOpen && (
                <div 
                    className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Area Konten Dinamis (Berubah sesuai halaman) */}
            <main className="flex-1 flex flex-col h-screen overflow-y-auto w-full relative">
                <div className="p-4 md:p-8 pt-20 md:pt-8 w-full max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;