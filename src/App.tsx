import React, { useState } from 'react';
import Dashboard from './components/Dashboard';
import CashBook from './components/CashBook';
import Inventory from './components/Inventory';
import Sales from './components/Sales';
import Reports from './components/Reports';
import { LayoutDashboard, BookOpen, Package, ShoppingCart, FileText } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col md:flex-row">
      <nav className="w-full md:w-64 bg-indigo-900 text-white p-6 shadow-xl">
        <h1 className="text-xl font-bold mb-8 text-yellow-400">KAS CLOUD V2</h1>
        <div className="flex flex-col gap-2">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20}/> },
            { id: 'cashbook', label: 'Buku Kas', icon: <BookOpen size={20}/> },
            { id: 'inventory', label: 'Stok Barang', icon: <Package size={20}/> },
            { id: 'sales', label: 'Kasir Jualan', icon: <ShoppingCart size={20}/> },
            { id: 'reports', label: 'Laporan', icon: <FileText size={20}/> },
          ].map((menu) => (
            <button 
              key={menu.id}
              onClick={() => setActiveTab(menu.id)}
              className={`flex items-center gap-3 p-3 rounded-lg transition ${activeTab === menu.id ? 'bg-indigo-700 shadow-inner' : 'hover:bg-indigo-800'}`}
            >
              {menu.icon} {menu.label}
            </button>
          ))}
        </div>
      </nav>
      <main className="flex-1 p-4 md:p-8">
        {activeTab === 'dashboard' && <Dashboard />}
        {activeTab === 'cashbook' && <CashBook />}
        {activeTab === 'inventory' && <Inventory />}
        {activeTab === 'sales' && <Sales />}
        {activeTab === 'reports' && <Reports />}
      </main>
    </div>
  );
}
