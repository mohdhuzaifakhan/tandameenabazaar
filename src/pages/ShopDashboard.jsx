import React, { useState } from 'react';
import { useBazaar } from '../context/BazaarContext';
import DashboardLayout from '../components/DashboardLayout';

export default function ShopDashboard() {
  const { currentUser, products, orders, addProduct, updateProduct, deleteProduct } = useBazaar();
  const shopId = currentUser?.shopId || 'sharma-mobile';

  const shopProducts = products.filter(p => p.shopId === shopId);
  const shopOrders = orders.filter(o => o.shopId === shopId);

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState('add');
  const [editingProduct, setEditingProduct] = useState(null);

  const [formFields, setFormFields] = useState({
    name: '', brand: '', price: '', originalPrice: '',
    category: 'electronics', categoryName: 'Electronics',
    description: '', image: '', highlights: '',
    stockStatus: 'In Stock', status: 'Active'
  });

  const openAddModal = () => {
    setModalMode('add');
    setFormFields({
      name: '', brand: '', price: '', originalPrice: '',
      category: 'electronics', categoryName: 'Electronics',
      description: '',
      image: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80',
      highlights: 'Premium Quality, 1 Year Warranty',
      stockStatus: 'In Stock', status: 'Active'
    });
    setShowModal(true);
  };

  const openEditModal = (product) => {
    setModalMode('edit');
    setEditingProduct(product);
    setFormFields({
      name: product.name,
      brand: product.brand || '',
      price: product.price.toString(),
      originalPrice: product.originalPrice ? product.originalPrice.toString() : product.price.toString(),
      category: product.category,
      categoryName: product.categoryName || 'Electronics',
      description: product.description || '',
      image: product.images ? product.images[0] : '',
      highlights: product.highlights ? product.highlights.join(', ') : '',
      stockStatus: product.stockStatus || 'In Stock',
      status: product.status || 'Active'
    });
    setShowModal(true);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const highlightsArr = formFields.highlights
      ? formFields.highlights.split(',').map(h => h.trim()).filter(Boolean)
      : [];

    const productPayload = {
      name: formFields.name,
      brand: formFields.brand,
      price: Number(formFields.price),
      originalPrice: Number(formFields.originalPrice || formFields.price),
      category: formFields.category,
      categoryName: formFields.categoryName,
      description: formFields.description,
      images: formFields.image ? [formFields.image] : ['https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400&q=80'],
      highlights: highlightsArr,
      stockStatus: formFields.stockStatus,
      status: formFields.status,
      shopId,
      shopName: currentUser?.shopName || 'Sharma Mobile Store'
    };

    if (modalMode === 'add') addProduct(productPayload);
    else updateProduct({ ...editingProduct, ...productPayload });
    setShowModal(false);
  };

  const topProducts = shopProducts.slice(0, 4);

  const stats = [
    { label: 'Products', value: shopProducts.length || 248, icon: 'fa-box', color: 'bg-emerald-50 text-emerald-600', trend: '+12 this week' },
    { label: 'Views', value: '5.6K', icon: 'fa-eye', color: 'bg-purple-50 text-purple-600', trend: '+18% this week' },
    { label: 'WhatsApp', value: 320, icon: 'fa-brands fa-whatsapp', color: 'bg-emerald-50 text-emerald-600', trend: '+15% this week' },
    { label: 'Leads', value: 23, icon: 'fa-comment-dots', color: 'bg-orange-50 text-orange-500', trend: '+6 this week' },
  ];

  return (
    <DashboardLayout title="Dashboard" role="shop">
      <div className="flex flex-col gap-5 md:gap-8 animate-fade-in">

        {/* ── Page Title Row ── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-lg md:text-2xl font-black text-slate-900 tracking-tight">Dashboard</h1>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5 hidden sm:block">
              Manage your products, stock and chat orders.
            </p>
          </div>
          <button
            onClick={openAddModal}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer border-none"
          >
            <i className="fa-solid fa-plus"></i>
            <span className="hidden sm:inline">Add Product</span>
          </button>
        </div>

        {/* ── Stats Grid ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
          {stats.map((s, i) => (
            <div key={i} className="bg-white rounded-2xl p-4 border border-slate-100 flex flex-col gap-2.5">
              <div className="flex items-center justify-between">
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center text-sm flex-shrink-0 ${s.color}`}>
                  <i className={`fa-solid ${s.icon}`}></i>
                </div>
                <span className="text-[9px] text-emerald-600 font-bold text-right leading-tight hidden sm:block">{s.trend}</span>
              </div>
              <div>
                <span className="text-xl font-black text-slate-900 block leading-none">{s.value}</span>
                <span className="text-[10px] text-slate-400 font-medium mt-0.5 block">{s.label}</span>
              </div>
            </div>
          ))}
        </div>

        {/* ── Analytics + Top Products Row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">

          {/* Chart */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100 lg:col-span-2">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">Views Analytics</h3>
              <select className="border border-slate-200 rounded-lg text-[10px] font-bold px-2 py-1 outline-none text-slate-600 cursor-pointer bg-white">
                <option>This Week</option>
                <option>This Month</option>
              </select>
            </div>
            <div className="h-36 md:h-44 relative">
              <svg viewBox="0 0 500 200" className="w-full h-full">
                <line x1="20" y1="20" x2="480" y2="20" stroke="#f1f5f9" strokeWidth="1.5" />
                <line x1="20" y1="70" x2="480" y2="70" stroke="#f1f5f9" strokeWidth="1.5" />
                <line x1="20" y1="120" x2="480" y2="120" stroke="#f1f5f9" strokeWidth="1.5" />
                <line x1="20" y1="170" x2="480" y2="170" stroke="#f1f5f9" strokeWidth="1.5" />
                <text x="5" y="25" fill="#94a3b8" fontSize="8" fontWeight="bold">1K</text>
                <text x="5" y="75" fill="#94a3b8" fontSize="8" fontWeight="bold">500</text>
                <text x="5" y="175" fill="#94a3b8" fontSize="8" fontWeight="bold">0</text>
                <path d="M 30,150 Q 80,100 130,120 T 230,140 T 330,80 T 430,110 L 480,50"
                  fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" />
                {[30,130,230,330,430,480].map((cx, i) => (
                  <circle key={i} cx={cx} cy={[150,120,140,80,110,50][i]} r="4" fill="#059669" />
                ))}
                <text x="30" y="195" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">20 May</text>
                <text x="130" y="195" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">22 May</text>
                <text x="230" y="195" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">24 May</text>
                <text x="330" y="195" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">25 May</text>
                <text x="450" y="195" fill="#94a3b8" fontSize="8" textAnchor="middle" fontWeight="bold">26 May</text>
              </svg>
            </div>
          </div>

          {/* Top Products */}
          <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-black text-slate-900 text-xs uppercase tracking-wider">Top Performing</h3>
              <span className="text-[10px] font-bold text-emerald-600 cursor-pointer">View All</span>
            </div>
            <div className="flex flex-col gap-3.5">
              {topProducts.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">No products yet</p>
              ) : topProducts.map((prod, idx) => (
                <div key={prod.id} className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <img src={prod.images[0]} alt={prod.name} className="w-8 h-8 rounded-lg object-cover border border-slate-100 flex-shrink-0" />
                    <div className="leading-tight min-w-0">
                      <h4 className="text-xs font-bold text-slate-800 truncate">{prod.name}</h4>
                      <span className="text-[10px] text-slate-400">{890 - idx * 105} views</span>
                    </div>
                  </div>
                  <span className="flex-shrink-0 bg-emerald-50 text-emerald-700 text-[10px] font-black px-2 py-0.5 rounded-full">
                    {67 - idx * 8} clicks
                  </span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* ── Product Catalog ── */}
        <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">

          {/* Header */}
          <div className="flex items-center justify-between px-4 md:px-6 py-4 border-b border-slate-100">
            <div>
              <h3 className="font-black text-slate-900 text-sm">Product Catalog</h3>
              <span className="text-[11px] text-slate-400 font-medium">{shopProducts.length} products listed</span>
            </div>
            <button
              onClick={openAddModal}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs transition-colors cursor-pointer border-none"
            >
              <i className="fa-solid fa-plus"></i> Add
            </button>
          </div>

          {/* Desktop Table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 font-bold border-b border-slate-100">
                  <th className="px-4 py-3">Product</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Price</th>
                  <th className="px-4 py-3">Stock</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3 text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {shopProducts.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-10 text-slate-400 font-medium">
                      No products yet. Add your first product above!
                    </td>
                  </tr>
                ) : shopProducts.map(prod => (
                  <tr key={prod.id} className="border-b border-slate-50 hover:bg-slate-50/50">
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={prod.images[0]} alt={prod.name} className="w-9 h-9 rounded-lg object-cover border border-slate-100 flex-shrink-0" />
                        <div>
                          <strong className="text-slate-800 font-bold block">{prod.name}</strong>
                          <span className="text-[10px] text-slate-400">{prod.brand}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-500">{prod.categoryName}</td>
                    <td className="px-4 py-3 font-bold text-slate-800">₹{prod.price.toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3">
                      <span className={`font-black uppercase text-[9px] ${prod.stockStatus === 'In Stock' ? 'text-emerald-600' : prod.stockStatus === 'Low Stock' ? 'text-orange-500' : 'text-red-500'}`}>
                        {prod.stockStatus || 'In Stock'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded text-[9px] font-black uppercase ${prod.status === 'Active' ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
                        {prod.status || 'Active'}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2 justify-center">
                        <button onClick={() => openEditModal(prod)} className="w-7 h-7 rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-600 flex items-center justify-center cursor-pointer border border-slate-200" title="Edit">
                          <i className="fa-regular fa-pen-to-square text-xs"></i>
                        </button>
                        <button onClick={() => { if(confirm('Delete this product?')) deleteProduct(prod.id); }} className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 text-red-500 flex items-center justify-center cursor-pointer border border-red-100" title="Delete">
                          <i className="fa-regular fa-trash-can text-xs"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Card List */}
          <div className="md:hidden divide-y divide-slate-100">
            {shopProducts.length === 0 ? (
              <div className="text-center py-10 text-slate-400 text-xs font-medium">
                No products yet. Tap Add above!
              </div>
            ) : shopProducts.map(prod => (
              <div key={prod.id} className="flex items-center gap-3 px-4 py-3.5">
                <img src={prod.images[0]} alt={prod.name} className="w-11 h-11 rounded-xl object-cover border border-slate-100 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-bold text-slate-800 truncate">{prod.name}</h4>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-black text-slate-700">₹{prod.price.toLocaleString('en-IN')}</span>
                    <span className={`text-[9px] font-black uppercase ${prod.stockStatus === 'In Stock' ? 'text-emerald-600' : 'text-red-500'}`}>
                      {prod.stockStatus}
                    </span>
                  </div>
                </div>
                <div className="flex gap-1.5 flex-shrink-0">
                  <button onClick={() => openEditModal(prod)} className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-center cursor-pointer text-slate-600">
                    <i className="fa-regular fa-pen-to-square text-xs"></i>
                  </button>
                  <button onClick={() => { if(confirm('Delete?')) deleteProduct(prod.id); }} className="w-8 h-8 rounded-xl bg-red-50 border border-red-100 text-red-500 flex items-center justify-center cursor-pointer">
                    <i className="fa-regular fa-trash-can text-xs"></i>
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>

      </div>

      {/* ── Add/Edit Modal ── */}
      {showModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-end md:items-center justify-center z-[1000] p-0 md:p-4">
          <div className="bg-white w-full md:max-w-lg rounded-t-3xl md:rounded-3xl max-h-[92vh] overflow-y-auto flex flex-col">

            {/* Modal Header */}
            <div className="flex justify-between items-center px-5 pt-5 pb-4 border-b border-slate-100 sticky top-0 bg-white z-10">
              {/* Mobile drag handle */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-slate-200 md:hidden"></div>
              <h3 className="text-sm font-black text-slate-900">
                {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
              </h3>
              <button
                onClick={() => setShowModal(false)}
                className="w-8 h-8 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center cursor-pointer border-none"
              >
                <i className="fa-solid fa-xmark"></i>
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="flex flex-col gap-4 p-5">

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Product Title *</label>
                <input type="text" required value={formFields.name}
                  onChange={e => setFormFields({...formFields, name: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/50 font-semibold"
                  placeholder="Enter product name" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Brand</label>
                  <input type="text" value={formFields.brand}
                    onChange={e => setFormFields({...formFields, brand: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/50 font-semibold"
                    placeholder="Brand name" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Category</label>
                  <select value={formFields.category}
                    onChange={e => setFormFields({...formFields, category: e.target.value, categoryName: e.target.options[e.target.selectedIndex].text})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/50 font-semibold cursor-pointer">
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="groceries">Groceries</option>
                    <option value="footwear">Footwear</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Sale Price (₹) *</label>
                  <input type="number" required value={formFields.price}
                    onChange={e => setFormFields({...formFields, price: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/50 font-semibold"
                    placeholder="0" />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Original Price (₹)</label>
                  <input type="number" value={formFields.originalPrice}
                    onChange={e => setFormFields({...formFields, originalPrice: e.target.value})}
                    className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/50 font-semibold"
                    placeholder="0" />
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Stock Status</label>
                <select value={formFields.stockStatus}
                  onChange={e => setFormFields({...formFields, stockStatus: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/50 font-semibold cursor-pointer">
                  <option value="In Stock">In Stock</option>
                  <option value="Low Stock">Low Stock</option>
                  <option value="Out of Stock">Out of Stock</option>
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Image URL</label>
                <input type="text" value={formFields.image}
                  onChange={e => setFormFields({...formFields, image: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/50 font-semibold"
                  placeholder="https://..." />
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">Highlights (comma separated)</label>
                <input type="text" value={formFields.highlights}
                  onChange={e => setFormFields({...formFields, highlights: e.target.value})}
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50/50 font-semibold"
                  placeholder="1 Year Warranty, Fast Delivery" />
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-xs cursor-pointer transition-colors border-none">
                  Cancel
                </button>
                <button type="submit"
                  className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs cursor-pointer transition-colors border-none">
                  {modalMode === 'add' ? 'Add Product' : 'Save Changes'}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
}
