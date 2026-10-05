import React, { useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowDown, ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { Product } from '../types';
import { ProductBottleVisual } from './ProductBottleVisual';

interface HeroProps {
  products: Product[];
  onUploadImage: (productId: string, dataUrl: string) => void;
  onSelectProduct?: (product: Product) => void;
}

export const Hero: React.FC<HeroProps> = ({
  products,
  onUploadImage,
  onSelectProduct
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const safeProducts = useMemo(() => products || [], [products]);
  const activeProduct = safeProducts[currentIndex] ?? safeProducts[0];

  // 🚀 Preload FIRST hero image only (LCP boost)
  useEffect(() => {
    if (!safeProducts.length) return;
    const img = new Image();
    img.src = safeProducts[0]?.image;
  }, [safeProducts]);

  // ⏱ Auto slider (optimized)
  useEffect(() => {
    if (isPaused || safeProducts.length === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % safeProducts.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isPaused, safeProducts.length]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % safeProducts.length);
  };

  const handlePrev = () => {
    setCurrentIndex(
      (prev) => (prev - 1 + safeProducts.length) % safeProducts.length
    );
  };

  const scrollToProducts = () => {
    document.getElementById('products')?.scrollIntoView({
      behavior: 'smooth'
    });
  };

  return (
    <section
      id="hero"
      className="relative min-h-screen w-full flex items-center justify-center pt-24 pb-12 overflow-hidden bg-gradient-to-b from-[#FAF9F6] via-[#F7F4EE] to-[#FAF9F6]"
    >
      {/* Background */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[700px] rounded-full bg-[#EFE9DE]/50 blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-12 right-12 w-96 h-96 rounded-full bg-[#C5A880]/10 blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto w-full px-6 md:px-12 grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">

        {/* LEFT */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1 }}
          className="lg:col-span-6 flex flex-col justify-center text-left z-10 space-y-6"
        >
          <div className="inline-flex items-center gap-2 self-start py-1 px-3.5 rounded-full bg-white/70 border border-[#E7E0D5]">
            <Sparkles className="w-3.5 h-3.5 text-[#C5A880]" />
            <span className="text-[11px] font-medium uppercase text-[#6B665E]">
              Clinical Dermatology
            </span>
          </div>

          <h1 className="text-5xl lg:text-7xl font-light leading-tight">
            Elevate <br />
            <span className="italic text-[#C5A880]">Your Skin</span>
          </h1>

          <p className="text-base lg:text-lg text-[#5C5852]">
            Clinical Skincare. Everyday Luxury.
          </p>

          {activeProduct && (
            <div
              className="pt-2 cursor-pointer"
              onClick={() => onSelectProduct?.(activeProduct)}
            >
              <p className="text-sm font-medium">
                {activeProduct.name}
              </p>
              <p className="text-xs text-[#7A756D]">
                {activeProduct.shortDescription}
              </p>
            </div>
          )}

          <div className="pt-4 flex gap-4">
            <button
              onClick={scrollToProducts}
              className="px-8 py-4 bg-black text-white rounded-full"
            >
              Explore Products
            </button>

            {onSelectProduct && activeProduct && (
              <button
                onClick={() => onSelectProduct(activeProduct)}
                className="px-6 py-4 border rounded-full"
              >
                View Details
              </button>
            )}
          </div>

          <div className="pt-6 flex gap-2">
            {safeProducts.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-1.5 rounded-full ${
                  idx === currentIndex ? 'w-8 bg-[#C5A880]' : 'w-2 bg-gray-300'
                }`}
              />
            ))}
          </div>
        </motion.div>

        {/* RIGHT */}
        <div
          className="lg:col-span-6 flex justify-center"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
        >
          <AnimatePresence mode="wait">
            {activeProduct && (
              <motion.div
                key={activeProduct.id}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.6 }}
                className="w-full max-w-md"
              >
                <ProductBottleVisual
                  image={activeProduct.secondaryImage || activeProduct.image}
                  name={activeProduct.name}
                  isHero={true}
                  onImageUpload={(dataUrl) =>
                    onUploadImage(activeProduct.id, dataUrl)
                  }
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
};
