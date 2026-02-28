import React, { useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

const HistoryTransaksi = () => {
  const [transactions, setTransactions] = useState([]);
  const [date, setDate] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchTransactions();
  }, [date]);

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/transactions', {
        params: { date }
      });
      setTransactions(res.data.data || []);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">

      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)} className="text-gray-500 hover:text-doabunda-dark">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-2xl font-bold text-doabunda-dark">
          History Transaksi
        </h1>
      </div>

      <div className="bg-white p-4 rounded-xl shadow mb-6 flex gap-4 items-center">
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="border rounded-lg px-3 py-2"
        />
        <button
          onClick={() => setDate('')}
          className="bg-gray-200 px-4 py-2 rounded-lg"
        >
          Reset
        </button>
      </div>

      <div className="bg-white rounded-xl shadow overflow-x-auto">
        <table className="min-w-[700px] w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-3 text-left">ID</th>
              <th className="p-3 text-left">Tanggal</th>
              <th className="p-3 text-left">Kasir</th>
              <th className="p-3 text-left">Metode</th>
              <th className="p-3 text-left">Sumber</th>
              <th className="p-3 text-right">Total</th>
            </tr>
          </thead>
          <tbody>
            {transactions.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-6 text-center text-gray-400">
                  Tidak ada transaksi
                </td>
              </tr>
            ) : (
              transactions.map((trx) => (
                <tr key={trx.id} className="border-t">
                  <td className="p-3">{trx.id}</td>
                  <td className="p-3">
                    {new Date(trx.created_at).toLocaleString('id-ID')}
                  </td>
                  <td className="p-3">{trx.cashier}</td>
                  <td className="p-3">{trx.payment_method}</td>
                  <td className="p-3">{trx.source}</td>
                  <td className="p-3 text-right font-bold">
                    Rp {Number(trx.total_amount).toLocaleString('id-ID')}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default HistoryTransaksi;