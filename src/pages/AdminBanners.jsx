import {
  CheckCircle2,
  Edit2,
  Eye,
  EyeOff,
  Plus,
  Trash2,
  X
} from 'lucide-react';
import { useState } from 'react';
import DashboardLayout from '../components/DashboardLayout';
import { BannerSkeleton } from '../components/Skeletons';
import {
  BANNER_TYPE_OPTIONS,
  COLOR_PALETTES,
  FILTER_TYPE_TABS,
  INITIAL_BANNER_FORM
} from '../constants/bannerConstants';
import { useBazaar } from '../context/BazaarContext';

export default function AdminBanners() {
  const { banners, addBanner, updateBanner, deleteBanner, toggleBannerActive, isDataLoading } = useBazaar();

  const [filterType, setFilterType] = useState('all'); // 'all' | 'special_offer' | 'new_arrival'
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);

  if (isDataLoading) {
    return (
      <DashboardLayout title="Banner Advertisements" role="admin">
        <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
          <BannerSkeleton />
          <BannerSkeleton />
        </div>
      </DashboardLayout>
    );
  }

  const [formData, setFormData] = useState(INITIAL_BANNER_FORM);

  const showToast = (text, type = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenAddModal = () => {
    setEditingBanner(null);
    setFormData(INITIAL_BANNER_FORM);
    setShowModal(true);
  };

  const handleOpenEditModal = (banner) => {
    setEditingBanner(banner);

    // Find theme key
    let foundTheme = 'emerald';
    if (banner.bgColor?.includes('indigo')) foundTheme = 'indigo';
    else if (banner.bgColor?.includes('rose')) foundTheme = 'rose';
    else if (banner.bgColor?.includes('f4efe8') || banner.bgColor?.includes('amber')) foundTheme = 'amber';

    setFormData({
      type: banner.type || 'special_offer',
      tag: banner.tag || 'SPECIAL OFFER',
      title: banner.title || '',
      subtitle: banner.subtitle || '',
      discount: banner.discount || '20% OFF',
      image: banner.image || '',
      themeKey: foundTheme,
      link: banner.link || '/categories',
      active: banner.active !== false
    });
    setShowModal(true);
  };

  const handleSubmitForm = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      showToast('Please enter a banner title.', 'error');
      return;
    }

    const theme = COLOR_PALETTES[formData.themeKey] || COLOR_PALETTES.emerald;
    const bannerPayload = {
      type: formData.type,
      tag: formData.tag.trim() || (formData.type === 'new_arrival' ? 'NEW ARRIVAL' : 'SPECIAL OFFER'),
      title: formData.title.trim(),
      subtitle: formData.subtitle.trim(),
      discount: formData.discount.trim() || '20% OFF',
      image: formData.image.trim() || 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=400&q=80',
      bgColor: theme.bgColor,
      borderColor: theme.borderColor,
      tagColor: theme.tagColor,
      btnBg: theme.btnBg,
      link: formData.link.trim() || '/categories',
      active: formData.active
    };

    if (editingBanner) {
      await updateBanner(editingBanner.id, bannerPayload);
      showToast(`Banner "${formData.title}" updated successfully!`);
    } else {
      await addBanner(bannerPayload);
      showToast(`New banner advertisement created!`);
    }

    setShowModal(false);
  };

  const handleDelete = async (bannerId, title) => {
    if (window.confirm(`Are you sure you want to delete banner "${title}"?`)) {
      await deleteBanner(bannerId);
      showToast(`Banner deleted.`);
    }
  };

  const handleToggleActive = async (bannerId, title) => {
    await toggleBannerActive(bannerId);
    showToast(`Banner visibility toggled for "${title}".`);
  };

  const filteredBanners = banners.filter(b => {
    if (filterType === 'all') return true;
    return b.type === filterType;
  });

  return (
    <DashboardLayout title="Manage Advertisements & Banners" role="admin">

      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-4 left-4 right-4 sm:left-auto sm:right-4 z-50 p-3.5 sm:p-4 rounded-2xl text-xs font-extrabold flex items-center gap-3 border animate-bounce max-w-md mx-auto ${toastMessage.type === 'error'
          ? 'bg-rose-950 text-rose-200 border-rose-800'
          : 'bg-emerald-950 text-emerald-200 border-emerald-800'
          }`}>
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage.text}</span>
        </div>
      )}

      <div className="space-y-5 animate-fade-in pb-12">

        {/* Top Action Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80">
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl font-black text-slate-900 tracking-tight">
                Ads & Banners
              </h1>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#056839] border border-emerald-200 text-[10px] font-black uppercase">
                {banners.length} Banners
              </span>
            </div>
            <p className="text-xs text-slate-500 font-medium mt-0.5">
              Control Special Offer hero sliders and New Arrival promotional banners on the Home page
            </p>
          </div>

          <button
            type="button"
            onClick={handleOpenAddModal}
            className="px-4 py-2.5 rounded-xl bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs inline-flex items-center gap-2 transition-colors cursor-pointer shrink-0 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Create New Banner
          </button>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center gap-2 overflow-x-auto no-scrollbar">
          {FILTER_TYPE_TABS.map((tab) => {
            const count = tab.id === 'all'
              ? banners.length
              : banners.filter(b => b.type === tab.id).length;

            return (
              <button
                key={tab.id}
                onClick={() => setFilterType(tab.id)}
                className={`px-3.5 py-2 rounded-xl text-xs font-extrabold transition-colors cursor-pointer shrink-0 ${filterType === tab.id ? 'bg-[#056839] text-white' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200/80'
                  }`}
              >
                {tab.label} ({count})
              </button>
            );
          })}
        </div>

        {/* Banners Display Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredBanners.map((b) => (
            <div key={b.id} className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-3">
              {/* Banner Live Card Preview */}
              <div className={`${b.bgColor || 'bg-[#eaf5ef]'} ${b.borderColor || 'border-emerald-100'} rounded-2xl p-4 border flex items-center justify-between gap-3 relative overflow-hidden`}>
                <div className="space-y-1 z-10 flex-1 min-w-0">
                  <span className={`text-[9px] font-black ${b.tagColor || 'text-[#056839]'} uppercase tracking-widest block`}>
                    {b.tag || 'PROMOTION'}
                  </span>
                  <h3 className="font-extrabold text-sm sm:text-base text-slate-900 truncate">
                    {b.title}
                  </h3>
                  <p className="text-[11px] text-slate-600 font-medium truncate">
                    {b.subtitle}
                  </p>
                  <span className={`inline-block px-2 py-0.5 rounded-full ${b.btnBg || 'bg-[#056839]'} text-white font-extrabold text-[9px] mt-1`}>
                    {b.discount}
                  </span>
                </div>

                <div className="w-20 h-20 shrink-0 relative flex items-center justify-center">
                  <img
                    src={b.image}
                    alt={b.title}
                    className="w-full h-full object-contain rounded-lg"
                  />
                </div>
              </div>

              {/* Banner Details & Action Controls */}
              <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs font-bold text-slate-600">
                <div className="flex items-center gap-2">
                  <span className="capitalize px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-extrabold">
                    Type: {b.type === 'special_offer' ? 'Special Offer' : 'New Arrival'}
                  </span>

                  <button
                    onClick={() => handleToggleActive(b.id, b.title)}
                    className={`px-2 py-0.5 rounded text-[10px] font-extrabold inline-flex items-center gap-1 cursor-pointer ${b.active !== false
                      ? 'bg-emerald-50 text-[#056839] border border-emerald-200'
                      : 'bg-rose-50 text-rose-600 border border-rose-200'
                      }`}
                  >
                    {b.active !== false ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3" />}
                    <span>{b.active !== false ? 'Active (Live)' : 'Hidden'}</span>
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(b)}
                    className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer"
                    title="Edit Banner"
                  >
                    <Edit2 className="w-3.5 h-3.5" />
                  </button>
                  <button
                    onClick={() => handleDelete(b.id, b.title)}
                    className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-600 cursor-pointer"
                    title="Delete Banner"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* --- CREATE / EDIT BANNER MODAL --- */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl border border-slate-200 max-w-lg w-full p-5 sm:p-6 space-y-4 animate-scale-up my-auto">

            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-lg font-black text-slate-900 tracking-tight">
                {editingBanner ? 'Edit Banner Advertisement' : 'Create New Banner Advertisement'}
              </h2>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmitForm} className="space-y-3.5 text-xs font-bold text-slate-700">

              {/* Placement Type */}
              <div className="space-y-1">
                <label className="block text-slate-900 font-extrabold">Banner Placement Type</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#056839]"
                >
                  {BANNER_TYPE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Title & Tag */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-900 font-extrabold">Banner Title</label>
                  <input
                    type="text"
                    placeholder="e.g. Smartwatch Series 9"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#056839]"
                    required
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-900 font-extrabold">Top Badge Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. SPECIAL OFFER"
                    value={formData.tag}
                    onChange={(e) => setFormData({ ...formData, tag: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#056839]"
                  />
                </div>
              </div>

              {/* Subtitle & Discount */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="block text-slate-900 font-extrabold">Subtitle Description</label>
                  <input
                    type="text"
                    placeholder="e.g. Advanced. Stylish. Connected."
                    value={formData.subtitle}
                    onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#056839]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-slate-900 font-extrabold">Discount Tag</label>
                  <input
                    type="text"
                    placeholder="e.g. 20% OFF"
                    value={formData.discount}
                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#056839]"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-1">
                <label className="block text-slate-900 font-extrabold">Image URL</label>
                <input
                  type="text"
                  placeholder="https://images.unsplash.com/..."
                  value={formData.image}
                  onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#056839]"
                />
              </div>

              {/* Link Destination */}
              <div className="space-y-1">
                <label className="block text-slate-900 font-extrabold">Button Target Route / Link</label>
                <input
                  type="text"
                  placeholder="e.g. /shops?search=smartwatch or /shops?category=fashion"
                  value={formData.link}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-[#056839]"
                />
              </div>

              {/* Color Theme Selector */}
              <div className="space-y-1">
                <label className="block text-slate-900 font-extrabold">Card Theme Palette</label>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(COLOR_PALETTES).map(([key, theme]) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setFormData({ ...formData, themeKey: key })}
                      className={`p-2 rounded-xl border text-left cursor-pointer flex items-center justify-between ${theme.bgColor} ${formData.themeKey === key ? 'ring-2 ring-[#056839] border-[#056839]' : 'border-slate-200'
                        }`}
                    >
                      <span className={`text-[11px] font-extrabold ${theme.tagColor}`}>{theme.name}</span>
                      {formData.themeKey === key && <CheckCircle2 className="w-3.5 h-3.5 text-[#056839]" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Active Toggle */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="activeCheck"
                  checked={formData.active}
                  onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                  className="w-4 h-4 text-[#056839] rounded cursor-pointer"
                />
                <label htmlFor="activeCheck" className="text-slate-900 font-bold cursor-pointer">
                  Publish Banner (Active on Home Screen)
                </label>
              </div>

              {/* Actions */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#056839] hover:bg-emerald-800 text-white font-extrabold"
                >
                  {editingBanner ? 'Save Changes' : 'Create Banner'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
