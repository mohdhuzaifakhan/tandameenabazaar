import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import DashboardLayout from '../components/DashboardLayout';

export default function AdminShops() {
  const { shops, toggleShopVerification } = useBazaar();
  const [searchShopQuery, setSearchShopQuery] = useState('');

  // Filtered Shops
  const filteredShops = shops.filter(shop => 
    shop.name.toLowerCase().includes(searchShopQuery.toLowerCase()) ||
    shop.market.toLowerCase().includes(searchShopQuery.toLowerCase()) ||
    shop.categoryName.toLowerCase().includes(searchShopQuery.toLowerCase())
  );

  return (
    <DashboardLayout title="Manage Shops" role="admin">
      <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col gap-6">
        
        {/* Header Search & Stats Row */}
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div className="relative w-full max-w-xs">
            <i className="fa-solid fa-magnifying-glass absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
            <input 
              type="text" 
              placeholder="Search shops by name or market..."
              value={searchShopQuery}
              onChange={(e) => setSearchShopQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/40"
            />
          </div>
          <span className="text-xs text-slate-500 font-semibold">
            Total Stores Registered: <strong className="text-slate-800 font-bold">{shops.length}</strong>
          </span>
        </div>

        {/* Directory Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                <th className="p-3">Shop Details</th>
                <th className="p-3">Area / Market</th>
                <th className="p-3">Category</th>
                <th className="p-3">Products Listed</th>
                <th className="p-3">Status</th>
                <th className="p-3">Action Controls</th>
              </tr>
            </thead>
            <tbody>
              {filteredShops.map(shop => (
                <tr key={shop.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="p-3 flex items-center gap-3">
                    <img 
                      src={shop.logoImage} 
                      alt={shop.name} 
                      className="w-9 h-9 rounded-full object-cover border border-slate-100 flex-shrink-0" 
                    />
                    <div>
                      <strong className="text-slate-800 font-bold block text-xs">{shop.name}</strong>
                      <span className="text-[10px] text-slate-400 font-semibold">Rating: {shop.rating} ({shop.reviewsCount} reviews)</span>
                    </div>
                  </td>
                  <td className="p-3 text-slate-500 font-semibold">{shop.market}</td>
                  <td className="p-3 text-slate-500 font-semibold">{shop.categoryName}</td>
                  <td className="p-3 text-slate-800 font-bold">{shop.productsCount || 0}+ Products</td>
                  <td className="p-3">
                    <span className={`inline-block px-2.5 py-1 rounded-md text-[10px] font-black uppercase ${shop.verified ? 'bg-emerald-50 text-emerald-700' : 'bg-orange-50 text-orange-700'}`}>
                      {shop.verified ? 'Verified' : 'Pending'}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-4 items-center">
                      <button 
                        onClick={() => toggleShopVerification(shop.id)}
                        className={`px-3 py-1.5 rounded-lg border text-[10px] font-extrabold cursor-pointer transition-colors ${shop.verified ? 'border-red-200 bg-red-50 text-red-650 hover:bg-red-100' : 'border-emerald-250 bg-emerald-50 text-emerald-700 hover:bg-emerald-100'}`}
                      >
                        {shop.verified ? 'Deactivate' : 'Approve'}
                      </button>
                      <Link 
                        to={`/dashboard/admin/shop/${shop.id}`}
                        className="text-emerald-600 hover:text-emerald-700 font-bold text-[11px] flex items-center gap-0.5"
                      >
                        Metrics <i className="fa-solid fa-chevron-right text-[8px]"></i>
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
      </div>
    </DashboardLayout>
  );
}
