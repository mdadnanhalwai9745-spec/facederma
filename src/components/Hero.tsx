import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductBottleVisual } from './ProductBottleVisual';

interface HeroProps {
  products: Product[];
  onUploadImage: (productId: string, dataUrl: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const Hero: React.FC<HeroProps> = ({ products, onUploadImage, onSelectProduct }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Auto smooth slide transition every 5 seconds (pausable on user hover)
  useEffect(() => {
    if (isPaused || products.length === 0) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % products.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [isPaused, products.length]);

  const activeProduct = products[currentIndex] || products[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % products.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + products.length) % products.length);
  };

  const scrollToProducts = () => {
    const el = document.getElementById('products');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-12 overflow-hidden bg-gradient-to-b from-[#FAF9F6] via-[#F7F4EE] to-[#FAF9F6]"
    >
      {/* Background Soft Luxury Accents */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#EFE9DE]/50 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-12 right-12 w-96 h-96 rounded-full bg-[#C5A880]/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        
        {/* LEFT COLUMN: Clean, Minimal, Luxury Text */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-6 flex flex-col justify-center text-left z-10 space-y-6"
        >
          {/* Subtle clinical benchmark badge */}
          <div className="inline-flex items-center gap-2 self-start py-1 px-3.5 rounded-full bg-white/70 border border-[#E7E0D5] backdrop-blur-xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="text-[11px] font-medium tracking-[0.25em] uppercase text-[#6B665E]">
              Clinical Dermatology
            </span>
          </div>

          {/* Heading */}
          <h1 className="font-luxury text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-[#1E1D1B] font-light leading-[1.05]">
            Elevate <br />
            <span className="italic font-normal text-[#C5A880]">Your Skin</span>
          </h1>

          {/* Subtext */}
          <p className="text-base sm:text-lg lg:text-xl font-light tracking-wide text-[#5C5852] max-w-md leading-relaxed">
            Clinical Skincare. Everyday Luxury.
          </p>

          {/* Active Product Preview Indicator */}
          {activeProduct && (
            <div
              className={`pt-2 ${onSelectProduct ? 'cursor-pointer group/spotlight' : ''}`}
              onClick={() => onSelectProduct?.(activeProduct)}
            >
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#8E8A83] block mb-1">
                Spotlight No. 0{currentIndex + 1}
              </span>
              <p className="text-sm font-medium text-[#2E2C29] tracking-wider group-hover/spotlight:text-[#C5A880] transition-colors">
                {activeProduct.name}
              </p>
              <p className="text-xs text-[#7A756D] font-light mt-0.5 line-clamp-1 max-w-md">
                {activeProduct.shortDescription}
              </p>
            </div>
          )}

          {/* CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center gap-4">
            <button
              onClick={scrollToProducts}
              className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-full bg-[#1E1D1B] text-[#FAF9F6] text-xs font-medium tracking-[0.25em] uppercase transition-all duration-500 hover:bg-[#C5A880] hover:text-[#1E1D1B] hover:shadow-[0_12px_24px_rgba(197,168,128,0.25)] active:scale-98 cursor-pointer"
              id="cta-explore-products"
            >
              <span>Explore Products</span>
              <ArrowDown className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-y-0.5" />
            </button>
            {onSelectProduct && activeProduct && (
              <button
                type="button"
                onClick={() => onSelectProduct(activeProduct)}
                className="inline-flex items-center gap-2 px-6 py-4 rounded-full bg-white/80 hover:bg-white text-[#1E1D1B] text-xs font-medium tracking-[0.2em] uppercase border border-[#EDE8DF] hover:border-[#C5A880] transition-all duration-300 cursor-pointer shadow-2xs"
              >
                <span>View Details</span>
              </button>
            )}
          </div>

          {/* Slide Navigation Pagination */}
          <div className="pt-6 flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              {products.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-1.5 transition-all duration-500 rounded-full ${
                    idx === currentIndex
                      ? 'w-8 bg-[#C5A880]'
                      : 'w-2 bg-[#DED6CA] hover:bg-[#BDB4A5]'
                  }`}
                  aria-label={`Go to slide ${idx + 1}`}
                />
              ))}
            </div>
            <div className="flex items-center space-x-2 pl-4 border-l border-[#EDE8DF]">
              <button
                onClick={handlePrev}
                className="p-1.5 rounded-full hover:bg-white text-[#6B665E] hover:text-[#1E1D1B] transition-colors"
                aria-label="Previous product"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                onClick={handleNext}
                className="p-1.5 rounded-full hover:bg-white text-[#6B665E] hover:text-[#1E1D1B] transition-colors"
                aria-label="Next product"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* RIGHT COLUMN: Product Visual Studio Stage */}
        <div
          className="lg:col-span-6 flex items-center justify-center relative"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          {/* Subtle Ambient Luxury Lighting Rings */}
          <div className="absolute w-72 sm:w-96 md:w-[480px] h-72 sm:h-96 md:h-[480px] rounded-full border border-[#C5A880]/15 pointer-events-none" />
          <div className="absolute w-80 sm:w-[420px] md:w-[540px] h-80 sm:h-[420px] md:h-[540px] rounded-full border border-[#EDE8DF]/60 pointer-events-none" />

          {/* Floating animation container */}
          <motion.div
            animate={{ y: [-4, 4, -4] }}
            transition={{ duration: 6.5, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full max-w-sm sm:max-w-md lg:max-w-lg aspect-square relative z-10 rounded-2xl p-4 sm:p-6 bg-white/40 backdrop-blur-xs border border-[#EDE7DC]/70 shadow-[0_20px_50px_rgba(30,29,27,0.06)]"
          >
            {/* Auto smooth slide transition between products */}
            <AnimatePresence mode="wait">
              {activeProduct && (
                <motion.div
                  key={activeProduct.id}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -24 }}
                  transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full rounded-xl overflow-hidden"
                >
                  <ProductBottleVisual
                    image={activeProduct.secondaryImage || activeProduct.image}
                    name={activeProduct.name}
                    isHero={true}
                    onImageUpload={(dataUrl) => onUploadImage(activeProduct.id, dataUrl)}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>

      </div>

      {/* Scroll-down cue indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex flex-col items-center pointer-events-none opacity-60">
        <span className="text-[9px] tracking-[0.3em] uppercase text-[#8E8A83] font-medium mb-1">
          Scroll
        </span>
        <div className="w-4 h-7 rounded-full border border-[#C5A880]/40 flex items-start justify-center p-1">
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
            className="w-1 h-1.5 rounded-full bg-[#C5A880]"
          />
        </div>
      </div>
    </section>
  );
};
