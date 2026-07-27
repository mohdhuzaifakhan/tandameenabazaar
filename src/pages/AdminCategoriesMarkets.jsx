import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { DEFAULT_CATEGORY_ICONS as ICON_OPTIONS } from '../constants/appConstants';
import { useBazaar } from '../context/BazaarContext';

export default function AdminCategoriesMarkets() {
  const {
    categories,
    markets,
    addCategory,
    updateCategory,
    deleteCategory,
    addMarket,
    updateMarket,
    deleteMarket
  } = useBazaar();

  const [activeTab, setActiveTab] = useState('categories'); // 'categories' | 'markets'
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  // ── Category Modal State ──
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: '', icon: 'fa-shapes', description: '' });

  // ── Market Modal State ──
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [editingMarket, setEditingMarket] = useState(null);
  const [marketForm, setMarketForm] = useState({ name: '', city: 'Rampur', area: 'Main City Area', description: '' });

  // ── Handlers for Category ──
  const openAddCategoryModal = () => {
    setEditingCategory(null);
    setCategoryForm({ name: '', icon: 'fa-shapes', description: '' });
    setShowCategoryModal(true);
  };

  const openEditCategoryModal = (cat) => {
    setEditingCategory(cat);
    setCategoryForm({ name: cat.name || '', icon: cat.icon || 'fa-shapes', description: cat.description || '' });
    setShowCategoryModal(true);
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    if (!categoryForm.name.trim()) {
      showToast("Please enter a category name.", "error");
      return;
    }

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryForm);
        showToast(`Category "${categoryForm.name}" updated!`);
      } else {
        await addCategory(categoryForm);
        showToast(`Category "${categoryForm.name}" added to system!`);
      }
      setShowCategoryModal(false);
    } catch (err) {
      console.error("Error saving category:", err);
      showToast("Failed to save category.", "error");
    }
  };

  const handleDeleteCategory = async (cat) => {
    if (window.confirm(`Are you sure you want to delete category "${cat.name}"?`)) {
      await deleteCategory(cat.id);
      showToast(`Category "${cat.name}" deleted.`);
    }
  };

  // ── Handlers for Market / Location ──
  const openAddMarketModal = () => {
    setEditingMarket(null);
    setMarketForm({ name: '', city: 'Rampur', area: 'Main City Area', description: '' });
    setShowMarketModal(true);
  };

  const openEditMarketModal = (mkt) => {
    const marketObj = typeof mkt === 'string' ? { id: mkt.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: mkt, city: 'Rampur', area: 'Main Area' } : mkt;
    setEditingMarket(marketObj);
    setMarketForm({
      name: marketObj.name || '',
      city: marketObj.city || 'Rampur',
      area: marketObj.area || 'Main Area',
      description: marketObj.description || ''
    });
    setShowMarketModal(true);
  };

  const handleSaveMarket = async (e) => {
    e.preventDefault();
    if (!marketForm.name.trim()) {
      showToast("Please enter a market/location name.", "error");
      return;
    }

    try {
      if (editingMarket) {
        await updateMarket(editingMarket.id, marketForm);
        showToast(`Location "${marketForm.name}" updated!`);
      } else {
        await addMarket(marketForm);
        showToast(`Location "${marketForm.name}" added to system!`);
      }
      setShowMarketModal(false);
    } catch (err) {
      console.error("Error saving market:", err);
      showToast("Failed to save market location.", "error");
    }
  };

  const handleDeleteMarket = async (mkt) => {
    const name = typeof mkt === 'string' ? mkt : mkt.name;
    const id = typeof mkt === 'string' ? mkt.toLowerCase().replace(/[^a-z0-9]+/g, '-') : mkt.id;

    if (window.confirm(`Are you sure you want to delete market location "${name}"?`)) {
      await deleteMarket(id);
      showToast(`Market location "${name}" deleted.`);
    }
  };

  return (
    <DashboardLayout title="Categories & Locations Management" role="admin">

      {/* Toast Feedback */}
      {toastMessage && (
        <div className={`fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-2xl text-xs font-extrabold flex items-center gap-3 border animate-bounce ${toastMessage.type === 'error'
          ? 'bg-rose-950 text-rose-200 border-rose-800'
          : 'bg-emerald-950 text-emerald-200 border-emerald-800'
          }`}>
          <i className={`fa-solid ${toastMessage.type === 'error' ? 'fa-circle-xmark text-rose-400' : 'fa-circle-check text-emerald-400'} text-base`}></i>
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="flex flex-col gap-6 md:gap-8 animate-fade-in pb-12">

        {/* Header & Tabs */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-black text-slate-900">Taxonomy & Location Control</h1>
            <p className="text-xs text-slate-500 mt-0.5">Manage categories and market locations.</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('categories')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'categories'
                ? 'bg-[#056839] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              <i className="fa-solid fa-tags"></i> Categories ({categories.length})
            </button>

            <button
              onClick={() => setActiveTab('markets')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${activeTab === 'markets'
                ? 'bg-[#056839] text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
            >
              <i className="fa-solid fa-location-dot"></i> Market Locations ({markets.length})
            </button>
          </div>
        </div>

        {/* ───────────────────────────────────────────────────────────── */}
        {/* TAB 1: CATEGORIES MANAGEMENT */}
        {/* ───────────────────────────────────────────────────────────── */}
        {activeTab === 'categories' && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-extrabold text-slate-900">
                  Product Categories
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  All categories available for shops and product catalog listings
                </p>
              </div>

              <button
                onClick={openAddCategoryModal}
                className="shrink-0 inline-flex items-center gap-2 rounded-xl bg-[#056839] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-800 cursor-pointer"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Add Category</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {categories.map((cat) => (
                <div key={cat.id} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between gap-3 group">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-emerald-50 text-[#056839] flex items-center justify-center text-lg font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                        <i className={`fa-solid ${cat.icon || 'fa-shapes'}`}></i>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 truncate">{cat.name}</h4>
                        <span className="text-[10px] text-slate-400 font-mono block">ID: {cat.id}</span>
                      </div>
                    </div>
                  </div>

                  {cat.description && (
                    <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{cat.description}</p>
                  )}

                  <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                    <button
                      onClick={() => openEditCategoryModal(cat)}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <i className="fa-solid fa-pen text-[10px]"></i> Edit
                    </button>
                    <button
                      onClick={() => handleDeleteCategory(cat)}
                      className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <i className="fa-solid fa-trash-can text-[10px]"></i> Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {/* TAB 2: MARKETS & LOCATIONS MANAGEMENT */}
        {activeTab === 'markets' && (
          <div className="space-y-6">
            <div className="flex items-start justify-between gap-6">
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-extrabold text-slate-900">
                  Locations
                </h3>
                <p className="mt-1 text-xs text-slate-500 leading-relaxed">
                  All registered locations
                </p>
              </div>

              <button
                onClick={openAddMarketModal}
                className="shrink-0 inline-flex items-center justify-center gap-2 rounded-xl bg-[#056839] px-4 py-2.5 text-xs font-bold text-white shadow-sm transition-all hover:bg-emerald-800 cursor-pointer"
              >
                <i className="fa-solid fa-plus"></i>
                <span>Add Location</span>
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              {markets.map((mkt, idx) => {
                const marketObj = typeof mkt === 'string' ? { id: mkt.toLowerCase().replace(/[^a-z0-9]+/g, '-'), name: mkt, city: 'Rampur', area: 'Main Area' } : mkt;

                return (
                  <div key={marketObj.id || idx} className="bg-white rounded-2xl p-4 border border-slate-100 shadow-2xs hover:border-emerald-300 transition-all flex flex-col justify-between gap-3 group">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center text-lg font-bold flex-shrink-0 group-hover:scale-110 transition-transform">
                        <i className="fa-solid fa-location-dot"></i>
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-sm text-slate-900 truncate">{marketObj.name}</h4>
                        <span className="text-[11px] text-slate-500 font-semibold">{marketObj.city || 'Rampur'} &bull; {marketObj.area || 'Main Market'}</span>
                      </div>
                    </div>

                    {marketObj.description && (
                      <p className="text-[11px] text-slate-500 line-clamp-2 leading-relaxed">{marketObj.description}</p>
                    )}

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-50">
                      <button
                        onClick={() => openEditMarketModal(marketObj)}
                        className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <i className="fa-solid fa-pen text-[10px]"></i> Edit
                      </button>
                      <button
                        onClick={() => handleDeleteMarket(marketObj)}
                        className="px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold text-[11px] transition-colors flex items-center gap-1 cursor-pointer"
                      >
                        <i className="fa-solid fa-trash-can text-[10px]"></i> Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>

      {/* ── Category Modal Form ── */}
      {showCategoryModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-up border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">
                {editingCategory ? 'Edit Category' : 'Add New Category'}
              </h3>
              <button
                onClick={() => setShowCategoryModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Electronics & Gadgets"
                  value={categoryForm.name}
                  onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium bg-slate-50"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">FontAwesome Icon</label>
                <div className="grid grid-cols-6 gap-2 p-2 bg-slate-50 rounded-xl border border-slate-200 max-h-32 overflow-y-auto">
                  {ICON_OPTIONS.map(icon => (
                    <button
                      key={icon}
                      type="button"
                      onClick={() => setCategoryForm({ ...categoryForm, icon })}
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-sm transition-all cursor-pointer ${categoryForm.icon === icon
                        ? 'bg-[#056839] text-white shadow-xs'
                        : 'bg-white text-slate-600 hover:bg-slate-200'
                        }`}
                    >
                      <i className={`fa-solid ${icon}`}></i>
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Short summary of items under this category..."
                  value={categoryForm.description}
                  onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium bg-slate-50"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowCategoryModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-sm"
                >
                  {editingCategory ? 'Update Category' : 'Create Category'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ── Market / Location Modal Form ── */}
      {showMarketModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4 animate-scale-up border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-black text-slate-900 text-base">
                {editingMarket ? 'Edit Location' : 'Add New Market Location'}
              </h3>
              <button
                onClick={() => setShowMarketModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center text-sm cursor-pointer"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            <form onSubmit={handleSaveMarket} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Market Location Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Civil Lines Market"
                  value={marketForm.name}
                  onChange={(e) => setMarketForm({ ...marketForm, name: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium bg-slate-50"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">City Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Rampur"
                    value={marketForm.city}
                    onChange={(e) => setMarketForm({ ...marketForm, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium bg-slate-50"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1">Area / District</label>
                  <input
                    type="text"
                    placeholder="e.g. Central Area"
                    value={marketForm.area}
                    onChange={(e) => setMarketForm({ ...marketForm, area: e.target.value })}
                    className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium bg-slate-50"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
                <textarea
                  rows="2"
                  placeholder="Short description of this commercial market area..."
                  value={marketForm.description}
                  onChange={(e) => setMarketForm({ ...marketForm, description: e.target.value })}
                  className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 font-medium bg-slate-50"
                ></textarea>
              </div>

              <div className="pt-2 flex items-center justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowMarketModal(false)}
                  className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-xs rounded-xl cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl cursor-pointer shadow-sm"
                >
                  {editingMarket ? 'Update Location' : 'Create Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
