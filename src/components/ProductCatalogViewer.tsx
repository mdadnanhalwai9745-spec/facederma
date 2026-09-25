import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Upload, Maximize2, X, ZoomIn } from 'lucide-react';
import { Product } from '../types';

interface ProductCatalogViewerProps {
  product: Product;
  onUploadCatalog?: (productId: string, dataUrl: string) => Promise<void> | void;
  onResetCatalog?: (productId: string) => Promise<void> | void;
}

export const ProductCatalogViewer: React.FC<ProductCatalogViewerProps> = ({
  product,
  onUploadCatalog,
}) => {
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const catalogUrl = product.secondaryImage;

  const handleFile = (file: File) => {
    if (!file) return;
    setIsUploading(true);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      if (dataUrl && onUploadCatalog) {
        try {
          await onUploadCatalog(product.id, dataUrl);
        } catch (err) {
          console.error('Error uploading catalog:', err);
        } finally {
          setIsUploading(false);
        }
      } else {
        setIsUploading(false);
      }
    };
    reader.onerror = () => {
      setIsUploading(false);
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  return (
    <div className="w-full">
      {/* Hidden File Input for Catalog Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFile(e.target.files[0]);
            e.target.value = '';
          }
        }}
      />

      {catalogUrl ? (
        /* Pure Image Presentation - Zero clutter, zero borders/text */
        <div
          className="relative w-full rounded-2xl sm:rounded-3xl overflow-hidden bg-white border border-[#EDE8DF] shadow-[0_12px_40px_rgba(0,0,0,0.04)] group cursor-pointer"
          onClick={() => setIsLightboxOpen(true)}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <img
            src={catalogUrl}
            alt={`${product.name} Catalog`}
            referrerPolicy="no-referrer"
            className="w-full h-auto block object-contain transition-transform duration-300 group-hover:scale-[1.01]"
          />

          {/* Minimalist Hover Controls: Zoom and Quick Change */}
          <div className="absolute top-3 right-3 flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              title="Change catalog image"
              className="p-2 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-md transition-all shadow-md"
            >
              <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
            </button>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsLightboxOpen(true);
              }}
              title="Enlarge image"
              className="p-2 rounded-full bg-black/70 hover:bg-black text-white backdrop-blur-md transition-all shadow-md"
            >
              <Maximize2 className="w-3.5 h-3.5 text-white" />
            </button>
          </div>

          {/* Subtle drag-and-drop feedback */}
          {isDragging && (
            <div className="absolute inset-0 bg-[#C5A880]/25 backdrop-blur-xs border-2 border-dashed border-[#C5A880] flex items-center justify-center">
              <span className="px-4 py-2 rounded-full bg-white text-xs font-semibold text-[#1E1D1B] shadow-lg">
                Drop image to replace
              </span>
            </div>
          )}
        </div>
      ) : (
        /* When no catalog image is uploaded yet: A clean, minimal image drop container */
        <div
          className={`relative w-full rounded-2xl sm:rounded-3xl border-2 border-dashed transition-all p-8 flex flex-col items-center justify-center text-center cursor-pointer ${
            isDragging
              ? 'border-[#C5A880] bg-[#FAF9F6]'
              : 'border-[#DDD7CD] hover:border-[#C5A880] bg-white/60'
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="w-12 h-12 rounded-2xl bg-[#FAF9F6] border border-[#EDE8DF] flex items-center justify-center text-[#C5A880] mb-3 shadow-xs">
            <Upload className="w-5 h-5" />
          </div>
          <p className="font-medium text-xs sm:text-sm text-[#1E1D1B]">
            {isUploading ? 'Uploading Image...' : 'Click or drop catalog image here'}
          </p>
          <p className="text-[11px] text-[#8E8A83] mt-1">PNG, JPG, or WEBP</p>
        </div>
      )}

      {/* Fullscreen Lightbox for Inspection */}
      <AnimatePresence>
        {isLightboxOpen && catalogUrl && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/90 backdrop-blur-md"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.18 }}
              className="relative max-w-5xl w-full max-h-[95vh] flex items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="absolute -top-12 right-0 p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>

              <img
                src={catalogUrl}
                alt={`${product.name} Catalog Fullscreen`}
                referrerPolicy="no-referrer"
                className="max-w-full max-h-[90vh] object-contain rounded-2xl shadow-2xl"
              />
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
