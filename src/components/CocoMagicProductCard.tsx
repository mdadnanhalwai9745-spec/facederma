import React, { useState } from 'react';
import { Heart, Search } from 'lucide-react';
import { Product } from '../types';
import { getAssetUrl } from '../utils/assetPath';

interface CocoMagicProductCardProps {
  product: Product;
  onReviewClick?: (product: Product) => void;
  onQuickViewClick?: (product: Product) => void;
  onOrderClick?: (product: Product) => void;
}

export const CocoMagicProductCard: React.FC<CocoMagicProductCardProps> = ({
  product,
  onReviewClick,
  onQuickViewClick,
  onOrderClick,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Front product image and hover infographic image as specified:
  // - Default: front product image (centered, fits cleanly within container)
  // - Hover: infographic hover image (smooth transition)
  const frontImage = getAssetUrl(product.image || '/products/coco-magic-front.jpg');
  const hoverImage = getAssetUrl(product.secondaryImage || '/products/coco-magic-hover.jpg');

  return (
    <div
      id="coco-magic-card"
      className="group relative flex flex-col w-full max-w-sm mx-auto bg-white rounded-2xl border border-gray-100 p-4 sm:p-5 shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_16px_36px_rgba(0,0,0,0.08)] transition-all duration-400 ease-out"
    >
      {/* ========================================================= */}
      {/* 1. IMAGE CONTAINER (Light grey/off-white background)       */}
      {/* Default: front image; Hover: infographic image swap       */}
      {/* ========================================================= */}
      <div className="relative w-full aspect-square bg-[#F4F4F6] rounded-xl overflow-hidden cursor-pointer select-none">
        {/* Default State: Front Product Image */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center p-4 transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0 pointer-events-none">
          <img
            src={frontImage}
            alt="CO-CO MAGIC Extra Virgin Coconut Oil"
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-contain filter drop-shadow-[0_8px_16px_rgba(0,0,0,0.06)]"
          />
        </div>

        {/* Hover State: Infographic Hover Image */}
        <div className="absolute inset-0 w-full h-full flex items-center justify-center p-2 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100 pointer-events-none">
          <img
            src={hoverImage}
            alt="CO-CO MAGIC Scientific Analysis Infographic"
            referrerPolicy="no-referrer"
            loading="lazy"
            className="w-full h-full object-contain rounded-lg"
          />
        </div>

        {/* ========================================================= */}
        {/* 2. HOVER ACTION ICONS (Top Right)                         */}
        {/* Small white circular buttons with subtle shadows          */}
        {/* Hidden by default, smooth slide/fade in on card hover     */}
        {/* ========================================================= */}
        <div className="absolute top-3 right-3 z-30 flex flex-col gap-2">
          {/* Heart / Wishlist Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              setIsWishlisted((prev) => !prev);
            }}
            title={isWishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
            aria-label="Wishlist"
            className={`w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-rose-500 hover:scale-105 active:scale-95 transition-all duration-300 ease-out cursor-pointer transform ${
              isWishlisted
                ? 'opacity-100 translate-y-0 text-rose-500'
                : 'opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0'
            }`}
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-200 ${
                isWishlisted ? 'fill-rose-500 text-rose-500' : 'stroke-current'
              }`}
            />
          </button>

          {/* Search / Magnifying Glass (Quick View) Button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              if (onQuickViewClick) onQuickViewClick(product);
              else if (onOrderClick) onOrderClick(product);
            }}
            title="Quick View"
            aria-label="Quick View"
            className="w-9 h-9 rounded-full bg-white shadow-md border border-gray-100 flex items-center justify-center text-gray-600 hover:text-[#1E1D1B] hover:scale-105 active:scale-95 transition-all duration-300 ease-out delay-75 cursor-pointer transform opacity-0 -translate-y-2 group-hover:opacity-100 group-hover:translate-y-0"
          >
            <Search className="w-4 h-4 stroke-current" />
          </button>
        </div>
      </div>

      {/* ========================================================= */}
      {/* 3. CARD FOOTER (Typography & Buttons)                     */}
      {/* Center-aligned product title, subtitle/specs & button     */}
      {/* ========================================================= */}
      <div className="flex flex-col items-center text-center pt-4 pb-1 space-y-3">
        {/* Product Title & Subtitle */}
        <div className="space-y-1">
          {/* Bold, uppercase, modern sans-serif, dark charcoal text */}
          <h3 className="text-base sm:text-lg font-bold tracking-wider uppercase text-[#1F2937]">
            CO-CO MAGIC
          </h3>

          {/* Lighter grey, slightly smaller text */}
          <p className="text-xs sm:text-sm text-[#6B7280] font-normal tracking-wide">
            Extra Virgin Coconut Oil • Cold Pressed
          </p>
        </div>

        {/* Action Button: Minimalist Outline Button */}
        {/* Transparent background, 1px solid border, uppercase, wide letter spacing */}
        <div className="w-full pt-1 flex flex-col gap-2">
          <button
            type="button"
            onClick={() => {
              if (onReviewClick) onReviewClick(product);
            }}
            className="w-full py-2.5 px-4 rounded-lg bg-transparent hover:bg-[#1E1D1B] text-[#1E1D1B] hover:text-white border border-[#1E1D1B] text-xs font-semibold uppercase tracking-[0.25em] transition-all duration-300 ease-out cursor-pointer active:scale-[0.99]"
          >
            REVIEW
          </button>

          {/* Direct Order Now link */}
          {onOrderClick && (
            <button
              type="button"
              onClick={() => onOrderClick(product)}
              className="text-[11px] font-mono tracking-widest text-[#9CA3AF] hover:text-[#1E1D1B] uppercase underline underline-offset-4 transition-colors cursor-pointer py-1"
            >
              Order Online / Inquire
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
