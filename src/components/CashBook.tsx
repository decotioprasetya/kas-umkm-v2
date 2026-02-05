import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { PlusCircle, Trash2 } from 'lucide-react';

export default function CashBook() {
  const [list, setList] = useState([]);
  const [form, setForm] = useState({ desc: '', amount: '', type: 'in', date: new Date().toISOString().split('T')[0] });

  const load = async () => {
    const { data } = await supabase.from('cash_book').select('*').order('date', { ascending: false });
    if (data) setList(data);
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await supabase.from('cash_book').insert([{ 
      description: form.desc, 
      amount: Number(form.amount), 
      type: form.type, 
      date: form.date 
    }]);
    setForm({ ...form, desc: '', amount: '' });
    load();
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <form onSubmit={save} className="bg-white p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" placeholder="Keterangan Transaksi" value={form.desc} onChange={e => setForm({...form, desc: e.target.value})} className="border p-3 rounded-xl w-full" required />
        <input type="number" placeholder="Nominal (Rp)" value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="border p-3 rounded-xl w-full" required />
        <input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className="border p-3 rounded-xl w-full" />
        <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="border p-3 rounded-xl w-full">
          <option value="in">Uang Masuk</option>
          <option value="out">Uang Keluar</option>
        </select>
        <button type="submit" className="md:col-span-2 bg-indigo-600 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition">
          <PlusCircle size={20}/> Simpan Transaksi Cloud
        </button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        {list.map((item: any) => (
          <div key={item.id} className="p-4 border-b flex justify-between items-center hover:bg-slate-50">
            <div>
              <p className="font-bold text-slate-800">{item.description}</p>
              <p className="text-xs text-slate-400">{item.date}</p>
            </div>
            <p className={`font-black ${item.type === 'in' ? 'text-green-600' : 'text-red-600'}`}>
              {item.type === 'in' ? '+' : '-'} Rp {item.amount.toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
