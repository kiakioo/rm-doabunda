import React, { useState, useEffect } from 'react';
import api from '../services/api'; 
import { useCartStore } from '../store/cartStore';
import { ShoppingCart, Trash2, CreditCard, Wallet, Truck, Search, ChevronLeft } from 'lucide-react';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const Kasir = () => {
  const [menus, setMenus] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { cart, addToCart, removeFromCart, clearCart, getTotal } = useCartStore();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await api.get('/menus'); 
      const data = res.data?.data || [];
      setMenus(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil menu", error);
      setMenus([]);
    }
  };

  // Fungsi navigasi kembali berdasarkan role
  const handleBack = () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user?.role === 'admin') {
      navigate('/admin');
    } else {
      navigate('/kasir/dashboard');
    }
  };

  const handleCheckout = async (method) => {
    if (cart.length === 0) {
      return Swal.fire({
        icon: 'warning',
        title: 'Keranjang Kosong',
        text: 'Silakan pilih menu terlebih dahulu.',
        confirmButtonColor: '#BF3131'
      });
    }

    try {
      const payload = {
        payment_method: method,
        source: method === 'Grab' ? 'GrabFood' : 'POS',
        items: cart.map(item => ({
          menu_id: item.id,
          qty: item.qty,
          price: item.price
        }))
      };

      await api.post('/transactions/checkout', payload); 

      Swal.fire({
        icon: 'success',
        title: 'Transaksi Berhasil',
        text: `Pembayaran via ${method} telah dicatat.`,
        timer: 2000,
        showConfirmButton: false
      });

      clearCart();
    } catch (error) {
      console.error(error);
      Swal.fire({
        icon: 'error',
        title: 'Gagal',
        text: 'Terjadi kesalahan saat memproses transaksi.',
        confirmButtonColor: '#BF3131'
      });
    }
  };

  const filteredMenus = menus.filter(m =>
    m.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    // Menggunakan 100dvh agar tidak terpotong address bar di browser HP
    <div className="flex flex-col md:flex-row h-[100dvh] w-full bg-gray-50 font-sans overflow-hidden">
      
      {/* ================= AREA KIRI: DAFTAR MENU ================= */}
      <div className="w-full md:w-[60%] lg:w-[72%] h-[55dvh] md:h-full flex flex-col relative z-0">
        
        {/* Header Kiri (Sticky) */}
        <div className="bg-white p-3 md:p-5 lg:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-3 lg:gap-4 shadow-sm shrink-0">
          <div className="flex items-center gap-2 md:gap-4">
            <button 
              onClick={handleBack} 
              className="p-1.5 md:p-2 text-gray-400 hover:text-doabunda-dark hover:bg-gray-100 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-lg md:text-xl lg:text-2xl font-black text-doabunda-dark tracking-wide leading-none">MESIN KASIR</h1>
              <p className="text-[10px] md:text-xs text-gray-500 font-medium hidden sm:block mt-1">RM. Doa Bunda</p>
            </div>
          </div>
          
          {/* Search Bar Fleksibel */}
          <div className="relative w-full sm:w-64 lg:w-80">
            <Search className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Cari nama menu..."
              className="w-full pl-10 pr-4 py-2.5 md:py-3 bg-gray-100 border border-transparent rounded-xl focus:bg-white focus:border-doabunda-primary focus:ring-2 focus:ring-doabunda-primary/20 outline-none transition-all text-xs md:text-sm font-medium"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* List Menu (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-3 md:p-5 lg:p-6 bg-gray-50/50">
          {/* Grid Responsif: 2 kolom di HP, 3 di Tablet, 4 di Laptop Kecil, 5 di Layar Besar */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 md:gap-4 lg:gap-5">
            {filteredMenus.map((menu) => (
              <button 
                key={menu.id}
                onClick={() => addToCart(menu)}
                className="bg-white p-3 lg:p-4 rounded-xl lg:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-doabunda-primary/30 transition-all text-left group flex flex-col justify-between h-24 sm:h-28 lg:h-32 active:scale-95"
              >
                <div>
                  <h3 className="font-bold text-[11px] sm:text-xs lg:text-sm text-gray-800 line-clamp-2 leading-snug group-hover:text-doabunda-primary transition-colors">
                    {menu.name}
                  </h3>
                  <span className="text-[9px] lg:text-[10px] font-bold tracking-wider text-gray-400 uppercase mt-1 lg:mt-2 inline-block">
                    {menu.category}
                  </span>
                </div>
                <p className="text-doabunda-primary font-black text-xs sm:text-sm lg:text-base">
                  Rp {Number(menu.price).toLocaleString('id-ID')}
                </p>
              </button>
            ))}

            {menus.length === 0 && (
              <div className="col-span-full text-center py-10 md:py-20 text-gray-400 text-xs md:text-sm">
                <p>Belum ada menu yang tersedia.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ================= AREA KANAN: KERANJANG ================= */}
      <div className="w-full md:w-[40%] lg:w-[28%] h-[45dvh] md:h-full bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.06)] md:shadow-[-10px_0_30px_rgba(0,0,0,0.04)] flex flex-col z-20 md:border-l border-gray-200">
        
        {/* Header Keranjang (Sticky) */}
        <div className="p-3 md:p-5 lg:p-6 border-b border-gray-100 flex justify-between items-center shrink-0 bg-gray-50/50">
          <div className="flex items-center gap-2 lg:gap-3 text-doabunda-dark">
            <ShoppingCart size={18} className="lg:w-5 lg:h-5" />
            <h2 className="text-sm lg:text-base font-bold">Pesanan Saat Ini</h2>
            <span className="bg-doabunda-primary text-white text-[10px] lg:text-xs px-2 py-0.5 rounded-full font-bold">{cart.length}</span>
          </div>
          <button onClick={clearCart} title="Kosongkan Keranjang" className="text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors p-1.5 md:p-2">
            <Trash2 size={18} />
          </button>
        </div>

        {/* List Keranjang (Scrollable) */}
        <div className="flex-1 overflow-y-auto p-3 md:p-5 lg:p-6 space-y-2 lg:space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-300 opacity-80 space-y-3">
              <ShoppingCart size={40} strokeWidth={1.5} />
              <p className="font-medium text-xs lg:text-sm">Keranjang masih kosong</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 lg:p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:border-gray-200 transition-colors">
                <div className="flex-1 pr-2 lg:pr-4">
                  <p className="font-bold text-gray-800 text-[11px] lg:text-xs leading-snug">{item.name}</p>
                  <p className="text-[10px] lg:text-[11px] text-gray-500 mt-1 font-medium">
                    Rp {item.price.toLocaleString('id-ID')} <span className="text-gray-400 mx-1">x</span> <span className="font-bold text-gray-700">{item.qty}</span>
                  </p>
                </div>
                <p className="font-black text-doabunda-dark text-xs lg:text-sm whitespace-nowrap">
                  Rp {(item.price * item.qty).toLocaleString('id-ID')}
                </p>
              </div>
            ))
          )}
        </div>

        {/* Footer Checkout (Sticky Bottom) */}
        <div className="p-4 md:p-5 lg:p-6 bg-white border-t border-gray-100 shrink-0 shadow-[0_-5px_15px_rgba(0,0,0,0.02)]">
          <div className="flex justify-between items-end mb-4 lg:mb-5">
            <span className="text-[10px] lg:text-xs font-bold text-gray-400 uppercase tracking-widest">Total Tagihan</span>
            <span className="text-2xl lg:text-3xl font-black text-doabunda-dark tracking-tight">
              Rp {getTotal().toLocaleString('id-ID')}
            </span>
          </div>

          <p className="text-[9px] lg:text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2 lg:mb-3">
            Pilih Metode Pembayaran
          </p>

          <div className="grid grid-cols-3 gap-2 lg:gap-3">
            <button onClick={() => handleCheckout('Cash')} className="flex flex-col items-center justify-center bg-white border-2 border-green-500 text-green-600 py-2.5 md:py-3 lg:py-4 rounded-xl hover:bg-green-50 active:scale-95 transition-all">
              <Wallet size={18} className="mb-1 lg:w-5 lg:h-5" />
              <span className="text-[9px] lg:text-[10px] font-black tracking-wider">CASH</span>
            </button>
            <button onClick={() => handleCheckout('QRIS')} className="flex flex-col items-center justify-center bg-white border-2 border-blue-500 text-blue-600 py-2.5 md:py-3 lg:py-4 rounded-xl hover:bg-blue-50 active:scale-95 transition-all">
              <CreditCard size={18} className="mb-1 lg:w-5 lg:h-5" />
              <span className="text-[9px] lg:text-[10px] font-black tracking-wider">QRIS</span>
            </button>
            <button onClick={() => handleCheckout('Grab')} className="flex flex-col items-center justify-center bg-doabunda-dark text-white py-2.5 md:py-3 lg:py-4 rounded-xl shadow-md hover:bg-doabunda-primary active:scale-95 transition-all">
              <Truck size={18} className="mb-1 lg:w-5 lg:h-5" />
              <span className="text-[9px] lg:text-[10px] font-black tracking-wider">GRAB</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kasir;