import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, Check, ShoppingBag, ShieldCheck } from 'lucide-react';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { getAssetUrl } from '../utils/assetPath';

interface QuickViewModalProps {
  isOpen: boolean;
  product: Product | null;
  onClose: () => void;
  onOrderClick: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  isOpen,
  product,
  onClose,
  onOrderClick,
}) => {
  if (!isOpen || !product) return null;

  const initialMatch = INITIAL_PRODUCTS.find((p) => p.id === product.id);
  const fallback = product.secondaryImage || initialMatch?.secondaryImage || '';
  const displayImage = product.image || fallback;
  const hoverImage = product.secondaryImage || displayImage;

  return (
    <AnimatePresence>
      <div
        id="quick-view-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.28, ease: 'easeOut' }}
          className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-[#EDE8DF] overflow-hidden z-10 grid grid-cols-1 md:grid-cols-2"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close Quick View"
            className="absolute top-4 right-4 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/90 shadow-md text-gray-500 hover:text-gray-900 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Left: Product Stage (Edge to Edge, No White Border) */}
          <div className="relative aspect-square md:aspect-auto bg-[#FAF9F6] p-0 flex flex-col items-center justify-center select-none overflow-hidden border-b md:border-b-0 md:border-r border-[#EAE5DD]">
            {(product.image && !product.image.includes('_catalog')) || `/products/permanent/${product.id}.png` ? (
              <img
                src={getAssetUrl((product.image && !product.image.includes('_catalog')) ? product.image : `/products/permanent/${product.id}.png`)}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover select-none"
              />
            ) : (
              <div className="flex flex-col items-center text-center space-y-2">
                <span className="text-[11px] font-mono uppercase bg-white px-3 py-1 rounded-full border border-[#EAE5DD] text-[#C05674] font-bold shadow-2xs">
                  {product.id.toUpperCase()}
                </span>
                <h3 className="font-serif text-2xl font-light text-[#1E2229] max-w-[200px]">
                  {product.name}
                </h3>
                <span className="text-[11px] text-[#6B665E] font-light">
                  {product.volume || 'Face Derma®'}
                </span>
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-4 bg-white">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-[#C05674]" />
                <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-[#C05674]">
                  {product.category || 'Clinical Line'}
                </span>
                {product.volume && (
                  <span className="text-[10px] font-mono text-gray-400 ml-auto">
                    {product.volume}
                  </span>
                )}
              </div>

              <h2 className="text-2xl sm:text-3xl font-serif text-[#1E2229] tracking-tight leading-tight">
                {product.name}
              </h2>

              <p className="text-xs sm:text-sm text-[#6B665E] font-medium tracking-wide">
                {product.subtitle}
              </p>

              <p className="text-xs sm:text-sm text-[#4A4742] leading-relaxed pt-1">
                {product.fullDescription || product.shortDescription}
              </p>

              {/* Key Benefits */}
              {product.keyBenefits && product.keyBenefits.length > 0 && (
                <div className="pt-2 space-y-1.5">
                  <span className="text-[11px] font-semibold text-[#1E2229] uppercase tracking-wider block">
                    Clinical Highlights
                  </span>
                  <ul className="space-y-1">
                    {product.keyBenefits.map((b, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-[#4A4742]">
                        <Check className="w-3.5 h-3.5 text-[#C05674] shrink-0 mt-0.5" />
                        <span>{b}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-[#EAE5DD] flex flex-col gap-2.5">
              <button
                onClick={() => {
                  onClose();
                  onOrderClick(product);
                }}
                className="w-full py-3 px-6 rounded-full bg-[#1E2229] hover:bg-[#C05674] text-white text-xs font-bold uppercase tracking-widest transition-all duration-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Order Now</span>
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#8E8A83] uppercase tracking-wider">
                <ShieldCheck className="w-3 h-3 text-[#C05674]" />
                <span>Authentic Formulation Guaranteed</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
