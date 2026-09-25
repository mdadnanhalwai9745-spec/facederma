import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ArrowRight, Star, ShieldCheck, Sparkles, Droplets, CheckCircle2, ChevronLeft, ChevronRight, MessageCircle, Eye, FileText, Camera, ZoomIn, X, Download } from 'lucide-react';
import { Product, ContactInfo } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { getAssetUrl } from '../utils/assetPath';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  contact: ContactInfo;
  onBack: () => void;
  onSelectProduct: (product: Product) => void;
  onOrderClick: (product: Product) => void;
  onUploadProductImage?: (productId: string, dataUrl: string) => Promise<void> | void;
  onResetProductImage?: (productId: string) => Promise<void> | void;
  onUploadCatalog?: (productId: string, dataUrl: string) => Promise<void> | void;
  onResetCatalog?: (productId: string) => Promise<void> | void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  contact,
  onBack,
  onSelectProduct,
  onOrderClick,
  onUploadProductImage,
  onResetProductImage,
  onUploadCatalog,
  onResetCatalog,
}) => {
  const initialMatch = INITIAL_PRODUCTS.find((p) => p.id === product.id);
  const cleanImage = (img?: string) => (img && !img.includes('_catalog') && !img.endsWith('.svg') ? img : '');
  const primaryImage = getAssetUrl(cleanImage(product.image) || cleanImage(initialMatch?.image) || `/products/permanent/${product.id}.png`);

  // Build a priority cascade of catalog candidate paths to guarantee zero errors
  const catalogCandidates = [
    product.secondaryImage ? getAssetUrl(product.secondaryImage) : '',
    getAssetUrl(`/products/permanent/${product.id}_catalog.webp`),
    getAssetUrl(`/products/permanent/${product.id}_catalog.jpg`),
    initialMatch?.secondaryImage ? getAssetUrl(initialMatch.secondaryImage) : '',
  ].filter(Boolean) as string[];

  const [imgSrc, setImgSrc] = useState(primaryImage);
  const [catalogIdx, setCatalogIdx] = useState(0);
  const [catalogFailed, setCatalogFailed] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxTarget, setLightboxTarget] = useState<'product' | 'catalog'>('product');

  useEffect(() => {
    const nextImg = getAssetUrl(cleanImage(product.image) || cleanImage(initialMatch?.image) || `/products/permanent/${product.id}.png`);
    setImgSrc(nextImg);
  }, [product.id, product.image, initialMatch?.image]);

  useEffect(() => {
    setCatalogIdx(0);
    setCatalogFailed(false);
  }, [product.id, product.secondaryImage]);

  const activeCatalogSrc = catalogCandidates[catalogIdx] || getAssetUrl(`/products/permanent/${product.id}_catalog.webp`);

  const handleCatalogError = () => {
    if (catalogIdx < catalogCandidates.length - 1) {
      setCatalogIdx(prev => prev + 1);
    } else {
      setCatalogFailed(true);
    }
  };

  const handleImageError = () => {
    setImgSrc('');
  };

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  const currentIndex = allProducts.findIndex((p) => p.id === product.id);
  const prevProduct = currentIndex > 0 ? allProducts[currentIndex - 1] : allProducts[allProducts.length - 1];
  const nextProduct = currentIndex < allProducts.length - 1 ? allProducts[currentIndex + 1] : allProducts[0];

  const rating = product.rating || 4.9;
  const reviews = product.reviewCount || 120;

  const handleWhatsAppOrder = () => {
    const text = encodeURIComponent(
      `Hello FaceDerma Concierge, I would like to order:\n\n*${product.name}*\nCategory: ${product.category || 'Clinical Line'}\nSize: ${product.volume || 'Standard'}\n\nPlease share price, availability, and delivery details.`
    );
    window.open(`https://wa.me/${contact.whatsappRaw}?text=${text}`, '_blank');
  };

  const openLightbox = (target: 'product' | 'catalog') => {
    setLightboxTarget(target);
    setIsLightboxOpen(true);
  };

  return (
    <div className="w-full min-h-screen bg-[#FAF9F6] text-[#1E2229] pt-2 sm:pt-4 pb-20 px-3 sm:px-6 md:px-12">
      <div className="max-w-7xl mx-auto">
        {/* Main Product Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-start">
          {/* Left Column: Pure World-Class Luxury Product Showcase */}
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-4"
          >
            {/* Iconic Product Stage */}
            <div
              className="relative w-full aspect-square bg-[#FAF9F6] rounded-3xl overflow-hidden flex items-center justify-center p-0 select-none shadow-[0_16px_50px_rgba(0,0,0,0.03)]"
            >
              {/* Floating Quality Seals */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 pointer-events-none z-10">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/95 backdrop-blur-md border border-[#EAE5DD] text-[10px] font-bold tracking-[0.2em] uppercase text-[#1E2229] shadow-xs">
                  <Sparkles className="w-3 h-3 text-[#C05674]" />
                  {product.category || 'Clinical Formula'}
                </span>
                {product.volume && (
                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#1E2229]/90 backdrop-blur-md text-white text-[10px] font-mono tracking-wider shadow-xs">
                    {product.volume}
                  </span>
                )}
              </div>



              {/* Product Hero Presentation (Strict Product Photo Slot - Full Edge-to-Edge) */}
              {imgSrc ? (
                <img
                  src={imgSrc}
                  alt={product.name}
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="relative z-1 w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
              ) : (
                <div className="text-center space-y-3 max-w-xs">
                  <span className="text-[10px] font-mono uppercase bg-white px-2.5 py-1 rounded-full border border-[#EAE5DD] text-[#C05674] font-bold">
                    {product.id.toUpperCase()}
                  </span>
                  <h2 className="font-serif text-2xl sm:text-3xl font-light text-[#1E2229]">
                    {product.name}
                  </h2>
                  <p className="text-xs text-[#6B665E] font-light">
                    {product.volume || 'Clinical Concentration'}
                  </p>
                </div>
              )}
            </div>

            {/* Micro Reassurance Triad */}
            <div className="grid grid-cols-3 gap-2 py-2 text-center">
              <div className="p-2.5 rounded-xl bg-white border border-[#EAE5DD] text-[11px] text-[#6B665E]">
                <ShieldCheck className="w-4 h-4 text-[#C05674] mx-auto mb-1" />
                <span className="font-medium block text-[#1E2229]">Original Formula</span>
                <span className="text-[10px] text-[#8E8A83]">Kathmandu, Nepal</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#EAE5DD] text-[11px] text-[#6B665E]">
                <Droplets className="w-4 h-4 text-[#C05674] mx-auto mb-1" />
                <span className="font-medium block text-[#1E2229]">Active Matrix</span>
                <span className="text-[10px] text-[#8E8A83]">Pharmaceutical Grade</span>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-[#EAE5DD] text-[11px] text-[#6B665E]">
                <Sparkles className="w-4 h-4 text-[#C05674] mx-auto mb-1" />
                <span className="font-medium block text-[#1E2229]">Derm Tested</span>
                <span className="text-[10px] text-[#8E8A83]">Targeted Regimen</span>
              </div>
            </div>

            {/* Official Clinical Catalog Flyer Document - Placed Directly Below Product Photo */}
            <div className="pt-2">
              {/* Flyer Image Frame */}
              <div
                onClick={() => !catalogFailed && openLightbox('catalog')}
                className="relative rounded-2xl sm:rounded-3xl bg-white border border-[#EAE5DD] shadow-[0_10px_35px_rgba(0,0,0,0.05)] overflow-hidden group cursor-pointer"
              >
                {!catalogFailed ? (
                  <>
                    <img
                      src={activeCatalogSrc}
                      alt={`${product.name} Clinical Catalog Flyer`}
                      referrerPolicy="no-referrer"
                      onError={handleCatalogError}
                      className="w-full h-auto block object-contain transition-transform duration-500 group-hover:scale-[1.02]"
                    />
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors flex items-center justify-center">
                      <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#1E2229]/90 backdrop-blur-md text-white text-xs font-medium tracking-wider uppercase shadow-lg">
                        <ZoomIn className="w-4 h-4 text-[#C05674]" />
                        <span>Click to View Full-Size Flyer</span>
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="p-8 text-center bg-[#FAF9F6] text-[#7A756D] space-y-2">
                    <FileText className="w-8 h-8 text-[#C05674] mx-auto opacity-70" />
                    <p className="text-xs font-medium uppercase tracking-wider text-[#1E2229]">
                      {product.name} Clinical Specification Sheet
                    </p>
                    <p className="text-[11px] text-[#8E8A83]">
                      Official laboratory monograph document
                    </p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>

          {/* Right Column: Formulation Dossier */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-6 space-y-7"
          >
            {/* Header / Title Block */}
            <div className="space-y-3 pb-6 border-b border-[#EAE5DD]">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <span className="text-[11px] font-semibold tracking-[0.25em] uppercase text-[#C05674]">
                  {product.category || 'Clinical Line'}
                </span>
                <div className="flex items-center gap-1 bg-[#FAF9F6] px-3 py-1 rounded-full border border-[#EAE5DD]">
                  <div className="flex text-[#C05674]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-current" />
                    ))}
                  </div>
                  <span className="text-xs font-bold text-[#1E2229] ml-1">{rating.toFixed(1)}</span>
                  <span className="text-[11px] text-[#8E8A83]">({reviews} verified reviews)</span>
                </div>
              </div>

              <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-light text-[#1E2229] tracking-tight leading-[1.15]">
                {product.name}
              </h1>

              {product.subtitle && (
                <p className="text-sm sm:text-base font-medium text-[#6B665E]">
                  {product.subtitle}
                </p>
              )}
            </div>

            {/* Official Clinical Monograph & Lab Flyer Access Card */}
            <div
              onClick={() => openLightbox('catalog')}
              className="group p-4 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DD] hover:border-[#C05674] transition-all duration-300 shadow-xs hover:shadow-md cursor-pointer flex items-center justify-between"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-white border border-[#EAE5DD] flex items-center justify-center shrink-0 text-[#C05674] group-hover:scale-105 group-hover:bg-[#C05674] group-hover:text-white transition-all duration-300">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold tracking-wider uppercase text-[#1E2229]">
                      Official Clinical Monograph &amp; Lab Flyer
                    </span>
                    <span className="text-[9px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-[#C05674] text-white">
                      Verified
                    </span>
                  </div>
                  <p className="text-xs text-[#7A756D] mt-0.5">
                    Authorized laboratory specification sheet, active ingredient breakdown &amp; regimen
                  </p>
                </div>
              </div>
              <div className="hidden sm:flex items-center gap-1 text-xs font-bold text-[#C05674] group-hover:text-[#1E2229] transition-colors shrink-0 ml-4">
                <span>Inspect</span>
                <Eye className="w-4 h-4" />
              </div>
            </div>

            {/* Key Clinical Benefits */}
            {product.keyBenefits && product.keyBenefits.length > 0 && (
              <div className="space-y-3 pt-1">
                <h3 className="text-xs font-bold tracking-[0.2em] uppercase text-[#1E2229]">
                  Clinical Performance &amp; Benefits
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {product.keyBenefits.map((benefit, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-2.5 p-3 rounded-xl bg-white border border-[#EAE5DD] text-xs text-[#1E2229]"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#C05674] shrink-0 mt-0.5" />
                      <span className="font-medium leading-snug">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Primary Order / Consultation Actions */}
            <div className="pt-3 space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleWhatsAppOrder}
                  className="flex-1 min-h-[52px] px-6 py-3 rounded-full bg-[#1E2229] hover:bg-[#C05674] text-white text-xs font-bold tracking-[0.2em] uppercase transition-all duration-300 shadow-xs flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <MessageCircle className="w-4 h-4 text-[#C05674] group-hover:text-white transition-colors" />
                  <span>Order Now via Concierge</span>
                  <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>

                <button
                  type="button"
                  onClick={() => onOrderClick(product)}
                  className="px-6 py-3 rounded-full bg-white border border-[#EAE5DD] hover:border-[#C05674] text-[#1E2229] hover:text-[#C05674] text-xs font-bold tracking-[0.18em] uppercase transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Select Order Method</span>
                </button>
              </div>

              <p className="text-center text-[11px] text-[#8E8A83]">
                Prompt dispatch across Kathmandu Valley &amp; all Nepal provinces • Direct clinical consultations.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Other Formulations Section */}
        <div className="mt-20 pt-12 border-t border-[#EAE5DD]">
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C05674]">
                Explore Collection
              </span>
              <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1E2229]">
                Other Clinical Formulations
              </h3>
            </div>
            <button
              type="button"
              onClick={onBack}
              className="text-xs font-semibold text-[#C05674] hover:text-[#1E2229] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <span>View All 13</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {allProducts
              .filter((p) => p.id !== product.id)
              .slice(0, 3)
              .map((other) => (
                <div
                  key={other.id}
                  onClick={() => onSelectProduct(other)}
                  className="group bg-white rounded-2xl border border-[#EAE5DD] overflow-hidden cursor-pointer hover:shadow-xl hover:border-[#C05674] transition-all duration-300 flex flex-col justify-between"
                >
                  <div className="relative aspect-square w-full bg-[#FAF9F6] overflow-hidden select-none">
                    {other.image && !other.image.includes('_catalog') ? (
                      <img
                        src={other.image}
                        alt={other.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-[9px] font-mono uppercase bg-white px-2 py-0.5 rounded border border-[#EAE5DD] text-[#C05674] font-semibold">
                          {other.id.toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <div className="p-3 sm:p-4">
                    <span className="text-[9px] font-bold tracking-wider uppercase text-[#C05674] block mb-1">
                      {other.category || 'Clinical Line'}
                    </span>
                    <h4 className="font-serif text-sm font-medium text-[#1E2229] line-clamp-1 group-hover:text-[#C05674] transition-colors">
                      {other.name}
                    </h4>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>

      {/* Full-Screen Interactive Lightbox Modal */}
      <AnimatePresence>
        {isLightboxOpen && (
          <div
            className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/90 backdrop-blur-md animate-in fade-in duration-200"
            onClick={() => setIsLightboxOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative max-w-5xl max-h-[92vh] w-full bg-[#1A1918] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lightbox Header */}
              <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-black/50 text-white">
                <div className="flex items-center gap-3">
                  <span className="text-[10px] font-bold tracking-widest uppercase text-[#C05674] px-2.5 py-1 rounded-full bg-[#C05674]/15 border border-[#C05674]/30">
                    Clinical Monograph Document
                  </span>
                  <h3 className="font-serif text-base sm:text-lg font-medium text-white truncate">
                    {product.name}
                  </h3>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setIsLightboxOpen(false)}
                    className="p-2 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer ml-2"
                    aria-label="Close"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Lightbox Image Stage */}
              <div className="p-4 sm:p-8 flex items-center justify-center overflow-auto max-h-[78vh]">
                <img
                  src={activeCatalogSrc}
                  alt={`${product.name} Clinical Monograph`}
                  onError={handleCatalogError}
                  className="max-h-[72vh] w-auto max-w-full object-contain rounded-xl select-none"
                />
              </div>

              {/* Lightbox Footer */}
              <div className="px-6 py-3 border-t border-white/10 bg-black/50 flex items-center justify-between text-xs text-white/60">
                <span>Face Derma Laboratories • Authorized Clinical Formulation</span>
                <span>Kathmandu, Nepal</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
