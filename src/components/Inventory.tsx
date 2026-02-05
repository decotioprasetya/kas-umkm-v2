import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { Package, Plus, Trash2 } from 'lucide-react';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [form, setForm] = useState({ name: '', qty: '', price: '', type: 'FOR_SALE' });

  const load = async () => {
    const { data } = await supabase.from('inventory').select('*').order('created_at', { ascending: false });
    if (data) setItems(data);
  };

  useEffect(() => { load(); }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const { error } = await supabase.from('inventory').insert([{
      product_name: form.name,
      qty: Number(form.qty),
      buy_price: Number(form.price),
      stock_type: form.type,
      date: new Date().toISOString().split('T')[0]
    }]);
    
    if (!error) {
      // Otomatis catat di Buku Kas sebagai pengeluaran (beli stok)
      await supabase.from('cash_book').insert([{
        description: `Beli Stok: ${form.name}`,
        amount: Number(form.qty) * Number(form.price),
        type: 'out',
        date: new Date().toISOString().split('T')[0]
      }]);
      setForm({ name: '', qty: '', price: '', type: 'FOR_SALE' });
      load();
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={save} className="bg-white p-6 rounded-2xl shadow-sm grid grid-cols-1 md:grid-cols-4 gap-4">
        <input type="text" placeholder="Nama Barang" value={form.name} onChange={e => setForm({...form, name: e.target.value})} className="border p-3 rounded-xl" required />
        <input type="number" placeholder="Jumlah" value={form.qty} onChange={e => setForm({...form, qty: e.target.value})} className="border p-3 rounded-xl" required />
        <input type="number" placeholder="Harga Beli Satuan" value={form.price} onChange={e => setForm({...form, price: e.target.value})} className="border p-3 rounded-xl" required />
        <button type="submit" className="bg-indigo-600 text-white p-3 rounded-xl font-bold flex items-center justify-center gap-2"><Plus size={18}/> Tambah Stok</button>
      </form>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Barang</th>
              <th className="p-4">Stok</th>
              <th className="p-4">Harga Beli</th>
              <th className="p-4">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {items.map((item: any) => (
              <tr key={item.id}>
                <td className="p-4 font-bold">{item.product_name}</td>
                <td className="p-4">{item.qty} unit</td>
                <td className="p-4 text-red-500 font-medium">Rp {item.buy_price.toLocaleString()}</td>
                <td className="p-4">
                  <button onClick={async () => { await supabase.from('inventory').delete().eq('id', item.id); load(); }} className="text-slate-300 hover:text-red-500"><Trash2 size={18}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
