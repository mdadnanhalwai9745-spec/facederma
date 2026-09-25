import React, { useState, useEffect } from 'react';
import { SiteHeader } from './components/SiteHeader';
import { VibrantPinkHero } from './components/VibrantPinkHero';
import { BrandDescription } from './components/BrandDescription';
import { ProductSection } from './components/ProductSection';
import { ProductDetailPage } from './components/ProductDetailPage';
import { AboutUsPage } from './components/AboutUsPage';
import { ContactFooter } from './components/ContactFooter';
import { ImageManagerModal } from './components/ImageManagerModal';
import { PermanentStorageModal } from './components/PermanentStorageModal';
import { OrderMethodModal } from './components/OrderMethodModal';
import { ReviewModal } from './components/ReviewModal';
import { QuickViewModal } from './components/QuickViewModal';
import { FloatingWhatsApp } from './components/FloatingWhatsApp';
import { Product } from './types';
import {
  BRAND_CONTACT,
  INITIAL_PRODUCTS,
  loadSavedProducts,
  saveProductImage,
  fetchServerProducts,
  saveProductImagePermanently,
} from './data/products';
import { getPersistentImage, removePersistentImage, STORAGE_KEYS } from './utils/imageStorage';
import { getAssetUrl } from './utils/assetPath';

