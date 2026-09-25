import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Product } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { getPersistentImage, STORAGE_KEYS } from '../utils/imageStorage';
import bundledHeroBanner from '../assets/hero_banner.webp';
import { getAssetUrl } from '../utils/assetPath';

export interface HeroSlideData {
  id: number;
  productId: string;
  productName: string;
  tagline: string;
  subheadline: string;
  badge: string;
  defaultFallback: string;
  accentColor: string;
}

export const DEFAULT_HERO_SLIDES: HeroSlideData[] = [
  {
    id: 2,
    productId: 'fd-02',
    productName: 'CO-CO MAGIC Cold Pressed Extra Virgin Coconut Oil',
    tagline: '100% Pure Extra Virgin Grade • Deep Nourishment Naturally',
    subheadline: 'Cold Pressed • ISO22000 Certified Grade • 100% Organic',
    badge: 'Pure Nourishment',
    defaultFallback: bundledHeroBanner,
    accentColor: '#C05674',
  },
];

// For backward compatibility if imported elsewhere
export interface CatalogHeroSlide {
  id: string;
  productId: string;
  name: string;
  subtitle?: string;
  category?: string;
  catalogImage: string;
  product?: Product;
}

interface VibrantPinkHeroProps {
  products?: Product[];
  onSelectProduct?: (product: Product) => void;
  onOpenImageManager?: () => void;
}

