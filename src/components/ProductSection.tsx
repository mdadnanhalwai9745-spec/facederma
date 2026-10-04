import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Product, ContactInfo } from '../types';
import { ProductCard } from './ProductCard';
import { ShieldCheck } from 'lucide-react';

interface ProductSectionProps {
  products: Product[];
  contact: ContactInfo;
  onSelectProduct: (product: Product) => void;
  onUploadImage?: (productId: string, dataUrl: string, isSecondary?: boolean) => void;
  onOpenImageManager?: () => void;
  onOpenPermanentStorage?: () => void;
  onOrderClick: (product: Product) => void;
  onReviewClick?: (product: Product) => void;
  onQuickViewClick?: (product: Product) => void;
}

export const ProductSection: React.FC<ProductSectionProps> = ({
  products,
  contact,
  onSelectProduct,
  onUploadImage,
  onOpenImageManager,
  onOpenPermanentStorage,
  onOrderClick,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [visibleCount, setVisibleCount] = useState<number>(4); // Only load first 4 initially

  // Extract unique categories
  const categories = ['all', ...Array.from(new Set(products.map((p) => p.category || 'Other')))];

  const filteredProducts =
    selectedCategory === 'all'
      ? products
      : products.filter((p) => (p.category || 'Other') === selectedCategory);

  const displayedProducts = filteredProducts.slice(0, visibleCount);

  return (
    <section
      id="products"
      className="relative py-10 sm:py-14 md:py-18 bg-transparent"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12">
        {/* Category Filter Pills & Upload Hub */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 mb-8">
          <div className="flex items-center gap-2 overflow-x-auto scrollbar-none py-1">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => {
                  setSelectedCategory(cat);
                  setVisibleCount(4); // Reset batch count on filter change
                }}
                className={`px-4 py-2 rounded-full text-xs font-medium tracking-wider uppercase whitespace-nowrap transition-all duration-200 cursor-pointer backdrop-blur-md shadow-2xs ${
                  selectedCategory === cat
                    ? 'bg-[#C05674] text-white shadow-xs'
                    : 'bg-white/85 text-[#6B665E] border border-[#EAE5DD]/80 hover:border-[#C05674] hover:text-[#C05674]'
                }`}
              >
                {cat === 'all' ? 'All Formulations (13)' : cat}
              </button>
            ))}
          </div>
        </div>

        {/* RESPONSIVE GRID (Batched to first 4 for performance) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-6 lg:gap-8">
          {displayedProducts.map((product, index) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-30px' }}
              transition={{
                duration: 0.5,
                delay: (index % 3) * 0.07,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="w-full flex"
            >
              <ProductCard
                product={product}
                contact={contact}
                onSelectProduct={onSelectProduct}
                onOrderClick={onOrderClick}
                onUploadImage={onUploadImage}
              />
            </motion.div>
          ))}
        </div>

        {/* Load More Button to fetch remaining formulations on demand */}
        {visibleCount < filteredProducts.length && (
          <div className="mt-12 text-center">
            <button
              onClick={() => setVisibleCount((prev) => prev + 6)}
              className="px-6 py-3 bg-[#1E2229] text-white text-xs font-medium tracking-wider uppercase rounded-full hover:bg-[#C05674] transition-colors cursor-pointer shadow-md"
            >
              Load More Formulations
            </button>
          </div>
        )}

        {/* Bottom Trust & Quality Seal */}
        <div className="mt-16 text-center flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-3 text-xs text-[#8E8A83] font-light tracking-wider uppercase px-4">
          <ShieldCheck className="w-4 h-4 text-[#C05674]" />
          <span>100% Original Clinical Integrity • Paraben-Free • Dermatologically Evaluated</span>
        </div>
      </div>
    </section>
  );
};
