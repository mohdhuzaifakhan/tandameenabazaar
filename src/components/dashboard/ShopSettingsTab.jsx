import React from 'react';
import ImageUploader from '../ImageUploader';

export default function ShopSettingsTab({
  storeForm,
  setStoreForm,
  handleSaveStoreProfile,
  savingStore,
  categories = [],
  markets = [],
  cities = []
}) {
  return (
    <div className="max-w-4xl bg-white rounded-xl p-2 mx-auto md:p-8 space-y-6">

      <div>
        <h2 className="text-xl font-black text-slate-900">Edit Shop Profile</h2>
        <p className="text-xs text-slate-500 mt-1">Update your shop's profile visible to customers on Meena Bazaar.</p>
      </div>

      <form onSubmit={handleSaveStoreProfile} className="space-y-6">

        {/* Grid 1: Basic Shop Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Shop Name *</label>
            <input
              type="text"
              required
              value={storeForm.name}
              onChange={(e) => setStoreForm({ ...storeForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">City / Region *</label>
            <select
              value={storeForm.city || 'Rampur'}
              onChange={(e) => setStoreForm({ ...storeForm, city: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
            >
              {cities.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Shop Category *</label>
            <select
              value={storeForm.category}
              onChange={(e) => setStoreForm({ ...storeForm, category: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
            >
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Market / Location *</label>
            <select
              value={storeForm.market}
              onChange={(e) => setStoreForm({ ...storeForm, market: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
            >
              {markets.map((m, idx) => {
                const name = typeof m === 'object' ? (m.name || m.id) : m;
                return <option key={idx} value={name}>{name}</option>;
              })}
            </select>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Shop Timings</label>
            <input
              type="text"
              placeholder="e.g. 10:00 AM - 9:00 PM"
              value={storeForm.timing}
              onChange={(e) => setStoreForm({ ...storeForm, timing: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Grid 2: Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone Contact Number</label>
            <input
              type="text"
              value={storeForm.phone}
              onChange={(e) => setStoreForm({ ...storeForm, phone: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1.5">WhatsApp Order Lead Number</label>
            <input
              type="text"
              placeholder="e.g. 919876543210"
              value={storeForm.whatsapp}
              onChange={(e) => setStoreForm({ ...storeForm, whatsapp: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
            />
          </div>
        </div>

        {/* Full Address */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Physical Address</label>
          <input
            type="text"
            placeholder="Shop No., Street, Market Name, City"
            value={storeForm.address}
            onChange={(e) => setStoreForm({ ...storeForm, address: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
          />
        </div>

        {/* Shop Description */}
        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1.5">Shop Description</label>
          <textarea
            rows="3"
            placeholder="Describe your shop specialties, products, and services..."
            value={storeForm.description}
            onChange={(e) => setStoreForm({ ...storeForm, description: e.target.value })}
            className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
          ></textarea>
        </div>

        {/* Shop Image Uploaders */}
        <div className="space-y-4 pt-2 border-t border-slate-100">
          <ImageUploader
            label="Shop Avatar / Logo"
            value={storeForm.image}
            onChange={(url) => setStoreForm({ ...storeForm, image: url })}
            aspectRatio="square"
          />

          <ImageUploader
            label="Shop Cover Banner Image"
            value={storeForm.banner}
            onChange={(url) => setStoreForm({ ...storeForm, banner: url })}
            aspectRatio="banner"
          />
        </div>

        <div className="pt-4 border-t border-slate-100 flex justify-end">
          <button
            type="submit"
            disabled={savingStore}
            className="px-6 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-lg flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {savingStore ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Saving Store...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-floppy-disk"></i> Save Shop Profile
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
}
