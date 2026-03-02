import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import SidebarKasir from '../components/SidebarKasir';

const Laporan = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Deteksi siapa yang login
  const user = JSON.parse(localStorage.getItem('user')) || {};
  
  const [selectedDate, setSelectedDate] = useState('');

  const fetchTransactions = async (dateFilter) => {
    setLoading(true);
    setError('');
    try {
      const endpoint = dateFilter ? `/transactions?date=${dateFilter}` : '/transactions';
      const response = await api.get(endpoint);
      
      if (response.data.success) {
        setTransactions(response.data.data);
      } else {
        setError('Gagal mengambil data transaksi');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Terjadi kesalahan pada server');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(selectedDate);
  }, [selectedDate]);

  const formatRupiah = (angka) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(angka);
  };

  const formatTanggal = (stringTanggal) => {
    const date = new Date(stringTanggal);
    return date.toLocaleString('id-ID', { 
      day: 'numeric', month: 'long', year: 'numeric', 
      hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    // Struktur Layout Flexbox untuk menampung Sidebar di kiri dan Konten di kanan
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f5f5f5' }}>
      
      {/* Deteksi Role untuk Sidebar */}
      {user.role === 'admin' && <SidebarAdmin />}
      {user.role === 'kasir' && <SidebarKasir />}

      {/* Konten Utama Laporan */}
      <div style={{ padding: '30px', fontFamily: 'sans-serif', flex: 1, backgroundColor: '#fff', borderRadius: '8px', margin: '20px', boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
        <h2 style={{ color: '#8B0000', marginBottom: '5px' }}>Riwayat Transaksi</h2>
        <p style={{ color: '#666', marginBottom: '20px' }}>Pantau riwayat penjualan RM. DOA BUNDA</p>

        {/* FILTER TANGGAL */}
        <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', alignItems: 'center' }}>
          <label htmlFor="dateFilter" style={{ fontWeight: 'bold' }}>Filter Tanggal:</label>
          <input 
            type="date" 
            id="dateFilter"
            value={selectedDate}
            onChange={(e) => setSelectedDate(e.target.value)}
            style={{ padding: '8px', borderRadius: '5px', border: '1px solid #ccc' }}
          />
          {selectedDate && (
            <button 
              onClick={() => setSelectedDate('')}
              style={{ padding: '8px 15px', backgroundColor: '#f44336', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', fontWeight: 'bold' }}
            >
              Hapus Filter
            </button>
          )}
        </div>

        {/* STATUS LOADING / ERROR */}
        {loading && <p>Memuat data transaksi...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}

        {/* TABEL TRANSAKSI */}
        {!loading && !error && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8c471', color: '#000', textAlign: 'left' }}>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Waktu Transaksi</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Kasir</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Metode</th>
                  <th style={{ padding: '12px', borderBottom: '2px solid #ddd' }}>Total Belanja</th>
                </tr>
              </thead>
              <tbody>
                {transactions.length > 0 ? (
                  transactions.map((trx) => (
                    <tr key={trx.id} style={{ borderBottom: '1px solid #eee' }}>
                      <td style={{ padding: '12px' }}>{formatTanggal(trx.created_at)}</td>
                      <td style={{ padding: '12px' }}>{trx.cashier}</td>
                      <td style={{ padding: '12px' }}>
                        <span style={{ 
                          backgroundColor: trx.payment_method === 'Cash' ? '#d4edda' : '#cce5ff', 
                          color: trx.payment_method === 'Cash' ? '#155724' : '#004085',
                          padding: '4px 8px', borderRadius: '4px', fontSize: '0.9em', fontWeight: 'bold'
                        }}>
                          {trx.payment_method}
                        </span>
                      </td>
                      <td style={{ padding: '12px', fontWeight: 'bold' }}>{formatRupiah(trx.total_amount)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" style={{ padding: '30px', textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                      Tidak ada transaksi yang ditemukan untuk tanggal ini.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Laporan;