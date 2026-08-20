import {
  Activity,
  ArrowLeft,
  Award,
  Battery,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  Droplets,
  Heart,
  PackageOpen,
  PhoneCall,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Star,
  Store
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { ProductDetailsSkeleton } from '../components/Skeletons';
import { useAuth } from '../context/AuthContext';
import { useBazaar } from '../context/BazaarContext';
import { useImageModal } from '../context/ImageModalContext';
import { trackView } from '../utils/trackView';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { products, shops, isProductSaved, toggleSaveProduct, openWhatsApp, isDataLoading } = useBazaar();
  const { userProfile } = useAuth();
  const { openImageModal } = useImageModal();

  const currentProductId = id || products[0]?.id || 'samsung-m16-5g';
  const product = products.find((p) => p.id === currentProductId);
  const shop = shops.find((s) => s.id === product?.shopId) || shops[0];

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [activeTab, setActiveTab] = useState('desc');
  const [readMore, setReadMore] = useState(false);
  const [copied, setCopied] = useState(false);
  const touchStartX = useRef(null);

  // Scroll to top immediately whenever product ID changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
    if (product) {
      setActiveImageIndex(0);
      setActiveTab('desc');
      setReadMore(false);
      // Track this product page view (session-debounced, silent on error)
      trackView('product', product.id);
    }
  }, [id, product?.id]);

  if (isDataLoading) {
    return <ProductDetailsSkeleton />;
  }

  if (!product) {
    return (
      <div className="w-full py-16 text-center text-slate-400 space-y-4">
        <PackageOpen className="w-12 h-12 text-slate-300 mx-auto" />
        <h2 className="text-lg font-bold text-slate-800">Product Not Found</h2>
        <p className="text-xs text-slate-500">The product you are looking for is unavailable or has been removed.</p>
        <Link to="/shops" className="px-5 py-2.5 bg-[#056839] text-white font-bold text-xs rounded-xl inline-block">
          Explore Products &amp; Stores
        </Link>
      </div>
    );
  }

  // Verification Access Control: Block public access if merchant storefront is unverified
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
        <h2 className="text-xl font-black text-slate-900 tracking-tight">Product Unavailable</h2>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">
          The merchant storefront listing this product is currently under admin verification or delisted.
        </p>
        <div className="pt-2">
          <Link
            to="/shops"
            className="px-5 py-2.5 bg-[#056839] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl inline-flex items-center gap-2 transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" /> Explore Active Stores
          </Link>
        </div>
      </div>
    );
  }

  // Real images array from product data
  const images = product.images && product.images.length > 0 ? product.images : [product.image || 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=600'];
  const activeImage = images[activeImageIndex] || images[0];

  const handlePrevImage = () => {
    setActiveImageIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setActiveImageIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) {
      if (diff > 0) handleNextImage();
      else handlePrevImage();
    }
    touchStartX.current = null;
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: product.name,
        text: `Check out ${product.name} on Meena Bazaar`,
        url: window.location.href,
      }).catch(() => { });
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const saved = isProductSaved(product.id);

  // Case-insensitive & normalized category & shop related products
  const currentCategory = (product.category || product.categoryName || '').toLowerCase().trim();
  const currentShopId = product.shopId;

  const sameCategoryProducts = products.filter((p) => {
    if (p.id === product.id) return false;
    const cat = (p.category || p.categoryName || '').toLowerCase().trim();
    return Boolean(cat && currentCategory && (cat === currentCategory || cat.includes(currentCategory) || currentCategory.includes(cat)));
  });

  const sameShopProducts = products.filter((p) => {
    if (p.id === product.id) return false;
    if (sameCategoryProducts.some((c) => c.id === p.id)) return false;
    return Boolean(currentShopId && p.shopId === currentShopId);
  });

  const relatedProducts = [...sameCategoryProducts, ...sameShopProducts].slice(0, 8);

  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  // Highlights icons mapping
  const highlightIcons = [PhoneCall, Activity, Droplets, Battery, Sparkles, Award];

  return (
    <div className="w-full max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8 flex flex-col items-center">

      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. MOBILE VIEW (Visible on screens below md: breakpoint) */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="md:hidden w-full space-y-4 pb-28 pt-3">

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
            <Link to={`/shop/${shop?.id}`} className="hover:text-[#056839] truncate max-w-[90px]">{shop?.name || 'Store'}</Link>
            <ChevronRight className="w-3 h-3 text-slate-300 flex-shrink-0" />
            <span className="text-slate-800 font-bold truncate max-w-[110px]">{product.name}</span>
          </div>
        </div>

        {/* Mobile Product Gallery Carousel */}
        <div className="space-y-3">
          <div
            className="relative aspect-[4/3] rounded-[24px] bg-slate-50 border border-slate-100 overflow-hidden select-none cursor-zoom-in shadow-2xs"
            onTouchStart={onTouchStart}
            onTouchEnd={onTouchEnd}
            onClick={() => openImageModal(activeImage, product.name)}
          >
            {/* Top Left Discount Badge */}
            {hasDiscount && (
              <span className="absolute top-3 left-3 bg-[#ff3b30] text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-md z-10">
                {discountPercent}% OFF
              </span>
            )}

            {/* Top Right Best Seller Badge */}
            {(product.badge || product.isFeatured) && (
              <span className="absolute top-3 right-3 bg-white text-slate-900 font-black text-[10px] px-2.5 py-1 rounded-md z-10 flex items-center gap-1 shadow-2xs">
                <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                <span>{product.badge || 'BEST SELLER'}</span>
              </span>
            )}

            {/* Slider Navigation Arrows */}
            {images.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                  className="absolute left-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow-xs border border-slate-100 cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-white/90 text-slate-700 flex items-center justify-center shadow-xs border border-slate-100 cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </>
            )}

            {/* Counter Badge Bottom Right */}
            <span className="absolute bottom-3 right-3 bg-white/90 text-slate-900 font-extrabold text-[11px] px-2.5 py-1 rounded-lg z-10 shadow-2xs">
              {activeImageIndex + 1} / {images.length}
            </span>

            <img
              src={activeImage}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Dynamic Thumbnails Strip */}
          {images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => setActiveImageIndex(idx)}
                  className={`w-14 h-14 aspect-square rounded-2xl overflow-hidden border-2 cursor-pointer transition-all bg-slate-50 flex-shrink-0 ${activeImageIndex === idx ? 'border-[#056839] ring-2 ring-[#056839]/20' : 'border-slate-100'
                    }`}
                >
                  <img src={img} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Real Product Metadata */}
        <div className="space-y-1">
          <span className="text-[11px] font-black text-[#056839] uppercase tracking-wider block font-sans">
            {product.brand || 'Local Brand'}
          </span>
          <h1 className="font-black text-2xl text-slate-900 tracking-tight leading-snug">
            {product.name}
          </h1>

          {/* Rating & Sold Row */}
          <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold pt-1 flex-wrap">
            <div className="flex items-center gap-1 text-slate-600">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-bold text-slate-900">{product.rating || '4.5'}</span>
              <span className="text-slate-400">({product.reviewsCount || '120'} Reviews)</span>
            </div>

            <span className="text-slate-300">|</span>

            <div className="flex items-center gap-1 text-slate-600">
              <ShoppingBag className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-bold text-slate-800">{product.soldCount || '210'} Sold</span>
            </div>

            {(product.viewCount || 0) > 0 && (
              <>
                <span className="text-slate-300">|</span>
                <div className="flex items-center gap-1 text-violet-600">
                  <Activity className="w-3.5 h-3.5 text-violet-400" />
                  <span className="font-bold">
                    {product.viewCount >= 1000
                      ? `${(product.viewCount / 1000).toFixed(1)}k`
                      : product.viewCount} views
                  </span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Real Price & Warranty Card Box */}
        <div className="bg-white border border-slate-100 rounded-2xl p-4 flex items-center justify-between shadow-2xs">
          <div>
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-black text-slate-900">
                ₹{product.price?.toLocaleString('en-IN')}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-xs text-slate-400 line-through font-medium">
                    ₹{product.originalPrice?.toLocaleString('en-IN')}
                  </span>
                  <span className="bg-rose-100 text-rose-600 font-extrabold text-[10px] px-2 py-0.5 rounded-md">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>
            <span className="text-[10.5px] text-slate-400 font-medium block mt-0.5">
              Inclusive of all taxes
            </span>
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-100">
            <ShieldCheck className="w-6 h-6 text-[#056839]" />
            <div className="leading-tight">
              <strong className="text-xs font-extrabold text-slate-900 block">1 Year</strong>
              <span className="text-[10px] text-slate-400 font-semibold block">Warranty</span>
            </div>
          </div>
        </div>

        {/* Mobile Inline Action Buttons (Save & WhatsApp Order) */}
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => toggleSaveProduct(product.id)}
            className={`w-full py-3 rounded-2xl border font-extrabold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${saved
                ? 'bg-rose-50 border-rose-200 text-rose-600'
                : 'bg-white border-slate-200/80 text-slate-800 hover:bg-slate-50'
              }`}
          >
            <Heart className={`w-4 h-4 ${saved ? 'fill-rose-600 text-rose-600' : ''}`} />
            <span>{saved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            type="button"
            onClick={() => openWhatsApp(product.id)}
            className="w-full py-3 rounded-2xl bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer border-none"
          >
            <svg className="w-4 h-4 fill-current text-white" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span>WhatsApp</span>
          </button>
        </div>

        {/* Real "AVAILABLE AT STORE" Section */}
        {shop && (
          <div className="space-y-2">
            <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
              AVAILABLE AT STORE
            </h2>

            <div
              onClick={() => navigate(`/shop/${shop.id}`)}
              className="bg-white border border-slate-100 rounded-2xl p-3.5 flex items-center justify-between cursor-pointer hover:border-emerald-300 transition-all shadow-2xs"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-2xl bg-emerald-100/90 text-[#056839] flex items-center justify-center flex-shrink-0">
                  <Store className="w-5 h-5 stroke-[2]" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 truncate group-hover:text-[#056839] transition-colors">
                    {shop.name}
                  </h3>
                  <span className="text-[10.5px] text-slate-400 font-medium block truncate mt-0.5">
                    {shop.address || shop.market}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                <span className="px-2 py-1 rounded-lg bg-amber-50 text-amber-600 text-xs font-extrabold flex items-center gap-1">
                  <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                  {shop.rating || '4.5'}
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          </div>
        )}

        {/* Real Product HIGHLIGHTS Section */}
        <div className="space-y-2.5">
          <h2 className="text-[11px] font-extrabold uppercase tracking-wider text-slate-800">
            HIGHLIGHTS
          </h2>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {product.highlights && product.highlights.length > 0 ? (
              product.highlights.map((item, idx) => {
                const Icon = highlightIcons[idx % highlightIcons.length];
                return (
                  <div
                    key={idx}
                    className="bg-white border border-slate-100 rounded-2xl p-2.5 flex items-center gap-2 shadow-2xs"
                  >
                    <div className="w-7.5 h-7.5 rounded-full bg-slate-100 text-[#056839] flex items-center justify-center flex-shrink-0">
                      <Icon className="w-3.5 h-3.5 stroke-[2]" />
                    </div>
                    <span className="text-[10.5px] font-bold text-slate-800 leading-tight truncate">
                      {item}
                    </span>
                  </div>
                );
              })
            ) : (
              <>
                <div className="bg-white border border-slate-100 rounded-2xl p-2.5 flex items-center gap-2 shadow-2xs">
                  <div className="w-7.5 h-7.5 rounded-full bg-slate-100 text-[#056839] flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-800 leading-tight truncate">100% Genuine</span>
                </div>
                <div className="bg-white border border-slate-100 rounded-2xl p-2.5 flex items-center gap-2 shadow-2xs">
                  <div className="w-7.5 h-7.5 rounded-full bg-slate-100 text-[#056839] flex items-center justify-center flex-shrink-0">
                    <ShieldCheck className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-[10.5px] font-bold text-slate-800 leading-tight truncate">Verified Shop</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Dynamic Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="space-y-2.5 pt-2">
            <div className="flex justify-between items-baseline">
              <h2 className="text-xs font-black uppercase tracking-wider text-slate-900">
                Related Products
              </h2>
              <Link to="/categories" className="text-xs font-bold text-[#056839] hover:underline flex items-center gap-0.5">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              {relatedProducts.map((prod) => (
                <div key={prod.id} className="h-full">
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          </section>
        )}

      </div>


      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. DESKTOP VIEW (Visible on md: breakpoints & above) */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex w-full py-6 flex-col gap-8 animate-fade-in max-w-7xl mx-auto">

        {/* Desktop Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <Link to="/" className="hover:text-[#056839] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to="/shops" className="hover:text-[#056839] transition-colors">Shops</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <Link to={`/shop/${shop?.id}`} className="hover:text-[#056839] transition-colors">{shop?.name}</Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-800 font-bold line-clamp-1">{product.name}</span>
        </div>

        {/* Main product display split columns */}
        <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">

          {/* LEFT COLUMN: Gallery */}
          <div className="flex flex-col gap-4">
            <div
              className="w-full aspect-[4/3] sm:aspect-square md:h-[460px] rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center relative overflow-hidden cursor-zoom-in select-none group shadow-2xs"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
              onClick={() => openImageModal(activeImage, product.name)}
              title="Click to view fullscreen photo"
            >
              {hasDiscount && (
                <span className="absolute top-4 left-4 z-10 px-3 py-1 bg-[#ff3b30] text-white font-extrabold text-xs uppercase tracking-wide rounded-md shadow-sm">
                  {discountPercent}% OFF
                </span>
              )}
              {(product.badge || product.isFeatured) && (
                <span className="absolute top-4 right-4 z-10 px-3 py-1 bg-white text-slate-900 font-black text-xs uppercase tracking-wide rounded-md shadow-2xs flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span>{product.badge || 'BEST SELLER'}</span>
                </span>
              )}

              {/* Slider Navigation Arrows */}
              {images.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handlePrevImage(); }}
                    className="absolute left-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center shadow-md border border-slate-100 transition-all cursor-pointer"
                    title="Previous Image"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); handleNextImage(); }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 z-10 w-9 h-9 rounded-full bg-white/80 hover:bg-white text-slate-700 flex items-center justify-center shadow-md border border-slate-100 transition-all cursor-pointer"
                    title="Next Image"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </>
              )}

              <img
                src={activeImage}
                alt={product.name}
                className="w-full h-full object-cover transition-all duration-300"
              />
            </div>

            {/* Thumbnail Strip (Desktop) */}
            {images.length > 1 && (
              <div className="flex gap-3 overflow-x-auto pb-1 mt-1">
                {images.map((img, idx) => (
                  <button
                    key={idx}
                    type="button"
                    className={`w-16 h-16 rounded-xl bg-slate-50 border-2 overflow-hidden flex-shrink-0 cursor-pointer transition-all ${activeImageIndex === idx ? 'border-[#056839]' : 'border-slate-100 hover:border-slate-200'}`}
                    onClick={() => setActiveImageIndex(idx)}
                  >
                    <img src={img} alt={`Thumbnail ${idx + 1}`} className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Info */}
          <div className="flex flex-col gap-6">
            <div>
              <span className="text-[11px] font-extrabold text-[#056839] uppercase tracking-widest font-sans">{product.brand || 'Local Brand'}</span>
              <h1 className="font-display text-2xl md:text-3.5xl font-black tracking-tight text-slate-900 mt-1 leading-tight">{product.name}</h1>

              <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold mt-2.5 tabular-nums flex-wrap">
                <span className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /> {product.rating || '4.5'} ({product.reviewsCount || '120'} Reviews)</span>
                <span>&bull;</span>
                <span className="text-slate-800">{product.soldCount || '210'} Sold</span>
                {(product.viewCount || 0) > 0 && (
                  <>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1 text-violet-600 font-bold">
                      <Activity className="w-3.5 h-3.5 text-violet-400" />
                      {product.viewCount >= 1000
                        ? `${(product.viewCount / 1000).toFixed(1)}k`
                        : product.viewCount} views
                    </span>
                  </>
                )}
              </div>
            </div>


            {/* Pricing Box */}
            <div className="p-4 bg-emerald-50/60 border border-emerald-100/50 rounded-2xl flex items-baseline gap-2.5 w-fit min-w-[200px]">
              <span className="text-3xl font-extrabold text-[#056839] tabular-nums">₹{product.price.toLocaleString('en-IN')}</span>
              {hasDiscount && (
                <>
                  <span className="text-xs text-slate-400 line-through tabular-nums font-medium">₹{product.originalPrice.toLocaleString('en-IN')}</span>
                  <span className="px-2 py-0.5 bg-rose-500 text-white font-bold text-[9px] uppercase tracking-wider rounded font-sans">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Available at Shop box */}
            {shop && (
              <div className="p-5 border border-slate-100 rounded-2xl bg-white flex justify-between items-center shadow-2xs">
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Available at Store</span>
                  <div className="flex items-center gap-1">
                    <Link to={`/shop/${shop.id}`} className="font-display text-sm font-bold text-[#056839] hover:underline flex items-center gap-1">
                      {shop.name}
                      <ChevronRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                  <span className="text-xs text-slate-500 font-medium">{shop.address}</span>
                </div>
                <div className="px-3 py-1.5 bg-slate-50 border border-slate-100 rounded-lg text-xs font-bold text-slate-700 flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" /> {shop.rating}
                </div>
              </div>
            )}

            {/* Product Highlights Grid */}
            <div className="flex flex-col gap-3">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Product Highlights</h4>
              <ul className="flex flex-col gap-2.5 text-xs text-slate-600 font-medium">
                {product.highlights && product.highlights.length > 0 ? (
                  product.highlights.map((h, i) => (
                    <li key={i} className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#056839]" /> {h}</li>
                  ))
                ) : (
                  <>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#056839]" /> Premium quality local product</li>
                    <li className="flex items-center gap-2"><CheckCircle2 className="w-4 h-4 text-[#056839]" /> Inquire directly with seller on WhatsApp</li>
                  </>
                )}
              </ul>
            </div>

            {/* CTA Buttons (Desktop) */}
            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => openWhatsApp(product.id)}
                className="flex-1 py-3.5 bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-sm border-none"
              >
                <svg className="w-4.5 h-4.5 fill-current text-white" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                </svg>
                <span>Order on WhatsApp</span>
              </button>

              <button
                type="button"
                onClick={() => toggleSaveProduct(product.id)}
                className={`px-6 py-3.5 border border-slate-200 hover:bg-slate-50 font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors ${saved ? 'text-rose-500 bg-rose-50/20' : 'text-slate-700 bg-white'}`}
              >
                <Heart className={`w-4 h-4 ${saved ? 'fill-rose-500 text-rose-500' : ''}`} />
                <span>{saved ? 'Saved' : 'Save Product'}</span>
              </button>
            </div>
          </div>

        </div>

        {/* Desktop Tabs description and specifications */}
        <section className="mt-8 flex flex-col gap-6">
          <div className="flex border-b border-slate-100 gap-6">
            <button
              type="button"
              onClick={() => setActiveTab('desc')}
              className={`pb-3 font-bold text-xs border-b-2 transition-all cursor-pointer border-none bg-transparent ${activeTab === 'desc' ? 'border-[#056839] text-[#056839]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Description
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('specs')}
              className={`pb-3 font-bold text-xs border-b-2 transition-all cursor-pointer border-none bg-transparent ${activeTab === 'specs' ? 'border-[#056839] text-[#056839]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Specifications
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 font-bold text-xs border-b-2 transition-all cursor-pointer border-none bg-transparent ${activeTab === 'reviews' ? 'border-[#056839] text-[#056839]' : 'border-transparent text-slate-400 hover:text-slate-600'}`}
            >
              Reviews ({product.reviewsCount || '120'})
            </button>
          </div>

          <div className="bg-white border border-slate-100 rounded-3xl p-6 text-xs md:text-sm leading-relaxed text-slate-500 shadow-2xs">
            {activeTab === 'desc' && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-2 flex flex-col gap-3">
                  <p>{readMore ? product.description : `${(product.description || '').substring(0, 160)}...`}</p>
                  <button
                    type="button"
                    onClick={() => setReadMore(!readMore)}
                    className="w-fit text-xs font-bold text-[#056839] hover:underline flex items-center gap-1 cursor-pointer bg-transparent border-none"
                  >
                    {readMore ? 'Read Less' : 'Read More'}
                  </button>
                </div>

                <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100 flex flex-col gap-3 h-fit">
                  <div className="font-bold text-slate-800 text-[11px] uppercase tracking-wider">Product Info</div>
                  <table className="w-full text-left text-[11px]">
                    <tbody>
                      <tr className="border-b border-slate-100"><td className="py-2 text-slate-400 font-semibold">Brand</td><td className="py-2 text-slate-800 font-bold">{product.brand || 'Generic'}</td></tr>
                      <tr className="border-b border-slate-100"><td className="py-2 text-slate-400 font-semibold">Condition</td><td className="py-2 text-slate-800 font-bold">New</td></tr>
                      <tr className="border-b border-slate-100"><td className="py-2 text-slate-400 font-semibold">Availability</td><td className="py-2 text-emerald-600 font-bold">In Stock</td></tr>
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'specs' && (
              <div>
                {product.specifications && Object.keys(product.specifications).length > 0 ? (
                  <table className="w-full text-left text-xs max-w-xl">
                    <tbody>
                      {Object.entries(product.specifications).map(([key, val]) => (
                        <tr key={key} className="border-b border-slate-50">
                          <td className="py-3 px-4 font-bold text-slate-400 w-44 bg-slate-50/50">{key}</td>
                          <td className="py-3 px-4 text-slate-800 font-semibold">{val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p>No specifications available.</p>
                )}
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="flex flex-col gap-4">
                <div className="border-b border-slate-50 pb-4">
                  <div className="flex justify-between items-center text-xs">
                    <strong className="text-slate-800">Amit Saxena</strong>
                    <span className="text-amber-500 font-bold flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-500" /> 5.0</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-normal">"Excellent product quality. Contacted the merchant via WhatsApp and collected it from the Shop in Gandhi Market."</p>
                </div>
                <div>
                  <div className="flex justify-between items-center text-xs">
                    <strong className="text-slate-800">Rohan Kumar</strong>
                    <span className="text-amber-500 font-bold flex items-center gap-1"><Star className="w-3.5 h-3.5 fill-amber-500" /> 4.5</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-2 font-normal">"Original packaging and warranty terms matched exactly. Great experience shopping locally."</p>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Dynamic Related Products Grid */}
        {relatedProducts.length > 0 && (
          <section className="flex flex-col gap-6 mt-4">
            <div className="flex justify-between items-baseline">
              <h2 className="text-xl font-black text-slate-900">Related Products</h2>
              <Link to="/categories" className="text-xs font-bold text-[#056839] hover:underline flex items-center gap-1">
                <span>View All</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
              {relatedProducts.map((prod) => (
                <ProductCard key={prod.id} product={prod} />
              ))}
            </div>
          </section>
        )}

      </div>

    </div>
  );
}
