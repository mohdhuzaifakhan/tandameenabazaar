import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Star, ZoomIn, MapPin } from 'lucide-react';
import { useImageModal } from '../context/ImageModalContext';
import { DEFAULT_STORE_LOGO } from '../utils/defaultAssets';

export default function ShopCardClean({ shop }) {
  if (!shop) return null;

  const navigate = useNavigate();
  const { openImageModal } = useImageModal();
  const logo = shop.image || shop.logoImage || DEFAULT_STORE_LOGO;

  const handleCardClick = () => {
    if (shop?.id) {
      navigate(`/shop/${shop.id}`);
    }
  };

  const handleZoom = (e) => {
    e.stopPropagation();
    openImageModal(logo, `${shop.name || 'Store'} Logo / Image`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:border-emerald-300 transition-all duration-300 flex flex-col justify-between group cursor-pointer h-full shadow-2xs"
    >
      {/* Store Cover Banner & Rating Badge */}
      <div className="relative h-28 bg-slate-100 overflow-hidden group/banner">
        <img 
          src={logo} 
          alt={shop.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
        />
        
        {/* Image Zoom Button */}
        <button
          type="button"
          onClick={handleZoom}
          className="absolute top-2.5 left-2.5 w-6.5 h-6.5 rounded-full bg-slate-900/70 hover:bg-slate-900 text-white flex items-center justify-center opacity-0 group-hover/banner:opacity-100 transition-opacity z-10 cursor-zoom-in shadow-xs border-none"
          title="Zoom image"
        >
          <ZoomIn className="w-3.5 h-3.5 text-white" />
        </button>

        {/* Rating Pill Top Right */}
        <span className="absolute top-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/90 text-slate-900 font-extrabold text-[10px] flex items-center gap-1 shadow-xs">
          <Star className="w-3 h-3 text-amber-400 fill-amber-400" /> {shop.rating || 4.8}
        </span>
      </div>

      {/* Store Info & WhatsApp CTA */}
      <div className="p-3.5 flex items-center justify-between gap-3 flex-1">
        <div className="min-w-0 flex-1">
          <h4 className="text-xs font-black text-slate-900 line-clamp-1 group-hover:text-[#056839] transition-colors">{shop.name}</h4>
          <span className="text-[11px] text-slate-400 font-medium flex items-center gap-1 truncate mt-0.5">
            {/* <MapPin className="w-3 h-3 text-slate-400 flex-shrink-0" /> */}
            <span className="truncate">{shop.market || shop.address || ''}</span>
          </span>
          <span className="text-[10px] text-[#056839] font-bold block mt-1">
            {shop.distance || ''}
          </span>
        </div>

        {/* WhatsApp Icon Button matching mockup */}
        <a
          href={`https://wa.me/${(shop.whatsapp || shop.phone || '918433043426').replace(/[^0-9]/g, '')}`}
          target="_blank"
          rel="noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="w-8 h-8 rounded-full bg-[#25D366]/10 hover:bg-[#25D366] text-[#25D366] hover:text-white flex items-center justify-center transition-colors flex-shrink-0"
          title="Contact Store on WhatsApp"
        >
          <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
          </svg>
        </a>
      </div>
    </div>
  );
}
