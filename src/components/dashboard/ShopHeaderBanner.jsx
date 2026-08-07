import { Link } from 'react-router-dom';
import { DEFAULT_COVER_BANNER, DEFAULT_STORE_LOGO } from '../../utils/defaultAssets';

export default function ShopHeaderBanner({ shop, onOpenSettings, onAddProduct, onOpenQRCode }) {
  if (!shop) return null;

  const viewCount = shop.viewCount || 0;
  const formatCount = (n) => {
    if (!n) return '0';
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  return (
    <div className="w-full relative overflow-hidden group transition-all duration-300 min-h-[220px] sm:min-h-[260px] md:min-h-[290px] flex flex-col justify-between">

      {/* Background Cover Image */}
      <img
        src={shop.banner || DEFAULT_COVER_BANNER}
        alt={shop.name}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
      />

      {/* Cinematic Multi-Stop Dark Gradient Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          background: 'linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.15) 35%, rgba(0,0,0,0.65) 70%, rgba(0,0,0,0.92) 100%)',
        }}
      />

      {/* ── Top Bar Badges (Floating on Image) ── */}
      <div className="relative z-10 p-3.5 sm:p-5 flex items-center justify-between gap-2.5 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          {shop.verified ? (
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/90 text-white border border-emerald-400/40 text-[11px] font-black inline-flex items-center gap-1.5 shadow-md backdrop-blur-md">
              <i className="fa-solid fa-circle-check text-xs"></i> Verified Store
            </span>
          ) : (
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/90 text-white border border-amber-400/40 text-[11px] font-black inline-flex items-center gap-1.5 backdrop-blur-md shadow-md">
              <i className="fa-solid fa-clock text-xs"></i> Verification Pending
            </span>
          )}

          <span className="px-2.5 py-0.5 rounded-full bg-violet-600/90 text-white border border-violet-400/40 text-[11px] font-black inline-flex items-center gap-1.5 shadow-md backdrop-blur-md">
            <i className="fa-solid fa-eye text-xs"></i> {formatCount(viewCount)} visits
          </span>
        </div>

        <Link
          to={`/shop/${shop.id}`}
          target="_blank"
          className="px-3 py-1 bg-white/20 hover:bg-white/30 text-white border border-white/30 text-[11px] font-black rounded-full transition-all inline-flex items-center gap-1.5 backdrop-blur-md shadow-md"
        >
          <i className="fa-solid fa-arrow-up-right-from-square text-[10px]"></i> Live Preview
        </Link>
      </div>

      {/* ── Bottom Overlay Area (Avatar + Shop Details + Action Buttons) ── */}
      <div className="relative z-10 p-4 sm:p-6 flex flex-col md:flex-row items-start md:items-end justify-between gap-4">

        {/* Left Side: Avatar + Text directly over banner gradient */}
        <div className="flex flex-row items-end gap-3.5 sm:gap-4 min-w-0 flex-1">

          {/* Shop Avatar Logo */}
          <div className="relative flex-shrink-0">
            <img
              src={shop.image || DEFAULT_STORE_LOGO}
              alt={shop.name}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl object-cover border-2 border-white/90 shadow-xl bg-white"
            />
            {shop.verified && (
              <div
                className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#056839] text-white border-2 border-white shadow-md flex items-center justify-center text-[10px] font-black"
                title="Verified Merchant"
              >
                <i className="fa-solid fa-check"></i>
              </div>
            )}
          </div>

          {/* Shop Name & Pills Directly Over Overlay */}
          <div className="min-w-0 flex-1">
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-tight leading-none drop-shadow-md truncate">
              {shop.name}
            </h1>

            {/* Sub-Badges Row */}
            <div className="flex items-center gap-2 mt-2 flex-wrap">
              <span className="bg-white/20 backdrop-blur-md border border-white/30 px-2.5 py-0.5 rounded-lg text-white text-[11px] font-extrabold flex items-center gap-1 shadow-2xs">
                <i className="fa-solid fa-location-dot text-emerald-400 text-[10px]"></i> {shop.market || 'Main Market'}
              </span>

              <span className="bg-white/20 backdrop-blur-md border border-white/30 px-2.5 py-0.5 rounded-lg text-emerald-300 text-[11px] font-extrabold flex items-center gap-1 shadow-2xs">
                <i className="fa-solid fa-tag text-emerald-400 text-[10px]"></i> {shop.category || shop.categoryName || 'General Store'}
              </span>

              {shop.rating && (
                <span className="bg-white/20 backdrop-blur-md border border-white/30 px-2 py-0.5 rounded-lg text-amber-300 text-[11px] font-black flex items-center gap-1 shadow-2xs">
                  <i className="fa-solid fa-star text-amber-400 text-[10px]"></i> {shop.rating}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Right Side: Primary Dashboard Action Buttons */}
        <div className="flex items-center gap-2 w-full md:w-auto pt-2 md:pt-0 border-t md:border-0 border-white/20 flex-wrap sm:flex-nowrap">
          {onOpenQRCode && (
            <button
              type="button"
              onClick={onOpenQRCode}
              className="px-3.5 py-2 bg-white/20 hover:bg-white/30 active:scale-95 text-white border border-white/30 font-extrabold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-md backdrop-blur-md flex-1 md:flex-initial"
            >
              <i className="fa-solid fa-qrcode text-xs"></i>
              <span>QR Code</span>
            </button>
          )}

          <button
            type="button"
            onClick={onOpenSettings}
            className="px-3.5 py-2 bg-white/20 hover:bg-white/30 active:scale-95 text-white font-extrabold text-xs rounded-xl transition-all border border-white/30 flex items-center justify-center gap-1.5 cursor-pointer shadow-md backdrop-blur-md flex-1 md:flex-initial"
          >
            <i className="fa-solid fa-sliders text-xs"></i>
            <span>Settings</span>
          </button>

          <button
            type="button"
            onClick={onAddProduct}
            className="px-4 py-2 bg-[#056839] hover:bg-emerald-600 active:scale-95 text-white font-black text-xs rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-lg shadow-emerald-950/30 border border-emerald-400/40 w-full sm:w-auto"
          >
            <i className="fa-solid fa-plus text-xs"></i>
            <span>Add Product</span>
          </button>
        </div>

      </div>
    </div>
  );
}
