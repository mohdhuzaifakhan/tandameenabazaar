import React from 'react';

export default function DeleteProductModal({
  productToDelete,
  onCancel,
  onConfirm,
  deleting
}) {
  if (!productToDelete) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4 animate-fade-in border border-slate-100">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 text-rose-600 flex items-center justify-center text-xl mx-auto">
          <i className="fa-solid fa-trash-can"></i>
        </div>

        <div className="text-center space-y-1">
          <h3 className="text-base font-black text-slate-900">Delete Product?</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Are you sure you want to remove <strong className="text-slate-800">{productToDelete.name}</strong> from your shop catalog? This action cannot be undone.
          </p>
        </div>

        <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={deleting}
            onClick={onConfirm}
            className="px-5 py-2.5 bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs rounded-xl transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-50"
          >
            {deleting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <i className="fa-solid fa-trash-can"></i> Confirm Delete
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
