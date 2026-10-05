import React, { useState, useEffect, lazy, Suspense } from 'react';
import { SiteHeader } from './components/SiteHeader';
import { VibrantPinkHero } from './components/VibrantPinkHero';
import { BrandDescription } from './components/BrandDescription';

const ProductSection = lazy(() =>
  import('./components/ProductSection').then((m) => ({
    default: m.ProductSection,
  }))
);

import { ProductDetailPage } from './components/ProductDetailPage';
import { AboutUsPage } from './components/AboutUsPage';
import { ContactFooter } from './components/ContactFooter';

const ImageManagerModal = lazy(() =>
  import('./components/ImageManagerModal').then((m) => ({
    default: m.ImageManagerModal,
  }))
);

const PermanentStorageModal = lazy(() =>
  import('./components/PermanentStorageModal').then((m) => ({
    default: m.PermanentStorageModal,
  }))
);

const OrderMethodModal = lazy(() =>
  import('./components/OrderMethodModal').then((m) => ({
    default: m.OrderMethodModal,
  }))
);

const ReviewModal = lazy(() =>
  import('./components/ReviewModal').then((m) => ({
    default: m.ReviewModal,
  }))
);

const QuickViewModal = lazy(() =>
  import('./components/QuickViewModal').then((m) => ({
    default: m.QuickViewModal,
  }))
);

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

import { getPersistentImage, STORAGE_KEYS } from './utils/imageStorage';
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

  // ✅ SAFE INIT (no blocking, no crashes)
  useEffect(() => {
    const init = async () => {
      try {
        // fast local load (for instant UI)
        const loaded = loadSavedProducts();
        setProducts(loaded);

        // background hydration (non-blocking)
        setTimeout(async () => {
          const serverMap = await fetchServerProducts();

          const hydrated = await Promise.all(
            loaded.map(async (p) => {
              let image = p.image;
              let secondaryImage = p.secondaryImage;

              if (serverMap?.[p.id] && !serverMap[p.id].includes('_catalog')) {
                image = serverMap[p.id];
              }

              try {
                const persisted = await getPersistentImage(STORAGE_KEYS.PRODUCT(p.id));
                if (persisted && !persisted.includes('_catalog')) {
                  image = persisted;
                }
              } catch {}

              const catalogKey = `${p.id}_catalog`;
              if (serverMap?.[catalogKey]) {
                secondaryImage = serverMap[catalogKey];
              }

              return {
                ...p,
                image: getAssetUrl(image),
                secondaryImage: secondaryImage ? getAssetUrl(secondaryImage) : undefined,
              };
            })
          );

          setProducts(hydrated);
        }, 0);

        // deep link support
        const hash = window.location.hash;
        if (hash.startsWith('#product-')) {
          const id = hash.replace('#product-', '');
          const all = loadSavedProducts();
          const target = all.find((p) => p.id === id);
          if (target) setSelectedProduct(target);
        }
      } catch (e) {
        console.error('Init error:', e);
      }
    };

    init();

    const onHashChange = () => {
      const hash = window.location.hash;

      if (hash.startsWith('#product-')) {
        const id = hash.replace('#product-', '');
        const all = loadSavedProducts();
        const target = all.find((p) => p.id === id);
        if (target) setSelectedProduct(target);
      }

      if (hash === '#about') {
        setIsAboutOpen(true);
      }

      if (hash === '#hero') {
        setIsAboutOpen(false);
        setSelectedProduct(null);
      }
    };

    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, []);

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    window.location.hash = `#product-${product.id}`;
  };

  const handleBackToAll = () => {
    setSelectedProduct(null);
    window.location.hash = '#products';
  };

  const handleGoHome = () => {
    setSelectedProduct(null);
    setIsAboutOpen(false);
    window.location.hash = '#hero';
  };

  const handleGoAbout = () => {
    setIsAboutOpen(true);
    window.location.hash = '#about';
  };

  const handleGoProducts = () => {
    setIsAboutOpen(false);
    setSelectedProduct(null);
    window.location.hash = '#products';
  };

  const handleGoContact = () => {
    window.location.hash = '#contact';
  };

  const handleUploadImage = async (
    productId: string,
    dataUrl: string,
    isSecondary = false
  ) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId
          ? isSecondary
            ? { ...p, secondaryImage: dataUrl }
            : { ...p, image: dataUrl }
          : p
      )
    );

    try {
      await saveProductImagePermanently(productId, dataUrl, isSecondary);
    } catch {}
  };

  const handleRemoveImage = (productId: string) => {
    saveProductImage(productId, '');
    setProducts((prev) =>
      prev.map((p) =>
        p.id === productId ? { ...p, image: INITIAL_PRODUCTS[0]?.image } : p
      )
    );
  };

  const handleResetCatalog = async (productId: string) => {
    saveProductImage(productId, '', true);
    await saveProductImagePermanently(productId, '', true);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] text-[#1E2229] flex flex-col">
      <SiteHeader
        onGoHome={handleGoHome}
        onGoAbout={handleGoAbout}
        onGoProducts={handleGoProducts}
        onGoContact={handleGoContact}
        currentView={selectedProduct ? 'product' : isAboutOpen ? 'about' : 'home'}
      />

      {selectedProduct ? (
        <ProductDetailPage
          product={selectedProduct}
          allProducts={products}
          contact={BRAND_CONTACT}
          onBack={handleBackToAll}
          onSelectProduct={handleSelectProduct}
          onOrderClick={(p) => setOrderModalProduct(p)}
          onUploadProductImage={(id, d) => handleUploadImage(id, d, false)}
          onResetProductImage={handleRemoveImage}
          onUploadCatalog={(id, d) => handleUploadImage(id, d, true)}
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
          <VibrantPinkHero
            products={products}
            onSelectProduct={handleSelectProduct}
          />

          <BrandDescription onLearnMore={handleGoAbout} />

          <Suspense fallback={<div className="p-10 text-center">Loading...</div>}>
            <ProductSection
              products={products}
              contact={BRAND_CONTACT}
              onSelectProduct={handleSelectProduct}
              onUploadImage={handleUploadImage}
              onOrderClick={(p) => setOrderModalProduct(p)}
              onReviewClick={(p) => setReviewModalProduct(p)}
              onQuickViewClick={(p) => setQuickViewModalProduct(p)}
            />
          </Suspense>
        </main>
      )}

      <ContactFooter contact={BRAND_CONTACT} />
      <FloatingWhatsApp whatsappRaw={BRAND_CONTACT.whatsappRaw} />

      {/* Modals */}
      <Suspense fallback={null}>
        <OrderMethodModal
          isOpen={!!orderModalProduct}
          product={orderModalProduct}
          contact={BRAND_CONTACT}
          onClose={() => setOrderModalProduct(null)}
        />

        <ReviewModal
          isOpen={!!reviewModalProduct}
          product={reviewModalProduct}
          onClose={() => setReviewModalProduct(null)}
        />

        <QuickViewModal
          isOpen={!!quickViewModalProduct}
          product={quickViewModalProduct}
          onClose={() => setQuickViewModalProduct(null)}
        />

        <ImageManagerModal
          isOpen={isImageManagerOpen}
          onClose={() => setIsImageManagerOpen(false)}
          products={products}
          onUploadImage={handleUploadImage}
          onRemoveImage={handleRemoveImage}
        />

        <PermanentStorageModal
          isOpen={isPermanentStorageOpen}
          onClose={() => setIsPermanentStorageOpen(false)}
          products={products}
          onUploadImage={handleUploadImage}
          onResetImage={handleRemoveImage}
        />
      </Suspense>
    </div>
  );
}
