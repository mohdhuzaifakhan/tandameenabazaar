import { PackageOpen, Search, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import CategoryFilterBar from '../components/CategoryFilterBar';
import ProductCard from '../components/ProductCard';
import { useBazaar } from '../context/BazaarContext';

export default function Categories() {
  const { products, shops } = useBazaar();
  const [searchParams, setSearchParams] = useSearchParams();

  const initialSearch = searchParams.get('search') || '';
  const initialCat = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(initialCat);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    const q = searchParams.get('search') || '';
    const cat = searchParams.get('category') || 'all';
    setSearchQuery(q);
    setSelectedCategory(cat);
  }, [searchParams]);

  const handleClearSearch = () => {
    setSearchQuery('');
    const newParams = new URLSearchParams(searchParams);
    newParams.delete('search');
    setSearchParams(newParams);
  };

  const handleSelectCategory = (catId) => {
    setSelectedCategory(catId);
    const newParams = new URLSearchParams(searchParams);
    if (catId === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', catId);
    }
    setSearchParams(newParams);
  };

  // Only products from verified shops or published products
  const verifiedShopIds = new Set(shops.filter(s => s.verified !== false).map(s => s.id));
  const publicProducts = products.filter(p => verifiedShopIds.has(p.shopId) || !p.shopId);

  // Filter & sort products by selected category, search query and rating
  const filteredProducts = publicProducts
    .filter(p => {
      const matchesCategory = selectedCategory === 'all' ||
        (p.category && p.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchesSearch = !searchQuery.trim() ||
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.brand && p.brand.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.categoryName && p.categoryName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    })
    .sort((a, b) => (b.rating || 0) - (a.rating || 0));

  return (
    <div className="w-full min-h-screen bg-[#f8faf9] pb-24 font-sans text-slate-800">
      <div className="max-w-4xl mx-auto px-2 sm:px-4 space-y-4 pt-2 sm:pt-4">

        {/* Search Active Indicator Pill */}
        {searchQuery.trim() && (
          <div className="bg-emerald-50 border border-emerald-200/90 rounded-2xl p-3 px-4 flex items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-[#056839] font-bold">
              <Search className="w-4 h-4 shrink-0 text-[#056839]" />
              <span>Showing search results for: <span className="font-black text-slate-900">"{searchQuery}"</span></span>
            </div>
            <button
              type="button"
              onClick={handleClearSearch}
              className="w-6 h-6 rounded-full bg-white text-slate-500 hover:text-slate-800 flex items-center justify-center cursor-pointer border border-slate-200"
              title="Clear Search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* --- 1. REUSABLE CATEGORY FILTER BAR --- */}
        <CategoryFilterBar selectedCategory={selectedCategory} onSelectCategory={handleSelectCategory} />

        {/* --- 3. FILTERED PRODUCTS GRID --- */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-3xl border border-slate-200/80 p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
              <PackageOpen className="w-6 h-6" />
            </div>
            <h3 className="text-sm font-black text-slate-900">
              {searchQuery ? `No Products found for "${searchQuery}"` : 'No Products in this Category'}
            </h3>
            <p className="text-xs text-slate-500 font-medium">
              Try clearing your search query or selecting another category.
            </p>
            <div className="flex items-center justify-center gap-2 pt-1">
              {searchQuery && (
                <button
                  onClick={handleClearSearch}
                  className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-bold hover:bg-slate-200 cursor-pointer"
                >
                  Clear Search
                </button>
              )}
              <button
                onClick={() => handleSelectCategory('all')}
                className="px-4 py-2 rounded-xl bg-[#056839] text-white text-xs font-extrabold cursor-pointer"
              >
                Show All Products
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
