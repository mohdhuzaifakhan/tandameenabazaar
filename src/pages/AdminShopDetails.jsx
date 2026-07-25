import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useBazaar } from '../context/BazaarContext';
import DashboardLayout from '../components/DashboardLayout';

export default function AdminShopDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { shops, products, toggleShopVerification, deleteProduct } = useBazaar();

  const [toastMessage, setToastMessage] = useState(null);
  const [productToDelete, setProductToDelete] = useState(null);

  const showToast = (text) => {
    setToastMessage(text);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const shop = shops.find(s => s.id === id) || shops[0];
  const shopProducts = products.filter(p => p.shopId === shop?.id);
  const totalCatalogValue = shopProducts.reduce((sum, p) => sum + (Number(p.price) || 0), 0);

  if (!shop) {
    return (
      <DashboardLayout title="Store Audit" role="admin">
        <div className="bg-white rounded-2xl p-12 text-center text-slate-400 space-y-4">
          <i className="fa-solid fa-store-slash text-4xl text-slate-300"></i>
          <h2 className="text-lg font-bold text-slate-800">Store Not Found</h2>
          <button onClick={() => navigate('/dashboard/admin/shops')} className="px-4 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow-md">
            Return to Stores Directory
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const handleToggleVerify = () => {
    toggleShopVerification(shop.id);
    const newStatus = !shop.verified ? 'Verified' : 'Pending Verification';
    showToast(`Store "${shop.name}" status changed to ${newStatus}.`);
  };

  const confirmDeleteProduct = () => {
    if (!productToDelete) return;
    deleteProduct(productToDelete.id);
    showToast(`Product "${productToDelete.name}" removed from catalog.`);
    setProductToDelete(null);
  };

  return (
    <DashboardLayout title={`Store Audit: ${shop.name}`} role="admin">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-4 right-4 z-50 p-4 rounded-2xl shadow-2xl bg-emerald-950 text-emerald-200 border border-emerald-800 text-xs font-extrabold flex items-center gap-3 animate-bounce">
          <i className="fa-solid fa-circle-check text-emerald-400 text-base"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="flex flex-col gap-6 md:gap-8 animate-fade-in pb-12">
        
        {/* Store Header Banner Card */}
        <div className="bg-white rounded-3xl overflow-hidden border border-slate-100 shadow-sm">
          <div className="h-44 bg-slate-900 relative">
            <img 
              src={shop.banner || shop.bannerImage || 'https://images.unsplash.com/photo-1526738549149-8e07eca6c147?w=1200&q=80'} 
              alt={shop.name} 
              className="w-full h-full object-cover opacity-60" 
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
          </div>

          <div className="p-6 md:p-8 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 relative -mt-12 z-10">
            <div className="flex items-center gap-4">
              <img 
                src={shop.image || shop.logoImage || 'https://images.unsplash.com/photo-1556742049-0a670f4a4591?w=400&q=80'} 
                alt={shop.name} 
                className="w-20 h-20 rounded-2xl object-cover border-4 border-white shadow-2xl bg-slate-800" 
              />
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="text-xl md:text-2xl font-black text-slate-900">{shop.name}</h1>
                  <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                    shop.verified ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {shop.verified ? 'Verified Store' : 'Pending Verification'}
                  </span>
                </div>
                <p className="text-xs text-slate-500 font-medium mt-1 flex items-center gap-2">
                  <span><i className="fa-solid fa-location-dot text-emerald-600"></i> {shop.address || shop.market || 'Main Market'}</span>
                  <span>&bull;</span>
                  <span><i className="fa-solid fa-tag text-emerald-600"></i> {shop.category || shop.categoryName || 'General'}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button 
                onClick={handleToggleVerify}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer ${
                  shop.verified 
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200' 
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {shop.verified ? 'Suspend Verification' : 'Approve & Verify Store'}
              </button>

              <Link 
                to={`/shop/${shop.id}`}
                target="_blank"
                className="px-4 py-2.5 border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-xl text-xs font-bold transition-all inline-flex items-center gap-1.5"
              >
                <i className="fa-solid fa-arrow-up-right-from-square text-xs"></i> View Live Storefront
              </Link>
            </div>
          </div>
        </div>

        {/* Business Audit Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          
          {/* Catalog Stats Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
              Store Catalog Metrics
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Active Listed Products:</span>
                <strong className="text-slate-900 font-extrabold">{shopProducts.length} Products</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Total Inventory MRP Value:</span>
                <strong className="text-slate-900 font-extrabold">₹{totalCatalogValue.toLocaleString('en-IN')}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">Average Item Selling Price:</span>
                <strong className="text-emerald-700 font-extrabold">
                  ₹{shopProducts.length > 0 ? Math.round(totalCatalogValue / shopProducts.length).toLocaleString('en-IN') : 0}
                </strong>
              </div>
            </div>
          </div>

          {/* Business Profile Details */}
          <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider border-b border-slate-100 pb-3">
              Merchant Contact & Location
            </h3>
            <div className="space-y-3 text-xs">
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Market Hub Location:</span>
                <strong className="text-slate-900">{shop.market || 'Main Market'}</strong>
              </div>
              <div className="flex justify-between py-1 border-b border-slate-100">
                <span className="text-slate-500">Business Hours:</span>
                <strong className="text-slate-900">{shop.timing || shop.hours || '10:00 AM - 9:00 PM'}</strong>
              </div>
              <div className="flex justify-between py-1">
                <span className="text-slate-500">WhatsApp Contact Lead #:</span>
                <strong className="text-emerald-700">{shop.whatsapp || shop.phone || '+919876543210'}</strong>
              </div>
            </div>
          </div>

        </div>

        {/* Product Catalog Audit Table */}
        <div className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900 text-xs uppercase tracking-wider">Product Inventory Audit ({shopProducts.length})</h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-extrabold uppercase tracking-wider border-b border-slate-100">
                  <th className="py-3.5 px-4">Product Details</th>
                  <th className="py-3.5 px-4">Category</th>
                  <th className="py-3.5 px-4">Price</th>
                  <th className="py-3.5 px-4">Stock Status</th>
                  <th className="py-3.5 px-4 text-right">Admin Control</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {shopProducts.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-10 text-slate-400 font-medium">
                      No products listed by this store yet.
                    </td>
                  </tr>
                ) : (
                  shopProducts.map(prod => (
                    <tr key={prod.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img 
                            src={prod.images && prod.images.length > 0 ? prod.images[0] : 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=100'} 
                            alt={prod.name} 
                            className="w-10 h-10 rounded-xl object-cover border border-slate-100 flex-shrink-0" 
                          />
                          <div>
                            <strong className="text-slate-900 font-bold block">{prod.name}</strong>
                            <span className="text-[10px] text-slate-400">{prod.brand || 'Merchant Product'}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 text-slate-600 font-medium">{prod.categoryName || prod.category}</td>
                      <td className="py-3.5 px-4 font-black text-slate-900">₹{prod.price?.toLocaleString('en-IN')}</td>
                      <td className="py-3.5 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          prod.stockStatus === 'Out of Stock' ? 'bg-rose-100 text-rose-700' : 'bg-emerald-100 text-emerald-700'
                        }`}>
                          {prod.stockStatus || 'In Stock'}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <button 
                          onClick={() => setProductToDelete(prod)}
                          className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs rounded-xl transition-colors cursor-pointer border border-rose-200"
                        >
                          <i className="fa-solid fa-trash-can mr-1"></i> Delete Item
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

      {/* Delete Confirmation Modal */}
      {productToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in border border-slate-100">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto">
              <i className="fa-solid fa-trash-can"></i>
            </div>

            <div className="text-center space-y-1">
              <h3 className="text-base font-black text-slate-900">Delete Product from Catalog?</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Are you sure you want to remove <strong className="text-slate-800">{productToDelete.name}</strong> from this store's catalog? This action cannot be undone.
              </p>
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteProduct}
                className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer"
              >
                <i className="fa-solid fa-trash-can"></i> Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
