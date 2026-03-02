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
      title: 'Uang Tambahan (Sisa Pasar/Lainnya)',
      html:
        '<input id="swal-input1" class="swal2-input" placeholder="Nama Sumber (Misal: Sisa Pasar)">' +
        '<input id="swal-input2" type="number" class="swal2-input" placeholder="Nominal Rp">',
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonColor: '#7D0A0A',
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
        Swal.fire('Berhasil!', 'Uang tambahan dicatat.', 'success');
        fetchFinancialReport();
      } catch (err) { Swal.fire('Gagal', err.response?.data?.message || 'Error', 'error'); }
    }
  };

  const handleDelete = async (id) => {
    const res = await Swal.fire({ title: 'Hapus data ini?', icon: 'warning', showCancelButton: true, confirmButtonColor: '#d33' });
    if (res.isConfirmed) {
      try { await api.delete(`/rekap/${id}`); fetchFinancialReport(); }
      catch (err) { Swal.fire('Error', 'Gagal', 'error'); }
    }
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-50 font-sans">
      <SidebarAdmin />
      <div className="flex-1 p-6 md:p-10">
        <header className="mb-10 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black flex items-center gap-3 italic"><FileText className="text-red-800" size={32} /> LAPORAN KEUANGAN</h1>
            <p className="text-gray-500 font-medium italic text-sm">Rekapitulasi Omzet, Pengeluaran & Laba RM. Doa Bunda.</p>
          </div>
        </header>

        <div className="bg-white rounded-3xl shadow-sm border overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-red-900 text-white text-[10px] uppercase font-bold tracking-widest">
              <tr>
                <th className="p-5">Tanggal</th>
                <th className="p-5 text-right text-green-300">Pendapatan</th>
                <th className="p-5 text-right text-red-300">Pengeluaran</th>
                <th className="p-5 text-right text-yellow-300">Uang Tambahan</th>
                <th className="p-5 text-right">Laba Bersih</th>
                <th className="p-5 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm">
              {loading ? (
                <tr><td colSpan="6" className="p-10 text-center"><Loader2 className="animate-spin inline" /></td></tr>
              ) : data.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="p-5 font-bold">{new Date(item.recap_date).toLocaleDateString('id-ID', {day:'numeric', month:'long', year:'numeric'})}</td>
                  <td className="p-5 text-right text-emerald-600 font-bold">Rp {Number(item.total_revenue).toLocaleString('id-ID')}</td>
                  <td className="p-5 text-right text-red-500 font-bold">Rp {Number(item.total_expense).toLocaleString('id-ID')}</td>
                  <td className="p-5 text-right text-blue-600 font-bold">Rp {Number(item.extra_income || 0).toLocaleString('id-ID')}</td>
                  <td className="p-5 text-right font-black bg-gray-50 text-gray-800">Rp {Number(item.net_profit).toLocaleString('id-ID')}</td>
                  <td className="p-5 text-center flex justify-center gap-2">
                    <button onClick={() => handleExtraIncome(item.recap_date)} className="text-blue-500 hover:text-blue-700" title="Tambah Sisa Pasar"><PlusCircle size={18}/></button>
                    <button onClick={() => handleDelete(item.id)} className="text-gray-300 hover:text-red-600"><Trash2 size={18}/></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
export default Laporan;