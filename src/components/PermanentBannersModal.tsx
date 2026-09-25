import React, { useState, useRef, useEffect } from 'react';
import { X, Upload, CheckCircle2, ShieldCheck, Image as ImageIcon, Sparkles, FolderDown } from 'lucide-react';
import { savePersistentImage, getPersistentImage, STORAGE_KEYS } from '../utils/imageStorage';
import { DEFAULT_HERO_SLIDES } from './VibrantPinkHero';

interface PermanentBannersModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImagesUpdated: () => void;
}

interface BannerSlot {
  id: number;
  title: string;
  recommendedFile: string;
  description: string;
  colorScheme: string;
}

const BANNER_SLOTS: BannerSlot[] = [
  {
    id: 1,
    title: 'Biosel Daily Hairfall Wash',
    recommendedFile: '1.webp',
    description: 'Magenta & purple glowing banner featuring the Biosel bottle on a vibrant background.',
    colorScheme: 'from-purple-900/20 to-pink-900/20 border-purple-500/30',
  },
  {
    id: 2,
    title: 'CO-CO Magic Coconut Oil',
    recommendedFile: '2 (2).jpg',
    description: 'Soft pink studio pedestals with jars of CO-CO magic Cold Pressed Extra Virgin Coconut Oil.',
    colorScheme: 'from-pink-900/20 to-rose-900/20 border-pink-500/30',
  },
  {
    id: 3,
    title: 'FD GLOW Face Serum',
    recommendedFile: '3.webp',
    description: 'Mint green clinical aesthetic banner with "THE CODE NUMBERS OF SKIN LONGEVITY" and 4 dropper bottles.',
    colorScheme: 'from-teal-900/20 to-emerald-900/20 border-teal-500/30',
  },
  {
    id: 4,
    title: 'FD-GROW Hair Serum',
    recommendedFile: 'Gemini_Generated_Image_v7xko9v7xko9v7xk.jpg',
    description: 'Blush nude studio backdrop with the blue carton & bottle beside "Ultra Collagen Booster Trio +69.4% More Collagen*".',
    colorScheme: 'from-amber-900/20 to-orange-900/20 border-amber-500/30',
  },
];

