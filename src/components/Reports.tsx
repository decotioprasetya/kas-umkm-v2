import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { FileText } from 'lucide-react';

export default function Reports() {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const load = async () => {
      const { data: res } = await supabase.from('cash_book').select('*').order('date', { ascending: false });
      if (res) setData(res);
    };
    load();
  }, []);

  return (
    <div className="space-y-6 text-sm">
      <h2 className="text-xl font-bold flex items-center gap-2"><FileText /> Riwayat Transaksi</h2>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-400 text-[10px] uppercase font-black tracking-widest">
            <tr><th className="p-4">Tanggal</th><th className="p-4">Keterangan</th><th className="p-4 text-right">Masuk</th><th className="p-4 text-right">Keluar</th></tr>
          </thead>
          <tbody className="divide-y">
            {data.map((t: any) => (
              <tr key={t.id} className="hover:bg-slate-50">
                <td className="p-4 text-slate-500">{t.date}</td>
                <td className="p-4 font-medium">{t.description}</td>
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
