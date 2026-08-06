import React from 'react';
import ImageUploader from '../ImageUploader';

export default function ProductFormModal({
  showProductModal,
  onClose,
  modalMode,
  productForm,
  setProductForm,
  handleProductSubmit,
  savingProduct,
  categories = []
}) {
  if (!showProductModal) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 md:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto animate-fade-in border border-slate-100">

        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <h3 className="text-lg font-black text-slate-900">
            {modalMode === 'add' ? 'Add New Product' : 'Edit Product'}
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <i className="fa-solid fa-xmark text-lg"></i>
          </button>
        </div>

        <form onSubmit={handleProductSubmit} className="space-y-4">

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Product Title *</label>
            <input
              type="text"
              required
              placeholder="e.g. Samsung Galaxy M16 5G (6GB RAM, 128GB)"
              value={productForm.name}
              onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Brand Name</label>
              <input
                type="text"
                placeholder="e.g. Samsung"
                value={productForm.brand}
                onChange={(e) => setProductForm({ ...productForm, brand: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Category</label>
              <select
                value={productForm.categoryName}
                onChange={(e) => setProductForm({ ...productForm, categoryName: e.target.value, category: e.target.value.toLowerCase() })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
              >
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                placeholder="14999"
                value={productForm.price}
                onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Original MRP Price (₹)</label>
              <input
                type="number"
                placeholder="18999"
                value={productForm.originalPrice}
                onChange={(e) => setProductForm({ ...productForm, originalPrice: e.target.value })}
                className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
              />
            </div>
          </div>

          {/* Multiple Product Photos Uploader */}
          <ImageUploader
            label="Product Photos (Select Multiple)"
            multiple={true}
            values={productForm.images || []}
            onImagesChange={(newImgs) => setProductForm({ ...productForm, images: newImgs })}
            aspectRatio="square"
          />

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Stock Availability</label>
            <select
              value={productForm.stockStatus}
              onChange={(e) => setProductForm({ ...productForm, stockStatus: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50 font-medium cursor-pointer"
            >
              <option value="In Stock">In Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>

          <div className="flex items-center gap-2 p-3 bg-amber-50 rounded-xl border border-amber-200/80">
            <input
              type="checkbox"
              id="dealOfDayCheck"
              checked={productForm.isDealOfDay || false}
              onChange={(e) => setProductForm({ ...productForm, isDealOfDay: e.target.checked })}
              className="w-4 h-4 text-emerald-600 rounded cursor-pointer accent-[#056839]"
            />
            <label htmlFor="dealOfDayCheck" className="text-xs font-extrabold text-slate-800 cursor-pointer select-none">
              Mark as "Best Deal of the Day" (Featured on Home Screen)
            </label>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Highlights (comma separated)</label>
            <input
              type="text"
              placeholder="e.g. 1 Year Warranty, 50MP Camera, 6000mAh Battery"
              value={productForm.highlights}
              onChange={(e) => setProductForm({ ...productForm, highlights: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Description</label>
            <textarea
              rows="3"
              placeholder="Detailed product specifications and features..."
              value={productForm.description}
              onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
              className="w-full px-3.5 py-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-emerald-500 bg-slate-50"
            ></textarea>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={savingProduct}
              className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {savingProduct ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Product...</span>
                </>
              ) : (
                <>
                  <i className="fa-solid fa-floppy-disk"></i> {modalMode === 'add' ? 'Save Product' : 'Update Product'}
                </>
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