export const PermanentBannersModal: React.FC<PermanentBannersModalProps> = ({
  isOpen,
  onClose,
  onImagesUpdated,
}) => {
  const [currentImages, setCurrentImages] = useState<{ [id: number]: string }>({});
  const [savingStatus, setSavingStatus] = useState<{ [id: number]: 'idle' | 'saving' | 'saved' }>({});
  const [isBulkDragging, setIsBulkDragging] = useState(false);
  const fileInputRefs = useRef<{ [key: number]: HTMLInputElement | null }>({});
  const bulkInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isOpen) return;
    const loadImages = async () => {
      const loaded: { [id: number]: string } = {};
      for (let id = 1; id <= 4; id++) {
        const img = await getPersistentImage(STORAGE_KEYS.HERO_SLIDE(id));
        if (img) loaded[id] = img;
      }
      setCurrentImages(loaded);
    };
    loadImages();
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSaveImage = async (slideId: number, dataUrl: string) => {
    setSavingStatus((prev) => ({ ...prev, [slideId]: 'saving' }));
    setCurrentImages((prev) => ({ ...prev, [slideId]: dataUrl }));

    try {
      await savePersistentImage(STORAGE_KEYS.HERO_SLIDE(slideId), dataUrl);
      setSavingStatus((prev) => ({ ...prev, [slideId]: 'saved' }));
      setTimeout(() => {
        setSavingStatus((prev) => ({ ...prev, [slideId]: 'idle' }));
      }, 3000);
      onImagesUpdated();
    } catch (err) {
      console.error('Failed to permanently save hero banner:', err);
      setSavingStatus((prev) => ({ ...prev, [slideId]: 'idle' }));
    }
  };

  const processFileList = (files: FileList | File[]) => {
    const arr = Array.from(files);
    arr.forEach((file, index) => {
      const name = file.name.toLowerCase();
      let targetId = index + 1;

      // Smart filename detection for the 4 uploaded banners
      if (name.startsWith('1') || name.includes('biosel') || name.includes('shampoo') || name.includes('power')) {
        targetId = 1;
      } else if (name.startsWith('2') || name.includes('coco') || name.includes('coconut')) {
        targetId = 2;
      } else if (name.startsWith('3') || name.includes('glow') || (name.includes('serum') && !name.includes('hair')) || name.includes('longevity')) {
        targetId = 3;
      } else if (name.startsWith('4') || name.includes('grow') || name.includes('collagen') || name.includes('gemini') || name.includes('v7xk')) {
        targetId = 4;
      }

      if (targetId >= 1 && targetId <= 4) {
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            handleSaveImage(targetId, e.target.result as string);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-[#181716] text-white rounded-3xl shadow-2xl border border-white/10 flex flex-col max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-5 sm:p-6 border-b border-white/10 bg-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                <span>Permanent Hero Banners Hub</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  Shared &amp; Publish Synced
                </span>
              </h3>
              <p className="text-xs text-gray-400 mt-0.5">
                Saved directly to the project's disk (<code className="text-emerald-300">/public/hero/</code>) so they remain permanent for all visitors and shared URLs.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Master Bulk Dropper */}
        <div className="p-5 sm:p-6 border-b border-white/10 bg-gradient-to-r from-emerald-950/40 via-teal-950/20 to-purple-950/30">
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsBulkDragging(true);
            }}
            onDragLeave={() => setIsBulkDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsBulkDragging(false);
              if (e.dataTransfer.files) processFileList(e.dataTransfer.files);
            }}
            onClick={() => bulkInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-2 ${
              isBulkDragging
                ? 'border-emerald-400 bg-emerald-500/20 scale-[0.99]'
                : 'border-white/20 hover:border-emerald-400 hover:bg-white/5'
            }`}
          >
            <input
              ref={bulkInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => {
                if (e.target.files) processFileList(e.target.files);
              }}
            />
            <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/40">
              <FolderDown className="w-6 h-6" />
            </div>
            <div className="text-sm font-bold text-white">
              Drop all 4 banner images here or click to browse
            </div>
            <div className="text-xs text-gray-400 max-w-md">
              Select <strong>1.webp</strong>, <strong>2 (2).jpg</strong>, <strong>3.webp</strong>, and <strong>Gemini_Generated_Image...jpg</strong> all at once. The system will automatically place each into its matching slide.
            </div>
          </div>
        </div>

        {/* 4 Banner Slots Grid */}
        <div className="p-5 sm:p-6 overflow-y-auto space-y-4 flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {BANNER_SLOTS.map((slot) => {
              const image = currentImages[slot.id];
              const status = savingStatus[slot.id];

              return (
                <div
                  key={slot.id}
                  className={`rounded-2xl border p-4 bg-gradient-to-br flex flex-col justify-between relative overflow-hidden transition-all ${
                    image ? 'border-emerald-500/40 bg-white/5' : slot.colorScheme
                  }`}
                >
                  <input
                    ref={(el) => {
                      fileInputRefs.current[slot.id] = el;
                    }}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onload = (ev) => {
                          if (ev.target?.result) {
                            handleSaveImage(slot.id, ev.target.result as string);
                          }
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />

                  <div>
                    {/* Top Row: Slide Tag & Status */}
                    <div className="flex items-center justify-between gap-2 mb-2.5">
                      <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-white/10 text-white border border-white/10">
                        Slide {slot.id}
                      </span>
                      {image ? (
                        <span className="text-[10px] font-semibold text-emerald-400 flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Permanent on Disk</span>
                        </span>
                      ) : (
                        <span className="text-[10px] font-medium text-amber-300/90 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                          Using built-in replica
                        </span>
                      )}
                    </div>

                    <h4 className="font-bold text-sm text-white">{slot.title}</h4>
                    <p className="text-[11px] text-gray-400 mt-1 leading-relaxed">{slot.description}</p>
                    <div className="text-[10px] font-mono text-emerald-300/80 mt-1">
                      File: {slot.recommendedFile}
                    </div>

                    {/* Preview Thumbnail */}
                    <div className="mt-3 relative w-full h-24 rounded-xl overflow-hidden bg-black/40 border border-white/10 flex items-center justify-center">
                      {image ? (
                        <img
                          src={image}
                          alt={slot.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="flex flex-col items-center gap-1 text-gray-500">
                          <ImageIcon className="w-6 h-6 opacity-40" />
                          <span className="text-[10px]">No custom file uploaded yet</span>
                        </div>
                      )}
                      {status === 'saving' && (
                        <div className="absolute inset-0 bg-black/70 flex items-center justify-center text-xs font-semibold text-emerald-400 gap-2">
                          <Sparkles className="w-4 h-4 animate-spin" />
                          <span>Writing to disk...</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-3 flex items-center gap-2">
                    <button
                      onClick={() => fileInputRefs.current[slot.id]?.click()}
                      className="flex-1 py-2 px-3 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border border-white/10"
                    >
                      <Upload className="w-3.5 h-3.5" />
                      <span>{image ? 'Replace File' : 'Upload Image'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 border-t border-white/10 bg-white/5 flex items-center justify-between text-xs text-gray-400">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Files are baked into public repository assets for instant global delivery.</span>
          </div>
          <button
            onClick={onClose}
            className="py-2 px-5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-colors shadow-lg"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
};
