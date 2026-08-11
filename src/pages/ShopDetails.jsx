import {
  ArrowLeft,
  Award,
  Check,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  List,
  Map,
  MapPin,
  PackageOpen,
  Search,
  Share2,
  ShieldCheck,
  Star,
  Store,
  Zap,
} from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import PaginatedProductGrid from '../components/PaginatedProductGrid';
import { useAuth } from '../context/AuthContext';
import { useBazaar } from '../context/BazaarContext';
import { useImageModal } from '../context/ImageModalContext';
import { DEFAULT_COVER_BANNER, DEFAULT_STORE_LOGO } from '../utils/defaultAssets';
import { matchProductSearch } from '../utils/searchUtils';
import { trackView } from '../utils/trackView';

// WhatsApp SVG icon — reusable
const WhatsAppIcon = ({ className = 'w-4 h-4' }) => (
  <svg className={`fill-current ${className}`} viewBox="0 0 24 24">
    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
  </svg>
);

export default function ShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shops, products, openWhatsApp, isShopFollowed, toggleFollowShop } = useBazaar();
  const { userProfile } = useAuth();
  const { openImageModal } = useImageModal();

  const [activeTab, setActiveTab] = useState('catalog');
  const [viewMode, setViewMode] = useState('grid');
  const [inShopSearch, setInShopSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [copied, setCopied] = useState(false);
  const [stickyVisible, setStickyVisible] = useState(false);
  const heroRef = useRef(null);

  // Find shop (must be before tracking effect)
  const currentShopId = id || shops[0]?.id || 'sharma-mobiles';
  const shop = shops.find((s) => s.id === currentShopId) || shops[0];
  const isFollowed = shop && isShopFollowed ? isShopFollowed(shop.id) : false;

  // Track shop visit (session-debounced)
  useEffect(() => {
    if (shop?.id) trackView('shop', shop.id);
  }, [shop?.id]);

  // Sticky mini-header: show after hero scrolls out of view
  useEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;
    const observer = new IntersectionObserver(
      ([entry]) => setStickyVisible(!entry.isIntersecting),
      { threshold: 0, rootMargin: '-64px 0px 0px 0px' }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, [shop?.id]);

  // ── Error states ──
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
          This shop is currently under administrative review or has been delisted.
        </p>
        <Link to="/shops" className="px-5 py-2.5 bg-[#056839] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Explore Verified Stores
        </Link>
      </div>
    );
  }

  // ── Data ──
  const shopProducts = products.filter((p) => p.shopId === shop.id);
  const rawCategories = ['all', ...new Set(shopProducts.map((p) => p.categoryName || p.category))];
  const filteredProducts = shopProducts.filter((p) => {
    const matchesSearch = matchProductSearch(p, inShopSearch);
    const matchesCategory =
      selectedCategory === 'all' || (p.categoryName || p.category) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const shopBanner = shop.banner || shop.bannerImage || DEFAULT_COVER_BANNER;
  const shopLogo   = shop.image  || shop.logoImage  || DEFAULT_STORE_LOGO;

  const viewCount = shop.viewCount || 0;
  const formatCount = (n) => {
    if (!n) return null;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000)    return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  // ── Handlers ──
  const handleWhatsAppContact = () => {
    const whatsappNum = (shop.whatsapp || shop.phone || '').replace(/[^0-9]/g, '');
    const text =
      ` *SHOP INQUIRY - MEENA BAZAAR*\n\n` +
      `• *Shop Name:* ${shop.name}\n` +
      `• *Location:* ${shop.market || 'Local Market'}, ${shop.city || 'Rampur'}\n` +
      `• *Category:* ${shop.categoryName || shop.category || 'Local Shop'}\n` +
      (shop.address ? `• *Address:* ${shop.address}\n` : '') +
      ` *Hello ${shop.name}, I found your shop on Meena Bazaar and would like to inquire about your products.*`;
    window.open(`https://wa.me/${whatsappNum}?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleShareShop = () => {
    if (navigator.share) {
      navigator.share({ title: shop.name, text: `Check out ${shop.name} on Meena Bazaar!`, url: window.location.href }).catch(() => {});
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

  return (
    <div className="w-full">

      {/* ══════════════════════════════════════════════════════
          STICKY MINI-HEADER — appears once hero scrolls away
      ══════════════════════════════════════════════════════ */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          stickyVisible ? 'translate-y-0 opacity-100 pointer-events-auto' : '-translate-y-full opacity-0 pointer-events-none'
        }`}
        style={{ backdropFilter: 'blur(20px)', background: 'rgba(255,255,255,0.92)', borderBottom: '1px solid rgba(0,0,0,0.08)' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between gap-3">
          {/* Left: back + info */}
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="w-8 h-8 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer flex-shrink-0 hover:bg-slate-200 transition-colors"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2]" />
            </button>
            <img src={shopLogo} alt={shop.name} className="w-8 h-8 rounded-xl object-cover flex-shrink-0 border border-slate-200" />
            <div className="min-w-0">
              <p className="font-black text-sm text-slate-900 truncate leading-none">{shop.name}</p>
              <p className="text-[10px] text-slate-400 font-semibold truncate mt-0.5">{shop.category || shop.categoryName || 'General Store'}</p>
            </div>
          </div>

          {/* Right: action buttons */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleWhatsAppContact}
              className="h-8 px-3 rounded-xl bg-[#056839] hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer border-none transition-colors"
            >
              <WhatsAppIcon className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Contact</span>
            </button>
            <button
              type="button"
              onClick={handleShareShop}
              className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center cursor-pointer transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════
          CINEMATIC HERO — full-width cover with overlay
      ══════════════════════════════════════════════════════ */}
      <div ref={heroRef} className="relative w-full overflow-hidden" style={{ height: 'clamp(200px, 26vw, 300px)' }}>

        {/* Cover image — full bleed */}
        <img
          src={shopBanner}
          alt={`${shop.name} cover`}
          className="absolute inset-0 w-full h-full object-cover cursor-zoom-in"
          onClick={() => openImageModal(shopBanner, `${shop.name} Storefront Cover`)}
        />

        {/* Deep gradient overlay — bottom heavy for text legibility */}
        <div
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(to bottom, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.10) 35%, rgba(0,0,0,0.55) 68%, rgba(0,0,0,0.88) 100%)',
          }}
        />

        {/* ── Top bar: back + share ── */}
        <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 sm:px-6 pt-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="w-9 h-9 rounded-2xl flex items-center justify-center cursor-pointer border-none transition-all"
            style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', color: '#fff' }}
          >
            <ArrowLeft className="w-4 h-4 stroke-[2]" />
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleShareShop}
              className="w-9 h-9 rounded-2xl flex items-center justify-center cursor-pointer border-none"
              style={{ background: 'rgba(0,0,0,0.35)', backdropFilter: 'blur(8px)', color: '#fff' }}
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
            </button>
          </div>
        </div>

        {/* ── Bottom overlay content: logo + info + actions ── */}
        <div className="absolute bottom-0 left-0 right-0 z-10 px-4 sm:px-6 lg:px-8 pb-5 pt-10">
          <div className="max-w-7xl mx-auto flex items-end justify-between gap-4">

            {/* LEFT: Logo + text */}
            <div className="flex items-end gap-4 min-w-0 flex-1">

              {/* Shop Logo — elevated ring */}
              <div
                onClick={() => openImageModal(shopLogo, `${shop.name} Logo`)}
                className="flex-shrink-0 cursor-zoom-in rounded-2xl overflow-hidden border-[3px] border-white/30 shadow-xl"
                style={{ width: 'clamp(52px,7vw,72px)', height: 'clamp(52px,7vw,72px)' }}
              >
                <img src={shopLogo} alt={shop.name} className="w-full h-full object-cover" />
              </div>

              {/* Text block */}
              <div className="min-w-0 flex-1 pb-0.5">
                {/* Category label */}
                <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest text-emerald-400 block truncate mb-1">
                  {shop.category || shop.categoryName || 'GENERAL STORE'}
                </span>

                {/* Shop name */}
                <h1 className="font-black text-white leading-none tracking-tight truncate"
                  style={{ fontSize: 'clamp(18px, 3vw, 28px)' }}
                >
                  {shop.name}
                  {shop.verified !== false && (
                    <CheckCircle2 className="inline w-5 h-5 ml-2 text-emerald-400 fill-emerald-400/20 align-middle flex-shrink-0" />
                  )}
                </h1>

                {/* Stats row */}
                <div className="flex items-center gap-3 mt-2 flex-wrap">
                  {/* Rating */}
                  <div className="flex items-center gap-1">
                    <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                    <span className="text-white font-bold text-xs">{shop.rating || '4.5'}</span>
                    <span className="text-white/50 text-[10px] font-medium">({shop.reviewsCount || '0'})</span>
                  </div>

                  <span className="text-white/30 text-xs">·</span>

                  {/* Location */}
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-white/60" />
                    <span className="text-white/80 text-xs font-medium truncate max-w-[160px]">{shop.market || shop.city || 'Rampur'}</span>
                  </div>

                  {/* Products */}
                  {shopProducts.length > 0 && (
                    <>
                      <span className="text-white/30 text-xs">·</span>
                      <span className="text-white/80 text-xs font-medium">{shopProducts.length} Products</span>
                    </>
                  )}

                  {/* Visits */}
                  {viewCount > 0 && (
                    <>
                      <span className="text-white/30 text-xs">·</span>
                      <div className="flex items-center gap-1">
                        <Zap className="w-3 h-3 text-violet-400" />
                        <span className="text-violet-300 text-xs font-bold">{formatCount(viewCount)} visits</span>
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Action buttons — hidden on tiny screens, shown sm+ */}
            <div className="hidden sm:flex flex-col gap-2 flex-shrink-0">
              <button
                type="button"
                onClick={() => toggleFollowShop(shop.id)}
                className={`h-10 px-5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer border-none transition-all ${isFollowed ? 'bg-emerald-100 text-[#056839]' : 'bg-white text-[#056839]'
                  }`}
              >
                <Store className="w-4 h-4" />
                <span>{isFollowed ? 'Following Store' : 'Follow Store'}</span>
              </button>
              <button
                type="button"
                onClick={handleWhatsAppContact}
                className="h-10 px-5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer border-none transition-all"
                style={{ background: '#056839', color: '#fff' }}
              >
                <WhatsAppIcon className="w-4 h-4" />
                Contact Merchant
              </button>
            </div>

          </div>
        </div>
      </div>

      {/* ── Mobile action bar below hero ── */}
      <div className="sm:hidden flex gap-2 px-4 py-3 bg-white border-b border-slate-100">
        <button
          type="button"
          onClick={handleWhatsAppContact}
          className="flex-1 h-10 rounded-2xl bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 cursor-pointer border-none transition-colors"
        >
          <WhatsAppIcon className="w-4 h-4" />
          Contact Merchant
        </button>
        <button
          type="button"
          onClick={handleViewOnMap}
          className="flex-1 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Map className="w-4 h-4 text-[#056839]" />
          Map
        </button>
      </div>

      {/* ══════════════════════════════════════════════════════
          PAGE BODY
      ══════════════════════════════════════════════════════ */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pb-24 flex flex-col lg:flex-row gap-6">

        {/* ── LEFT SIDEBAR (desktop only) ── */}
        <aside className="hidden lg:flex flex-col gap-4 w-64 flex-shrink-0">

          {/* Merchant info */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="font-black text-slate-900 text-sm pb-2 border-b border-slate-100">Merchant Profile</h3>
            <div className="flex items-center gap-3">
              <img src={shopLogo} alt={shop.name} className="w-10 h-10 rounded-xl object-cover border border-slate-100" />
              <div>
                <div className="font-black text-slate-900 text-xs">{shop.name}</div>
                <span className="text-[10px] text-slate-400 font-semibold">Storefront Owner</span>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 leading-relaxed">{shop.description || 'Verified merchant storefront on Meena Bazaar.'}</p>
          </div>

          {/* Business details */}
          <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-3 shadow-sm">
            <h3 className="font-black text-slate-900 text-sm pb-2 border-b border-slate-100">Business Details</h3>
            <div className="flex flex-col gap-2 text-[11px]">
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Timings</span>
                <span className="font-bold text-[#056839]">{shop.timing || '10:00 AM – 09:00 PM'}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold text-slate-400">Market</span>
                <span className="font-bold text-slate-800 truncate max-w-[120px]">{shop.market || 'Civil Lines'}</span>
              </div>
              {shop.phone && (
                <div className="flex justify-between">
                  <span className="font-semibold text-slate-400">Contact</span>
                  <span className="font-bold text-slate-800">{shop.phone}</span>
                </div>
              )}
              {shop.address && (
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-slate-400">Address</span>
                  <span className="font-medium text-slate-600 leading-snug">{shop.address}</span>
                </div>
              )}
            </div>
            <button
              type="button"
              onClick={handleViewOnMap}
              className="w-full py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Map className="w-3.5 h-3.5 text-[#056839]" />
              View on Map
            </button>
          </div>

          {/* Trust badges */}
          <div className="bg-[#f0faf5] border border-emerald-100 rounded-2xl p-4 grid grid-cols-2 gap-3">
            {[
              { icon: ShieldCheck, label: 'Verified', sub: 'Trusted Shop' },
              { icon: Award,        label: 'Quality',  sub: '100% Original' },
              { icon: Zap,          label: 'Fast',     sub: 'Quick Support' },
              { icon: Store,        label: 'Reliable',  sub: 'Local Seller' },
            ].map(({ icon: Icon, label, sub }) => (
              <div key={label} className="flex flex-col items-center text-center gap-1">
                <Icon className="w-4 h-4 text-[#056839]" />
                <strong className="text-[10px] font-extrabold text-slate-900 leading-none">{label}</strong>
                <span className="text-[9px] text-slate-400 font-medium">{sub}</span>
              </div>
            ))}
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">

          {/* Mobile quick-info cards */}
          <div className="lg:hidden grid grid-cols-2 gap-2.5">
            <div className="bg-white border border-slate-100 rounded-2xl p-3.5 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                <Store className="w-3.5 h-3.5 text-[#056839]" />
                Business
              </div>
              <div className="text-[10.5px] space-y-1 text-slate-600">
                <div className="flex justify-between"><span className="text-slate-400">Hours</span><span className="font-bold text-[#056839]">{shop.timing || '10AM-9PM'}</span></div>
                <div className="flex justify-between"><span className="text-slate-400">Market</span><span className="font-bold truncate max-w-[100px]">{shop.market || 'Rampur'}</span></div>
                {shop.phone && <div className="flex justify-between"><span className="text-slate-400">Phone</span><span className="font-bold">{shop.phone}</span></div>}
              </div>
            </div>
            <div className="bg-white border border-slate-100 rounded-2xl p-3.5 space-y-1.5 shadow-sm">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-900">
                <MapPin className="w-3.5 h-3.5 text-[#056839]" />
                Address
              </div>
              <p className="text-[10.5px] text-slate-500 leading-relaxed line-clamp-3">
                {shop.address || `${shop.market || 'Civil Lines'}, Rampur, UP 244901`}
              </p>
              <button type="button" onClick={handleViewOnMap} className="flex items-center gap-1 text-[10.5px] text-[#056839] font-bold cursor-pointer">
                <Map className="w-3 h-3" /> View on Map
              </button>
            </div>
          </div>

          {/* Catalog / About tabs */}
          <div className="flex border-b border-slate-100 gap-6">
            {[
              { key: 'catalog', label: `Catalog (${shopProducts.length})` },
              { key: 'about',   label: 'About Seller' },
            ].map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setActiveTab(key)}
                className={`pb-2.5 font-black text-xs transition-all cursor-pointer border-b-2 bg-transparent whitespace-nowrap ${
                  activeTab === key
                    ? 'border-[#056839] text-[#056839]'
                    : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* ── CATALOG TAB ── */}
          {activeTab === 'catalog' && (
            <div className="space-y-3">
              {/* Search + view toggle */}
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
                  {[
                    { mode: 'grid', Icon: LayoutGrid },
                    { mode: 'list', Icon: List },
                  ].map(({ mode, Icon }) => (
                    <button
                      key={mode}
                      type="button"
                      onClick={() => setViewMode(mode)}
                      className={`p-1.5 rounded-lg text-xs transition-all cursor-pointer ${viewMode === mode ? 'bg-white text-[#056839] shadow-sm' : 'text-slate-400'}`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                    </button>
                  ))}
                </div>
              </div>

              {/* Category chips */}
              <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                {rawCategories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`px-3.5 py-1 rounded-full text-xs font-bold transition-all cursor-pointer whitespace-nowrap flex-shrink-0 ${
                      selectedCategory === cat
                        ? 'bg-[#056839] text-white shadow-sm'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat === 'all' ? 'All Products' : cat}
                  </button>
                ))}
              </div>

              {/* Products */}
              {filteredProducts.length === 0 ? (
                <div className="bg-white border border-slate-100 rounded-2xl p-10 text-center space-y-2">
                  <PackageOpen className="w-8 h-8 text-slate-300 mx-auto" />
                  <h4 className="text-xs font-bold text-slate-800">No products found</h4>
                  <p className="text-[11px] text-slate-400">Try searching for another product or category.</p>
                </div>
              ) : viewMode === 'grid' ? (
                <PaginatedProductGrid
                  products={filteredProducts}
                  initialCount={6}
                  pageSize={6}
                  gridClassName="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-2.5"
                  endMessageText="You've reached the end of products from this store!"
                />
              ) : (
                <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden divide-y divide-slate-100">
                  {filteredProducts.map((prod) => {
                    const img = prod.images?.[0] || prod.image;
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
                        <div className="flex items-center gap-2.5 flex-shrink-0">
                          <div className="text-right">
                            <span className="font-black text-xs text-slate-900 block">₹{prod.price?.toLocaleString('en-IN')}</span>
                            {prod.originalPrice > prod.price && (
                              <span className="text-[10px] text-slate-400 line-through block">₹{prod.originalPrice?.toLocaleString('en-IN')}</span>
                            )}
                          </div>
                          <button
                            type="button"
                            onClick={() => openWhatsApp(prod.id)}
                            className="p-2 bg-[#056839] hover:bg-emerald-800 text-white rounded-xl flex items-center justify-center cursor-pointer border-none transition-colors"
                          >
                            <WhatsAppIcon className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* ── ABOUT TAB ── */}
          {activeTab === 'about' && (
            <div className="bg-white border border-slate-100 rounded-2xl p-5 space-y-4 text-xs leading-relaxed">
              <div>
                <h4 className="font-black text-slate-900 mb-1.5">Store Description</h4>
                <p className="text-slate-500 font-medium">
                  {shop.description || 'Official merchant storefront on Digital Meena Bazaar. Direct WhatsApp ordering available.'}
                </p>
              </div>
              <div className="border-t border-slate-100 pt-3">
                <h4 className="font-black text-slate-900 mb-1.5">Store Policies</h4>
                <ul className="space-y-1.5 text-slate-500 font-medium">
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#056839] flex-shrink-0" /> Direct WhatsApp communication</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#056839] flex-shrink-0" /> In-store pickup & local Rampur delivery</li>
                  <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-[#056839] flex-shrink-0" /> Quality products, trusted merchant</li>
                </ul>
              </div>

              {/* Mobile trust badges in about tab */}
              <div className="lg:hidden border-t border-slate-100 pt-3">
                <h4 className="font-black text-slate-900 mb-3">Why Shop Here</h4>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { icon: ShieldCheck, label: 'Verified Shop',   sub: 'Trusted & Verified' },
                    { icon: Award,        label: 'Quality Products', sub: '100% Original' },
                    { icon: Zap,          label: 'Fast Response',   sub: 'Quick Support' },
                    { icon: Store,        label: 'Safe Shopping',   sub: 'Reliable Merchant' },
                  ].map(({ icon: Icon, label, sub }) => (
                    <div key={label} className="bg-[#f0faf5] border border-emerald-100 rounded-xl p-3 flex flex-col items-center text-center gap-1">
                      <Icon className="w-4 h-4 text-[#056839]" />
                      <strong className="text-[10px] font-extrabold text-slate-900 leading-none">{label}</strong>
                      <span className="text-[9px] text-slate-400 font-medium">{sub}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
