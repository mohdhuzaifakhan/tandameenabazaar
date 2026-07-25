import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import DashboardLayout from '../components/DashboardLayout';

export default function AdminShopDetails() {
  const { id } = useParams();
  const { shops, products, toggleShopVerification, deleteProduct } = useBazaar();

  const shopId = id || 'sharma-mobile';
  const shop = shops.find(s => s.id === shopId) || shops[0];
  const shopProducts = products.filter(p => p.shopId === shop.id);
  const totalCatalogValue = shopProducts.reduce((sum, p) => sum + p.price, 0);

  return (
    <DashboardLayout title={`Shop Audit - ${shop.name}`} role="admin">
      <div className="flex flex-col gap-6 md:gap-8 animate-fade-in">
        
        {/* Cover and details header */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100">
          <div className="h-44 bg-slate-100 relative">
            <img src={shop.bannerImage} alt={shop.name} className="w-full h-full object-cover" />
            <div className="absolute -bottom-8 left-8 w-20 h-20 rounded-full overflow-hidden border-4 border-white bg-white">
              <img src={shop.logoImage} alt={shop.name} className="w-full h-full object-cover" />
            </div>
          </div>

          <div className="pt-12 pb-6 px-8 flex flex-col sm:flex-row justify-between sm:items-start gap-4">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black text-slate-900 leading-none">{shop.name}</h2>
                {shop.verified && <i className="fa-solid fa-circle-check text-emerald-600 text-sm"></i>}
              </div>
              <p className="text-xs text-slate-500 font-semibold mt-1">
                <i className="fa-solid fa-location-dot text-slate-400 mr-1"></i> {shop.address}
              </p>
            </div>

            <div className="flex gap-2">
              <button 
                onClick={() => toggleShopVerification(shop.id)}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${shop.verified ? 'bg-orange-50 hover:bg-orange-100 text-orange-700' : 'bg-emerald-600 hover:bg-emerald-500 text-white'}`}
              >
                {shop.verified ? 'Suspend Verification' : 'Verify Shop'}
              </button>
              <Link 
                to={`/shop/${shop.id}`}
                className="px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-650 rounded-xl text-xs font-bold transition-all"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>

        {/* Catalog stats and info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Stats card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4 pb-2.5 border-b border-slate-100">
              Catalog Metrics
            </h3>
            <div className="flex flex-col gap-3 text-xs font-semibold text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Active Products:</span>
                <strong>{shopProducts.length}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Total Catalog Value:</span>
                <strong>₹{totalCatalogValue.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Average Product Price:</span>
                <strong>₹{shopProducts.length > 0 ? Math.round(totalCatalogValue / shopProducts.length).toLocaleString('en-IN') : 0}</strong>
              </div>
            </div>
          </div>

          {/* Shop details info card */}
          <div className="bg-white rounded-2xl p-5 border border-slate-100">
            <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider mb-4 pb-2.5 border-b border-slate-100">
              Business Profile
            </h3>
            <div className="flex flex-col gap-3 text-xs font-semibold text-slate-700">
              <div className="flex justify-between">
                <span className="text-slate-400">Market Area:</span>
                <strong>{shop.market}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Category:</span>
                <strong>{shop.categoryName}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Hours:</span>
                <strong>{shop.hours}</strong>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">WhatsApp Contact:</span>
                <strong>{shop.phone}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Product listing table */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 flex flex-col gap-5">
          <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider">Shop Products Catalog</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <th className="p-3">Product Name</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Price</th>
                  <th className="p-3">Units Sold</th>
                  <th className="p-3">Action Controls</th>
                </tr>
              </thead>
              <tbody>
                {shopProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-8 text-slate-400 font-medium">
                      No products listed by this shop.
                    </td>
                  </tr>
                ) : (
                  shopProducts.map(prod => (
                    <tr key={prod.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                      <td className="p-3 flex items-center gap-3">
                        <img src={prod.images[0]} alt={prod.name} className="w-9 h-9 rounded-lg object-cover border border-slate-100 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-800 font-bold block text-xs">{prod.name}</strong>
                          <span className="text-[10px] text-slate-400 font-semibold">{prod.brand}</span>
                        </div>
                      </td>
                      <td className="p-3 text-slate-500 font-semibold">{prod.categoryName}</td>
                      <td className="p-3 text-slate-850 font-bold">₹{prod.price.toLocaleString('en-IN')}</td>
                      <td className="p-3 text-slate-500 font-medium">{prod.soldCount || 0} units</td>
                      <td className="p-3">
                        <button 
                          onClick={() => { if(confirm('Are you sure you want to delete this product?')) deleteProduct(prod.id); }}
                          className="text-red-500 hover:text-red-600 font-bold text-xs cursor-pointer transition-colors bg-transparent border-none"
                        >
                          Delete Item
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
