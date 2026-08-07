import React from 'react';
import { Eye } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useImageModal } from '../context/ImageModalContext';
import { DEFAULT_COVER_BANNER, DEFAULT_STORE_LOGO } from '../utils/defaultAssets';

export default function ShopCard({ shop }) {
  if (!shop) return null;

  const navigate = useNavigate();
  const { openImageModal } = useImageModal();

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

  return (
    <div 
      onClick={handleCardClick}
      className="shop-card cursor-pointer group hover:border-emerald-400 transition-all duration-300 relative"
      title={`Click to view ${shop.name || 'Store'} page`}
    >
      {/* Cover Banner with Zoom Button */}
      <div className="relative group/banner overflow-hidden">
        <img 
          src={bannerUrl} 
          alt={shop.name || 'Store'} 
          className="shop-card-banner group-hover:scale-105 transition-transform duration-500" 
          style={{ objectFit: 'cover' }} 
        />
        
        {/* Banner Zoom Button */}
        <button
          type="button"
          onClick={handleBannerZoom}
          className="absolute top-2 left-2 px-2 py-1 rounded-lg bg-slate-950/70 hover:bg-slate-950 text-white text-[10px] font-bold flex items-center gap-1 opacity-80 sm:opacity-0 group-hover/banner:opacity-100 transition-opacity z-10 cursor-zoom-in border border-white/20 shadow-md"
          title="Zoom cover image"
        >
          <i className="fa-solid fa-magnifying-glass-plus"></i> Zoom Cover
        </button>

        <span className="shop-products-badge">{shop.productsCount || 0}+ Products</span>
      </div>

      <div className="shop-card-body">
        {/* Logo Avatar with Direct Tap-to-Zoom */}
        <div className="relative group/logo w-fit">
          <img 
            src={logoUrl} 
            alt={shop.name || 'Store'} 
            className="shop-card-avatar group-hover/logo:scale-110 transition-transform duration-300 cursor-zoom-in ring-2 ring-emerald-500/20" 
            style={{ objectFit: 'cover' }} 
            onClick={handleLogoZoom}
            title="Click to zoom logo avatar"
          />
        </div>

        <h3 className="shop-card-name group-hover:text-[#056839] transition-colors">
          {shop.name || 'Storefront'}{' '}
          {shop.verified && <i className="fa-solid fa-circle-check badge-verified" style={{ marginLeft: '4px' }}></i>}
        </h3>

        <div className="shop-card-location">
          <i className="fa-solid fa-location-dot"></i> {shop.address || shop.location || shop.market || 'Main Market'}
        </div>
        <div className="shop-card-category">{shop.category || shop.categoryName || 'General Store'}</div>
        
        <div className="shop-card-footer">
          <div className="flex items-center gap-3">
            <div className="shop-rating">
              <i className="fa-solid fa-star"></i> {shop.rating || 5.0} ({shop.reviewsCount || 0})
            </div>
            {(shop.viewCount || 0) > 0 && (
              <div className="flex items-center gap-1 text-slate-500 font-semibold text-[11px]">
                <Eye className="w-3 h-3 text-violet-500" />
                <span className="text-violet-600 font-bold">
                  {shop.viewCount >= 1000
                    ? `${(shop.viewCount / 1000).toFixed(1)}k`
                    : shop.viewCount} visits
                </span>
              </div>
            )}
          </div>
          <button 
            type="button"
            onClick={handleCardClick}
            className="btn btn-outline cursor-pointer" 
            style={{ padding: '6px 12px', fontSize: '0.85rem' }}
          >
            Visit Shop <i className="fa-solid fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </div>
  );
}

