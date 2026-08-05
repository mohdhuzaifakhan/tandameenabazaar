import React from 'react';
import ImageUploader from '../ImageUploader';
import { DEFAULT_COVER_BANNER, DEFAULT_STORE_LOGO } from '../../utils/defaultAssets';

export default function ShopCreateForm({
  newStoreForm,
  setNewStoreForm,
  handleCreateShop,
  creating,
  categories = [],
  markets = [],
  cities = []
}) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-100 shadow-sm space-y-6">
      <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-[#056839] flex items-center justify-center text-xl font-bold">
          <i className="fa-solid fa-store"></i>
        </div>
        <div>
          <h2 className="text-xl font-black text-slate-900">Create &amp; Launch Your Storefront</h2>
          <p className="text-xs text-slate-500 font-medium">You don't have a registered Shop on Meena Bazaar yet. Fill in your details below to launch.</p>
        </div>
      </div>

      <form onSubmit={handleCreateShop} className="space-y-4 max-w-2xl">
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Store / Business Name *</label>
          <input
            type="text"
            required
            placeholder="e.g. Rampur Electronics &amp; Mobiles"
            value={newStoreForm.name}
            onChange={(e) => setNewStoreForm({ ...newStoreForm, name: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">City / Region *</label>
            <select
              required
              value={newStoreForm.city || 'Rampur'}
              onChange={(e) => setNewStoreForm({ ...newStoreForm, city: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Business Category *</label>
            <select
              required
              value={newStoreForm.category}
              onChange={(e) => setNewStoreForm({ ...newStoreForm, category: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
            >
              <option value="" disabled>-- Select Category --</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Market Location *</label>
            <select
              required
              value={newStoreForm.market}
              onChange={(e) => setNewStoreForm({ ...newStoreForm, market: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
            >
              <option value="" disabled>-- Select Market Location --</option>
              {markets.map((m, idx) => {
                const mktName = typeof m === 'object' ? (m.name || m.id) : m;
                return <option key={idx} value={mktName}>{mktName}</option>;
              })}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Contact Phone *</label>
            <input
              type="text"
              required
              placeholder="Enter phone number"
              value={newStoreForm.phone}
              onChange={(e) => setNewStoreForm({ ...newStoreForm, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">WhatsApp Number *</label>
            <input
              type="text"
              required
              placeholder="Enter WhatsApp number (e.g. 919876543210)"
              value={newStoreForm.whatsapp}
              onChange={(e) => setNewStoreForm({ ...newStoreForm, whatsapp: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Opening Hours / Timing</label>
            <input
              type="text"
              placeholder="10:00 AM - 9:00 PM"
              value={newStoreForm.timing}
              onChange={(e) => setNewStoreForm({ ...newStoreForm, timing: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Full Shop Address *</label>
            <input
              type="text"
              required
              placeholder="Enter full physical shop address"
              value={newStoreForm.address}
              onChange={(e) => setNewStoreForm({ ...newStoreForm, address: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Store Description</label>
          <textarea
            rows="3"
            placeholder="Tell customers about your products and services..."
            value={newStoreForm.description}
            onChange={(e) => setNewStoreForm({ ...newStoreForm, description: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium"
          ></textarea>
        </div>

        <ImageUploader
          label="Store Logo Image"
          values={newStoreForm.image ? [newStoreForm.image] : []}
          onImagesChange={(imgs) => setNewStoreForm({ ...newStoreForm, image: imgs[0] || DEFAULT_STORE_LOGO })}
          aspectRatio="square"
        />

        <ImageUploader
          label="Store Cover Banner"
          values={newStoreForm.banner ? [newStoreForm.banner] : []}
          onImagesChange={(imgs) => setNewStoreForm({ ...newStoreForm, banner: imgs[0] || DEFAULT_COVER_BANNER })}
          aspectRatio="banner"
        />

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="submit"
            disabled={creating}
            className="px-6 py-3 bg-[#056839] hover:bg-emerald-800 text-white font-black text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {creating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Creating Store...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-rocket"></i> Launch Storefront Now
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
