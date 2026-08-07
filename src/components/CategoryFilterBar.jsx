import { useEffect, useRef, useState } from 'react';
import { useBazaar } from '../context/BazaarContext';
import {
  Footprints,
  Gamepad2,
  LayoutGrid,
  Shirt,
  ShoppingBasket,
  Smartphone,
  Sparkle,
  Utensils
} from 'lucide-react';

export default function CategoryFilterBar({ selectedCategory = 'all', onSelectCategory }) {
  const { categories } = useBazaar();
  const [scrolled, setScrolled] = useState(false);
  const scrollRef = useRef(null);

  // Track page scroll to add elevated shadow when sticky bar activates
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Auto-scroll the active category pill into view
  useEffect(() => {
    if (!scrollRef.current) return;
    const active = scrollRef.current.querySelector('[data-active="true"]');
    if (active) {
      active.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [selectedCategory]);

  // Combine All option + Real database categories
  const categoryList = [{ id: 'all', name: 'All', icon: 'fa-shapes' }, ...categories];

  const getCategoryIcon = (cat) => {
    if (cat.id === 'all') return <LayoutGrid className="w-4 h-4 stroke-[2]" />;
    const iconStr = cat.icon || '';
    if (iconStr.startsWith('fa-')) {
      return <i className={`fa-solid ${iconStr} text-sm`}></i>;
    }
    const nameLower = (cat.name || '').toLowerCase();
    if (nameLower.includes('fashion') || nameLower.includes('clothing')) return <Shirt className="w-4 h-4 stroke-[2]" />;
    if (nameLower.includes('electronics') || nameLower.includes('gadget') || nameLower.includes('mobile')) return <Smartphone className="w-4 h-4 stroke-[2]" />;
    if (nameLower.includes('home') || nameLower.includes('kitchen') || nameLower.includes('furniture')) return <Utensils className="w-4 h-4 stroke-[2]" />;
    if (nameLower.includes('beauty') || nameLower.includes('cosmetics') || nameLower.includes('jewel')) return <Sparkle className="w-4 h-4 stroke-[2]" />;
    if (nameLower.includes('footwear') || nameLower.includes('shoe')) return <Footprints className="w-4 h-4 stroke-[2]" />;
    if (nameLower.includes('grocer') || nameLower.includes('food')) return <ShoppingBasket className="w-4 h-4 stroke-[2]" />;
    if (nameLower.includes('toy') || nameLower.includes('game')) return <Gamepad2 className="w-4 h-4 stroke-[2]" />;
    return <LayoutGrid className="w-4 h-4 stroke-[2]" />;
  };

  const getCategoryBg = (cat, isSelected) => {
    if (isSelected) return 'bg-[#056839] text-white ring-2 ring-[#056839]/25 scale-110';
    const nameLower = (cat.name || '').toLowerCase();
    if (nameLower.includes('fashion')) return 'bg-rose-50 text-rose-600 hover:bg-rose-100';
    if (nameLower.includes('electronics')) return 'bg-sky-50 text-sky-600 hover:bg-sky-100';
    if (nameLower.includes('home')) return 'bg-amber-50 text-amber-600 hover:bg-amber-100';
    if (nameLower.includes('beauty') || nameLower.includes('cosmetics')) return 'bg-orange-50 text-orange-600 hover:bg-orange-100';
    if (nameLower.includes('footwear')) return 'bg-blue-50 text-blue-600 hover:bg-blue-100';
    if (nameLower.includes('grocer')) return 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100';
    if (nameLower.includes('toy') || nameLower.includes('game')) return 'bg-purple-50 text-purple-600 hover:bg-purple-100';
    return 'bg-slate-100 text-slate-600 hover:bg-slate-200';
  };

  return (
    /* Sticky wrapper — sticks just below the header (h-16 = 64px) */
    <div
      className={`sticky top-16 z-40 transition-all duration-300 ${
        scrolled
          ? 'bg-white/95 backdrop-blur-lg border-b border-slate-100'
          : 'bg-transparent'
      }`}
    >
      {/* Inner scroll container */}
      <div className="max-w-4xl mx-auto px-3 sm:px-4">
        <div
          ref={scrollRef}
          className="flex items-end gap-3 sm:gap-4 overflow-x-auto no-scrollbar py-2.5"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {categoryList.map((cat) => {
            const isSelected =
              (selectedCategory || 'all').toLowerCase() === cat.name.toLowerCase() ||
              (cat.id === 'all' && (!selectedCategory || selectedCategory === 'all'));

            return (
              <button
                key={cat.id}
                data-active={isSelected ? 'true' : 'false'}
                type="button"
                onClick={() => onSelectCategory && onSelectCategory(cat.name.toLowerCase())}
                className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group focus:outline-none"
              >
                {/* Icon bubble */}
                <div
                  className={`w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 ${getCategoryBg(cat, isSelected)}`}
                >
                  {getCategoryIcon(cat)}
                </div>

                {/* Label */}
                <span
                  className={`text-[10px] font-bold tracking-tight text-center leading-tight max-w-[52px] truncate transition-colors ${
                    isSelected ? 'text-[#056839] font-black' : 'text-slate-500 group-hover:text-slate-700'
                  }`}
                >
                  {cat.name}
                </span>

                {/* Active indicator dot */}
                <span
                  className={`w-1 h-1 rounded-full transition-all duration-200 ${
                    isSelected ? 'bg-[#056839] scale-100' : 'bg-transparent scale-0'
                  }`}
                />
              </button>
            );
          })}
        </div>
      </div>

      {/* Subtle bottom gradient line when scrolled */}
      {scrolled && (
        <div className="h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />
      )}
    </div>
  );
}
