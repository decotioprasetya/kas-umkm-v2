import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Wallet, TrendingUp, TrendingDown } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState({ balance: 0, in: 0, out: 0 });

  useEffect(() => {
    const fetchSummary = async () => {
      const { data: trans } = await supabase.from('cash_book').select('amount, type');
      if (trans) {
        const totalIn = trans.filter(t => t.type === 'in').reduce((s, t) => s + Number(t.amount), 0);
        const totalOut = trans.filter(t => t.type === 'out').reduce((s, t) => s + Number(t.amount), 0);
        setData({ balance: totalIn - totalOut, in: totalIn, out: totalOut });
      }
    };
    fetchSummary();
  }, []);

  const format = (v: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(v);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-slate-800">Ringkasan Keuangan</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-blue-500">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 font-medium">Total Saldo</span>
            <Wallet className="text-blue-500" />
          </div>
          <p className="text-2xl font-black text-slate-900">{format(data.balance)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-green-500">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 font-medium">Pemasukan</span>
            <TrendingUp className="text-green-500" />
          </div>
          <p className="text-2xl font-black text-green-600">{format(data.in)}</p>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border-b-4 border-red-500">
          <div className="flex justify-between items-start mb-4">
            <span className="text-slate-500 font-medium">Pengeluaran</span>
            <TrendingDown className="text-red-500" />
          </div>
          <p className="text-2xl font-black text-red-600">{format(data.out)}</p>
        </div>
      </div>
    </div>
  );
}
