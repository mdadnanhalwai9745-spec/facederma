import React, { useRef } from 'react';
import { Upload, Image as ImageIcon } from 'lucide-react';

interface ProductBottleVisualProps {
  image?: string;
  name: string;
  onImageUpload?: (dataUrl: string) => void;
  aspectSquare?: boolean;
  isHero?: boolean;
  priority?: boolean;
}

export const ProductBottleVisual: React.FC<ProductBottleVisualProps> = ({
  image,
  name,
  onImageUpload,
  aspectSquare = true,
  isHero = false,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageUpload(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const file = e.dataTransfer.files?.[0];
    if (!file || !onImageUpload) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onImageUpload(event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      onDrop={handleDrop}
      onDragOver={handleDragOver}
      className={`relative w-full ${aspectSquare ? 'aspect-square' : 'h-full'} flex items-center justify-center overflow-hidden bg-gradient-to-b from-[#FAF8F5] via-[#F5F2EC] to-[#EFEAE1] group`}
    >
      {/* Studio lighting radial backdrop */}
      <div className="absolute inset-0 luxury-glow pointer-events-none" />
      <div className="absolute bottom-0 inset-x-0 h-1/3 luxury-podium pointer-events-none" />

      {/* Hidden file input */}
      {onImageUpload && (
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />
      )}

      {image ? (
        /* Real Uploaded Bottle Image: Preserves exact proportions with zero distortion, crisp lighting */
        <div className="relative w-full h-full p-4 md:p-6 flex items-center justify-center">
          <img
            src={image}
            alt={name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-contain select-none transition-transform duration-500 ease-out group-hover:scale-[1.02]"
            style={{ filter: 'drop-shadow(0 12px 20px rgba(0, 0, 0, 0.12))' }}
          />
          {/* Gentle Pedestal Shadow Base */}
          <div className="absolute bottom-4 inset-x-12 h-4 bg-black/10 blur-md rounded-full pointer-events-none" />

          {/* Quick Change / Upload overlay button on hover */}
          {onImageUpload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              title="Replace Product Image"
              className="absolute top-3 right-3 z-10 opacity-0 group-hover:opacity-100 transition-all duration-300 bg-white/90 hover:bg-white text-[#1E1D1B] backdrop-blur-md p-2 rounded-full shadow-sm border border-[#EDE8DF] text-xs flex items-center gap-1.5"
            >
              <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
              <span className="text-[11px] font-medium tracking-wider uppercase pr-1">Replace</span>
            </button>
          )}
        </div>
      ) : (
        /* Minimal luxury architectural silhouette when user has not yet uploaded image */
        <div className="relative w-full h-full flex flex-col items-center justify-center p-6 text-center select-none">
          {/* Elegant geometric bottle silhouette */}
          <div className="relative w-28 h-40 md:w-32 md:h-48 flex items-center justify-center mb-3">
            <svg
              className="w-full h-full text-[#C5A880]/40 stroke-[#C5A880]/60 transition-transform duration-700 ease-out group-hover:scale-105"
              viewBox="0 0 100 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Dropper / Pump Cap */}
              <rect x="42" y="6" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1.2" fill="#FAF8F5" />
              <rect x="38" y="20" width="24" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2" fill="#EDE8DF" />
              <rect x="46" y="2" width="8" height="4" rx="1" fill="#C5A880" opacity="0.8" />
              {/* Bottle Neck */}
              <rect x="40" y="28" width="20" height="12" stroke="currentColor" strokeWidth="1.2" fill="#FAF8F5" />
              {/* Glass Shoulder & Body */}
              <path
                d="M40 40 C34 44 26 50 26 62 L26 142 C26 148 30 152 38 152 L62 152 C70 152 74 148 74 142 L74 62 C74 50 66 44 60 40 Z"
                stroke="currentColor"
                strokeWidth="1.4"
                fill="url(#goldGradient)"
              />
              {/* Inner Luxury Cosmetic Level */}
              <path
                d="M30 84 L70 84 L70 140 C70 144 67 148 62 148 L38 148 C33 148 30 144 30 140 Z"
                fill="#C5A880"
                fillOpacity="0.1"
              />
              {/* Minimal brand label line */}
              <line x1="38" y1="102" x2="62" y2="102" stroke="currentColor" strokeWidth="0.8" strokeDasharray="1 1" />
              <line x1="42" y1="110" x2="58" y2="110" stroke="currentColor" strokeWidth="0.8" />
              
              <defs>
                <linearGradient id="goldGradient" x1="26" y1="40" x2="74" y2="152" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FFFFFF" stopOpacity="0.8" />
                  <stop offset="0.5" stopColor="#F5F2EC" stopOpacity="0.4" />
                  <stop offset="1" stopColor="#EADEC9" stopOpacity="0.6" />
                </linearGradient>
              </defs>
            </svg>
            {/* Ambient floor shadow */}
            <div className="absolute -bottom-1 inset-x-4 h-3 bg-black/5 blur-sm rounded-full pointer-events-none" />
          </div>

          {/* User manual upload trigger */}
          {onImageUpload && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
              className="mt-1 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 hover:bg-white text-[#1E1D1B] border border-[#E2D9CC] text-xs font-medium tracking-wide transition-all shadow-sm hover:shadow active:scale-95"
            >
              <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
              <span>Insert Bottle Photo</span>
            </button>
          )}

          <p className="text-[11px] text-[#8E8A83] tracking-widest uppercase mt-2 font-mono">
            {isHero ? 'Drop product visual here' : '1:1 Square Frame'}
          </p>
        </div>
      )}
    </div>
  );
};
