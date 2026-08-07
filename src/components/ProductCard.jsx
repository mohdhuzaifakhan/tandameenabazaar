import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useBazaar } from '../context/BazaarContext';
import { DEFAULT_PRODUCT_IMAGE } from '../utils/defaultAssets';

export default function ProductCard({ product }) {
  if (!product) return null;

  const { isProductSaved, toggleSaveProduct, openWhatsApp } = useBazaar();
  const navigate = useNavigate();
  const saved = isProductSaved(product.id);
  const hasDiscount = Boolean(product.originalPrice && product.originalPrice > product.price);
  const discountPercent = hasDiscount
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleCardClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleSaveClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSaveProduct(product.id);
  };

  // const handleWhatsAppClick = (e) => {
  //   e.preventDefault();
  //   e.stopPropagation();
  //   openWhatsApp(product.id);
  // };

  const imageUrl =
    (product.images && product.images.length > 0 ? product.images[0] : product.image) ||
    DEFAULT_PRODUCT_IMAGE;

  // Compact view-count formatter — handles up to millions
  const formatCount = (n) => {
    if (!n || n <= 0) return null;
    if (n >= 1000000) return `${(n / 1000000).toFixed(1)}M`;
    if (n >= 1000)    return `${(n / 1000).toFixed(1)}k`;
    return String(n);
  };

  // Price formatter — keeps prices short (Cr / L for very large amounts)
  const formatPrice = (val) => {
    if (!val || isNaN(val)) return '0';
    const num = Number(val);
    if (num >= 10000000) return `${(num / 10000000).toFixed(1)}Cr`;
    if (num >= 100000)   return `${(num / 100000).toFixed(1)}L`;
    return num.toLocaleString('en-IN');
  };

  const viewLabel = formatCount(product.viewCount);

  return (
    <div
      onClick={handleCardClick}
      className="relative rounded-2xl overflow-hidden cursor-pointer group aspect-[3/4] bg-slate-100"
      style={{ boxShadow: 'none' }}
    >
      {/* ── Full-bleed product image ── */}
      <img
        src={imageUrl}
        alt={product.name || 'Product'}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
      />

      {/* ── Top-left: Combined split pill (Discount | Views) ──
          max-w prevents it from overflowing into the ♥ button (which sits at right-2.5 = ~10px + 28px = ~40px).
          overflow-hidden on the pill clips text if system font is huge.
          All font sizes use inline style px to be immune to browser font-scale setting.  */}
      {(hasDiscount || viewLabel) && (
        <div
          className="absolute top-2.5 left-2.5 z-20 flex items-stretch rounded-full overflow-hidden shadow-lg"
          style={{
            maxWidth: 'calc(100% - 52px)', // always stays left of the ♥ button
            backdropFilter: 'blur(8px)',
          }}
        >
          {/* Left: Discount % — red */}
          {hasDiscount && (
            <span
              className="bg-[#ff3b30] text-white font-extrabold uppercase flex items-center shrink-0"
              style={{ fontSize: '10px', letterSpacing: '0.04em', padding: '5px 9px', lineHeight: 1, whiteSpace: 'nowrap' }}
            >
              {discountPercent}%&nbsp;OFF
            </span>
          )}

          {/* Divider — only when both exist */}
          {hasDiscount && viewLabel && (
            <span className="w-px self-stretch" style={{ background: 'rgba(255,255,255,0.28)' }} />
          )}

          {/* Right: View count — dark glass */}
          {viewLabel && (
            <span
              className="bg-black/60 text-white font-extrabold flex items-center overflow-hidden"
              style={{ fontSize: '10px', padding: '5px 9px', lineHeight: 1, whiteSpace: 'nowrap', maxWidth: '80px' }}
            >
              <span className="truncate">{viewLabel}&nbsp;views</span>
            </span>
          )}
        </div>
      )}

      {/* ── Top-right: Wishlist heart ── */}
      <button
        type="button"
        onClick={handleSaveClick}
        className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all cursor-pointer z-20 border-none backdrop-blur-sm ${
          saved
            ? 'bg-rose-500/90 text-white'
            : 'bg-black/25 text-white hover:bg-black/40'
        }`}
        title="Save Product"
      >
        <Heart className={`w-3.5 h-3.5 ${saved ? 'fill-white' : ''}`} />
      </button>

      {/* ── Bottom frosted-glass footer ── */}
      <div
        className="absolute bottom-0 left-0 right-0 z-10 px-3 py-2.5 flex items-end justify-between gap-2 min-w-0"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.38) 60%, transparent 100%)',
        }}
      >
        {/* Product name — left, clamps to 2 lines, never pushes price out */}
        <p
          className="text-white font-bold leading-tight line-clamp-2 flex-1 min-w-0 drop-shadow"
          style={{ fontSize: '11px' }}
        >
          {product.name}
        </p>

        {/* Price block — right, shrinks but never wraps */}
        <div className="flex flex-col items-end shrink-0 text-right gap-0.5" style={{ maxWidth: '45%' }}>
          <span
            className="text-white font-extrabold leading-none tabular-nums drop-shadow truncate"
            style={{ fontSize: '12px' }}
          >
            ₹{formatPrice(product.price)}
          </span>
          {hasDiscount && (
            <span
              className="text-white/60 line-through font-medium tabular-nums leading-none truncate"
              style={{ fontSize: '9px' }}
            >
              ₹{formatPrice(product.originalPrice)}
            </span>
          )}
        </div>
      </div>

      {/* WhatsApp Direct Order Button — commented out */}
      {/* <button
        type="button"
        onClick={handleWhatsAppClick}
        className="absolute bottom-14 right-2.5 w-8 h-8 rounded-full bg-[#25d366] hover:bg-emerald-600 text-white flex items-center justify-center transition-transform hover:scale-105 cursor-pointer border-none z-20"
        title="Order on WhatsApp"
      >
        <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
          <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.205 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
        </svg>
      </button> */}
    </div>
  );
}
