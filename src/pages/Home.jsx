import {
  Armchair,
  ArrowRight,
  BookOpen,
  CheckCircle2,
  ChevronRight,
  LayoutGrid,
  PackageOpen,
  Search,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  SlidersHorizontal,
  Smartphone,
  Sparkles,
  Store
} from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ShopCardClean from '../components/ShopCardClean';
import { useBazaar } from '../context/BazaarContext';

export default function Home() {
  const { categories, products, shops, savedProductIds } = useBazaar();
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/shops?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Only shops verified by Admin are published to public users
  const verifiedShops = shops.filter((s) => s.verified !== false);
  const verifiedShopIds = new Set(verifiedShops.map((s) => s.id));

  // Only products from verified shops
  const publicProducts = products.filter((p) => verifiedShopIds.has(p.shopId));

  // Featured products list from verified shops
  const featuredProducts = (
    publicProducts.filter((p) => p.isFeatured).length > 0
      ? publicProducts.filter((p) => p.isFeatured)
      : publicProducts
  ).slice(0, 8);

  // Popular verified shops list
  const popularShops = (
    verifiedShops.filter((s) => (s.rating || 0) >= 4.0).length > 0
      ? verifiedShops.filter((s) => (s.rating || 0) >= 4.0)
      : verifiedShops
  ).slice(0, 5);

  // Category Colors Map matching mockup
  const categoryColors = [
    { bg: 'bg-rose-100/90 text-rose-600', count: '95 Shops', icon: Shirt },
    { bg: 'bg-sky-100/90 text-sky-600', count: '180 Shops', icon: Smartphone },
    { bg: 'bg-purple-100/90 text-purple-600', count: '120 Shops', icon: Sparkles },
    { bg: 'bg-emerald-100/90 text-emerald-700', count: '140 Shops', icon: Armchair },
    { bg: 'bg-amber-100/90 text-amber-600', count: '124 Shops', icon: BookOpen },
    { bg: 'bg-rose-100/90 text-rose-600', count: '85 Shops', icon: ShoppingBag },
    { bg: 'bg-[#eefdf5] text-[#056839]', count: '110 Shops', icon: Store },
    { bg: 'bg-indigo-100/90 text-indigo-600', count: '60 Shops', icon: LayoutGrid },
    { bg: 'bg-slate-100/90 text-slate-600', count: 'More', icon: ChevronRight }
  ];

  return (
    <div className="w-full flex flex-col items-center">

      {/* ────────────────────────────────────────────────────────── */}
      {/* 1. MOBILE VIEW (Visible on screens below md: breakpoint) */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="md:hidden w-full space-y-5 pb-20 pt-2">

        {/* Mobile Search Input */}
        <form onSubmit={handleSearchSubmit} className="relative flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search for shops, products, categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200/80 rounded-2xl text-xs text-slate-800 placeholder:text-slate-400 font-medium outline-none focus:border-[#056839]"
            />
          </div>
          <button
            type="button"
            onClick={() => navigate('/shops')}
            className="p-2.5 rounded-xl border border-slate-200 bg-white text-slate-700 flex items-center justify-center flex-shrink-0 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 stroke-[2]" />
          </button>
        </form>

        {/* Mobile Hero Banner */}
        <div className="relative overflow-hidden rounded-[24px] bg-[#eefdf5] border border-emerald-100 p-5 flex flex-col justify-between min-h-[210px] shadow-2xs">
          <div className="relative z-10 max-w-[200px] flex flex-col gap-2">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[#d5f3e2] text-[#056839] text-[9px] font-extrabold uppercase tracking-wider w-fit">
              <CheckCircle2 className="w-3 h-3 text-[#056839]" />
              <span>LOCAL &bull; VERIFIED &bull; TRUSTED</span>
            </div>

            <h1 className="text-xl font-black text-slate-900 leading-[1.15] tracking-tight">
              Discover the Best <br />
              <span className="text-[#056839] font-serif italic font-normal">Shops &amp; Products</span> <br />
              in Your City
            </h1>

            <p className="text-[10.5px] text-slate-600 font-medium leading-relaxed">
              Verified local shops. Direct WhatsApp orders. Fast &amp; reliable Rampur marketplace.
            </p>

            <Link
              to="/shops"
              className="mt-1 px-4 py-2 rounded-xl bg-[#056839] hover:bg-emerald-800 text-white font-bold text-[11px] inline-flex items-center gap-1.5 transition-all shadow-xs w-fit"
            >
              <span>Explore Shops</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="absolute right-0 bottom-2 w-[165px] pointer-events-none">
            <img src="/hero_shopping_bags.png" alt="Shopping Illustration" className="w-full h-auto object-contain max-h-[155px]" />
          </div>

          {/* <div className="relative z-10 flex items-center justify-center gap-1.5 mt-3 pt-1">
            <span className="w-2 h-2 rounded-full bg-[#056839]" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
            <span className="w-1.5 h-1.5 rounded-full bg-slate-300" />
          </div> */}
        </div>

        {/* Mobile Stats Row */}
        <div className="grid grid-cols-4 gap-2">
          <div className="bg-white rounded-2xl border border-slate-100 p-2 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/90 text-[#056839] flex items-center justify-center mb-1">
              <ShoppingBag className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xs text-slate-900">1,500+</span>
            <span className="text-[9px] text-slate-400 font-semibold">Products</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-2 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-emerald-100/90 text-[#056839] flex items-center justify-center mb-1">
              <Store className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xs text-slate-900">200+</span>
            <span className="text-[9px] text-slate-400 font-semibold">Shops</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-2 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-orange-100/90 text-orange-600 flex items-center justify-center mb-1">
              <LayoutGrid className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xs text-slate-900">15+</span>
            <span className="text-[9px] text-slate-400 font-semibold">Categories</span>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-2 flex flex-col items-center text-center">
            <div className="w-8 h-8 rounded-xl bg-sky-100/90 text-sky-600 flex items-center justify-center mb-1">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-xs text-slate-900">100%</span>
            <span className="text-[9px] text-slate-400 font-semibold">Local</span>
          </div>
        </div>

        {/* Mobile Shop by Categories */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-slate-900">Shop by Categories</h2>
            <Link to="/shops" className="text-xs font-bold text-[#056839] flex items-center gap-0.5">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="flex items-center justify-between gap-1.5 overflow-x-auto pb-1 scrollbar-none">
            {categories.slice(0, 5).map((cat, idx) => {
              const color = categoryColors[idx % categoryColors.length];
              const Icon = color.icon;
              return (
                <Link
                  key={cat.id}
                  to={`/shops?category=${cat.id}`}
                  className="flex flex-col items-center justify-center bg-white border border-slate-100 rounded-2xl p-2 min-w-[70px] flex-1"
                >
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center ${color.bg} mb-1`}>
                    <Icon className="w-4.5 h-4.5" />
                  </div>
                  <span className="text-[11px] font-bold text-slate-900 text-center truncate w-full">{cat.name}</span>
                  <span className="text-[9px] text-slate-400 font-medium text-center truncate w-full">{color.count}</span>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Mobile Featured Products */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-slate-900">Featured Products</h2>
            <Link to="/shops" className="text-xs font-bold text-[#056839] flex items-center gap-0.5">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-6 text-center border border-slate-100 space-y-2">
              <PackageOpen className="w-8 h-8 text-slate-300 mx-auto" />
              <h3 className="text-xs font-bold text-slate-800">No live products listed yet</h3>
              <p className="text-[11px] text-slate-400 max-w-xs mx-auto">
                Sign in to your Shop dashboard to list your products and receive WhatsApp leads.
              </p>
              <Link to="/login" className="px-4 py-2 bg-[#056839] text-white font-bold text-xs rounded-xl inline-block">
                Merchant Login
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-2.5">
              {featuredProducts.slice(0, 4).map((prod) => (
                <div key={prod.id} className="h-full">
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Mobile Nearby Top Rated Shops */}
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <h2 className="font-extrabold text-sm text-slate-900">Nearby Top Rated Shops</h2>
            <Link to="/shops" className="text-xs font-bold text-[#056839] flex items-center gap-0.5">
              <span>View All</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-2.5">
            {popularShops.slice(0, 4).map((shop) => (
              <div key={shop.id} className="h-full">
                <ShopCardClean shop={shop} />
              </div>
            ))}
          </div>
        </section>

      </div>


      {/* ────────────────────────────────────────────────────────── */}
      {/* 2. DESKTOP VIEW (Visible on md: breakpoints & above) */}
      {/* ────────────────────────────────────────────────────────── */}
      <div className="hidden md:flex w-full py-6 flex-col gap-10 animate-fade-in max-w-7xl mx-auto">

        {/* Desktop Hero Banner Section */}
        <section className="relative overflow-hidden rounded-3xl bg-[#f0fdf4] px-8 py-12 lg:px-12 lg:py-14 text-slate-800 border border-emerald-100/70 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xs">
          <div className="relative z-10 max-w-xl flex flex-col gap-4 text-left items-start">

            {/* Badge */}
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100/80 text-[#056839] text-[10px] font-extrabold uppercase tracking-wider font-sans">
              <CheckCircle2 className="w-3.5 h-3.5 text-[#056839]" />
              <span>LOCAL &bull; VERIFIED &bull; TRUSTED</span>
            </span>

            {/* Main Headline */}
            <h1 className="font-display text-4xl lg:text-5xl font-black tracking-tight leading-[1.12] text-slate-900">
              Discover the Best <br />
              <span className="text-[#056839] font-serif italic">Shops &amp; Products</span> <br />
              in Your City
            </h1>

            <p className="text-sm text-slate-600 max-w-md font-medium leading-relaxed">
              Verified local shops. Direct WhatsApp orders. Fast &amp; reliable Rampur marketplace.
            </p>

            {/* Action Callouts */}
            <div className="flex flex-wrap justify-start gap-3 mt-1 w-full">
              <Link
                to="/shops"
                className="px-6 py-3 rounded-xl bg-[#056839] hover:bg-emerald-800 text-white font-bold transition-all flex items-center justify-center gap-2 text-xs tracking-wide shadow-sm"
              >
                <span>Explore Shops</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Desktop Hero Graphic */}
          <div className="relative z-10 flex items-center justify-center w-full lg:w-[420px] flex-shrink-0">
            <div className="relative w-full aspect-[4/3] max-w-[400px] bg-white/90 backdrop-blur-xs rounded-3xl border border-slate-100 p-4 flex items-center justify-center shadow-xs">
              <img
                src="/hero_shopping_bags.png"
                alt="Shopping Banner Illustration"
                className="w-full h-full object-contain drop-shadow-md max-h-[240px]"
              />

              {/* Floating Badge */}
              <div className="absolute bottom-4 left-6 bg-white/95 border border-slate-100 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-xs font-bold text-slate-800 shadow-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-semibold text-slate-900">Verified Hub &bull; Trusted</span>
              </div>
            </div>
          </div>
        </section>

        {/* Desktop Stats Bar Strip */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/90 text-[#056839] flex items-center justify-center text-sm flex-shrink-0">
              <ShoppingBag className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="leading-tight">
              <strong className="font-display text-sm font-extrabold text-slate-900 block tabular-nums">1,500+</strong>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Products</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/90 text-[#056839] flex items-center justify-center text-sm flex-shrink-0">
              <Store className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="leading-tight">
              <strong className="font-display text-sm font-extrabold text-slate-900 block tabular-nums">200+</strong>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Shops</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-orange-100/90 text-orange-600 flex items-center justify-center text-sm flex-shrink-0">
              <LayoutGrid className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="leading-tight">
              <strong className="font-display text-sm font-extrabold text-slate-900 block tabular-nums">15+</strong>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Categories</span>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-3 shadow-2xs">
            <div className="w-10 h-10 rounded-xl bg-sky-100/90 text-sky-600 flex items-center justify-center text-sm flex-shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2]" />
            </div>
            <div className="leading-tight">
              <strong className="font-display text-sm font-extrabold text-slate-900 block tabular-nums">100%</strong>
              <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">Local</span>
            </div>
          </div>
        </div>

        {/* Desktop Shop by Categories Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl md:text-2xl font-bold text-slate-900 leading-snug truncate tracking-tight">Shop by Categories</h2>
              <p className="text-xs text-slate-500 font-medium truncate">Explore curated marketplace categories</p>
            </div>
            <Link to="/shops" className="text-xs font-bold text-[#056839] hover:underline flex items-center gap-1 flex-shrink-0 whitespace-nowrap tracking-wide">
              <span>View All Categories</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-5 lg:grid-cols-9 gap-3">
            {categories.slice(0, 9).map((cat, idx) => {
              const color = categoryColors[idx % categoryColors.length];
              const Icon = color.icon;

              return (
                <Link
                  key={cat.id}
                  to={`/shops?category=${cat.id}`}
                  className="flex flex-col items-center justify-center gap-2 p-3.5 rounded-2xl bg-white border border-slate-100 hover:border-emerald-300 transition-all text-center group flex-shrink-0 shadow-2xs"
                >
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-lg ${color.bg} transition-transform group-hover:scale-110 flex-shrink-0`}>
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <div className="flex flex-col leading-none w-full min-w-0">
                    <span className="font-display text-xs font-bold text-slate-800 group-hover:text-[#056839] transition-colors truncate block">{cat.name}</span>
                    <span className="text-[10px] text-slate-400 font-semibold mt-1 truncate block">{color.count}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* Desktop Featured Products Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl md:text-2xl font-bold text-slate-900 leading-snug truncate tracking-tight">Featured Products</h2>
              <p className="text-xs text-slate-500 font-medium truncate">Handpicked products from trusted local shops</p>
            </div>
            <Link to="/shops" className="text-xs font-bold text-[#056839] hover:underline flex items-center gap-1 flex-shrink-0 whitespace-nowrap tracking-wide">
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {featuredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-10 text-center border border-slate-100 space-y-3">
              <PackageOpen className="w-10 h-10 text-slate-300 mx-auto" />
              <h3 className="text-sm font-bold text-slate-800">No live products listed yet</h3>
              <p className="text-xs text-slate-400 max-w-sm mx-auto">
                Are you a merchant? Sign in to your Shop dashboard to list your products and receive WhatsApp leads.
              </p>
              <Link to="/login" className="px-5 py-2.5 bg-[#056839] hover:bg-emerald-800 text-white font-bold text-xs rounded-xl inline-block transition-colors">
                Merchant Login
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-4 gap-4">
              {featuredProducts.map((prod) => (
                <div key={prod.id} className="h-full">
                  <ProductCard product={prod} />
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Desktop Nearby Top Rated Shops Section */}
        <section className="flex flex-col gap-4">
          <div className="flex items-center justify-between gap-2 min-w-0">
            <div className="min-w-0 flex-1">
              <h2 className="font-display text-xl md:text-2xl font-bold text-slate-900 leading-snug truncate tracking-tight">Nearby Top Rated Shops</h2>
              <p className="text-xs text-slate-500 font-medium truncate">Top rated shops near you in Rampur</p>
            </div>
            <Link to="/shops" className="text-xs font-bold text-[#056839] hover:underline flex items-center gap-1 flex-shrink-0 whitespace-nowrap tracking-wide">
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-4 lg:grid-cols-5 gap-4">
            {popularShops.map((shop) => (
              <div key={shop.id} className="h-full">
                <ShopCardClean shop={shop} />
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}
