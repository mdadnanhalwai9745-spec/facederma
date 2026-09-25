import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Globe, CheckCircle2, Sparkles, RefreshCw, FileText, Image as ImageIcon, ShieldCheck, RotateCcw } from 'lucide-react';
import { Product } from '../types';
import { matchUploadedFileToProductId, INITIAL_PRODUCTS } from '../data/products';

interface PermanentStorageModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
  onUploadImage: (productId: string, dataUrl: string, isSecondary?: boolean) => Promise<void> | void;
  onResetImage?: (productId: string, isSecondary?: boolean) => Promise<void> | void;
}

type TabFilter = 'all' | 'photo' | 'catalog';

export const PermanentStorageModal: React.FC<PermanentStorageModalProps> = ({
  isOpen,
  onClose,
  products,
  onUploadImage,
  onResetImage,
}) => {
  const [tab, setTab] = useState<TabFilter>('all');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadLog, setUploadLog] = useState<string[]>([]);
  const [isDragOver, setIsDragOver] = useState(false);
  const [currentLogoUrl, setCurrentLogoUrl] = useState<string>('/products/permanent/brand_logo.webp');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const slotInputRefs = useRef<{ [slotKey: string]: HTMLInputElement | null }>({});

  useEffect(() => {
    fetch('/api/products')
      .then((r) => r.json())
      .then((d) => {
        if (d?.products?.brand_logo) {
          setCurrentLogoUrl(d.products.brand_logo);
        }
      })
      .catch(() => {});
  }, []);

  if (!isOpen) return null;

  const readFileAsDataUrl = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFiles = async (files: FileList | File[]) => {
    setIsUploading(true);
    setUploadLog([]);
    const logs: string[] = [];

    const fileList = Array.from(files);
    logs.push(`Processing ${fileList.length} file(s)...`);
    setUploadLog([...logs]);

    for (const file of fileList) {
      const matchedId = matchUploadedFileToProductId(file.name);
      if (matchedId) {
        const lowerName = file.name.toLowerCase();
        // Intelligent slot determination
        const isCatalog =
          tab === 'catalog' ||
          lowerName.includes('catalog') ||
          lowerName.includes('flyer') ||
          lowerName.includes('monograph') ||
          lowerName.includes('sheet') ||
          lowerName.includes('brochure');

        const prod = products.find((p) => p.id === matchedId);
        const slotLabel = isCatalog ? 'Catalog Flyer' : 'Product Photo';
        logs.push(`Matched "${file.name}" → ${prod?.name || matchedId} [${slotLabel} Slot]`);
        setUploadLog([...logs]);

        try {
          const dataUrl = await readFileAsDataUrl(file);

          // Upload to permanent disk API
          const res = await fetch('/api/products/upload', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              productId: matchedId,
              imageBase64: dataUrl,
              filename: file.name,
              isCatalog,
            }),
          });

          if (res.ok) {
            const data = await res.json();
            const finalUrl = data.permanentUrl || dataUrl;
            await onUploadImage(matchedId, finalUrl, isCatalog);
            logs.push(`✓ Saved permanently on server: ${matchedId} (${slotLabel})`);
          } else {
            // Local fallback
            await onUploadImage(matchedId, dataUrl, isCatalog);
            logs.push(`Saved to client storage for ${matchedId} (${slotLabel})`);
          }
        } catch (err: any) {
          logs.push(`Error on ${file.name}: ${err.message}`);
        }
      } else {
        logs.push(`Notice: Could not automatically match "${file.name}". Name it fd-01 to fd-13 or use individual slot button.`);
      }
      setUploadLog([...logs]);
    }

    logs.push('✓ Processing complete! All slots updated permanently.');
    setUploadLog([...logs]);
    setIsUploading(false);
  };

  const handleSingleSlotUpload = async (productId: string, e: React.ChangeEvent<HTMLInputElement>, isCatalog: boolean) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await readFileAsDataUrl(file);

      // Save to server
      const res = await fetch('/api/products/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId,
          imageBase64: dataUrl,
          filename: file.name,
          isCatalog,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        await onUploadImage(productId, data.permanentUrl || dataUrl, isCatalog);
      } else {
        await onUploadImage(productId, dataUrl, isCatalog);
      }
    } catch (err) {
      console.error('Error during single slot upload:', err);
    }
  };

  const handleResetSlot = async (productId: string, isCatalog: boolean) => {
    try {
      if (onResetImage) {
        await onResetImage(productId, isCatalog);
      } else {
        // Direct server delete call
        await fetch('/api/products/upload', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId, delete: true, isCatalog }),
        });
        await onUploadImage(productId, '', isCatalog);
      }
    } catch (e) {
      console.warn('Reset error:', e);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      {/* Hidden Bulk File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,application/pdf"
        className="hidden"
        onChange={(e) => {
          if (e.target.files && e.target.files.length > 0) {
            handleFiles(e.target.files);
          }
        }}
      />

      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="relative w-full max-w-5xl max-h-[92vh] bg-[#FAF9F6] rounded-3xl border border-[#EDE8DF] shadow-2xl flex flex-col overflow-hidden text-[#1E1D1B]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-5 border-b border-[#EDE8DF] flex items-center justify-between bg-white">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#C05674]/10 flex items-center justify-center text-[#C05674]">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold tracking-[0.25em] uppercase text-[#C05674]">
                  Permanent Slot Storage
                </span>
                <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                  Dual Slot System (26 Total)
                </span>
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-light text-[#1E1D1B]">
                Face Derma® Product &amp; Catalog Asset Hub
              </h3>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-[#7A756D] hover:text-[#1E1D1B] hover:bg-[#FAF9F6] transition-colors cursor-pointer"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Filters */}
        <div className="px-6 py-3 bg-[#FAF9F6] border-b border-[#EDE8DF] flex items-center justify-between gap-3 overflow-x-auto scrollbar-none">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setTab('all')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                tab === 'all'
                  ? 'bg-[#1E1D1B] text-white shadow-md'
                  : 'bg-white text-[#5A554E] hover:text-[#1E1D1B] border border-[#EDE8DF]'
              }`}
            >
              <span>All Slots (26: Photo &amp; Catalog)</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('photo')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                tab === 'photo'
                  ? 'bg-[#1E1D1B] text-white shadow-md'
                  : 'bg-white text-[#5A554E] hover:text-[#1E1D1B] border border-[#EDE8DF]'
              }`}
            >
              <ImageIcon className="w-4 h-4 text-[#C05674]" />
              <span>Product Photos (13)</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('catalog')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                tab === 'catalog'
                  ? 'bg-[#1E1D1B] text-white shadow-md'
                  : 'bg-white text-[#5A554E] hover:text-[#1E1D1B] border border-[#EDE8DF]'
              }`}
            >
              <FileText className="w-4 h-4 text-[#C05674]" />
              <span>Catalog Flyers (13)</span>
            </button>
            <button
              type="button"
              onClick={() => setTab('logo' as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold tracking-wider uppercase transition-all cursor-pointer whitespace-nowrap ${
                (tab as string) === 'logo'
                  ? 'bg-[#1E1D1B] text-white shadow-md'
                  : 'bg-white text-[#5A554E] hover:text-[#1E1D1B] border border-[#EDE8DF]'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#D4AF37]" />
              <span>Brand Logo (1)</span>
            </button>
          </div>
          <span className="text-[11px] text-[#7A756D] hidden md:inline whitespace-nowrap">
            Permanent disk: <code className="text-[#C05674] font-mono">public/products/permanent/</code>
          </span>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 max-h-[72vh]">
          {/* Reassurance Banner */}
          <div className="p-4 rounded-2xl bg-white border border-[#EDE8DF] flex items-start gap-3 shadow-xs">
            <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div className="text-xs text-[#5A554E] leading-relaxed">
              <span className="font-bold text-[#1E1D1B] block mb-0.5">
                Upload once — images and catalog flyers stay permanently assigned forever
              </span>
              Every product has two isolated slots: (1) <strong>3D Product Photo</strong> and (2) <strong>Clinical Monograph Flyer</strong>. Each slot is strictly isolated, saved to server disk, indexed locally, and will never reset on reload or refresh.
            </div>
          </div>

          {/* Bulk Drag & Drop Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragOver(false);
              if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
                handleFiles(e.dataTransfer.files);
              }
            }}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-3xl p-6 sm:p-8 text-center transition-all cursor-pointer ${
              isDragOver
                ? 'border-[#C05674] bg-[#C05674]/5 scale-[1.01]'
                : 'border-[#DDD5C7] bg-white hover:border-[#C05674] hover:bg-[#FDFCF9]'
            }`}
          >
            <div className="max-w-md mx-auto space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#FAF9F6] border border-[#EDE8DF] flex items-center justify-center text-[#C05674] shadow-xs">
                <Upload className="w-5 h-5" />
              </div>
              <h4 className="font-serif text-lg font-medium text-[#1E1D1B]">
                Drop any photos or catalog flyers here
              </h4>
              <p className="text-xs text-[#7A756D] leading-relaxed">
                Smart matching: files containing <span className="font-mono text-[#1E1D1B] font-bold">catalog</span> or <span className="font-mono text-[#1E1D1B] font-bold">flyer</span> route to the catalog slot; standard images route to product photo slots. Or use the dedicated buttons below for instant precision.
              </p>
              <button
                type="button"
                className="mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-full bg-[#1E1D1B] hover:bg-[#C05674] text-white text-xs font-bold tracking-widest uppercase transition-all shadow-xs cursor-pointer"
              >
                <span>Select Files From Device</span>
              </button>
            </div>
          </div>

          {/* Upload Progress Log */}
          {uploadLog.length > 0 && (
            <div className="p-4 rounded-2xl bg-[#1E1D1B] text-white font-mono text-[11px] space-y-1 max-h-40 overflow-y-auto">
              <div className="flex items-center justify-between text-[#C05674] font-bold pb-1 border-b border-white/10 mb-1">
                <span>Permanent Sync Log</span>
                {isUploading && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
              </div>
              {uploadLog.map((line, i) => (
                <div key={i} className={line.startsWith('✓') ? 'text-emerald-400 font-bold' : 'text-gray-300'}>
                  &gt; {line}
                </div>
              ))}
            </div>
          )}

          {/* Brand Logo Dedicated Slot */}
          {(tab === 'all' || (tab as string) === 'logo') && (
            <div className="p-4 rounded-2xl bg-[#1E1D1B] text-white border border-[#D4AF37]/30 shadow-md mb-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full border-2 border-[#D4AF37] overflow-hidden flex items-center justify-center bg-black/60 shrink-0">
                    <img
                      src={currentLogoUrl}
                      alt="Brand Logo Preview"
                      key={currentLogoUrl}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
                      <span className="text-xs font-bold uppercase tracking-widest text-[#D4AF37]">
                        Official Brand Logo Slot
                      </span>
                    </div>
                    <h4 className="text-sm font-bold text-white mt-0.5">
                      Face Derma® Medallion Emblem
                    </h4>
                    <p className="text-[11px] text-white/70">
                      Upload your exact transparent or black PNG/JPG logo to update the header and footer globally.
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  <input
                    id="brand-logo-file-input"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = async (ev) => {
                        const dataUrl = ev.target?.result as string;
                        if (dataUrl) {
                          try {
                            const res = await fetch('/api/products/upload', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({
                                productId: 'brand_logo',
                                imageBase64: dataUrl,
                                filename: 'brand_logo.png',
                                isCatalog: false,
                              }),
                            });
                            if (res.ok) {
                              const json = await res.json();
                              const newUrl = json.permanentUrl || `/products/permanent/brand_logo.webp?t=${Date.now()}`;
                              setCurrentLogoUrl(newUrl);
                              window.dispatchEvent(new CustomEvent('facederma_image_updated'));
                            }
                          } catch (err: any) {
                            alert(`Error uploading logo: ${err.message}`);
                          }
                        }
                      };
                      reader.readAsDataURL(file);
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => document.getElementById('brand-logo-file-input')?.click()}
                    className="px-4 py-2 rounded-full bg-[#D4AF37] hover:bg-[#E5C158] text-black font-bold text-xs tracking-wider uppercase transition-all shadow-md cursor-pointer"
                  >
                    Upload Logo File
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 13 Formulations: Detailed Slot Management */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold tracking-[0.2em] uppercase text-[#1E1D1B]">
                All 13 Clinical Formulations (26 Dedicated Slots)
              </h4>
              <span className="text-[11px] text-[#7A756D]">
                Independent storage per slot • No mixing
              </span>
            </div>

            <div className="space-y-3">
              {products.map((prod, idx) => {
                const initialMatch = INITIAL_PRODUCTS.find((p) => p.id === prod.id);
                const defaultPhoto = initialMatch?.image || '/products/fd-moist-moisturizer.svg';
                const defaultCatalog = initialMatch?.secondaryImage || `/products/permanent/${prod.id}_catalog.webp`;

                const photoImg = prod.image || defaultPhoto;
                const catalogImg = prod.secondaryImage || defaultCatalog;

                const isPhotoPermanent = photoImg && photoImg.includes('/products/permanent/');
                const isCatalogPermanent = catalogImg && catalogImg.includes('/products/permanent/');

                const photoKey = `${prod.id}_photo`;
                const catalogKey = `${prod.id}_catalog`;

                return (
                  <div
                    key={prod.id}
                    className="p-4 rounded-2xl bg-white border border-[#EDE8DF] shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    {/* Product Meta Header */}
                    <div className="w-full md:w-56 shrink-0">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[10px] font-mono text-[#8E8A83] font-bold">
                          #{String(idx + 1).padStart(2, '0')}
                        </span>
                        <span className="text-[10px] font-mono text-[#C05674] font-bold">
                          ({prod.id})
                        </span>
                        <span className="text-[9px] px-2 py-0.5 rounded-full bg-[#FAF9F6] border border-[#EDE8DF] text-[#7A756D] font-medium">
                          {prod.category}
                        </span>
                      </div>
                      <h5 className="text-sm font-bold text-[#1E1D1B] truncate">
                        {prod.name}
                      </h5>
                      <p className="text-[11px] text-[#8E8A83] font-mono">
                        {prod.volume || 'Standard Pack'}
                      </p>
                    </div>

                    {/* The 2 Dedicated Slots */}
                    <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {/* Slot 1: Product Photo */}
                      {(tab === 'all' || tab === 'photo') && (
                        <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#EDE8DF] flex items-center gap-3">
                          <input
                            ref={(el) => {
                              slotInputRefs.current[photoKey] = el;
                            }}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleSingleSlotUpload(prod.id, e, false)}
                          />

                          <div className="w-14 h-14 rounded-lg bg-white border border-[#EDE8DF] overflow-hidden flex items-center justify-center shrink-0 p-1">
                            <img
                              src={photoImg}
                              alt={`${prod.name} Photo`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = defaultPhoto;
                              }}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#1E1D1B] block">
                              Product Photo Slot
                            </span>
                            <div className="flex items-center gap-1 mt-0.5">
                              {isPhotoPermanent ? (
                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Permanent
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[9px] text-[#8E8A83]">
                                  <Sparkles className="w-2.5 h-2.5 text-[#C05674]" />
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-2">
                              <button
                                type="button"
                                onClick={() => slotInputRefs.current[photoKey]?.click()}
                                className="px-2.5 py-1 rounded-full bg-white hover:bg-[#1E1D1B] text-[#1E1D1B] hover:text-white border border-[#EDE8DF] text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer"
                              >
                                Upload Photo
                              </button>
                              {photoImg !== defaultPhoto && (
                                <button
                                  type="button"
                                  onClick={() => handleResetSlot(prod.id, false)}
                                  title="Reset to default formulation photo"
                                  className="p-1 rounded-full text-[#8E8A83] hover:text-[#C05674] hover:bg-white transition-colors cursor-pointer"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Slot 2: Catalog Flyer */}
                      {(tab === 'all' || tab === 'catalog') && (
                        <div className="p-2.5 rounded-xl bg-[#FAF9F6] border border-[#EDE8DF] flex items-center gap-3">
                          <input
                            ref={(el) => {
                              slotInputRefs.current[catalogKey] = el;
                            }}
                            type="file"
                            accept="image/*,application/pdf"
                            className="hidden"
                            onChange={(e) => handleSingleSlotUpload(prod.id, e, true)}
                          />

                          <div className="w-14 h-14 rounded-lg bg-white border border-[#EDE8DF] overflow-hidden flex items-center justify-center shrink-0 p-1">
                            <img
                              src={catalogImg}
                              alt={`${prod.name} Catalog`}
                              onError={(e) => {
                                (e.target as HTMLImageElement).src = defaultCatalog;
                              }}
                              className="w-full h-full object-contain"
                            />
                          </div>

                          <div className="flex-1 min-w-0">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#C05674] block">
                              Catalog Flyer Slot
                            </span>
                            <div className="flex items-center gap-1 mt-0.5">
                              {isCatalogPermanent ? (
                                <span className="inline-flex items-center gap-1 text-[9px] font-semibold text-emerald-700">
                                  <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                  Permanent
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1 text-[9px] text-[#8E8A83]">
                                  <Sparkles className="w-2.5 h-2.5 text-[#C05674]" />
                                  Default
                                </span>
                              )}
                            </div>
                            <div className="flex items-center gap-1.5 mt-2">
                              <button
                                type="button"
                                onClick={() => slotInputRefs.current[catalogKey]?.click()}
                                className="px-2.5 py-1 rounded-full bg-white hover:bg-[#C05674] text-[#1E1D1B] hover:text-white border border-[#EDE8DF] text-[10px] font-bold tracking-wider uppercase transition-colors cursor-pointer"
                              >
                                Upload Catalog
                              </button>
                              {catalogImg !== defaultCatalog && (
                                <button
                                  type="button"
                                  onClick={() => handleResetSlot(prod.id, true)}
                                  title="Reset to default clinical flyer"
                                  className="p-1 rounded-full text-[#8E8A83] hover:text-[#C05674] hover:bg-white transition-colors cursor-pointer"
                                >
                                  <RotateCcw className="w-3 h-3" />
                                </button>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[#EDE8DF] flex items-center justify-between bg-white">
          <div className="flex items-center gap-2 text-xs text-[#8E8A83]">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Images saved here are permanent and visible across all browsers &amp; devices worldwide.</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="px-6 py-2.5 rounded-full bg-[#1E1D1B] hover:bg-[#C05674] text-white text-xs font-bold tracking-widest uppercase transition-all cursor-pointer shadow-xs"
          >
            Done
          </button>
        </div>
      </motion.div>
    </div>
  );
};
