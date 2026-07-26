import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import { useAuth } from '../context/AuthContext';
import { useImageModal } from '../context/ImageModalContext';
import { DEFAULT_COVER_BANNER, DEFAULT_STORE_LOGO } from '../utils/defaultAssets';
import ProductCard from '../components/ProductCard';
import {
  ArrowLeft,
  ShoppingBag,
  Heart,
  Share2,
  ChevronRight,
  Star,
  MapPin,
  CheckCircle2,
  ShieldCheck,
  Award,
  Zap,
  Store,
  Search,
  LayoutGrid,
  List,
  Map,
  PackageOpen,
  Check
} from 'lucide-react';

export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shops, products, openWhatsApp } = useBazaar();
  const { userProfile } = useAuth();
  const { openImageModal } = useImageModal();
  const [activeTab, setActiveTab] = useState('catalog'); // 'catalog' | 'about'
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [inShopSearch, setInShopSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copied, setCopied] = useState(false);

  // Find current shop from real state
  const currentShopId = id || shops[0]?.id || 'sharma-mobiles';
  const shop = shops.find((s) => s.id === currentShopId) || shops[0];

  if (!shop) {
    return (
      <div className="w-full py-16 text-center text-slate-400 space-y-4">
        <PackageOpen className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Store Not Found</h2>
        <Link to="/shops" className="px-5 py-2.5 bg-[#056839] text-white font-bold text-xs rounded-xl inline-block">
          Explore Stores Directory
        </Link>
      </div>
    );
  }

  // Verification Access Control: If store is unverified, only Admin or Store Owner can view it
  const isOwnerOrAdmin =
    userProfile?.role === 'admin' ||
    userProfile?.uid === shop?.ownerUid ||
    userProfile?.shopId === shop?.id;

  if (shop && !shop.verified && !isOwnerOrAdmin) {
    return (
      <div className="w-full py-16 px-4 text-center space-y-4 max-w-lg mx-auto animate-fade-in">
        <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center text-2xl mx-auto border border-amber-200">
          <PackageOpen className="w-8 h-8" />
        </div>
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Storefront Under Verification</h2>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          "{shop.name}" is currently under administrative review or has been delisted by Admin.
        </p>
        <div className="pt-2">
          <Link
            to="/shops"
            className="px-5 py-2.5 bg-[#056839] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Explore Verified Stores
          </Link>
        </div>
      </div>
    );
  }

  // Filter real products for this shop
  const shopProducts = products.filter((p) => p.shopId === shop.id);
  const rawCategories = ['all', ...new Set(shopProducts.map((p) => p.categoryName || p.category))];

  // Filter products by search and category
  const filteredProducts = shopProducts.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(inShopSearch.toLowerCase()) ||
      (p.brand && p.brand.toLowerCase().includes(inShopSearch.toLowerCase()));
    const matchesCategory =
      selectedCategory === 'all' || (p.categoryName || p.category) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleWhatsAppContact = () => {
    const whatsappNum = (shop.whatsapp || shop.phone || '').replace(/[^0-9]/g, '');
    const text = `Hello ${shop.name}, I found your store on Meena Bazaar and would like to inquire about your catalog.`;
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareShop = () => {
    if (navigator.share) {
      navigator.share({
        title: shop.name,
        text: `Check out ${shop.name} on Digital Meena Bazaar!`,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleViewOnMap = () => {
    const query = encodeURIComponent(`${shop.name}, ${shop.address || shop.market}, Rampur, Uttar Pradesh`);
    window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, '_blank');
  };

  const shopBanner = shop.banner || shop.bannerImage || DEFAULT_COVER_BANNER;
  const shopLogo = shop.image || shop.logoImage || DEFAULT_STORE_LOGO;

  return (
    <div className="w-full flex flex-col items-center">
      
      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. MOBILE VIEW (Visible on screens below md: breakpoint) */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="md:hidden w-full space-y-4 pb-20 pt-2">
        
        {/* Mobile Navigation Sub-Bar: Back Button & Breadcrumbs & Share Button */}
        <div className="flex items-center justify-between gap-2 py-1">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-8.5 h-8.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-700 cursor-pointer flex-shrink-0"
            title="Go Back"
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
          </button>

          {/* Breadcrumb Trail */}
          <div className="flex items-center gap-1 text-[10.5px] text-slate-400 font-semibold overflow-x-auto whitespace-nowrap scrollbar-none flex-1 px-1">
            <Link to="/" className="hover:text-[#056839]">Home</Link>
            <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
            <Link to="/shops" className="hover:text-[#056839]">Shops</Link>
            <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
            <span className="text-slate-800 font-bold truncate max-w-[140px]">{shop.name}</span>
          </div>

          <button
            type="button"
            onClick={handleShareShop}
            className="w-8.5 h-8.5 rounded-2xl border border-slate-200/80 bg-white flex items-center justify-center text-slate-700 cursor-pointer flex-shrink-0"
            title="Share Store"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4 text-slate-700" />}
          </button>
        </div>

        {/* Mobile Store Cover Banner */}
        <div
          onClick={() => openImageModal(shopBanner, `${shop.name} Storefront Cover`)}
          className="h-44 w-full rounded-[24px] bg-slate-900 overflow-hidden relative border border-slate-200/80 cursor-zoom-in group shadow-2xs"
        >
          <img src={shopBanner} alt={`${shop.name} Cover`} className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/50 via-transparent to-transparent" />
        </div>

        {/* Mobile Floating White Store Profile Card */}
        <div className="bg-white border border-slate-100/90 rounded-3xl p-4 sm:p-5 -mt-14 relative z-10 mx-1 sm:mx-3 shadow-xs space-y-4">
          <div className="flex items-start gap-3.5">
            {/* Store Logo Thumbnail */}
            <div
              onClick={() => openImageModal(shopLogo, `${shop.name} Logo`)}
              className="w-18 h-18 rounded-2xl bg-white border border-slate-100 overflow-hidden flex-shrink-0 cursor-zoom-in shadow-2xs"
            >
              <img src={shopLogo} alt={shop.name} className="w-full h-full object-cover" />
            </div>

            {/* Store Header Details */}
            <div className="flex flex-col gap-0.5 min-w-0 flex-1">
              <div className="flex items-center gap-1.5 min-w-0">
                <h1 className="font-black text-lg text-slate-900 truncate">{shop.name}</h1>
                {shop.verified !== false && (
                  <CheckCircle2 className="w-4 h-4 text-[#056839] fill-[#056839]/10 flex-shrink-0" />
                )}
              </div>

              <span className="text-[10px] font-black text-[#056839] uppercase tracking-wider block font-sans truncate">
                {shop.category || shop.categoryName || 'GENERAL STORE'}
              </span>

              {/* Rating & Address Row with Truncation Protection */}
              <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold mt-1 min-w-0 max-w-full flex-wrap">
                <div className="flex items-center gap-1 text-slate-700 font-bold flex-shrink-0">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500 flex-shrink-0" />
                  <span>{shop.rating || '4.5'}</span>
                  <span className="text-slate-400 font-normal">({shop.reviewsCount || '120'} Reviews)</span>
                </div>

                <span className="text-slate-300 flex-shrink-0">|</span>

                <div className="flex items-center gap-1 text-slate-500 min-w-0 flex-1 overflow-hidden">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                  <span className="truncate text-[11px] font-medium block min-w-0">{shop.market || shop.address || 'Rampur'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons Row */}
          <div className="flex gap-2 pt-1">
            <button
              type="button"
              onClick={handleWhatsAppContact}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs border-none whitespace-nowrap"
            >
              <svg className="w-4 h-4 fill-current text-white flex-shrink-0" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>Contact Merchant</span>
            </button>

            <button
              type="button"
              onClick={handleShareShop}
              className="flex-1 py-2.5 px-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-slate-800 font-extrabold text-xs flex items-center justify-center gap-2 hover:bg-slate-100 transition-all cursor-pointer whitespace-nowrap"
            >
              <Share2 className="w-4 h-4 text-slate-700 flex-shrink-0" />
              <span>Share Store</span>
            </button>
          </div>
        </div>

        {/* Mobile Trust Badges Bar (4 Pills Row) */}
        <div className="grid grid-cols-4 gap-1 sm:gap-2 bg-[#f8faf9] border border-emerald-100/60 rounded-2xl p-2.5 sm:p-3 text-center shadow-2xs">
          <div className="flex flex-col items-center justify-center text-center">
            <ShieldCheck className="w-4 h-4 text-[#056839] mb-1" />
            <strong className="text-[9.5px] sm:text-[10.5px] font-extrabold text-slate-900 block leading-tight truncate w-full">Verified Shop</strong>
            <span className="text-[8px] sm:text-[9.5px] text-slate-400 font-medium block truncate w-full">Trusted &amp; Verified</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <Award className="w-4 h-4 text-[#056839] mb-1" />
            <strong className="text-[9.5px] sm:text-[10.5px] font-extrabold text-slate-900 block leading-tight truncate w-full">Quality Products</strong>
            <span className="text-[8px] sm:text-[9.5px] text-slate-400 font-medium block truncate w-full">100% Original</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <Zap className="w-4 h-4 text-[#056839] mb-1" />
            <strong className="text-[9.5px] sm:text-[10.5px] font-extrabold text-slate-900 block leading-tight truncate w-full">Fast Response</strong>
            <span className="text-[8px] sm:text-[9.5px] text-slate-400 font-medium block truncate w-full">Quick Support</span>
          </div>

          <div className="flex flex-col items-center justify-center text-center">
            <ShieldCheck className="w-4 h-4 text-[#056839] mb-1" />
            <strong className="text-[9.5px] sm:text-[10.5px] font-extrabold text-slate-900 block leading-tight truncate w-full">Safe Shopping</strong>
            <span className="text-[8px] sm:text-[9.5px] text-slate-400 font-medium block truncate w-full">Secure Payments</span>
          </div>
        </div>

        {/* Mobile Merchant Profile Section */}
        <div className="space-y-2.5">
          <h2 className="text-xs font-black text-slate-900 uppercase tracking-wider">
            Merchant Profile
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            <div className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
              <img src={shopLogo} alt={shop.name} className="w-11 h-11 rounded-xl object-cover border border-slate-100 flex-shrink-0" />
              <p className="text-[11px] text-slate-600 font-medium leading-relaxed line-clamp-3">
                {shop.description || 'Original brands, local essentials, grooming kits, and quality products direct from Rampur.'}
              </p>
            </div>

            <div className="bg-[#eefdf5] border border-emerald-100 rounded-2xl p-3.5 flex items-center gap-3 shadow-2xs">
              <div className="w-10 h-10 rounded-2xl bg-[#056839] text-white flex items-center justify-center flex-shrink-0">
                <Store className="w-5 h-5 text-white" />
              </div>
              <div className="leading-tight min-w-0">
                <strong className="text-xs font-extrabold text-[#056839] block truncate">Storefront Owner</strong>
                <span className="text-[10.5px] text-slate-500 font-medium block mt-0.5">Joined May 2023</span>
              </div>
            </div>
          </div>
        </div>

        {/* Mobile Business Details & Store Address Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          {/* Card 1: Business Details */}
          <div className="bg-white border border-slate-100 rounded-2xl p-3.5 space-y-2 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <Store className="w-4 h-4 text-[#056839]" />
              <h3 className="text-xs font-black text-slate-900">Business Details</h3>
            </div>

            <div className="space-y-1.5 text-[10.5px]">
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Timings</span>
                <span className="text-[#056839] font-extrabold">{shop.timing || '10:00 AM - 09:00 PM'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Market Hub</span>
                <span className="text-slate-800 font-bold truncate max-w-[140px]">{shop.market || 'Civil Lines'}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400 font-medium">Contact</span>
                <span className="text-slate-800 font-bold truncate max-w-[140px]">{shop.phone || '+91 98765 43217'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Store Address */}
          <div className="bg-white border border-slate-100 rounded-2xl p-3.5 space-y-2 shadow-2xs flex flex-col justify-between">
            <div className="flex items-center gap-1.5 pb-1 border-b border-slate-100">
              <MapPin className="w-4 h-4 text-[#056839]" />
              <h3 className="text-xs font-black text-slate-900">Store Address</h3>
            </div>

            <p className="text-[10.5px] text-slate-500 font-medium leading-relaxed line-clamp-2">
              {shop.address || `${shop.market || 'Civil Lines'}, Rampur, Uttar Pradesh - 244901`}
            </p>

            <button
              type="button"
              onClick={handleViewOnMap}
              className="w-full py-2 rounded-xl border border-slate-200/80 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-[10.5px] flex items-center justify-center gap-1.5 cursor-pointer transition-all mt-1"
            >
              <Map className="w-3.5 h-3.5 text-[#056839]" />
              <span>View on Map</span>
            </button>
          </div>
        </div>

        {/* Mobile Catalog & About Seller Tabs */}
        <div className="space-y-3 pt-2">
          <div className="flex border-b border-slate-100 gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('catalog')}
              className={`pb-2.5 font-black text-xs transition-all cursor-pointer border-b-2 bg-transparent ${
                activeTab === 'catalog' ? 'border-[#056839] text-[#056839]' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              Catalog ({shopProducts.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('about')}
              className={`pb-2.5 font-black text-xs transition-all cursor-pointer border-b-2 bg-transparent ${
                activeTab === 'about' ? 'border-[#056839] text-[#056839]' : 'border-transparent text-slate-400 hover:text-slate-600'
              }`}
            >
              About Seller
            </button>
          </div>

          {activeTab === 'catalog' && (
            <div className="space-y-3">
              {/* Search in Store + View Switcher */}
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search products in this store..."
                    value={inShopSearch}
                    onChange={(e) => setInShopSearch(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-slate-50 border border-slate-200/80 rounded-xl text-xs outline-none focus:border-[#056839]"
                  />
                </div>

                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200/60">
                  <button
                    type="button"
                    onClick={() => setViewMode('grid')}
                    className={`p-1 rounded-lg text-xs transition-all cursor-pointer ${
                      viewMode === 'grid' ? 'bg-white text-[#056839] shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    <LayoutGrid className="w-3.5 h-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewMode('list')}
                    className={`p-1 rounded-lg text-xs transition-all cursor-pointer ${
                      viewMode === 'list' ? 'bg-white text-[#056839] shadow-2xs' : 'text-slate-500'
                    }`}
                  >
                    <List className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Dynamic Category Chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {rawCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-[#056839] text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Products' : cat}
                  </button>
                ))}
              </div>

              {/* Products Display */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-8 text-center space-y-2">
                  <PackageOpen className="w-8 h-8 text-slate-300 mx-auto" />
                  <h4 className="text-xs font-bold text-slate-800">No products found</h4>
                  <p className="text-[11px] text-slate-400">Try searching for another product name or category.</p>
                </div>
              ) : viewMode === 'grid' ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {filteredProducts.map((prod) => (
                    <div key={prod.id} className="h-full">
                      <ProductCard product={prod} />
                    </div>
                  ))}
                </div>
              ) : (
                /* List View */
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
                  {filteredProducts.map((prod) => {
                    const img = prod.images && prod.images.length > 0 ? prod.images[0] : prod.image;
                    return (
                      <div key={prod.id} className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50/80 transition-colors">
                        <Link to={`/product/${prod.id}`} className="flex items-center gap-3 min-w-0 flex-1">
                          <div className="w-12 h-12 rounded-xl bg-slate-100 overflow-hidden flex-shrink-0 border border-slate-100">
                            <img src={img} alt={prod.name} className="w-full h-full object-cover" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs text-slate-900 truncate hover:text-[#056839] transition-colors">{prod.name}</h4>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">{prod.brand || shop.name}</span>
                          </div>
                        </Link>

                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="text-right">
                            <span className="font-black text-xs text-slate-900 block">₹{prod.price?.toLocaleString('en-IN')}</span>
                            {prod.originalPrice > prod.price && (
                              <span className="text-[10px] text-slate-400 line-through block">₹{prod.originalPrice?.toLocaleString('en-IN')}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => openWhatsApp(prod.id)}
                            className="p-2 bg-[#056839] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl flex items-center justify-center cursor-pointer border-none"
                            title="Order on WhatsApp"
                          >
                            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
                              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                            </svg>
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'about' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-4 text-xs space-y-3 leading-relaxed">
              <div>
                <h4 className="font-bold text-slate-900 mb-1">Store Description</h4>
                <p className="text-slate-500 font-medium">
                  {shop.description || 'Official merchant storefront on Digital Meena Bazaar. Direct WhatsApp ordering.'}
                </p>
              </div>

              <div className="border-t border-slate-100 pt-3">
                <h4 className="font-bold text-slate-900 mb-1">Store Policies</h4>
                <ul className="space-y-1.5 text-slate-500 font-medium">
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#056839]" /> Direct WhatsApp communication</li>
                  <li className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-[#056839]" /> In-store pickup &amp; local Rampur delivery</li>
                </ul>
              </div>
            </div>
          )}
        </div>

      </div>


      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. DESKTOP VIEW (Visible on md: breakpoints & above) */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex w-full py-6 flex-col gap-6 animate-fade-in max-w-7xl mx-auto">
        
        {/* Desktop Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <Link to="/" className="hover:text-[#056839] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/shops" className="hover:text-[#056839] transition-colors">Shops</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-bold">{shop.name}</span>
        </div>

        {/* Desktop Banner Image */}
        <div
          onClick={() => openImageModal(shopBanner, `${shop.name} Storefront Cover`)}
          className="h-56 md:h-72 w-full rounded-3xl bg-slate-900 overflow-hidden relative border border-slate-200 cursor-zoom-in group shadow-xs"
        >
          <img src={shopBanner} alt={`${shop.name} Cover`} className="w-full h-full object-cover opacity-85 group-hover:scale-105 transition-transform duration-500" />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        </div>

        {/* Desktop Profile Summary Card */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 -mt-24 relative z-10 mx-6 shadow-xs">
          <div className="flex flex-row items-end justify-between gap-5">
            <div className="flex items-end gap-5 min-w-0 flex-1">
              <div
                onClick={() => openImageModal(shopLogo, `${shop.name} Logo`)}
                className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white border border-slate-200 overflow-hidden flex-shrink-0 cursor-zoom-in shadow-2xs"
              >
                <img src={shopLogo} alt={shop.name} className="w-full h-full object-cover" />
              </div>

              <div className="flex flex-col gap-1 min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <h1 className="font-display text-2xl md:text-3xl font-black text-slate-900 leading-none tracking-tight truncate">{shop.name}</h1>
                  {shop.verified !== false && <CheckCircle2 className="w-5 h-5 text-[#056839] fill-[#056839]/10 flex-shrink-0" />}
                </div>
                <span className="text-[11px] font-extrabold text-[#056839] uppercase tracking-wider font-sans">{shop.category || shop.categoryName || 'GENERAL STORE'}</span>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-1 tabular-nums min-w-0 max-w-full flex-wrap">
                  <span className="flex items-center gap-1 flex-shrink-0"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {shop.rating || '4.5'} ★</span>
                  <span className="flex-shrink-0">&bull;</span>
                  <span className="flex items-center gap-1 min-w-0 flex-1 overflow-hidden"><MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" /> <span className="truncate">{shop.market || 'Rampur'}</span></span>
                </div>
              </div>
            </div>

            <div className="flex gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={handleWhatsAppContact}
                className="px-5 py-3 rounded-xl bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer border-none shadow-xs"
              >
                <svg className="w-4.5 h-4.5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Contact Merchant</span>
              </button>
              <button
                type="button"
                onClick={handleShareShop}
                className="px-4 py-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center gap-2 cursor-pointer"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Desktop Main Grid */}
        <div className="grid grid-cols-4 gap-8 mt-2">
          
          {/* Desktop Left Sidebar */}
          <aside className="flex flex-col gap-6">
            <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col gap-3 shadow-2xs">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Merchant Profile</h3>
              <div className="flex items-center gap-3">
                <img src={shopLogo} alt={shop.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
                <div>
                  <div className="font-black text-slate-900 text-xs">{shop.name}</div>
                  <span className="text-[10px] text-slate-400 font-semibold">Storefront Owner</span>
                </div>
              </div>
              <p className="text-[11px] text-slate-500 leading-relaxed font-normal">{shop.description || 'Verified merchant storefront.'}</p>
            </div>

            <div className="bg-white border border-slate-100 rounded-2xl p-5 flex flex-col gap-3 shadow-2xs">
              <h3 className="font-bold text-slate-900 text-sm pb-2 border-b border-slate-100">Business Details</h3>
              <div className="flex flex-col gap-2 text-[11px]">
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Timings:</span>
                  <span className="font-bold text-[#056839]">{shop.timing || '10:00 AM – 09:00 PM'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Market Hub:</span>
                  <span className="font-bold text-slate-800">{shop.market || 'Civil Lines'}</span>
                </div>
                {shop.phone && (
                  <div className="flex justify-between">
                    <span className="font-semibold text-slate-400">Contact:</span>
                    <span className="font-bold text-slate-800">{shop.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </aside>

          {/* Desktop Right Catalog Section */}
          <div className="col-span-3 flex flex-col gap-6">
            <div className="flex border-b border-slate-100 gap-6">
              <button
                type="button"
                onClick={() => setActiveTab('catalog')}
                className={`pb-3 font-bold text-xs border-b-2 transition-all cursor-pointer border-none bg-transparent ${
                  activeTab === 'catalog' ? 'border-[#056839] text-[#056839]' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                Catalog ({shopProducts.length})
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('about')}
                className={`pb-3 font-bold text-xs border-b-2 transition-all cursor-pointer border-none bg-transparent ${
                  activeTab === 'about' ? 'border-[#056839] text-[#056839]' : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                About Seller
              </button>
            </div>

            {activeTab === 'catalog' && (
              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search inside this store..."
                      value={inShopSearch}
                      onChange={(e) => setInShopSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 border border-slate-200/80 rounded-xl text-xs outline-none focus:border-[#056839] bg-white"
                    />
                  </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-1">
                  {rawCategories.map((cat) => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border ${
                        selectedCategory === cat ? 'bg-[#056839] border-[#056839] text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      {cat === 'all' ? 'All Catalog Items' : cat}
                    </button>
                  ))}
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="text-center py-16 bg-white border border-slate-100 rounded-2xl space-y-2">
                    <PackageOpen className="w-10 h-10 text-slate-300 mx-auto" />
                    <h4 className="font-bold text-slate-800 text-xs">No products found</h4>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {filteredProducts.map((prod) => (
                      <ProductCard key={prod.id} product={prod} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'about' && (
              <div className="bg-white border border-slate-100 rounded-2xl p-6 space-y-4 text-xs text-slate-500">
                <h3 className="font-black text-slate-900 text-sm">Store Description</h3>
                <p>{shop.description || 'Official merchant storefront.'}</p>
              </div>
            )}
          </div>

        </div>

      </div>

    </div>
  );
}
