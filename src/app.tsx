import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import CashBook from './components/CashBook';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import { LayoutDashboard, BookOpen, Package, ShoppingCart } from 'lucide-react';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      {/* Sidebar / Navigasi */}
      <nav className="w-full md:w-64 bg-indigo-900 text-white p-6">
        <h1 className="text-xl font-bold mb-8 flex items-center gap-2">
          <Package className="text-yellow-400" /> Kas UMKM Cloud
        </h1>
        <div className="flex flex-col gap-2">
          <button 
            onClick={() => setActiveTab('dashboard')}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'dashboard' ? 'bg-indigo-700 shadow-inner' : 'hover:bg-indigo-800'}`}
          >
            <LayoutDashboard size={20} /> Dashboard
          </button>
          <button 
            onClick={() => setActiveTab('cashbook')}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'cashbook' ? 'bg-indigo-700 shadow-inner' : 'hover:bg-indigo-800'}`}
          >
            <BookOpen size={20} /> Buku Kas
          </button>
          <button 
            onClick={() => setActiveTab('inventory')}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'inventory' ? 'bg-indigo-700 shadow-inner' : 'hover:bg-indigo-800'}`}
          >
            <Package size={20} /> Stok Barang
          </button>
          <button 
            onClick={() => setActiveTab('sales')}
            className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === 'sales' ? 'bg-indigo-700 shadow-inner' : 'hover:bg-indigo-800'}`}
          >
            <ShoppingCart size={20} /> Kasir Penjualan
          </button>
        </div>
      </nav>

      {/* Konten Utama */}
      <main className="flex-1 p-4 md:p-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'cashbook' && <CashBook />}
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'sales' && <Sales />}
      </main>
    </div>
  );
}

export default App;
