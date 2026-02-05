import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FileText, Download } from 'lucide-react';

export default function Reports() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const load = async () => {
      const { data: res } = await supabase.from('cash_book').select('*').order('date', { ascending: false });
      if (res) setData(res);
    };
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2"><FileText /> Laporan Transaksi</h2>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden border">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
            <tr>
              <th className="p-4 border-b">Tanggal</th>
              <th className="p-4 border-b">Keterangan</th>
              <th className="p-4 border-b text-right">Uang Masuk</th>
              <th className="p-4 border-b text-right">Uang Keluar</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {data.map((t: any) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="p-4 text-sm">{t.date}</td>
                <td className="p-4 text-sm font-medium">{t.description}</td>
                <td className="p-4 text-right text-green-600 font-bold">{t.type === 'in' ? `Rp ${t.amount.toLocaleString()}` : '-'}</td>
                <td className="p-4 text-right text-red-600 font-bold">{t.type === 'out' ? `Rp ${t.amount.toLocaleString()}` : '-'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
