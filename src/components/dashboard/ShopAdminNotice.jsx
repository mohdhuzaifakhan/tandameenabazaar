import React from 'react';
import { Link } from 'react-router-dom';

export default function ShopAdminNotice({
  adminSelectedShopId,
  setAdminSelectedShopId,
  shops = []
}) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm flex flex-col gap-6">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#056839] flex items-center justify-center text-xl font-bold">
          <i className="fa-solid fa-user-shield"></i>
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">Administrator Access Panel</h2>
          <p className="text-xs text-slate-500 font-medium">Platform administrators do not own a single store</p>
        </div>
      </div>

      <div className="p-4 bg-emerald-50/60 border border-emerald-100 rounded-2xl text-xs text-slate-700 space-y-2 font-medium">
        <p>
          As an <strong>Administrator</strong>, your primary tools are available on the <strong>Admin Dashboard</strong> where you can audit stores, manage categories, verify merchants, and edit platform taxonomy.
        </p>
      </div>

      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
        <Link
          to="/dashboard/admin"
          className="px-5 py-3 bg-[#056839] hover:bg-emerald-800 text-white font-black text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-gauge-high"></i>
          <span>Go to Main Admin Dashboard</span>
        </Link>
        <Link
          to="/dashboard/admin/shops"
          className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-2"
        >
          <i className="fa-solid fa-store"></i>
          <span>Browse All Shops Directory</span>
        </Link>
      </div>

      {/* Shop Selector for Admin Inspection */}
      <div className="pt-6 border-t border-slate-100 space-y-3">
        <label className="text-xs font-black text-slate-800 block">
          <i className="fa-solid fa-sliders text-[#056839] mr-1.5"></i> Or Select a Merchant Shop to Inspect &amp; Manage:
        </label>
        <select
          value={adminSelectedShopId}
          onChange={(e) => setAdminSelectedShopId(e.target.value)}
          className="w-full sm:w-96 px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-white font-bold cursor-pointer shadow-2xs"
        >
          <option value="">Choose a Shop from Marketplace</option>
          {shops.map((s) => (
            <option key={s.id} value={s.id}>
              {s.name} ({s.market || 'Main Market'}) {s.verified ? '✓ Verified' : '• Pending'}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}
