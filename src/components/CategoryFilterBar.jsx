import { useEffect, useRef, useState } from 'react';
import { useBazaar } from '../context/BazaarContext';
import { getCategoryAsset } from '../assets/categories';
import { ChevronLeft, ChevronRight, LayoutGrid } from 'lucide-react';

export default function CategoryFilterBar({ selectedCategory = 'all', onSelectCategory }) {
  const { categories } = useBazaar();
  const [scrolled, setScrolled] = useState(false);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);
  const scrollRef = useRef(null);

  // Track page scroll to add elevated shadow when sticky bar activates
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Full category list including All
  const categoryList = [{ id: 'all', name: 'All Categories', icon: 'fa-shapes' }, ...categories];

  // Scroll buttons state updater
  const updateScrollButtons = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 6);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 6);
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    updateScrollButtons();
    el.addEventListener('scroll', updateScrollButtons, { passive: true });
    window.addEventListener('resize', updateScrollButtons);
    return () => {
      el.removeEventListener('scroll', updateScrollButtons);
      window.removeEventListener('resize', updateScrollButtons);
    };
  }, [categories]);

  // Auto-scroll the active category pill into view
  useEffect(() => {
    if (!scrollRef.current) return;
    const active = scrollRef.current.querySelector('[data-active="true"]');
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedCategory]);

  const handleScroll = (direction) => {
    if (!scrollRef.current) return;
    const scrollAmount = direction === 'left' ? -280 : 280;
    scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
  };

  const isCategorySelected = (cat) => {
    if (!selectedCategory || selectedCategory.toLowerCase() === 'all') {
      return cat.id === 'all';
    }
    const sel = selectedCategory.toLowerCase();
    const catId = (cat.id || '').toLowerCase();
    const catName = (cat.name || '').toLowerCase();
    return sel === catId || sel === catName || catName.startsWith(sel) || sel.startsWith(catId);
  };

  return (
    /* Sticky wrapper — sticks just below the header (h-16 = 64px) */
    <div
      className={`sticky top-16 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-md border-b border-slate-200/80 shadow-xs py-1.5'
          : 'bg-white/80 backdrop-blur-xs border-b border-slate-100 py-2'
      }`}
    >
      <div className="max-w-6xl mx-auto px-2 sm:px-4 relative group/bar">
        {/* Left Scroll Button (Desktop) */}
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => handleScroll('left')}
            className="hidden md:flex absolute -left-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-md border border-slate-200 items-center justify-center hover:bg-slate-50 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Scroll Left"
          >
            <ChevronLeft className="w-5 h-5 text-slate-700" />
          </button>
        )}

        {/* Right Scroll Button (Desktop) */}
        {canScrollRight && (
          <button
            type="button"
            onClick={() => handleScroll('right')}
            className="hidden md:flex absolute -right-1 top-1/2 -translate-y-1/2 z-20 w-8 h-8 rounded-full bg-white/95 text-slate-700 shadow-md border border-slate-200 items-center justify-center hover:bg-slate-50 hover:scale-110 active:scale-95 transition-all cursor-pointer"
            aria-label="Scroll Right"
          >
            <ChevronRight className="w-5 h-5 text-slate-700" />
          </button>
        )}

        {/* Inner Scroll Container */}
        <div
          ref={scrollRef}
          className="flex items-start gap-3 sm:gap-4.5 overflow-x-auto no-scrollbar py-1.5 px-1 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoryList.map((cat) => {
            const isSelected = isCategorySelected(cat);
            const assetSrc = cat.image && cat.image.trim() !== '' ? cat.image : getCategoryAsset(cat);

            return (
              <button
                key={cat.id}
                data-active={isSelected ? 'true' : 'false'}
                type="button"
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(cat.id === 'all' ? 'all' : cat.id);
                  }
                }}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group focus:outline-none select-none transition-transform active:scale-95"
              >
                {/* Circular Image Container */}
                <div
                  className={`relative w-13 h-13 sm:w-15 sm:h-15 rounded-full p-0.5 flex items-center justify-center transition-all duration-300 ${
                    isSelected
                      ? 'ring-3 ring-[#056839] ring-offset-2 ring-offset-white scale-105 shadow-md shadow-[#056839]/25 bg-gradient-to-tr from-[#056839] to-emerald-500'
                      : 'border-2 border-slate-200/90 bg-white hover:border-[#056839]/50 hover:scale-105 hover:shadow-sm'
                  }`}
                >
                  <div className="w-full h-full rounded-full overflow-hidden bg-slate-50 flex items-center justify-center relative">
                    {assetSrc ? (
                      <img
                        src={assetSrc}
                        alt={cat.name}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                          // Fallback to SVG asset if custom image fails
                          e.target.onerror = null;
                          e.target.src = getCategoryAsset(cat);
                        }}
                      />
                    ) : (
                      <LayoutGrid className="w-6 h-6 text-[#056839]" />
                    )}
                  </div>

                  {/* Selected Active Badge Dot */}
                  {isSelected && (
                    <span className="absolute -bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full bg-[#056839] border-2 border-white flex items-center justify-center shadow-xs">
                      <span className="w-1.5 h-1.5 rounded-full bg-white" />
                    </span>
                  )}
                </div>

                {/* Category Label */}
                <span
                  className={`text-[10.5px] sm:text-xs tracking-tight text-center leading-tight max-w-[68px] sm:max-w-[76px] truncate transition-colors duration-200 ${
                    isSelected
                      ? 'text-[#056839] font-black'
                      : 'text-slate-600 font-semibold group-hover:text-slate-900'
                  }`}
                  title={cat.name}
                >
                  {cat.name}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
