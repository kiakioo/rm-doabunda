import React, { useState, useEffect } from 'react';
import api from '../services/api';

const Kasir = () => {
  const [menus, setMenus] = useState([]);
  const [cart, setCart] = useState([]);
  const [mobileCartOpen, setMobileCartOpen] = useState(false);

  useEffect(() => {
    fetchMenus();
  }, []);

  const fetchMenus = async () => {
    try {
      const res = await api.get('/menus');
      setMenus(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const addToCart = (item) => {
    setCart([...cart, item]);
  };

  const total = cart.reduce((sum, item) => sum + parseFloat(item.price), 0);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-100">

      {/* PRODUK */}
      <div className="flex-1 p-4 md:p-8 overflow-y-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-6 text-doabunda-dark">
          Mesin Kasir
        </h1>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {menus.map((menu) => (
            <div
              key={menu.id}
              onClick={() => addToCart(menu)}
              className="bg-white p-4 rounded-xl shadow hover:shadow-lg cursor-pointer transition"
            >
              <h3 className="font-bold text-gray-800">{menu.name}</h3>
              <p className="text-doabunda-primary font-bold">
                Rp {parseFloat(menu.price).toLocaleString('id-ID')}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* DESKTOP CART */}
      <div className="hidden md:flex w-96 bg-white shadow-xl flex-col p-6">
        <h2 className="text-xl font-bold mb-4">Pesanan</h2>

        <div className="flex-1 overflow-y-auto">
          {cart.map((item, index) => (
            <div key={index} className="flex justify-between mb-2">
              <span>{item.name}</span>
              <span>Rp {parseFloat(item.price).toLocaleString('id-ID')}</span>
            </div>
          ))}
        </div>

        <div className="border-t pt-4 font-bold">
          Total: Rp {total.toLocaleString('id-ID')}
        </div>
      </div>

      {/* MOBILE CART BUTTON */}
      <div className="md:hidden fixed bottom-4 left-4 right-4">
        <button
          onClick={() => setMobileCartOpen(true)}
          className="w-full bg-doabunda-primary text-white p-4 rounded-xl shadow-lg font-bold"
        >
          Lihat Pesanan (Rp {total.toLocaleString('id-ID')})
        </button>
      </div>

      {/* MOBILE CART PANEL */}
      {mobileCartOpen && (
        <div className="fixed inset-0 bg-black/40 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-3xl p-6 max-h-[70vh] overflow-y-auto">
            <button
              onClick={() => setMobileCartOpen(false)}
              className="mb-4 text-gray-500"
            >
              Tutup
            </button>

            {cart.map((item, index) => (
              <div key={index} className="flex justify-between mb-2">
                <span>{item.name}</span>
                <span>Rp {parseFloat(item.price).toLocaleString('id-ID')}</span>
              </div>
            ))}

            <div className="border-t pt-4 font-bold mt-4">
              Total: Rp {total.toLocaleString('id-ID')}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Kasir;