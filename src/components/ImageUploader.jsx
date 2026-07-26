import React, { useState, useRef } from 'react';
import { useImageModal } from '../context/ImageModalContext';
import { DEFAULT_STORE_LOGO, DEFAULT_COVER_BANNER } from '../utils/defaultAssets';

// Preset sample graphics for quick selection
const PRESET_LOGOS = [
  { name: 'Default Store Logo', url: DEFAULT_STORE_LOGO }
];

const PRESET_BANNERS = [
  { name: 'Default Cover Header', url: DEFAULT_COVER_BANNER }
];

export default function ImageUploader({ 
  value = "", 
  onChange,
  values = [], // For multi-image mode
  onImagesChange, // For multi-image mode
  multiple = false, 
  label = "Product Image", 
  aspectRatio = "square", 
  placeholder = "Upload file or paste image URL..." 
}) {
  const { openImageModal } = useImageModal();
  const [uploading, setUploading] = useState(false);
  const [activeMode, setActiveMode] = useState('upload'); // 'upload' | 'url' | 'presets'
  const [urlInput, setUrlInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const fileInputRef = useRef(null);

  // Helper: Read file and compress on canvas to optimized Base64 JPEG
  const processAndCompressImage = (file, maxDim = 800, quality = 0.82) => {
    return new Promise((resolve, reject) => {
      if (!file || !file.type.startsWith('image/')) {
        reject(new Error('Selected file is not a valid image.'));
        return;
      }
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          try {
            let width = img.width;
            let height = img.height;

            if (width > maxDim || height > maxDim) {
              if (width > height) {
                height = Math.round((height * maxDim) / width);
                width = maxDim;
              } else {
                width = Math.round((width * maxDim) / height);
                height = maxDim;
              }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');

            // Draw with high quality canvas rendering
            ctx.imageSmoothingEnabled = true;
            ctx.imageSmoothingQuality = 'high';
            ctx.drawImage(img, 0, 0, width, height);

            const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
            resolve(compressedDataUrl);
          } catch (canvasErr) {
            reject(canvasErr);
          }
        };
        img.onerror = () => reject(new Error('Failed to load image into memory.'));
        img.src = e.target.result;
      };
      reader.onerror = () => reject(new Error('Failed to read file.'));
      reader.readAsDataURL(file);
    });
  };

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setErrorMsg('');
    setUploading(true);

    try {
      const validFiles = files.filter(f => f.type.startsWith('image/'));
      if (validFiles.length === 0) {
        setErrorMsg('Please select valid image files (PNG, JPG, WEBP).');
        setUploading(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // Determine optimal max dimension based on aspect ratio / multi mode
      const maxDim = aspectRatio === 'banner' ? 1200 : (multiple ? 800 : 500);

      // Convert and compress all selected files
      const encodedImages = await Promise.all(
        validFiles.map(f => processAndCompressImage(f, maxDim, 0.82))
      );

      if (multiple && onImagesChange) {
        onImagesChange([...(values || []), ...encodedImages]);
      } else if (onChange) {
        onChange(encodedImages[0]);
      }
      setUploading(false);
    } catch (err) {
      console.error("Error processing image files:", err);
      setErrorMsg("Failed to process image files. Please try a different photo.");
      setUploading(false);
    } finally {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };


  const handleAddUrl = (e) => {
    e.preventDefault();
    if (!urlInput.trim()) return;

    if (multiple && onImagesChange) {
      onImagesChange([...(values || []), urlInput.trim()]);
      setUrlInput('');
    } else if (onChange) {
      onChange(urlInput.trim());
      setUrlInput('');
    }
  };

  const removeImageAt = (index) => {
    if (multiple && onImagesChange) {
      const updated = values.filter((_, i) => i !== index);
      onImagesChange(updated);
    } else if (onChange) {
      onChange('');
    }
  };

  const setCoverImageAt = (index) => {
    if (multiple && onImagesChange && index > 0) {
      const selected = values[index];
      const rest = values.filter((_, i) => i !== index);
      onImagesChange([selected, ...rest]);
    }
  };

  const presets = aspectRatio === 'banner' ? PRESET_BANNERS : PRESET_LOGOS;
  const imageList = multiple ? values : (value ? [value] : []);

  return (
    <div className="space-y-2">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
        <label className="text-xs font-bold text-slate-700 block">
          {label} {multiple && <span className="text-slate-400 font-normal">({imageList.length} Selected)</span>}
        </label>

        {/* Mode Toggle Buttons */}
        <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-[10px] w-fit">
          <button
            type="button"
            onClick={() => setActiveMode('upload')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
              activeMode === 'upload' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-cloud-arrow-up mr-1"></i> Upload {multiple ? 'Files' : 'File'}
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('url')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
              activeMode === 'url' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-link mr-1"></i> Image URL
          </button>
          <button
            type="button"
            onClick={() => setActiveMode('presets')}
            className={`px-2.5 py-1 rounded-md font-bold transition-all cursor-pointer ${
              activeMode === 'presets' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <i className="fa-solid fa-wand-magic-sparkles mr-1"></i> Presets
          </button>
        </div>
      </div>

      {/* Error Message */}
      {errorMsg && (
        <p className="text-[11px] text-rose-600 font-medium flex items-center gap-1">
          <i className="fa-solid fa-circle-exclamation"></i> {errorMsg}
        </p>
      )}

      {/* Multi-Image Gallery Grid or Single Preview */}
      <div className="space-y-3">
        
        {/* Thumbnails Display */}
        {imageList.length > 0 && (
          <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5">
            {imageList.map((imgUrl, idx) => (
              <div 
                key={idx} 
                className={`relative rounded-xl border overflow-hidden group bg-slate-50 flex items-center justify-center cursor-zoom-in ${
                  idx === 0 ? 'border-emerald-500 ring-2 ring-emerald-500/20' : 'border-slate-200'
                } ${aspectRatio === 'banner' ? 'h-20' : 'h-24'}`}
                onClick={() => openImageModal(imgUrl, label || 'Image Preview')}
                title="Click to zoom image"
              >
                <img src={imgUrl} alt={`Uploaded ${idx + 1}`} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
                
                {/* Cover badge for first image */}
                {idx === 0 && (
                  <span className="absolute top-1 left-1 px-1.5 py-0.5 bg-emerald-600 text-white font-extrabold text-[8px] rounded uppercase tracking-wider">
                    Cover
                  </span>
                )}

                {/* Make Cover Button if not first */}
                {multiple && idx > 0 && (
                  <button
                    type="button"
                    onClick={() => setCoverImageAt(idx)}
                    className="absolute bottom-1 left-1 px-1.5 py-0.5 bg-slate-900/80 hover:bg-slate-900 text-white text-[8px] font-bold rounded opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    Set Cover
                  </button>
                )}

                {/* Remove Image Button */}
                <button
                  type="button"
                  onClick={() => removeImageAt(idx)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-rose-600 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-rose-700 cursor-pointer shadow-sm"
                  title="Remove photo"
                >
                  <i className="fa-solid fa-xmark text-[10px]"></i>
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Input Controls */}
        <div>
          {activeMode === 'upload' && (
            <div className="space-y-1.5">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple={multiple}
                onChange={handleFileChange}
                className="hidden"
              />
              
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-800 text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer disabled:opacity-50"
              >
                {uploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
                    <span>Processing Photos...</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-images text-emerald-600 text-sm"></i>
                    <span>{multiple ? 'Select Photos (Select Multiple)' : 'Select Photo from Device'}</span>
                  </>
                )}
              </button>
            </div>
          )}

          {activeMode === 'url' && (
            <form onSubmit={handleAddUrl} className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder={placeholder}
                className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-xs outline-none focus:border-emerald-500 font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer"
              >
                Add Image
              </button>
            </form>
          )}

          {activeMode === 'presets' && (
            <div className="flex flex-wrap gap-2">
              {presets.map((preset, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    if (multiple && onImagesChange) {
                      onImagesChange([...(values || []), preset.url]);
                    } else if (onChange) {
                      onChange(preset.url);
                    }
                  }}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 bg-slate-50 hover:bg-emerald-50 hover:border-emerald-300 text-slate-700 hover:text-emerald-700 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                >
                  <img src={preset.url} alt={preset.name} className="w-4 h-4 rounded-full object-cover" />
                  <span>{preset.name}</span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
