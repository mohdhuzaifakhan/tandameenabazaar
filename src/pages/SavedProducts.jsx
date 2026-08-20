import {
  Compass,
  Heart,
  Sparkles
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import PaginatedProductGrid from '../components/PaginatedProductGrid';
import { SavedProductsSkeleton } from '../components/Skeletons';
import { useBazaar } from '../context/BazaarContext';
import { matchProductSearch } from '../utils/searchUtils';

export default function SavedProducts() {
  const { savedProductIds, products, categories, isDataLoading } = useBazaar();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  if (isDataLoading) {
    return <SavedProductsSkeleton />;
  }

  const savedProducts = products.filter(p => savedProductIds.includes(p.id));

  const filteredSaved = savedProducts.filter(p => {
    const matchesSearch = matchProductSearch(p, searchQuery);

    const matchesCategory = selectedCategory === 'all' ||
      (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

    return matchesSearch && matchesCategory;
  });

  const emptySavedState = savedProducts.length > 0 ? (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-6 text-center space-y-2">
      <p className="text-xs font-bold text-slate-600">No saved items match your filter.</p>
      <button
        onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }}
        className="text-xs font-extrabold text-[#056839] hover:underline cursor-pointer"
      >
        Clear Filter
      </button>
    </div>
  ) : (
    /* EXACT MATCHING EMPTY WISHLIST STATE */
    <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center space-y-4">
      <div className="relative w-20 h-20 rounded-full bg-[#f4fbf7] text-[#056839] flex items-center justify-center mx-auto border border-emerald-100">
        <Heart className="w-10 h-10 text-[#056839] stroke-[2]" />
        <Sparkles className="w-4 h-4 text-emerald-400 absolute top-2 right-2" />
        <Sparkles className="w-3 h-3 text-emerald-400 absolute bottom-3 left-2" />
      </div>

      <div>
        <h3 className="text-lg font-black text-slate-900">Your Saved List is Empty</h3>
        <p className="text-xs text-slate-500 max-w-sm mx-auto font-medium mt-1">
          Browse products from local shops and tap the heart icon to save items here!
        </p>
      </div>

      <div>
        <Link
          to="/shops"
          className="px-6 py-3 rounded-2xl bg-[#056839] hover:bg-emerald-800 text-white font-extrabold text-xs inline-flex items-center gap-2 transition-all cursor-pointer"
        >
          <Compass className="w-4 h-4" /> Explore Local Marketplace
        </Link>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-[#f8faf9] pb-24 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-4 pt-2 sm:pt-4">

        {/* --- 3. CATEGORY FILTER PILLS STRIP (IF ITEMS EXIST) --- */}
        {savedProducts.length > 0 && (
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer shrink-0 ${selectedCategory === 'all' ? 'bg-[#056839] text-white' : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                }`}
            >
              All Items ({savedProducts.length})
            </button>

            {categories.map(cat => {
              const count = savedProducts.filter(p => p.category?.toLowerCase() === cat.name.toLowerCase()).length;
              if (count === 0) return null;

              return (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-extrabold transition-colors cursor-pointer shrink-0 ${selectedCategory.toLowerCase() === cat.name.toLowerCase()
                    ? 'bg-[#056839] text-white'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200/80'
                    }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>
        )}

        {/* --- 4. SAVED PRODUCTS GRID / EMPTY STATE --- */}
        <PaginatedProductGrid
          products={filteredSaved}
          initialCount={8}
          pageSize={8}
          gridClassName="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3"
          emptyState={emptySavedState}
          endMessageText="You've reached the end of your saved items!"
        />

      </div>
    </div>
  );
}
