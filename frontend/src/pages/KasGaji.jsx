import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { Landmark, Banknote, Trash2, Plus, Users, Wallet, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const KasGaji = () => {
  const [kasInfo, setKasInfo] = useState({ saldo_kas: 0, history: [] });
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ amount: '', category: 'Gaji Karyawan', description: '' });

  useEffect(() => { fetchKasInfo(); }, []);

  const fetchKasInfo = async () => {
    setLoading(true);
    try {
      const res = await api.get('/payouts');
      setKasInfo(res.data.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleAddPayout = async (e) => {
    e.preventDefault();
    if (form.amount > kasInfo.saldo_kas) {
      return Swal.fire('Peringatan!', 'Saldo kas tidak mencukupi untuk penarikan ini.', 'warning');
    }

    try {
      await api.post('/payouts', form);
      Swal.fire('Berhasil!', 'Penarikan dana berhasil dicatat.', 'success');
      setForm({ amount: '', category: 'Gaji Karyawan', description: '' });
      fetchKasInfo();
    } catch (err) {
      Swal.fire('Gagal!', 'Terjadi kesalahan sistem.', 'error');
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({ title: 'Hapus data ini?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#BF3131' });
    if (res.isConfirmed) {
      try { 
        await api.delete(`/payouts/${id}`); 
        fetchKasInfo(); 
      } catch (err) { Swal.fire('Error', 'Gagal menghapus.', 'error'); }
    }
  };

  return (
    // 1. KUNCI HALAMAN (Root): Mencegah scroll pada body utama
    <div className="flex h-[100dvh] bg-gray-50 font-sans w-full overflow-hidden">
      <SidebarAdmin />
      
      {/* 2. AREA KONTEN: Flex Column dengan Tinggi 100dvh */}
      <div className="flex-1 flex flex-col h-[100dvh] p-4 pt-20 md:p-8 md:pt-8 w-full overflow-hidden">
        
        {/* Header - Diberi shrink-0 agar tidak mengecil */}
        <header className="mb-4 md:mb-6 shrink-0">
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-3 tracking-wide">
            <Landmark className="text-doabunda-primary" size={32} /> BUKU KAS & GAJI
          </h1>
          <p className="text-gray-500 font-medium text-xs md:text-sm mt-1">Pantau sisa saldo warung & catat penarikan gaji/owner.</p>
        </header>

        {/* Info Saldo Kas Raksasa - Shrink-0 */}
        <div className="bg-gradient-to-r from-doabunda-dark to-doabunda-primary rounded-3xl p-6 md:p-8 text-white shadow-xl mb-4 md:mb-6 relative overflow-hidden shrink-0">
          <div className="relative z-10">
            <h2 className="text-sm md:text-base font-bold text-white/80 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Wallet size={20} /> Saldo Kas Warung Tersedia
            </h2>
            <div className="text-4xl md:text-5xl font-black tracking-tight">
              Rp {Number(kasInfo.saldo_kas).toLocaleString('id-ID')}
            </div>
            <p className="mt-3 text-[10px] md:text-xs text-white/70 max-w-xl leading-relaxed">
              *Ini adalah estimasi uang fisik hasil akumulasi laba bersih yang belum dibagikan/ditarik.
            </p>
          </div>
          <Banknote size={160} className="absolute -right-10 -bottom-10 opacity-10 transform -rotate-12" />
        </div>

        {/* 3. WADAH BAWAH (Form & Tabel): flex-1 mengambil semua sisa ruang kosong */}
        <div className="flex flex-col xl:flex-row gap-6 md:gap-8 flex-1 overflow-hidden">
          
          {/* KOLOM KIRI (Form Tarik Dana) - Dapat discroll terpisah jika layar HP terlalu pendek */}
          <div className="w-full xl:w-[35%] shrink-0 overflow-y-auto pb-4 xl:pb-0">
            <div className="bg-white p-5 md:p-6 rounded-3xl shadow-sm border border-gray-100 h-fit">
              <h2 className="text-lg md:text-xl font-black text-gray-800 mb-4 flex items-center gap-2">
                <Plus size={20} className="text-doabunda-primary" /> Catat Penarikan
              </h2>
              <form onSubmit={handleAddPayout} className="space-y-4">
                <select className="w-full p-3.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-doabunda-primary bg-gray-50" 
                  value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
                  <option value="Gaji Karyawan">Gaji Karyawan</option>
                  <option value="Bagi Hasil Owner">Bagi Hasil Owner</option>
                  <option value="Tarik Tunai Lainnya">Tarik Tunai Lainnya</option>
                </select>
                <input type="text" placeholder="Nama / Keterangan (Misal: Gaji Ega)" required
                  className="w-full p-3.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-doabunda-primary bg-gray-50" 
                  value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                <input type="number" placeholder="Nominal Tarik (Rp)" required max={kasInfo.saldo_kas}
                  className="w-full p-3.5 text-sm border border-gray-200 rounded-xl outline-none focus:ring-1 focus:ring-doabunda-primary bg-gray-50" 
                  value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} />
                <button type="submit" className="w-full bg-doabunda-dark text-white font-bold py-3.5 md:py-4 rounded-xl hover:bg-doabunda-primary transition-all text-sm tracking-wide shadow-md">
                  TARIK DANA KAS
                </button>
              </form>
            </div>
          </div>

          {/* KOLOM KANAN (Tabel Riwayat Payout) */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-gray-100 flex flex-col overflow-hidden">
            <div className="p-4 md:p-5 border-b border-gray-100 bg-gray-50/50 shrink-0">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><Users size={18} className="text-doabunda-primary"/> Riwayat Penarikan</h3>
            </div>
            
            {/* 4. AREA SCROLL TABEL: Hanya kotak ini yang bisa discroll ke bawah dan ke samping */}
            <div className="flex-1 overflow-auto w-full relative">
              <table className="w-full text-left min-w-[600px]">
                
                {/* 5. STICKY HEADER */}
                <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] md:text-xs font-bold tracking-widest sticky top-0 z-10 border-b shadow-sm">
                  <tr>
                    <th className="p-4 font-black">Tanggal</th>
                    <th className="p-4 font-black">Kategori</th>
                    <th className="p-4 font-black">Penerima/Ket</th>
                    <th className="p-4 text-right font-black">Nominal</th>
                    <th className="p-4 text-center font-black">Aksi</th>
                  </tr>
                </thead>
                
                <tbody className="text-sm divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="5" className="p-10 text-center"><Loader2 className="animate-spin inline w-8 h-8 text-doabunda-primary" /></td></tr>
                  ) : kasInfo.history.length > 0 ? kasInfo.history.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-500 font-medium whitespace-nowrap">{new Date(item.payout_date).toLocaleDateString('id-ID')}</td>
                      <td className="p-4 whitespace-nowrap">
                        <span className={`px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${item.category === 'Gaji Karyawan' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                          {item.category}
                        </span>
                      </td>
                      <td className="p-4 font-bold text-gray-700">{item.description}</td>
                      <td className="p-4 font-black text-red-500 text-right whitespace-nowrap">- Rp {Number(item.amount).toLocaleString('id-ID')}</td>
                      <td className="p-4 text-center">
                        <button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-medium text-sm">Belum ada penarikan dana tercatat.</td></tr>
                  )}
                </tbody>
              </table>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

export default KasGaji;