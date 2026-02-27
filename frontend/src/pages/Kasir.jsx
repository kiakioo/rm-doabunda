import React, { useState, useEffect } from 'react';
import api from '../services/api'; // ✅ gunakan api.js agar ikut VITE_API_URL
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
      const res = await api.get('/menus'); // ✅ tidak pakai localhost lagi
      
      // ✅ Backend kamu return { message, data }
      const data = res.data?.data || [];
      
      setMenus(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Gagal mengambil menu", error);
      setMenus([]);
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

      await api.post('/transactions/checkout', payload); // ✅ pakai api instance

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
    <div className="flex flex-col md:flex-row h-screen bg-gray-50 font-sans overflow-hidden">
      
      {/* KIRI */}
      <div className="w-full md:w-2/3 h-[55vh] md:h-full flex flex-col relative z-0">
        
        <div className="bg-white p-4 md:p-6 border-b border-gray-200 flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm z-10 shrink-0">
          <div className="flex items-center gap-3 md:gap-4">
            <button onClick={() => navigate('/admin')} className="p-2 text-gray-400 hover:text-doabunda-dark hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-xl md:text-2xl font-black text-doabunda-dark tracking-wide">MESIN KASIR</h1>
              <p className="text-xs md:text-sm text-gray-500 font-medium">RM. Doa Bunda</p>
            </div>
          </div>
          
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text"
              placeholder="Cari nama menu..."
              className="w-full pl-12 pr-4 py-2.5 md:py-3 bg-gray-100 border-transparent rounded-xl focus:bg-white focus:border-doabunda-primary focus:ring-2 focus:ring-doabunda-primary/20 outline-none transition-all text-sm font-medium"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            
            {filteredMenus.map((menu) => (
              <button 
                key={menu.id}
                onClick={() => addToCart(menu)}
                className="bg-white p-3 md:p-5 rounded-xl md:rounded-2xl shadow-sm border border-gray-100 hover:shadow-md hover:border-doabunda-primary/30 transition-all text-left group flex flex-col justify-between h-28 md:h-32 active:scale-95"
              >
                <div>
                  <h3 className="font-bold text-xs md:text-sm text-gray-800 line-clamp-2 leading-tight group-hover:text-doabunda-primary transition-colors">
                    {menu.name}
                  </h3>
                  <span className="text-[9px] md:text-[10px] font-bold tracking-wider text-gray-400 uppercase mt-1 md:mt-2 inline-block">
                    {menu.category}
                  </span>
                </div>
                <p className="text-doabunda-primary font-bold text-sm md:text-lg">
                  Rp {Number(menu.price).toLocaleString('id-ID')}
                </p>
              </button>
            ))}

            {menus.length === 0 && (
              <div className="col-span-full text-center py-10 md:py-20 text-gray-400 text-sm">
                <p>Belum ada menu yang tersedia.</p>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* KANAN (tidak diubah sama sekali) */}
      <div className="w-full md:w-1/3 h-[45vh] md:h-full bg-white shadow-[0_-10px_30px_rgba(0,0,0,0.05)] md:shadow-[-10px_0_30px_rgba(0,0,0,0.03)] flex flex-col z-20 md:border-l border-gray-200">
        
        <div className="p-4 md:p-6 border-b border-gray-100 flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2 md:gap-3 text-doabunda-dark">
            <ShoppingCart size={20} />
            <h2 className="text-base md:text-lg font-bold">Pesanan Saat Ini</h2>
            <span className="bg-doabunda-primary text-white text-xs px-2 py-0.5 rounded-full">{cart.length}</span>
          </div>
          <button onClick={clearCart} className="text-gray-400 hover:text-red-500 transition-colors p-1 md:p-2">
            <Trash2 size={18} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-3">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 opacity-50 space-y-2 md:space-y-4">
              <ShoppingCart size={36} strokeWidth={1} />
              <p className="font-medium text-xs md:text-sm">Keranjang masih kosong</p>
            </div>
          ) : (
            cart.map((item) => (
              <div key={item.id} className="flex justify-between items-center p-3 md:p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="flex-1 pr-2 md:pr-4">
                  <p className="font-bold text-gray-800 text-xs md:text-sm">{item.name}</p>
                  <p className="text-[10px] md:text-xs text-gray-500 mt-1">
                    Rp {item.price.toLocaleString('id-ID')} x {item.qty}
                  </p>
                </div>
                <p className="font-bold text-doabunda-dark text-xs md:text-base">
                  Rp {(item.price * item.qty).toLocaleString('id-ID')}
                </p>
              </div>
            ))
          )}
        </div>

        <div className="p-4 md:p-6 bg-gray-50 border-t border-gray-200 shrink-0">
          <div className="flex justify-between items-end mb-4 md:mb-6">
            <span className="text-[10px] md:text-sm font-bold text-gray-500 uppercase tracking-widest">Total Tagihan</span>
            <span className="text-2xl md:text-3xl font-black text-doabunda-dark">
              Rp {getTotal().toLocaleString('id-ID')}
            </span>
          </div>

          <p className="text-[9px] md:text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 md:mb-3">
            Pilih Pembayaran
          </p>

          <div className="grid grid-cols-3 gap-2 md:gap-3">
            <button onClick={() => handleCheckout('Cash')} className="flex flex-col items-center justify-center bg-white border-2 border-green-600 text-green-700 py-2 md:py-4 rounded-xl font-bold">
              <Wallet size={18} />
              <span className="text-[10px] md:text-xs tracking-wider">CASH</span>
            </button>
            <button onClick={() => handleCheckout('QRIS')} className="flex flex-col items-center justify-center bg-white border-2 border-blue-600 text-blue-700 py-2 md:py-4 rounded-xl font-bold">
              <CreditCard size={18} />
              <span className="text-[10px] md:text-xs tracking-wider">QRIS</span>
            </button>
            <button onClick={() => handleCheckout('Grab')} className="flex flex-col items-center justify-center bg-doabunda-dark text-white py-2 md:py-4 rounded-xl font-bold">
              <Truck size={18} />
              <span className="text-[10px] md:text-xs tracking-wider">GRAB</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kasir;