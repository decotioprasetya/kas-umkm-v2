import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { ShoppingCart, Trash2, Tag, Plus } from 'lucide-react';

export default function Sales() {
  const [sales, setSales] = useState([]);
  const [inventory, setInventory] = useState([]);
  const [form, setForm] = useState({ productName: '', qty: '', sellPrice: '', date: new Date().toISOString().split('T')[0] });

  const loadData = async () => {
    // Ambil data penjualan
    const { data: salesData } = await supabase.from('sales').select('*').order('created_at', { ascending: false });
    if (salesData) setSales(salesData);

    // Ambil data stok yang tersedia (untuk pilihan produk)
    const { data: invData } = await supabase.from('inventory').select('product_name, qty');
    if (invData) setInventory(invData);
  };

  useEffect(() => { loadData(); }, []);

  const handleSale = async (e: React.FormEvent) => {
    e.preventDefault();
    const total = Number(form.qty) * Number(form.sellPrice);

    // 1. Simpan ke tabel sales
    const { error: saleError } = await supabase.from('sales').insert([{
      product_name: form.productName,
      qty: Number(form.qty),
      sell_price: Number(form.sellPrice),
      total_revenue: total,
      date: form.date
    }]);

    if (!saleError) {
      // 2. Otomatis catat di Buku Kas sebagai uang masuk
      await supabase.from('cash_book').insert([{
        description: `Penjualan: ${form.productName} (${form.qty} pcs)`,
        amount: total,
        type: 'in',
        date: form.date
      }]);

      setForm({ ...form, productName: '', qty: '', sellPrice: '' });
      loadData();
      alert("Penjualan Berhasil & Masuk ke Buku Kas!");
    }
  };

  const deleteSale = async (id: string) => {
    if(confirm("Hapus data penjualan ini? (Tidak otomatis mengoreksi buku kas)")) {
      await supabase.from('sales').delete().eq('id', id);
      loadData();
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
        <ShoppingCart className="text-indigo-600" /> Kasir Penjualan
      </h2>

      {/* Form Input Penjualan */}
      <form onSubmit={handleSale} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="text-xs font-bold text-slate-400 uppercase">Nama Produk</label>
          <input 
            list="product-list"
            type="text" 
            value={form.productName} 
            onChange={e => setForm({...form, productName: e.target.value})} 
            className="w-full border p-3 rounded-xl mt-1" 
            placeholder="Ketik nama produk..."
            required 
          />
          <datalist id="product-list">
            {inventory.map((item, idx) => (
              <option key={idx} value={item.product_name} />
            ))}
          </datalist>
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Jumlah (Qty)</label>
          <input type="number" value={form.qty} onChange={e => setForm({...form, qty: e.target.value})} className="w-full border p-3 rounded-xl mt-1" placeholder="0" required />
        </div>
        <div>
          <label className="text-xs font-bold text-slate-400 uppercase">Harga Jual Satuan</label>
          <input type="number" value={form.sellPrice} onChange={e => setForm({...form, sellPrice: e.target.value})} className="w-full border p-3 rounded-xl mt-1" placeholder="Rp" required />
        </div>
        <button type="submit" className="md:col-span-4 bg-emerald-500 text-white p-4 rounded-xl font-bold hover:bg-emerald-600 transition flex items-center justify-center gap-2 shadow-lg shadow-emerald-100">
          <Tag size={20}/> Proses Penjualan
        </button>
      </form>

      {/* Tabel Riwayat Penjualan */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead className="bg-slate-50 text-slate-500 text-xs uppercase font-bold">
            <tr>
              <th className="p-4">Tanggal</th>
              <th className="p-4">Produk</th>
              <th className="p-4">Qty</th>
              <th className="p-4 text-right">Total Pendapatan</th>
              <th className="p-4 text-center">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {sales.map((s) => (
              <tr key={s.id} className="hover:bg-slate-50 transition">
                <td className="p-4 text-sm">{s.date}</td>
                <td className="p-4 text-sm font-bold text-slate-700">{s.product_name}</td>
                <td className="p-4 text-sm">{s.qty}</td>
                <td className="p-4 text-sm text-right font-black text-emerald-600">Rp {s.total_revenue.toLocaleString()}</td>
                <td className="p-4 text-center">
                  <button onClick={() => deleteSale(s.id)} className="text-slate-300 hover:text-red-500 transition">
                    <Trash2 size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
