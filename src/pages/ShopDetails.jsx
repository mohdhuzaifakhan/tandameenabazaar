import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import { useAuth } from '../context/AuthContext';
import { useImageModal } from '../context/ImageModalContext';
import { DEFAULT_COVER_BANNER, DEFAULT_STORE_LOGO } from '../utils/defaultAssets';
import ShopProductCard from '../components/ShopProductCard';

export default function ShopDetails() {
  const { id } = useParams();
  const { shops, products, openWhatsApp } = useBazaar();
  const { userProfile } = useAuth();
  const { openImageModal } = useImageModal();
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'about'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'table'
  const [inShopSearch, setInShopSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Find current shop from real state
  const shop = shops.find(s => s.id === id);

  if (!shop) {
    return (
      <div className="w-full py-16 text-center text-slate-400 space-y-4">
        <i className="fa-solid fa-store-slash text-4xl text-slate-300"></i>
        <h2 className="text-lg font-bold text-slate-800">Store Not Found</h2>
        <Link to="/shops" className="px-5 py-2.5 bg-emerald-600 text-white font-bold text-xs rounded-xl inline-block">
          Explore Stores Directory
        </Link>
      </div>
    );
  }

  // Verification Access Control: If store is unverified, only Admin or Store Owner can view it
  const isOwnerOrAdmin = (userProfile?.role === 'admin') || (userProfile?.uid === shop?.ownerUid) || (userProfile?.shopId === shop?.id);

  if (!shop.verified && !isOwnerOrAdmin) {
    return (
      <div className="w-full py-16 px-4 text-center space-y-4 max-w-lg mx-auto animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto shadow-inner border border-amber-200">
          <i className="fa-solid fa-store-slash"></i>
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Storefront Under Verification</h2>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          "{shop.name}" is currently under administrative review or has been delisted by Admin. This storefront and its product catalog are not accessible to public buyers.
        </p>
        <div className="pt-2">
          <Link to="/shops" className="px-5 py-2.5 bg-[#056839] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 transition-colors shadow-sm">
            <i className="fa-solid fa-arrow-left"></i> Explore Verified Stores
          </Link>
        </div>
      </div>
    );
  }

  // Filter real products for this shop
  const shopProducts = products.filter(p => p.shopId === shop.id);
  const shopCategories = ['all', ...new Set(shopProducts.map(p => p.categoryName || p.category))];

  // Filter products by search and category
  const filteredProducts = shopProducts.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(inShopSearch.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(inShopSearch.toLowerCase()));
    const matchesCategory = selectedCategory === 'all' || (p.categoryName || p.category) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleWhatsAppContact = () => {
    const whatsappNum = (shop.whatsapp || shop.phone || '').replace(/[^0-9]/g, '');
    const text = `Hello ${shop.name}, I found your store on Meena Bazaar and would like to inquire about your catalog.`;
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, "_blank");
  };

  const handleShareShop = () => {
    if (navigator.share) {
      navigator.share({
        title: shop.name,
        text: `Check out ${shop.name} on Meena Bazaar!`,
        url: window.location.href,
      }).catch(err => console.log(err));
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert('Storefront link copied to clipboard!');
    }
  };

  const shopBanner = shop.banner || shop.bannerImage || DEFAULT_COVER_BANNER;
  const shopLogo = shop.image || shop.logoImage || DEFAULT_STORE_LOGO;

  return (
    <div className="w-full flex flex-col gap-6 py-4 animate-fade-in">
      
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
        <Link to="/" className="hover:text-emerald-600 transition-colors">Home</Link>
        <i className="fa-solid fa-chevron-right text-[8px]"></i>
        <Link to="/shops" className="hover:text-emerald-600 transition-colors">Shops</Link>
        <i className="fa-solid fa-chevron-right text-[8px]"></i>
        <span className="text-slate-800">{shop.name}</span>
      </div>

      {/* Cover Image Banner */}
      <div 
        onClick={() => openImageModal(shopBanner, `${shop.name} Storefront Cover`)}
        className="h-44 sm:h-56 md:h-72 w-full rounded-2xl bg-slate-900 overflow-hidden relative border border-slate-200 cursor-zoom-in group"
        title="Click to view full cover image"
      >
        <img src={shopBanner} alt={`${shop.name} Cover`} className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
      </div>

      {/* Profile summary card */}
      <div className="bg-white border border-slate-200 rounded-2xl p-4 sm:p-6 -mt-16 md:-mt-24 relative z-10 mx-2 sm:mx-6 md:mx-8 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-5">
          
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-5 items-start sm:items-end">
            {/* Floating Logo */}
            <div 
              onClick={() => openImageModal(shopLogo, `${shop.name} Storefront Logo`)}
              className="w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-2xl bg-white border border-slate-200 overflow-hidden flex-shrink-0 cursor-zoom-in group"
              title="Click to view full logo image"
            >
              <img src={shopLogo} alt={shop.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-black text-slate-900 leading-none tracking-tight">{shop.name}</h1>
                {shop.verified && <i className="fa-solid fa-circle-check text-emerald-600 text-base" title="Verified Store"></i>}
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700 uppercase tracking-wider font-sans">{shop.category || shop.categoryName || 'General Store'}</span>
              
              <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-1 tabular-nums">
                <span className="flex items-center gap-1"><i className="fa-solid fa-star text-amber-500"></i> {shop.rating || 5.0} ★</span>
                <span>&bull;</span>
                <span className="flex items-center gap-1"><i className="fa-solid fa-location-dot text-slate-400"></i> {shop.market || 'Main Market'}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 w-full sm:w-auto">
            <button 
              onClick={handleWhatsAppContact}
              className="flex-1 sm:flex-initial px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border border-emerald-700 shadow-xs"
            >
              <i className="fa-brands fa-whatsapp text-sm"></i> Contact Merchant
            </button>
            <button 
              onClick={handleShareShop}
              className="px-4 py-2.5 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
              title="Share Shop"
            >
              <i className="fa-solid fa-arrow-up-from-bracket"></i>
            </button>
          </div>

        </div>
      </div>

      {/* Main Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 sm:gap-8 mt-2">
        
        {/* Left Side: Merchant Info Sidebar */}
        <aside className="flex flex-col gap-4 sm:gap-6">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Merchant Profile</h3>
            <div className="flex items-center gap-3">
              <img src={shopLogo} alt={shop.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
              <div>
                <div className="font-black text-slate-900 text-xs">{shop.name}</div>
                <span className="text-[10px] text-slate-400 font-semibold">Storefront Owner</span>
              </div>
            </div>
            {shop.description && (
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">{shop.description}</p>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Business Details</h3>
            <div className="flex flex-col gap-2 text-[11px] text-slate-600">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Timings:</span>
                <span className="font-bold text-emerald-700">{shop.timing || '10:00 AM – 09:00 PM'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Market Hub:</span>
                <span className="font-bold text-slate-800">{shop.market || 'Main Market'}</span>
              </div>
              {shop.phone && (
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Contact:</span>
                  <span className="font-bold text-slate-800">{shop.phone}</span>
                </div>
              )}
            </div>
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-3">
            <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Physical Address</h3>
            <p className="text-[11px] text-slate-500 leading-normal">
              <i className="fa-solid fa-location-dot text-emerald-600 mr-1"></i> {shop.address || shop.market || 'Main Market Road'}
            </p>
          </div>
        </aside>

        {/* Right Side: Tab Panel and Catalog */}
        <div className="lg:col-span-3 flex flex-col gap-6">
          {/* Scrollable Navigation Tabs */}
          <div className="flex border-b border-slate-200 gap-4 overflow-x-auto flex-nowrap scrollbar-none pb-0.5">
            <button 
              onClick={() => setActiveTab('products')}
              className={`pb-3 font-bold text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${activeTab === 'products' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Catalog ({shopProducts.length})
            </button>
            <button 
              onClick={() => setActiveTab('about')}
              className={`pb-3 font-bold text-xs border-b-2 transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${activeTab === 'about' ? 'border-emerald-600 text-emerald-700' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              About Seller
            </button>
          </div>

          {/* TAB 1: CATALOG PRODUCTS */}
          {activeTab === 'products' && (
            <div className="flex flex-col gap-5">
              
              {/* Search catalog bar + View Switcher */}
              <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
                <div className="relative flex-1">
                  <i className="fa-solid fa-magnifying-glass absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs"></i>
                  <input 
                    type="text"
                    placeholder="Search inside this store..."
                    value={inShopSearch}
                    onChange={e => setInShopSearch(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-white"
                  />
                </div>

                {/* Grid vs Table View Mode Switcher */}
                <div className="flex items-center gap-1.5 self-end sm:self-auto">
                  <div className="bg-slate-100 p-1 rounded-xl border border-slate-200 flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setViewMode('grid')}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'grid' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="Grid View"
                    >
                      <i className="fa-solid fa-border-all"></i>
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode('table')}
                      className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                        viewMode === 'table' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-500 hover:text-slate-800'
                      }`}
                      title="Table List View"
                    >
                      <i className="fa-solid fa-list text-xs"></i>
                    </button>
                  </div>
                </div>
              </div>

              {/* Scrollable Category Filter Strip */}
              <div className="flex gap-2 overflow-x-auto flex-nowrap scrollbar-none pb-1 -mx-2 px-2 sm:mx-0 sm:px-0">
                {shopCategories.map(cat => (
                  <button 
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === cat ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                    }`}
                  >
                    {cat === 'all' ? 'All Catalog Items' : cat}
                  </button>
                ))}
              </div>

              {/* Display Catalog Items */}
              {filteredProducts.length === 0 ? (
                <div className="text-center py-16 bg-white border border-slate-200 rounded-2xl flex flex-col items-center gap-2">
                  <div className="w-12 h-12 rounded-full bg-slate-50 text-slate-300 flex items-center justify-center text-lg"><i className="fa-solid fa-box-open"></i></div>
                  <h4 className="font-bold text-slate-800 text-xs">No products listed by this store</h4>
                  <p className="text-xs text-slate-400">Items added by this merchant will appear here in real-time.</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-5">
                  {filteredProducts.map(prod => (
                    <ShopProductCard key={prod.id} product={prod} />
                  ))}
                </div>
              ) : (
                /* Compact Mobile-Responsive Product List Table */
                <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden divide-y divide-slate-100">
                  <div className="hidden sm:grid grid-cols-12 gap-4 bg-slate-50 px-4 py-3 text-[11px] font-extrabold text-slate-500 uppercase tracking-wider">
                    <div className="col-span-6">Product Details</div>
                    <div className="col-span-3 text-right">Price</div>
                    <div className="col-span-3 text-right">Inquire</div>
                  </div>

                  {filteredProducts.map(prod => {
                    const img = prod.images && prod.images.length > 0 ? prod.images[0] : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=300';
                    return (
                      <div key={prod.id} className="p-3 sm:p-4 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                        
                        <Link to={`/product/${prod.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                            <img src={img} alt={prod.name} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate hover:text-emerald-600 transition-colors">{prod.name}</h4>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                              <span className="text-[10px] text-slate-400 font-semibold">{prod.categoryName || prod.category}</span>
                              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${prod.stockStatus === 'Out of Stock' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                                {prod.stockStatus || 'In Stock'}
                              </span>
                            </div>
                          </div>
                        </Link>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <span className="font-black text-xs sm:text-sm text-slate-900 block">₹{prod.price?.toLocaleString('en-IN')}</span>
                            {prod.originalPrice > prod.price && (
                              <span className="text-[10px] text-slate-400 line-through">₹{prod.originalPrice?.toLocaleString('en-IN')}</span>
                            )}
                          </div>

                          <button
                            onClick={() => openWhatsApp(prod.id)}
                            className="px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 transition-colors cursor-pointer"
                            title="Inquire on WhatsApp"
                          >
                            <i className="fa-brands fa-whatsapp text-sm"></i>
                            <span className="hidden sm:inline">WhatsApp</span>
                          </button>
                        </div>

                      </div>
                    );
                  })}
                </div>
              )}

            </div>
          )}

          {/* TAB 2: ABOUT SELLER */}
          {activeTab === 'about' && (
            <div className="bg-white border border-slate-200 rounded-2xl p-6 flex flex-col gap-6 leading-relaxed">
              <div>
                <h3 className="font-black text-slate-900 text-sm mb-2">Store Description</h3>
                <p className="text-xs text-slate-500 font-normal leading-relaxed">
                  {shop.description || 'Official merchant storefront on Meena Bazaar. All customer orders are directly coordinated via WhatsApp.'}
                </p>
              </div>
              
              <div className="border-t border-slate-100 pt-4">
                <h3 className="font-black text-slate-900 text-sm mb-3">Merchant Guidelines</h3>
                <ul className="flex flex-col gap-2.5 text-xs text-slate-500 font-normal">
                  <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Direct-to-merchant WhatsApp inquiries.</li>
                  <li className="flex items-center gap-2"><i className="fa-solid fa-check text-emerald-600"></i> Local market store collection and delivery options.</li>
                </ul>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