export default function App() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [isImageManagerOpen, setIsImageManagerOpen] = useState(false);
  const [isPermanentStorageOpen, setIsPermanentStorageOpen] = useState(false);
  const [orderModalProduct, setOrderModalProduct] = useState<Product | null>(null);
  const [reviewModalProduct, setReviewModalProduct] = useState<Product | null>(null);
  const [quickViewModalProduct, setQuickViewModalProduct] = useState<Product | null>(null);

  // Initialize products from server (for worldwide visitors) + local cache fallback
  useEffect(() => {
    const initProducts = async () => {
      // 1. Initial local state
      const loaded = loadSavedProducts();
      setProducts(loaded);

      // 2. Fetch server-persisted image URLs (visible to everyone globally)
      const serverMap = await fetchServerProducts();

      // 3. Hydrate product images and catalog flyers with multi-layer persistence
      const hydrated = await Promise.all(
        loaded.map(async (p) => {
          let finalImage = p.image;
          let finalSecondary = p.secondaryImage;

          // Priority 1: Check server permanent product image
          if (serverMap && serverMap[p.id] && !serverMap[p.id].includes('_catalog')) {
            finalImage = serverMap[p.id];
          } else {
            // Priority 2: Check IndexedDB persistent storage
            try {
              const persistedImg = await getPersistentImage(STORAGE_KEYS.PRODUCT(p.id));
              if (persistedImg && !persistedImg.includes('_catalog')) {
                finalImage = persistedImg;
              }
            } catch {
              // fallback to p.image
            }
          }
          if (finalImage && finalImage.includes('_catalog')) {
            finalImage = '';
          }
          if (!finalImage) {
            finalImage = p.image || `/products/permanent/${p.id}.png`;
          }

          // Catalog flyer priority
          const catalogKey = `${p.id}_catalog`;
          if (serverMap && serverMap[catalogKey]) {
            finalSecondary = serverMap[catalogKey];
          } else {
            try {
              const persistedCatalog = await getPersistentImage(`${STORAGE_KEYS.PRODUCT(p.id)}_secondary`);
              if (persistedCatalog) {
                finalSecondary = persistedCatalog;
              }
            } catch {
              // fallback to p.secondaryImage
            }
          }

          return {
            ...p,
            image: getAssetUrl(finalImage),
            secondaryImage: finalSecondary ? getAssetUrl(finalSecondary) : undefined,
          };
        })
      );
      setProducts(hydrated);

      // 4. Check hash for deep link e.g. #product-fd-01 or #about
      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        const prodId = hash.replace('#product-', '');
        const target = hydrated.find((p) => p.id === prodId);
        if (target) {
          setSelectedProduct(target);
          setIsAboutOpen(false);
        }
      } else if (hash === '#about' || hash === '#about-page') {
        setSelectedProduct(null);
        setIsAboutOpen(true);
      }
    };

    initProducts();

    const handleHashChange = () => {
      const hash = window.location.hash;
      if (hash.startsWith('#product-')) {
        const prodId = hash.replace('#product-', '');
        const all = loadSavedProducts();
        const target = all.find((p) => p.id === prodId);
        if (target) {
          setSelectedProduct(target);
          setIsAboutOpen(false);
        }
      } else if (hash === '#about' || hash === '#about-page') {
        setSelectedProduct(null);
        setIsAboutOpen(true);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (hash === '#hero') {
        setSelectedProduct(null);
        setIsAboutOpen(false);
        setTimeout(() => {
          const heroEl = document.getElementById('hero') || document.getElementById('vibrant-hero-section');
          if (heroEl) {
            heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
        }, 50);
      } else if (hash === '' || hash === '#products') {
        setSelectedProduct(null);
        setIsAboutOpen(false);
        if (hash === '#products') {
          setTimeout(() => {
            const el = document.getElementById('products');
            if (el) {
              const navHeight = 70;
              const rect = el.getBoundingClientRect();
              const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
              window.scrollTo({
                top: rect.top + scrollTop - navHeight,
                behavior: 'smooth',
              });
            }
          }, 60);
        }
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setIsAboutOpen(false);
    window.location.hash = `#product-${product.id}`;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToAll = () => {
    setSelectedProduct(null);
    setIsAboutOpen(false);
    window.location.hash = '#products';

    const scrollToProducts = () => {
      const el = document.getElementById('products');
      if (el) {
        const navHeight = 70;
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({
          top: rect.top + scrollTop - navHeight,
          behavior: 'smooth',
        });
      }
    };

    requestAnimationFrame(scrollToProducts);
    setTimeout(scrollToProducts, 40);
    setTimeout(scrollToProducts, 120);
  };

  const handleGoHome = () => {
    setSelectedProduct(null);
    setIsAboutOpen(false);
    window.location.hash = '#hero';
    setTimeout(() => {
      const heroEl = document.getElementById('hero') || document.getElementById('vibrant-hero-section');
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 50);
  };

  const handleGoAbout = () => {
    setSelectedProduct(null);
    setIsAboutOpen(true);
    window.location.hash = '#about-page';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleGoProducts = () => {
    setSelectedProduct(null);
    setIsAboutOpen(false);
    window.location.hash = '#products';

    const scrollToProducts = () => {
      const el = document.getElementById('products');
      if (el) {
        const navHeight = 70;
        const rect = el.getBoundingClientRect();
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        window.scrollTo({
          top: rect.top + scrollTop - navHeight,
          behavior: 'smooth',
        });
      }
    };

    requestAnimationFrame(scrollToProducts);
    setTimeout(scrollToProducts, 40);
    setTimeout(scrollToProducts, 120);
  };

  const handleGoContact = () => {
    setSelectedProduct(null);
    setIsAboutOpen(false);
    window.location.hash = '#contact';
    setTimeout(() => {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
  };

  const handleUploadImage = async (productId: string, dataUrl: string, isSecondary = false) => {
    // 1. Immediately update React state with functional update: GUARANTEES no previous product image disappears!
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === productId) {
          return isSecondary ? { ...p, secondaryImage: dataUrl } : { ...p, image: dataUrl };
        }
        return p;
      })
    );

    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) =>
        prev
          ? isSecondary
            ? { ...prev, secondaryImage: dataUrl }
            : { ...prev, image: dataUrl }
          : null
      );
    }

    // 2. Persist permanently to disk and IndexedDB
    try {
      const permanentUrl = await saveProductImagePermanently(productId, dataUrl, isSecondary);
      if (permanentUrl) {
        setProducts((prev) =>
          prev.map((p) => {
            if (p.id === productId) {
              return isSecondary ? { ...p, secondaryImage: permanentUrl } : { ...p, image: permanentUrl };
            }
            return p;
          })
        );
        if (selectedProduct && selectedProduct.id === productId) {
          setSelectedProduct((prev) =>
            prev
              ? isSecondary
                ? { ...prev, secondaryImage: permanentUrl }
                : { ...prev, image: permanentUrl }
              : null
          );
        }
      }
    } catch (e) {
      console.warn('Permanent save error:', e);
    }
  };

  const handleRemoveImage = (productId: string) => {
    saveProductImage(productId, '');
    const defaultInitial = INITIAL_PRODUCTS.find((init) => init.id === productId);
    const fallbackImage = defaultInitial?.image || '/products/fd-moist-moisturizer.svg';
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, image: fallbackImage } : p))
    );
  };

  const handleResetCatalog = async (productId: string) => {
    saveProductImage(productId, '', true);
    await saveProductImagePermanently(productId, '', true);
    const defaultInitial = INITIAL_PRODUCTS.find((init) => init.id === productId);
    const fallbackCatalog = defaultInitial?.secondaryImage || undefined;
    setProducts((prev) =>
      prev.map((p) => (p.id === productId ? { ...p, secondaryImage: fallbackCatalog } : p))
    );
    if (selectedProduct && selectedProduct.id === productId) {
      setSelectedProduct((prev) => (prev ? { ...prev, secondaryImage: fallbackCatalog } : null));
    }
  };

  return (
    <div className="w-full max-w-full overflow-x-clip min-h-screen bg-[#FAF9F6] text-[#1E2229] flex flex-col pt-[calc(0.375in+58px)] sm:pt-[calc(0.5in+64px)] selection:bg-[#C05674]/20 selection:text-[#1E2229]">
      {/* Persistent Floating Navigation Bar */}
      <SiteHeader
        onGoHome={handleGoHome}
        onGoAbout={handleGoAbout}
        onGoProducts={handleGoProducts}
        onGoContact={handleGoContact}
        currentView={selectedProduct ? 'product' : isAboutOpen ? 'about' : 'home'}
        onOpenImageManager={() => setIsImageManagerOpen(true)}
        onOpenPermanentStorage={() => setIsPermanentStorageOpen(true)}
      />

      {/* Main Content: Dedicated Single Product Page OR Dedicated About Us Page OR Full Brand Portal */}
      {selectedProduct ? (
        <ProductDetailPage
          product={selectedProduct}
          allProducts={products}
          contact={BRAND_CONTACT}
          onBack={handleBackToAll}
          onSelectProduct={handleSelectProduct}
          onOrderClick={(product) => setOrderModalProduct(product)}
          onUploadProductImage={(productId, dataUrl) => handleUploadImage(productId, dataUrl, false)}
          onResetProductImage={(productId) => handleRemoveImage(productId)}
          onUploadCatalog={(productId, dataUrl) => handleUploadImage(productId, dataUrl, true)}
          onResetCatalog={handleResetCatalog}
        />
      ) : isAboutOpen ? (
        <AboutUsPage
          products={products}
          contact={BRAND_CONTACT}
          onBackToHome={handleGoHome}
          onSelectProduct={handleSelectProduct}
        />
      ) : (
        <main>
          {/* 1. Four Slide Images Hero Section */}
          <VibrantPinkHero
            products={products}
            onSelectProduct={handleSelectProduct}
            onOpenImageManager={() => setIsImageManagerOpen(true)}
          />

          {/* 2. Brand Description Section */}
          <BrandDescription onLearnMore={handleGoAbout} />

          {/* 3. Products Section (Interactive 13-Product Grid with 1:1 Image Frame & Hover Overlay) */}
          <ProductSection
            products={products}
            contact={BRAND_CONTACT}
            onSelectProduct={handleSelectProduct}
            onUploadImage={handleUploadImage}
            onOpenImageManager={() => setIsImageManagerOpen(true)}
            onOpenPermanentStorage={() => setIsPermanentStorageOpen(true)}
            onOrderClick={(product) => setOrderModalProduct(product)}
            onReviewClick={(product) => setReviewModalProduct(product)}
            onQuickViewClick={(product) => setQuickViewModalProduct(product)}
          />
        </main>
      )}

      {/* Contact / Footer Section with Map Embed */}
      <ContactFooter contact={BRAND_CONTACT} />

      {/* Floating WhatsApp Quick Contact Button (Icon Only) */}
      <FloatingWhatsApp whatsappRaw={BRAND_CONTACT.whatsappRaw} />

      {/* Glassmorphic Order Method Modal (WhatsApp / Email) */}
      <OrderMethodModal
        isOpen={!!orderModalProduct}
        product={orderModalProduct}
        contact={BRAND_CONTACT}
        onClose={() => setOrderModalProduct(null)}
      />

      {/* Verified Customer Review Modal */}
      <ReviewModal
        isOpen={!!reviewModalProduct}
        product={reviewModalProduct}
        onClose={() => setReviewModalProduct(null)}
      />

      {/* Quick View Modal with Full Infographic Insight */}
      <QuickViewModal
        isOpen={!!quickViewModalProduct}
        product={quickViewModalProduct}
        onClose={() => setQuickViewModalProduct(null)}
        onOrderClick={(product) => setOrderModalProduct(product)}
      />

      {/* Product Image Manager Modal */}
      <ImageManagerModal
        isOpen={isImageManagerOpen}
        onClose={() => setIsImageManagerOpen(false)}
        products={products}
        onUploadImage={handleUploadImage}
        onRemoveImage={handleRemoveImage}
      />

      {/* Permanent Product & Catalog Storage Modal (26 Slots) */}
      <PermanentStorageModal
        isOpen={isPermanentStorageOpen}
        onClose={() => setIsPermanentStorageOpen(false)}
        products={products}
        onUploadImage={handleUploadImage}
        onResetImage={(productId, isSecondary) =>
          isSecondary ? handleResetCatalog(productId) : handleRemoveImage(productId)
        }
      />
    </div>
  );
}
