import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingCart, Tag } from 'lucide-react';

export default function Sales() {
  const [sales, setSales] = useState<any[]>([]);
  const [inventory, setInventory] = useState<any[]>([]);
  const [form, setForm] = useState({ productName: '', qty: '', sellPrice: '' });

  const loadData = async () => {
    const { data: s } = await supabase.from('sales').select('*').order('created_at', { ascending: false });
    const { data: i } = await supabase.from('inventory').select('*');
    if (s) setSales(s);
    if (i) setInventory(i);
  };

  useEffect(() => { loadData(); }, []);

  const handleSale = async (e: any) => {
    e.preventDefault();
    const total = Number(form.qty) * Number(form.sellPrice);
    const { error } = await supabase.from('sales').insert([{
      product_name: form.productName, qty: Number(form.qty), sell_price: Number(form.sellPrice), total_revenue: total, date: new Date().toISOString().split('T')[0]
    }]);
    if (!error) {
      await supabase.from('cash_book').insert([{
        description: `Jual: ${form.productName}`, amount: total, type: 'in', date: new Date().toISOString().split('T')[0]
      }]);
      setForm({ productName: '', qty: '', sellPrice: '' });
      loadData();
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSale} className="bg-white p-6 rounded-2xl shadow-sm border grid grid-cols-1 md:grid-cols-4 gap-4">
        <input list="prods" placeholder="Produk" value={form.productName} onChange={e => setForm({...form, productName: e.target.value})} className="border p-3 rounded-xl md:col-span-2" required />
        <datalist id="prods">{inventory.map((item, i) => <option key={i} value={item.product_name} />)}</datalist>
        <input type="number" placeholder="Qty" value={form.qty} onChange={e => setForm({...form, qty: e.target.value})} className="border p-3 rounded-xl" required />
        <input type="number" placeholder="Harga Jual" value={form.sellPrice} onChange={e => setForm({...form, sellPrice: e.target.value})} className="border p-3 rounded-xl" required />
        <button type="submit" className="md:col-span-4 bg-emerald-500 text-white p-4 rounded-xl font-bold flex items-center justify-center gap-2"><ShoppingCart size={20}/> Jual Sekarang</button>
      </form>
      <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50 text-xs font-bold uppercase text-slate-500">
            <tr><th className="p-4">Produk</th><th className="p-4 text-right">Total</th></tr>
          </thead>
          <tbody className="divide-y">
            {sales.map((s: any) => (
              <tr key={s.id}><td className="p-4 text-sm font-bold">{s.product_name} ({s.qty})</td><td className="p-4 text-right text-emerald-600 font-bold text-sm">Rp {s.total_revenue.toLocaleString()}</td></tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
