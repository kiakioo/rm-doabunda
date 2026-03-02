import React, { useState, useEffect } from 'react';
import api from '../services/api';
import SidebarAdmin from '../components/SidebarAdmin';
import { FileText, Trash2, PlusCircle, Loader2 } from 'lucide-react';
import Swal from 'sweetalert2';

const Laporan = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchFinancialReport(); }, []);

  const fetchFinancialReport = async () => {
    setLoading(true);
    try {
      const res = await api.get('/rekap');
      setData(res.data.data || []);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleExtraIncome = async (date) => {
    const { value: formValues } = await Swal.fire({
      title: 'Uang Tambahan (Sisa Pasar)',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Sumber (Misal: Sisa Pasar)">' +
        '<input id="swal-input2" type="number" class="swal2-input" placeholder="Nominal Rp">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#BF3131',
      cancelButtonText: 'Batal',
      preConfirm: () => {
        return [
          document.getElementById('swal-input1').value,
          document.getElementById('swal-input2').value
        ]
      }
    });

    if (formValues && formValues[0] && formValues[1]) {
      try {
        await api.post('/rekap/extra-income-log', {
          source_name: formValues[0],
          amount: formValues[1],
          date: date
        });
        Swal.fire({icon: 'success', title: 'Berhasil!', text: 'Uang tambahan dicatat.', confirmButtonColor: '#BF3131'});
        fetchFinancialReport();
      } catch (err) { 
        Swal.fire({icon: 'error', title: 'Gagal', text: err.response?.data?.message || 'Error', confirmButtonColor: '#BF3131'}); 
      }
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({ 
      title: 'Hapus data laporan ini?', 
      text: "Tindakan ini tidak dapat dibatalkan!",
      icon: 'warning', 
      showCancelButton: true, 
      confirmButtonColor: '#BF3131',
      cancelButtonText: 'Batal',
      confirmButtonText: 'Ya, Hapus!'
    });
    
    if (res.isConfirmed) {
      try { 
        await api.delete(`/rekap/${id}`); 
        fetchFinancialReport(); 
      }
      catch (err) { Swal.fire({icon: 'error', title: 'Error', text: 'Gagal menghapus data.', confirmButtonColor: '#BF3131'}); }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans w-full">
      <SidebarAdmin />
      
      {/* Container responsif */}
      <div className="flex-1 p-4 pt-20 md:p-8 md:pt-8 w-full overflow-x-hidden">
        
        <header className="mb-6 md:mb-10 flex flex-col md:flex-row md:justify-between md:items-end gap-2">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-gray-800 flex items-center gap-3 tracking-wide">
              <FileText className="text-doabunda-primary" size={32} /> LAPORAN KEUANGAN
            </h1>
            <p className="text-gray-500 font-medium text-xs md:text-sm mt-1">Rekapitulasi Omzet, Pengeluaran & Laba Bersih RM. Doa Bunda.</p>
          </div>
        </header>

        <div className="bg-white rounded-2xl md:rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
          
          {/* Wadah pembungkus tabel agar bisa di-scroll di HP */}
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left min-w-[750px]">
              <thead className="bg-doabunda-dark text-doabunda-gold text-[10px] md:text-xs uppercase font-bold tracking-widest border-b border-doabunda-primary/30">
                <tr>
                  <th className="p-4 md:p-5 font-black">Tanggal</th>
                  <th className="p-4 md:p-5 text-right font-black">Pendapatan</th>
                  <th className="p-4 md:p-5 text-right font-black">Pengeluaran</th>
                  <th className="p-4 md:p-5 text-right font-black">Uang Tambahan</th>
                  <th className="p-4 md:p-5 text-right font-black text-white bg-doabunda-primary/20">Laba Bersih</th>
                  <th className="p-4 md:p-5 text-center font-black">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 text-xs md:text-sm">
                {loading ? (
                  <tr><td colSpan="6" className="p-10 text-center text-doabunda-primary"><Loader2 className="animate-spin inline w-8 h-8" /></td></tr>
                ) : data.length > 0 ? data.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50/80 transition-colors">
                    <td className="p-4 md:p-5 font-bold text-gray-700 whitespace-nowrap">
                      {new Date(item.recap_date).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}
                    </td>
                    <td className="p-4 md:p-5 text-right font-black text-emerald-600">Rp {Number(item.total_revenue).toLocaleString('id-ID')}</td>
                    <td className="p-4 md:p-5 text-right font-bold text-red-500">Rp {Number(item.total_expense).toLocaleString('id-ID')}</td>
                    <td className="p-4 md:p-5 text-right font-bold text-blue-600">Rp {Number(item.extra_income || 0).toLocaleString('id-ID')}</td>
                    <td className="p-4 md:p-5 text-right font-black text-doabunda-primary bg-doabunda-light/30">Rp {Number(item.net_profit).toLocaleString('id-ID')}</td>
                    <td className="p-4 md:p-5 text-center flex justify-center gap-2 md:gap-3">
                      <button 
                        onClick={() => handleExtraIncome(item.recap_date)} 
                        className="p-1.5 md:p-2 text-blue-500 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-all" 
                        title="Catat Uang Tambahan (Sisa Pasar)"
                      >
                        <PlusCircle size={20}/>
                      </button>
                      <button 
                        onClick={() => handleDelete(item.id)} 
                        className="p-1.5 md:p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        title="Hapus Laporan Ini"
                      >
                        <Trash2 size={20}/>
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr><td colSpan="6" className="p-10 text-center text-gray-400 font-medium">Belum ada data laporan keuangan yang dicatat.</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Laporan;