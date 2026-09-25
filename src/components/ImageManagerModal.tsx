import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, Trash2, CheckCircle2, AlertCircle, Sparkles, Layers, Image as ImageIcon, Heart } from 'lucide-react';
import { Product } from '../types';
import { DEFAULT_HERO_SLIDES, HeroSlideData } from './VibrantPinkHero';
import { matchUploadedFileToProductId, INITIAL_PRODUCTS } from '../data/products';
import {
  savePersistentImage,
  getPersistentImage,
  removePersistentImage,
  STORAGE_KEYS
} from '../utils/imageStorage';

interface ImageManagerModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUploadImage: (productId: string, dataUrl: string) => void;
  onRemoveImage: (productId: string) => void;
}

const HERO_STORAGE_KEY = 'facederma_hero_custom_images_v6';
const HERO_VIEW_MODE_KEY = 'facederma_hero_banner_mode_v6';
const PHILOSOPHY_PHOTO_KEY = 'facederma_philosophy_photo_v1';

export const ImageManagerModal: React.FC<ImageManagerModalProps> = ({
  isOpen,
  onClose,
  products,
  onUploadImage,
  onRemoveImage,
}) => {
  const [activeTab, setActiveTab] = useState<'hero' | 'products' | 'philosophy'>('hero');
  const [heroImages, setHeroImages] = useState<{ [slideId: number]: string }>({});
  const [philosophyPhoto, setPhilosophyPhoto] = useState<string>('');
  const [isFullBannerMode, setIsFullBannerMode] = useState(false);
  const [isDraggingBulk, setIsDraggingBulk] = useState(false);
  const productFileInputRefs = useRef<{ [key: string]: HTMLInputElement | null }>({});
  const heroFileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const bulkFileInputRef = useRef<HTMLInputElement>(null);
  const philosophyFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const loadAll = async () => {
      // 1. Load hero images from IndexedDB / server
      const loadedHeroes: { [slideId: number]: string } = {};
      for (let id = 1; id <= 4; id++) {
        const img = await getPersistentImage(STORAGE_KEYS.HERO_SLIDE(id));
        if (img) loadedHeroes[id] = img;
      }
      if (Object.keys(loadedHeroes).length > 0) {
        setHeroImages(loadedHeroes);
      } else {
        const saved = localStorage.getItem(HERO_STORAGE_KEY);
        if (saved) setHeroImages(JSON.parse(saved));
      }

      // 2. Load mode
      const savedMode = localStorage.getItem(HERO_VIEW_MODE_KEY);
      if (savedMode) {
        setIsFullBannerMode(savedMode === 'true');
      }

      // 3. Load philosophy
      const phil = await getPersistentImage(STORAGE_KEYS.PHILOSOPHY_MODEL);
      if (phil) {
        setPhilosophyPhoto(phil);
      } else {
        const savedPhil = localStorage.getItem(PHILOSOPHY_PHOTO_KEY);
        if (savedPhil) setPhilosophyPhoto(savedPhil);
      }
    };

    loadAll();
  }, [isOpen]);

  const handlePhilosophyUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (event) => {
      if (event.target?.result) {
        const val = event.target.result as string;
        setPhilosophyPhoto(val);
        await savePersistentImage(STORAGE_KEYS.PHILOSOPHY_MODEL, val);
        try {
          localStorage.setItem(PHILOSOPHY_PHOTO_KEY, val);
        } catch {
          // ignore
        }
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhilosophyPhoto = async () => {
    setPhilosophyPhoto('');
    await removePersistentImage(STORAGE_KEYS.PHILOSOPHY_MODEL);
    localStorage.removeItem(PHILOSOPHY_PHOTO_KEY);
  };

  if (!isOpen) return null;

  const saveSlideImage = async (slideId: number, dataUrl: string) => {
    setHeroImages((prev) => ({ ...prev, [slideId]: dataUrl }));
    await savePersistentImage(STORAGE_KEYS.HERO_SLIDE(slideId), dataUrl);
  };

  const handleHeroFileUpload = (slideId: number, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        saveSlideImage(slideId, event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleHeroRemove = async (slideId: number) => {
    const updated = { ...heroImages };
    delete updated[slideId];
    setHeroImages(updated);
    await removePersistentImage(STORAGE_KEYS.HERO_SLIDE(slideId));
  };

  const toggleBannerMode = () => {
    const newMode = !isFullBannerMode;
    setIsFullBannerMode(newMode);
    try {
      localStorage.setItem(HERO_VIEW_MODE_KEY, String(newMode));
      window.dispatchEvent(new Event('storage'));
    } catch (e) {
      console.error(e);
    }
  };

  // Smart Bulk Upload / Drop handler for the 4 images
  const processFiles = (files: FileList | File[]) => {
    Array.from(files).forEach((file, index) => {
      const matchedProductId = matchUploadedFileToProductId(file.name);
      if (activeTab === 'products' || matchedProductId) {
        if (matchedProductId) {
          const reader = new FileReader();
          reader.onload = (e) => {
            if (e.target?.result) {
              onUploadImage(matchedProductId, e.target.result as string);
            }
          };
          reader.readAsDataURL(file);
          return;
        }
      }

      const name = file.name.toLowerCase();
      let targetSlideId = index + 1; // Default sequential 1, 2, 3, 4

      // Intelligent filename matching for the 4 images
      if (name.startsWith('1') || name.includes('biosel') || name.includes('shampoo') || name.includes('power') || name.includes('3.37.56')) {
        targetSlideId = 1; // Biosel
      } else if (name.startsWith('2') || name.includes('coco') || name.includes('coconut') || name.includes('3.37.54')) {
        targetSlideId = 2; // Coconut Oil
      } else if (name.startsWith('3') || name.includes('glow') || (name.includes('serum') && !name.includes('hair')) || name.includes('longevity') || (name.includes('3.37.55') && !name.includes('(1)'))) {
        targetSlideId = 3; // FD GLOW
      } else if (name.startsWith('4') || name.includes('grow') || name.includes('collagen') || (name.includes('3.37.55') && name.includes('(1)'))) {
        targetSlideId = 4; // FD-GROW Hair Serum
      }

      if (targetSlideId <= 4) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            saveSlideImage(targetSlideId, e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const handleBulkDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingBulk(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const handleBulkChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  const handleProductFileChange = (productId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        onUploadImage(productId, event.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200 font-sans">
      {/* Hidden input for multi-file upload */}
      <input
        ref={bulkFileInputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={handleBulkChange}
      />

      <div
        className="relative w-full max-w-3xl max-h-[92vh] bg-[#FAF9F6] rounded-2xl border border-[#E7E0D5] shadow-2xl flex flex-col overflow-hidden text-[#1E1D1B]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[#EDE8DF] flex items-center justify-between bg-white">
          <div>
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#D81B60] font-mono font-bold block">
              Face Derma Brand Studio
            </span>
            <h3 className="text-xl font-extrabold text-[#1E1D1B] tracking-tight">
              Website Image Manager
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-[#7A756D] hover:text-[#1E1D1B] hover:bg-[#EDE8DF] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Tabs */}
        <div className="px-6 pt-3 bg-white border-b border-[#EDE8DF] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('hero')}
              className={`px-4 py-2.5 text-xs font-extrabold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'hero'
                  ? 'border-[#D81B60] text-[#D81B60]'
                  : 'border-transparent text-[#7A756D] hover:text-[#1E1D1B]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hero 4 Product Banners</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-pink-100 text-[#D81B60] font-bold">
                {Object.keys(heroImages).length}/4
              </span>
            </button>

            <button
              onClick={() => setActiveTab('products')}
              className={`px-4 py-2.5 text-xs font-extrabold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'products'
                  ? 'border-[#D81B60] text-[#D81B60]'
                  : 'border-transparent text-[#7A756D] hover:text-[#1E1D1B]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Product Cards ({products.length} Items)</span>
              <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-gray-100 text-gray-700 font-bold">
                {products.filter((p) => Boolean(p.image)).length}/{products.length}
              </span>
            </button>

            <button
              onClick={() => setActiveTab('philosophy')}
              className={`px-4 py-2.5 text-xs font-extrabold tracking-wider uppercase border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'philosophy'
                  ? 'border-[#D81B60] text-[#D81B60]'
                  : 'border-transparent text-[#7A756D] hover:text-[#1E1D1B]'
              }`}
            >
              <Heart className="w-3.5 h-3.5" />
              <span>Philosophy Model Photo</span>
              {philosophyPhoto && (
                <span className="ml-1 px-2 py-0.5 rounded-full text-[10px] bg-pink-100 text-[#D81B60] font-bold">
                  Active
                </span>
              )}
            </button>
          </div>

          {activeTab === 'hero' && Object.keys(heroImages).length > 0 && (
            <button
              onClick={toggleBannerMode}
              className="text-[11px] font-bold tracking-wider uppercase text-[#D81B60] hover:text-[#AD1457] flex items-center gap-1.5 pb-2"
            >
              <ImageIcon className="w-3.5 h-3.5" />
              <span>View Mode: {isFullBannerMode ? 'Full Banner' : 'Interactive Studio'}</span>
            </button>
          )}
        </div>

        {/* Tab 1: Hero Carousel 4 Images */}
        {activeTab === 'hero' && (
          <div className="p-6 overflow-y-auto space-y-4 max-h-[58vh]">
            
            {/* Multi-Drop Zone */}
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsDraggingBulk(true);
              }}
              onDragLeave={() => setIsDraggingBulk(false)}
              onDrop={handleBulkDrop}
              onClick={() => bulkFileInputRef.current?.click()}
              className={`p-4 rounded-xl border-2 border-dashed transition-all text-center cursor-pointer flex flex-col items-center justify-center gap-2 ${
                isDraggingBulk
                  ? 'border-[#D81B60] bg-pink-50'
                  : 'border-pink-200 bg-pink-50/40 hover:bg-pink-50 hover:border-[#D81B60]'
              }`}
            >
              <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center text-[#D81B60]">
                <Upload className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#1E1D1B] tracking-wide">
                  Drag & Drop all 4 product images here, or click to upload
                </p>
                <p className="text-[10px] text-[#7A756D] mt-0.5">
                  Supports WhatsApp JPEG / PNG images. Automatically places each photo onto its matching slide.
                </p>
              </div>
            </div>

            {/* Slide List */}
            {DEFAULT_HERO_SLIDES.map((slide: HeroSlideData) => {
              const hasHeroImage = Boolean(heroImages[slide.id]);

              return (
                <div
                  key={slide.id}
                  className="p-4 rounded-xl bg-white border border-[#EDE8DF] flex items-center justify-between gap-4 shadow-xs hover:border-[#D81B60]/50 transition-colors"
                >
                  {/* Thumbnail Preview */}
                  <div className="w-16 h-16 rounded-lg bg-[#D81B60]/10 border border-[#D81B60]/20 flex items-center justify-center overflow-hidden shrink-0">
                    {hasHeroImage ? (
                      <img
                        src={heroImages[slide.id]}
                        alt={`Slide ${slide.id} - ${slide.productName}`}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] text-[#D81B60] font-bold uppercase font-mono">
                        Slide 0{slide.id}
                      </span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] px-2 py-0.5 font-bold uppercase bg-pink-50 text-[#D81B60] rounded-sm">
                        Slide 0{slide.id}
                      </span>
                      <h4 className="text-sm font-bold text-[#1E1D1B] truncate">
                        {slide.productName}
                      </h4>
                      {hasHeroImage && (
                        <CheckCircle2 className="w-4 h-4 text-[#1B803E] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#7A756D] truncate mt-1">
                      {slide.subheadline}
                    </p>
                  </div>

                  {/* Upload Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={(el) => {
                        heroFileInputRefs.current[slide.id] = el;
                      }}
                      onChange={(e) => handleHeroFileUpload(slide.id, e)}
                    />

                    <button
                      onClick={() => heroFileInputRefs.current[slide.id]?.click()}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-[#D81B60] hover:bg-[#C2185B] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-xs"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{hasHeroImage ? 'Change' : 'Upload'}</span>
                    </button>

                    {hasHeroImage && (
                      <button
                        onClick={() => handleHeroRemove(slide.id)}
                        className="p-1.5 rounded-lg text-[#8E8A83] hover:text-[#B91C1C] hover:bg-red-50 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Product Catalog 6 Items */}
        {activeTab === 'products' && (
          <div className="p-6 overflow-y-auto space-y-4 max-h-[58vh]">
            {products.map((product) => {
              const hasImage = Boolean(product.image);

              return (
                <div
                  key={product.id}
                  className="p-3.5 rounded-xl bg-white border border-[#EDE8DF] flex items-center justify-between gap-4"
                >
                  {/* Thumbnail Preview */}
                  <div className="w-14 h-14 rounded-lg bg-[#F5F2EC] border border-[#E5DFD3] flex items-center justify-center overflow-hidden shrink-0">
                    {hasImage ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        onError={(e) => {
                          const fallback = INITIAL_PRODUCTS.find((p) => p.id === product.id)?.image || '/products/fd-moist-moisturizer.svg';
                          (e.target as HTMLImageElement).src = fallback;
                        }}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <span className="text-[10px] text-[#A39E96] uppercase font-mono">Empty</span>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="text-sm font-medium text-[#1E1D1B] truncate">{product.name}</h4>
                      {hasImage && (
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1B803E] shrink-0" />
                      )}
                    </div>
                    <p className="text-[11px] text-[#7A756D] truncate mt-0.5">{product.subtitle}</p>
                  </div>

                  {/* Upload or Remove Actions */}
                  <div className="flex items-center space-x-2 shrink-0">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      ref={(el) => {
                        productFileInputRefs.current[product.id] = el;
                      }}
                      onChange={(e) => handleProductFileChange(product.id, e)}
                    />

                    <button
                      onClick={() => productFileInputRefs.current[product.id]?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#FAF8F5] hover:bg-[#F2ECE1] text-[#1E1D1B] border border-[#DDD5C7] text-xs font-medium transition-all"
                    >
                      <Upload className="w-3.5 h-3.5 text-[#C5A880]" />
                      <span>{hasImage ? 'Change' : 'Upload'}</span>
                    </button>

                    {hasImage && (
                      <button
                        onClick={() => onRemoveImage(product.id)}
                        className="p-1.5 rounded-lg text-[#8E8A83] hover:text-[#B91C1C] hover:bg-red-50 transition-colors"
                        title="Remove image"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 3: Philosophy / Model Photo */}
        {activeTab === 'philosophy' && (
          <div className="p-6 overflow-y-auto space-y-5 max-h-[58vh]">
            <div className="bg-[#FAF9F6] p-5 rounded-2xl border border-[#EDE8DF]">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Photo Preview */}
                <div className="relative w-36 h-44 rounded-xl overflow-hidden bg-gray-100 border border-[#DDD5C7] shadow-md shrink-0">
                  {philosophyPhoto ? (
                    <img
                      src={philosophyPhoto}
                      alt="Brand Philosophy Model"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center p-3 text-center text-gray-400 bg-[#F5F2EB]">
                      <Heart className="w-8 h-8 mb-1 text-[#C5A880]" />
                      <span className="text-[10px] uppercase font-bold tracking-wider">Default Model</span>
                    </div>
                  )}
                </div>

                {/* Upload & Instructions */}
                <div className="flex-1 text-center sm:text-left">
                  <h4 className="text-sm font-bold text-[#1E1D1B] mb-1">
                    The Formulation Philosophy Feature Photo
                  </h4>
                  <p className="text-xs text-[#6B665E] leading-relaxed mb-4">
                    This photo displays on the left side of "The Formulation Philosophy" section with the Biosel formula badge. You can upload the model holding Biosel photo (or any portrait of your choice).
                  </p>

                  <input
                    ref={philosophyFileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handlePhilosophyUpload}
                  />

                  <div className="flex flex-wrap items-center gap-3 justify-center sm:justify-start">
                    <button
                      onClick={() => philosophyFileInputRef.current?.click()}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E1D1B] hover:bg-[#D81B60] text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-sm"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{philosophyPhoto ? 'Replace Image' : 'Upload Image'}</span>
                    </button>

                    {philosophyPhoto && (
                      <button
                        onClick={removePhilosophyPhoto}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-red-50 text-gray-600 hover:text-red-600 border border-gray-200 text-xs font-medium transition-colors"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Reset to Default</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#EDE8DF] bg-white flex items-center justify-between">
          <span className="text-xs text-[#8E8A83]">
            {activeTab === 'hero'
              ? `${Object.keys(heroImages).length} of 4 hero slide images loaded`
              : activeTab === 'products'
              ? `${products.filter((p) => Boolean(p.image)).length} of ${products.length} product bottle photos uploaded`
              : philosophyPhoto ? 'Custom philosophy model photo active' : 'Default luxury photo active'}
          </span>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-[#1E1D1B] hover:bg-[#D81B60] text-white text-xs font-bold tracking-widest uppercase transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
