import React from 'react';
import { useBazaar } from '../context/BazaarContext';
import {
  Shirt,
  Smartphone,
  Utensils,
  Sparkle,
  Footprints,
  ShoppingBasket,
  Gamepad2,
  LayoutGrid
} from 'lucide-react';

export default function CategoryFilterBar({ selectedCategory = 'all', onSelectCategory }) {
  const { categories } = useBazaar();

  // Combine All option + Real database categories
  const categoryList = [{ id: 'all', name: 'All', icon: 'fa-shapes' }, ...categories];

  const getCategoryIcon = (cat) => {
    if (cat.id === 'all') return <LayoutGrid className="w-5 h-5 stroke-[2]" />;
    const iconStr = cat.icon || '';
    if (iconStr.startsWith('fa-')) {
      return <i className={`fa-solid ${iconStr} text-base`}></i>;
    }
    const nameLower = (cat.name || '').toLowerCase();
    if (nameLower.includes('fashion') || nameLower.includes('clothing')) return <Shirt className="w-5 h-5 stroke-[2]" />;
    if (nameLower.includes('electronics') || nameLower.includes('gadget') || nameLower.includes('mobile')) return <Smartphone className="w-5 h-5 stroke-[2]" />;
    if (nameLower.includes('home') || nameLower.includes('kitchen') || nameLower.includes('furniture')) return <Utensils className="w-5 h-5 stroke-[2]" />;
    if (nameLower.includes('beauty') || nameLower.includes('cosmetics') || nameLower.includes('jewel')) return <Sparkle className="w-5 h-5 stroke-[2]" />;
    if (nameLower.includes('footwear') || nameLower.includes('shoe')) return <Footprints className="w-5 h-5 stroke-[2]" />;
    if (nameLower.includes('grocer') || nameLower.includes('food')) return <ShoppingBasket className="w-5 h-5 stroke-[2]" />;
    if (nameLower.includes('toy') || nameLower.includes('game')) return <Gamepad2 className="w-5 h-5 stroke-[2]" />;
    return <LayoutGrid className="w-5 h-5 stroke-[2]" />;
  };

  const getCategoryBg = (cat, isSelected) => {
    if (isSelected) return 'bg-[#056839] text-white ring-2 ring-[#056839]/30';
    const nameLower = (cat.name || '').toLowerCase();
    if (nameLower.includes('fashion')) return 'bg-rose-100 text-rose-600';
    if (nameLower.includes('electronics')) return 'bg-sky-100 text-sky-600';
    if (nameLower.includes('home')) return 'bg-amber-100 text-amber-600';
    if (nameLower.includes('beauty') || nameLower.includes('cosmetics')) return 'bg-orange-100 text-orange-600';
    if (nameLower.includes('footwear')) return 'bg-blue-100 text-blue-600';
    if (nameLower.includes('grocer')) return 'bg-emerald-100 text-emerald-700';
    if (nameLower.includes('toy') || nameLower.includes('game')) return 'bg-purple-100 text-purple-600';
    return 'bg-slate-100 text-slate-700';
  };

  return (
    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar py-1">
      {categoryList.map((cat) => {
        const isSelected =
          (selectedCategory || 'all').toLowerCase() === cat.name.toLowerCase() ||
          (cat.id === 'all' && (!selectedCategory || selectedCategory === 'all'));

        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => onSelectCategory && onSelectCategory(cat.name.toLowerCase())}
            className="flex flex-col items-center gap-1.5 shrink-0 cursor-pointer group"
          >
            <div
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-transform group-hover:scale-105 ${getCategoryBg(
                cat,
                isSelected
              )}`}
            >
              {getCategoryIcon(cat)}
            </div>
            <span
              className={`text-[11px] font-bold tracking-tight text-center ${
                isSelected ? 'text-[#056839] font-black' : 'text-slate-700'
              }`}
            >
              {cat.name}
            </span>
          </button>
        );
      })}
    </div>
  );
}
