import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarKasir from '../components/SidebarKasir';

const KasirDashboard = () => {
  const [stats, setStats] = useState({ totalRevenue: 0, totalTransactions: 0 });
  const user = JSON.parse(localStorage.getItem('user')) || {};

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      // Mengambil transaksi khusus hari ini untuk kasir yang sedang login
      const dateToday = new Date().toISOString().slice(0, 10);
      const res = await api.get(`/transactions?date=${dateToday}`);
      
      const transactions = res.data.data || [];
      // Hitung total dari semua transaksi yang dikembalikan
      const totalRev = transactions.reduce((sum, trx) => sum + parseFloat(trx.total_amount), 0);
      
      setStats({
        totalRevenue: totalRev,
        totalTransactions: transactions.length
      });
    } catch (error) {
      console.error("Gagal mengambil data statistik kasir", error);
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5', fontFamily: 'sans-serif' }}>
      
      {/* Memanggil Sidebar Kasir di kiri */}
      <SidebarKasir />

      {/* Konten Utama */}
      <div style={{ padding: '30px', flex: 1, backgroundColor: '#f5f5f5' }}>
        <div style={{ backgroundColor: '#fff', padding: '30px', borderRadius: '12px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
          <header style={{ marginBottom: '30px' }}>
            <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#333', margin: 0 }}>
              Halo, {user.name || 'Kasir'}! 👋
            </h1>
            <p style={{ color: '#666', marginTop: '5px' }}>
              Berikut adalah ringkasan performa penjualan Anda hari ini.
            </p>
          </header>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
            
            {/* Kartu Pendapatan */}
            <div style={{ backgroundColor: '#fef2f2', border: '1px solid #fee2e2', padding: '25px', borderRadius: '12px' }}>
              <h3 style={{ color: '#991b1b', fontSize: '14px', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                Pendapatan Anda (Hari Ini)
              </h3>
              <h2 style={{ color: '#7f1d1d', fontSize: '36px', fontWeight: '900', margin: 0 }}>
                Rp {stats.totalRevenue.toLocaleString('id-ID')}
              </h2>
            </div>

            {/* Kartu Jumlah Transaksi */}
            <div style={{ backgroundColor: '#fffbeb', border: '1px solid #fef3c7', padding: '25px', borderRadius: '12px' }}>
              <h3 style={{ color: '#b45309', fontSize: '14px', margin: '0 0 10px 0', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 'bold' }}>
                Struk Selesai (Hari Ini)
              </h3>
              <h2 style={{ color: '#92400e', fontSize: '36px', fontWeight: '900', margin: 0 }}>
                {stats.totalTransactions} <span style={{ fontSize: '16px', fontWeight: 'normal' }}>Transaksi</span>
              </h2>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default KasirDashboard;