export const VibrantPinkHero: React.FC<VibrantPinkHeroProps> = ({
  products = [],
  onSelectProduct,
}) => {
  const [heroImages, setHeroImages] = useState<Record<number, string>>({
    2: bundledHeroBanner,
  });
  const [activeCatalogIndex, setActiveCatalogIndex] = useState<number>(0);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const [imgLoadError, setImgLoadError] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const activeSlideData = DEFAULT_HERO_SLIDES[0];

  // Load the slide image from server or local storage if a custom one was saved
  const loadSlideImages = async () => {
    const loaded: Record<number, string> = {};

    // 1. Check server permanent products manifest first
    try {
      const res = await fetch('/api/products');
      if (res.ok) {
        const d = await res.json();
        if (d?.products?.hero_banner) {
          loaded[activeSlideData.id] = d.products.hero_banner;
        }
      }
    } catch {
      // ignore
    }

    // 2. Check IndexedDB / local cache
    for (const slide of DEFAULT_HERO_SLIDES) {
      if (!loaded[slide.id]) {
        try {
          const saved = await getPersistentImage(STORAGE_KEYS.HERO_SLIDE(slide.id));
          if (saved) {
            loaded[slide.id] = saved;
          }
        } catch (err) {
          console.warn(`Error loading hero slide ${slide.id}:`, err);
        }
      }
    }

    if (Object.keys(loaded).length > 0) {
      setHeroImages((prev) => ({ ...prev, ...loaded }));
    }
  };

  useEffect(() => {
    loadSlideImages();

    const handleUpdate = () => {
      loadSlideImages();
    };

    window.addEventListener('facederma_image_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);

    return () => {
      window.removeEventListener('facederma_image_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  // Resolve all 13 catalogs from active products or fallback to INITIAL_PRODUCTS
  const catalogList: Product[] = (products && products.length > 0 ? products : INITIAL_PRODUCTS);
  const totalCatalogs = catalogList.length;

  // Auto-slide effect for the catalogs
  useEffect(() => {
    if (isPaused || totalCatalogs <= 1) return;

    timerRef.current = setInterval(() => {
      setActiveCatalogIndex((prev) => (prev + 1) % totalCatalogs);
    }, 3800);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused, totalCatalogs]);

  const currentCatalog = catalogList[activeCatalogIndex] || catalogList[0];

  // Resolve active slide image: custom uploaded hero image > bundled hero banner
  const getActiveImage = (slide: HeroSlideData) => {
    if (imgLoadError) return bundledHeroBanner;
    if (heroImages[slide.id]) return heroImages[slide.id];
    return slide.defaultFallback || bundledHeroBanner;
  };

  const activeImage = getActiveImage(activeSlideData);

  return (
    <section
      id="hero"
      data-section="vibrant-hero-section"
      className="w-full max-w-full flex flex-col font-sans select-none bg-[#121110] overflow-hidden scroll-mt-20"
    >
      {/* ========================================================================= */}
      {/* 1-SLIDE HERO PRODUCT BANNER (UNTOUCHABLE, CRYSTAL CLEAR & IMMERSIVE)      */}
      {/* ========================================================================= */}
      <div
        className="relative w-full max-w-full h-[calc(100dvh-64px)] md:h-[calc(100vh-65px)] min-h-[580px] md:min-h-[480px] max-h-[960px] overflow-hidden bg-[#121110] text-white flex items-center justify-center border-0 outline-hidden select-none"
      >
        <div className="absolute inset-0 w-full h-full flex items-center justify-center overflow-hidden bg-[#11100F] select-none pointer-events-none">
          {/* Hero Banner Graphic - Full clarity without darkening words */}
          <img
            src={activeImage}
            alt={activeSlideData.productName}
            referrerPolicy="no-referrer"
            loading="eager"
            onError={() => {
              if (!imgLoadError) {
                setImgLoadError(true);
              }
            }}
            className="absolute inset-0 w-full h-full object-cover object-[20%_center] md:object-center select-none pointer-events-none scale-105 md:scale-100 transition-transform duration-700"
          />

          {/* Very light subtle edge vignette so banner stays bright and natural */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/15 pointer-events-none" />
        </div>

        {/* ========================================================================= */}
        {/* ALL 13 CATALOGS AUTO-SLIDING FRAME                                        */}
        {/* Mobile: Centered horizontally and vertically in hero section               */}
        {/* Desktop: Anchored on the right side of the hero (untouched)                */}
        {/* ========================================================================= */}
        <motion.div
          id="hero-decorative-frame"
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          className="absolute z-25 w-[90%] sm:w-[84%] md:w-[60%] lg:w-[55%] xl:w-[52%] max-w-[804px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 md:left-auto md:translate-x-0 md:right-6 lg:right-14 xl:right-16 aspect-[1.41/1] select-none group"
        >
          {/* Ambient Soft Glow Behind Frame for Depth */}
          <div className="absolute -inset-1.5 rounded-2xl lg:rounded-3xl bg-gradient-to-tr from-[#C05674]/30 via-transparent to-transparent blur-xl opacity-80 pointer-events-none" />

          {/* Luxury Frame housing the 13 Auto-sliding Catalog Monographs */}
          <div className="relative w-full h-full rounded-2xl lg:rounded-3xl border-2 border-white/30 shadow-[0_20px_50px_rgba(0,0,0,0.55),0_0_35px_rgba(192,86,116,0.2)] overflow-hidden bg-black/40 backdrop-blur-sm">
            {/* Top Hairline Rose Accent Line */}
            <div className="absolute top-0 inset-x-4 sm:inset-x-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#C05674]/80 to-transparent z-25 pointer-events-none" />
            
            {/* Bottom Hairline Rose Accent Line */}
            <div className="absolute bottom-0 inset-x-4 sm:inset-x-6 h-[1.5px] bg-gradient-to-r from-transparent via-[#C05674]/80 to-transparent z-25 pointer-events-none" />

            {/* Subtle Inner Corner Accents */}
            <div className="absolute top-2 left-2 w-3 sm:w-3.5 h-3 sm:h-3.5 border-t-2 border-l-2 border-[#C05674]/80 rounded-tl-sm pointer-events-none z-25" />
            <div className="absolute top-2 right-2 w-3 sm:w-3.5 h-3 sm:h-3.5 border-t-2 border-r-2 border-[#C05674]/80 rounded-tr-sm pointer-events-none z-25" />
            <div className="absolute bottom-2 left-2 w-3 sm:w-3.5 h-3 sm:h-3.5 border-b-2 border-l-2 border-[#C05674]/80 rounded-bl-sm pointer-events-none z-25" />
            <div className="absolute bottom-2 right-2 w-3 sm:w-3.5 h-3 sm:h-3.5 border-b-2 border-r-2 border-[#C05674]/80 rounded-br-sm pointer-events-none z-25" />

            {/* Main Pure Catalog Stage with Smooth Cross-Fade Auto-Slide Animation */}
            <div
              className="relative w-full h-full overflow-hidden flex items-center justify-center cursor-pointer"
              onClick={() => onSelectProduct && onSelectProduct(currentCatalog)}
              title={`View ${currentCatalog.name} details`}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentCatalog.id}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.02 }}
                  transition={{ duration: 0.65, ease: 'easeOut' }}
                  className="absolute inset-0 w-full h-full"
                >
                  <img
                    src={getAssetUrl(currentCatalog.secondaryImage || `/products/permanent/${currentCatalog.id}_catalog.jpg`)}
                    alt={`${currentCatalog.name} Clinical Catalog`}
                    className="w-full h-full object-cover select-none rounded-xl lg:rounded-2xl"
                    loading="eager"
                  />
                </motion.div>
              </AnimatePresence>

              {/* Bottom Dot Navigation Strip */}
              <div className="absolute bottom-3 inset-x-0 z-30 flex items-center justify-center gap-1.5 pointer-events-auto">
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/55 backdrop-blur-md border border-white/15">
                  {catalogList.map((cat, idx) => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveCatalogIndex(idx);
                      }}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        idx === activeCatalogIndex
                          ? 'w-5 bg-[#C05674]'
                          : 'w-1.5 bg-white/40 hover:bg-white/70'
                      }`}
                      title={`Go to ${cat.name}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
