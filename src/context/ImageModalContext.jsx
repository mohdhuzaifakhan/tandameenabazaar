import React, { createContext, useContext, useState, useEffect } from 'react';

const ImageModalContext = createContext();

export function ImageModalProvider({ children }) {
  const [modalState, setModalState] = useState({
    isOpen: false,
    src: '',
    title: ''
  });

  const openImageModal = (src, title = '') => {
    if (!src) return;
    setModalState({
      isOpen: true,
      src,
      title
    });
  };

  const closeImageModal = () => {
    setModalState({
      isOpen: false,
      src: '',
      title: ''
    });
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        closeImageModal();
      }
    };
    if (modalState.isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [modalState.isOpen]);

  return (
    <ImageModalContext.Provider value={{ openImageModal, closeImageModal }}>
      {children}

      {/* Global Fullscreen Lightbox Modal */}
      {modalState.isOpen && (
        <div 
          className="fixed inset-0 z-[9999] bg-slate-950/90 backdrop-blur-md flex flex-col items-center justify-center p-4 cursor-zoom-out select-none animate-fade-in"
          onClick={closeImageModal}
        >
          {/* Close Button */}
          <button 
            type="button"
            onClick={closeImageModal} 
            className="absolute top-4 right-4 sm:top-6 sm:right-6 text-white text-lg w-11 h-11 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center transition-all cursor-pointer z-10 shadow-xl"
            title="Close Preview (ESC)"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>

          {/* Title / Caption Badge */}
          {modalState.title && (
            <div className="absolute top-4 left-4 sm:top-6 sm:left-6 px-3.5 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white font-extrabold text-xs max-w-xs sm:max-w-md truncate z-10 shadow-xl">
              {modalState.title}
            </div>
          )}

          {/* Image Container */}
          <div 
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center p-2"
            onClick={closeImageModal}
          >
            <img 
              src={modalState.src} 
              alt={modalState.title || 'Image Preview'} 
              className="max-w-full max-h-[85vh] object-contain rounded-2xl shadow-2xl transition-transform duration-300 cursor-zoom-out" 
            />
          </div>

          {/* Helper hint text */}
          <div className="absolute bottom-4 text-[11px] text-white/70 font-semibold flex items-center gap-1.5 pointer-events-none">
            <i className="fa-solid fa-magnifying-glass-minus"></i> Click anywhere to zoom out & close
          </div>
        </div>
      )}
    </ImageModalContext.Provider>
  );
}

export const useImageModal = () => useContext(ImageModalContext);

// Reusable Zoomable Image Component
export function ZoomableImage({ src, alt = '', title = '', className = '', containerClassName = '', ...props }) {
  const { openImageModal } = useImageModal();

  const handleClick = (e) => {
    e.stopPropagation();
    openImageModal(src, title || alt);
  };

  return (
    <div 
      className={`relative group cursor-zoom-in overflow-hidden ${containerClassName}`}
      onClick={handleClick}
      title="Click to zoom in"
    >
      <img src={src} alt={alt} className={className} {...props} />
      <div className="absolute inset-0 bg-slate-900/0 group-hover:bg-slate-900/10 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100 pointer-events-none">
        <span className="w-8 h-8 rounded-full bg-white/80 text-slate-800 flex items-center justify-center text-xs shadow-md">
          <i className="fa-solid fa-magnifying-glass-plus"></i>
        </span>
      </div>
    </div>
  );
}
