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
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans w-full">
      <SidebarAdmin />
      <div className="flex-1 p-4 pt-20 md:p-8 md:pt-8 w-full overflow-x-hidden">
        
        <header className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-3 tracking-wide">
            <Landmark className="text-doabunda-primary" size={32} /> BUKU KAS & GAJI
          </h1>
          <p className="text-gray-500 font-medium text-xs md:text-sm mt-1">Pantau sisa saldo warung & catat penarikan gaji/owner.</p>
        </header>

        {/* Info Saldo Kas Raksasa */}
        <div className="bg-gradient-to-r from-doabunda-dark to-doabunda-primary rounded-3xl p-6 md:p-10 text-white shadow-xl mb-8 relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-sm md:text-base font-bold text-white/80 uppercase tracking-widest mb-2 flex items-center gap-2">
              <Wallet size={20} /> Saldo Kas Warung Tersedia
            </h2>
            <div className="text-4xl md:text-6xl font-black tracking-tight">
              Rp {Number(kasInfo.saldo_kas).toLocaleString('id-ID')}
            </div>
            <p className="mt-4 text-xs md:text-sm text-white/70 max-w-xl leading-relaxed">
              *Ini adalah estimasi uang fisik hasil akumulasi laba bersih yang belum dibagikan/ditarik.
            </p>
          </div>
          <Banknote size={180} className="absolute -right-10 -bottom-10 opacity-10 transform -rotate-12" />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 md:gap-8">
          {/* Form Tarik Dana */}
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
              <button type="submit" className="w-full bg-doabunda-dark text-white font-bold py-4 rounded-xl hover:bg-doabunda-primary transition-all text-sm tracking-wide shadow-md">
                TARIK DANA KAS
              </button>
            </form>
          </div>

          {/* Tabel Riwayat Payout */}
          <div className="xl:col-span-2 bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50/50">
              <h3 className="font-bold text-gray-800 flex items-center gap-2"><Users size={18} className="text-doabunda-primary"/> Riwayat Penarikan</h3>
            </div>
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left min-w-[600px]">
                <thead className="bg-gray-50 text-gray-400 uppercase text-[10px] md:text-xs font-bold tracking-widest border-b">
                  <tr>
                    <th className="p-4">Tanggal</th>
                    <th className="p-4">Kategori</th>
                    <th className="p-4">Penerima/Ket</th>
                    <th className="p-4 text-right">Nominal</th>
                    <th className="p-4 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-gray-50">
                  {loading ? (
                    <tr><td colSpan="5" className="p-10 text-center"><Loader2 className="animate-spin inline w-8 h-8 text-doabunda-primary" /></td></tr>
                  ) : kasInfo.history.length > 0 ? kasInfo.history.map(item => (
                    <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                      <td className="p-4 text-gray-500 font-medium">{new Date(item.payout_date).toLocaleDateString('id-ID')}</td>
                      <td className="p-4"><span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${item.category === 'Gaji Karyawan' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>{item.category}</span></td>
                      <td className="p-4 font-bold text-gray-700">{item.description}</td>
                      <td className="p-4 font-black text-red-500 text-right">- Rp {Number(item.amount).toLocaleString('id-ID')}</td>
                      <td className="p-4 text-center"><button onClick={() => handleDelete(item.id)} className="p-2 text-gray-400 hover:text-red-500 bg-gray-50 hover:bg-red-50 rounded-lg"><Trash2 size={16} /></button></td>
                    </tr>
                  )) : (
                    <tr><td colSpan="5" className="p-10 text-center text-gray-400 font-medium">Belum ada penarikan dana tercatat.</td></tr>
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