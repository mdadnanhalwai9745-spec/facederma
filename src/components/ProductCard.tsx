import React, { useState, useEffect } from 'react';
import { ArrowRight, Star } from 'lucide-react';
import { Product, ContactInfo } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { getAssetUrl } from '../utils/assetPath';

interface ProductCardProps {
  product: Product;
  contact: ContactInfo;
  onSelectProduct: (product: Product) => void;
  onOrderClick: (product: Product) => void;
  onUploadImage?: (productId: string, dataUrl: string, isSecondary?: boolean) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  onOrderClick,
  onUploadImage,
}) => {
  const rating = product.rating || 4.9;
  const initialMatch = INITIAL_PRODUCTS.find((p) => p.id === product.id);

  const [candidateIdx, setCandidateIdx] = useState(0);
  const [hasFailed, setHasFailed] = useState(false);

  // Strictly only include images that are specified and not catalogs
  const candidateImages: string[] = [
    product.image ? getAssetUrl(product.image) : '',
    initialMatch?.image ? getAssetUrl(initialMatch.image) : '',
    getAssetUrl(`/products/permanent/${product.id}.png`),
    getAssetUrl(`/products/permanent/${product.id}.webp`),
    getAssetUrl(`/products/permanent/${product.id}.jpg`),
  ].filter((src): src is string => typeof src === 'string' && src.length > 0 && !src.includes('_catalog'));

  useEffect(() => {
    setCandidateIdx(0);
    setHasFailed(false);
  }, [product.id, product.image]);

  const activeSrc = !hasFailed && candidateIdx < candidateImages.length ? candidateImages[candidateIdx] : null;

  const handleImageError = () => {
    if (candidateIdx < candidateImages.length - 1) {
      setCandidateIdx((prev) => prev + 1);
    } else {
      setHasFailed(true);
    }
  };

  return (
    <div
      id={`product-card-${product.id}`}
      onClick={() => onSelectProduct(product)}
      className="group relative flex flex-col w-full bg-white rounded-2xl overflow-hidden shadow-[0_4px_20px_rgba(0,0,0,0.04)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-300 ease-out cursor-pointer"
    >
      {/* 1:1 SQUARE RATIO PRODUCT PRESENTATION */}
      <div className="relative w-full aspect-square bg-[#FAF9F6] overflow-hidden select-none flex items-center justify-center p-0">
        {/* Clinical Formula Category Pill */}
        <div className="absolute top-2 sm:top-3 left-2 sm:left-3 z-10 pointer-events-none">
          <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#EAE5DD]/80 text-[8px] sm:text-[9px] font-semibold tracking-wider uppercase text-[#1E2229] shadow-xs truncate max-w-[90px] sm:max-w-none inline-block">
            {product.category}
          </span>
        </div>

        {/* Volume/Specification Micro Badge */}
        {product.volume && (
          <div className="absolute top-2 sm:top-3 right-2 sm:right-3 z-10 pointer-events-none">
            <span className="px-1.5 sm:px-2.5 py-0.5 sm:py-1 rounded-full bg-white/95 backdrop-blur-md border border-[#EAE5DD]/80 text-[8px] sm:text-[9px] font-mono font-medium text-[#4A463F] shadow-xs">
              {product.volume}
            </span>
          </div>
        )}



        {/* Product Image Presentation (Strict Photo Slot - Edge to Edge, No White Borders) */}
        {activeSrc ? (
          <img
            src={activeSrc}
            alt={product.name}
            loading="lazy"
            onError={handleImageError}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out pointer-events-none"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-center space-y-3 pointer-events-none p-6 w-full h-full bg-gradient-to-b from-[#FAF8F5] via-[#F5F2EB] to-[#FAF8F5]">
            <div className="w-16 h-16 rounded-2xl bg-white/90 backdrop-blur-xs border border-[#EAE5DD] shadow-[0_4px_12px_rgba(0,0,0,0.03)] flex items-center justify-center group-hover:scale-105 group-hover:border-[#C05674] transition-all duration-300">
              <span className="font-mono text-xs font-bold text-[#C05674] tracking-wider">
                {product.id.toUpperCase()}
              </span>
            </div>
            <div className="space-y-0.5 max-w-[140px]">
              <span className="text-[10px] font-bold tracking-[0.18em] uppercase text-[#1E2229] block">
                Face Derma®
              </span>
              <span className="text-[9px] font-medium tracking-wider text-[#8E8A83] uppercase block">
                {product.category || 'Cleansing Bar'}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* CARD FOOTER */}
      <div className="flex flex-col justify-between p-2.5 sm:p-4 md:p-5 space-y-2 sm:space-y-3 bg-white flex-1">
        <div>
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] uppercase tracking-wider text-[#8E8A83] mb-0.5 sm:mb-1">
            <span className="truncate max-w-[70%]">{product.category || 'Formulation'}</span>
            <div className="flex items-center gap-0.5 sm:gap-1 text-[#C05674]">
              <Star className="w-2.5 h-2.5 sm:w-3 sm:h-3 fill-current" />
              <span className="font-bold text-[#1E2229]">{rating.toFixed(1)}</span>
            </div>
          </div>
          <h3 className="font-luxury text-xs sm:text-base md:text-lg font-medium text-[#1E2229] tracking-tight leading-snug line-clamp-2 sm:line-clamp-1 group-hover:text-[#C05674] transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOrderClick(product);
          }}
          aria-label={`Order Now - ${product.name}`}
          className="w-full min-h-[34px] sm:min-h-[42px] py-1.5 sm:py-2 px-2 sm:px-4 rounded-full bg-[#1E2229] hover:bg-[#C05674] text-white text-[10px] sm:text-xs font-semibold tracking-[0.12em] sm:tracking-[0.18em] uppercase transition-all duration-300 ease-out flex items-center justify-center gap-1 sm:gap-2 cursor-pointer shadow-xs hover:shadow-md"
        >
          <span>Order Now</span>
          <ArrowRight className="w-3 h-3 sm:w-3.5 sm:h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>
    </div>
  );
};
