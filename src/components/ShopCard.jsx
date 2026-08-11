import React from 'react';
import { ArrowRight, CheckCircle2, Eye, MapPin, MessageCircle, Star, Store, ZoomIn } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import { useImageModal } from '../context/ImageModalContext';
import { DEFAULT_COVER_BANNER, DEFAULT_STORE_LOGO } from '../utils/defaultAssets';

export default function ShopCard({ shop }) {
  if (!shop) return null;

  const navigate = useNavigate();
  const { openImageModal } = useImageModal();
  const { isShopFollowed, toggleFollowShop, products } = useBazaar();

  const isFollowed = isShopFollowed ? isShopFollowed(shop.id) : false;
  const shopProductsCount = products ? products.filter(p => p.shopId === shop.id && !p.deleted).length : (shop.productsCount || 0);

  const bannerUrl = shop.banner || shop.bannerImage || DEFAULT_COVER_BANNER;
  const logoUrl = shop.image || shop.logoImage || DEFAULT_STORE_LOGO;

  const handleCardClick = () => {
    if (shop.id) {
      navigate(`/shop/${shop.id}`);
    }
  };

  const handleBannerZoom = (e) => {
    e.stopPropagation();
    openImageModal(bannerUrl, `${shop.name || 'Storefront'} Cover Banner`);
  };

  const handleLogoZoom = (e) => {
    e.stopPropagation();
    openImageModal(logoUrl, `${shop.name || 'Storefront'} Logo Avatar`);
  };

  const handleFollowClick = (e) => {
    e.stopPropagation();
    if (toggleFollowShop) {
      toggleFollowShop(shop.id);
    }
  };

  const whatsappNum = (shop.whatsapp || shop.phone || '').replace(/[^0-9]/g, '');

  return (
    <div
      onClick={handleCardClick}
      className="group relative bg-white rounded-3xl border border-slate-200/80 hover:border-emerald-400 shadow-xs hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden cursor-pointer h-full"
    >
      {/* ── 1. COVER BANNER & OVERLAYS ── */}
      <div className="relative h-32 sm:h-36 w-full bg-slate-900 overflow-hidden group/banner">
        <img
          src={bannerUrl}
          alt={shop.name || 'Store Cover'}
          className="w-full h-full object-cover opacity-85 group-hover/banner:scale-105 transition-transform duration-700 ease-out"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

        {/* Top Bar Badges */}
        <div className="absolute top-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 z-10">
          {/* Zoom Cover Button */}
          <button
            type="button"
            onClick={handleBannerZoom}
            className="px-2.5 py-1 rounded-xl bg-slate-950/60 hover:bg-slate-950 text-white text-[10px] font-extrabold backdrop-blur-md border border-white/20 flex items-center gap-1 opacity-0 group-hover/banner:opacity-100 transition-opacity cursor-zoom-in shadow-xs"
            title="Zoom cover image"
          >
            <ZoomIn className="w-3 h-3 text-white" />
            <span>Cover</span>
          </button>

          {/* Follow Store Floating Toggle Button */}
          <button
            type="button"
            onClick={handleFollowClick}
            className={`ml-auto px-2.5 py-1 rounded-xl font-extrabold text-[10.5px] backdrop-blur-md border transition-all flex items-center gap-1 shadow-xs cursor-pointer ${
              isFollowed
                ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-black'
                : 'bg-slate-950/60 hover:bg-slate-950 text-white border-white/20'
            }`}
            title={isFollowed ? 'Following store' : 'Follow store'}
          >
            <Store className="w-3 h-3" />
            <span>{isFollowed ? 'Following' : 'Follow'}</span>
          </button>
        </div>

        {/* Bottom Banner Info: Products Count Badge */}
        <div className="absolute bottom-2.5 right-2.5 z-10">
          <span className="px-2.5 py-0.5 rounded-full bg-slate-950/70 backdrop-blur-md border border-white/15 text-white text-[10px] font-black tracking-wider uppercase shadow-xs">
            {shopProductsCount} Products
          </span>
        </div>
      </div>

      {/* ── 2. CARD CONTENT & STORE IDENTITY ── */}
      <div className="p-4 pt-0 flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Overlapping Logo Avatar & Verified Status */}
          <div className="flex items-end justify-between -mt-7 mb-2 relative z-10 px-0.5">
            <div
              onClick={handleLogoZoom}
              className="relative w-14 h-14 rounded-2xl overflow-hidden border-3 border-white bg-white shadow-md group-hover:scale-105 transition-transform duration-300 cursor-zoom-in shrink-0"
              title="Click to zoom logo avatar"
            >
              <img src={logoUrl} alt={shop.name} className="w-full h-full object-cover" />
            </div>

            {/* Verification Badge */}
            {shop.verified !== false && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-50 text-[#056839] border border-emerald-200/90 text-[10px] font-black uppercase tracking-wider inline-flex items-center gap-1 shadow-2xs">
                <CheckCircle2 className="w-3 h-3 text-[#056839] fill-emerald-100" />
                Verified
              </span>
            )}
          </div>

          {/* Store Name */}
          <h3 className="text-base font-black text-slate-900 group-hover:text-[#056839] transition-colors leading-tight line-clamp-1">
            {shop.name}
          </h3>

          {/* Market & Location */}
          <p className="text-xs font-semibold text-slate-500 flex items-center gap-1 mt-1 truncate">
            <MapPin className="w-3.5 h-3.5 text-[#056839] shrink-0" />
            <span className="truncate">{shop.market || shop.address || shop.city || 'Rampur'}</span>
          </p>

          {/* Category Pill & Rating Metrics */}
          <div className="flex items-center justify-between gap-2 mt-3 pt-2.5 border-t border-slate-100/90">
            <span className="px-2.5 py-1 rounded-xl bg-slate-100 text-slate-700 font-extrabold text-[11px] truncate max-w-[140px]">
              {shop.categoryName || shop.category || 'General Store'}
            </span>

            <div className="flex items-center gap-2 shrink-0">
              <div className="flex items-center gap-1 bg-amber-50 border border-amber-200/80 px-2 py-0.5 rounded-lg text-slate-900 font-extrabold text-xs">
                <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                <span>{Number(shop.rating || 4.8).toFixed(1)}</span>
              </div>

              {(shop.viewCount || 0) > 0 && (
                <div className="flex items-center gap-0.5 text-violet-600 font-extrabold text-[11px]" title="Store visits">
                  <Eye className="w-3 h-3 text-violet-500" />
                  <span>{shop.viewCount >= 1000 ? `${(shop.viewCount / 1000).toFixed(1)}k` : shop.viewCount}</span>
                </div>
              )}
            </div>
          </div>

          {/* Description Snippet if available */}
          {shop.description && (
            <p className="text-xs text-slate-500 font-medium line-clamp-2 leading-relaxed mt-2.5">
              {shop.description}
            </p>
          )}
        </div>

        {/* ── 3. ACTION CONTROLS FOOTER ── */}
        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={handleCardClick}
            className="flex-1 py-2.5 px-3 rounded-2xl bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs transition-all flex items-center justify-center gap-1.5 shadow-2xs group-hover:shadow-md cursor-pointer border-none"
          >
            <span>Visit Shop</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
          </button>

          {whatsappNum && (
            <a
              href={`https://wa.me/${whatsappNum}?text=${encodeURIComponent(
                ` *SHOP INQUIRY - MEENA BAZAAR*\n\n• *Shop Name:* ${shop.name}\n• *Location:* ${shop.market || 'Local Market'}, ${shop.city || 'Rampur'}\n• *Category:* ${shop.categoryName || shop.category || 'Local Shop'}\n\n *Hello ${shop.name}, I found your shop on Meena Bazaar and would like to inquire about your products.*`
              )}`}
              target="_blank"
              rel="noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="p-2.5 rounded-2xl bg-emerald-50 text-[#056839] border border-emerald-200/80 hover:bg-[#25D366] hover:text-white hover:border-[#25D366] transition-colors flex items-center justify-center shrink-0 shadow-2xs"
              title="Chat on WhatsApp"
            >
              <MessageCircle className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}

