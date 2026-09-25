import React from 'react';
import { motion } from 'motion/react';
import { ShieldCheck, Dna, Sparkles } from 'lucide-react';

interface BrandDescriptionProps {
  onLearnMore?: () => void;
}

export const BrandDescription: React.FC<BrandDescriptionProps> = ({ onLearnMore }) => {
  return (
    <section
      id="about"
      className="relative py-16 sm:py-24 md:py-32 bg-[#FAF9F6] border-0 overflow-hidden"
    >
      {/* Ambient background glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-[#F2EDE4]/60 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-80 h-80 bg-[#EFE9DF]/60 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-5xl mx-auto px-4 sm:px-8 md:px-12 relative z-10 text-center">
        
        {/* Subtle Brand Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="inline-flex items-center justify-center gap-2.5 mb-4 sm:mb-6"
        >
          <span className="h-[1px] w-6 sm:w-10 bg-[#C05674]" />
          <span className="text-[10px] sm:text-[11.5px] font-semibold tracking-[0.28em] sm:tracking-[0.32em] uppercase text-[#C05674]">
            The Formulation Philosophy
          </span>
          <span className="h-[1px] w-6 sm:w-10 bg-[#C05674]" />
        </motion.div>

        {/* Main Luxury Sentence */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="font-serif text-2xl sm:text-3xl md:text-4xl lg:text-[44px] text-[#1E2229] font-light leading-[1.25] tracking-tight mb-5 sm:mb-7 max-w-4xl mx-auto"
          style={{ fontFamily: "'Bodoni Moda', 'Cormorant Garamond', 'Playfair Display', serif" }}
        >
          Where clinical precision meets everyday luxury.
          <span className="block mt-2 italic font-normal text-[#4A4742] text-xl sm:text-2xl md:text-3xl lg:text-[34px]">
            Face Derma delivers intelligent skincare designed for real results.
          </span>
        </motion.h2>

        {/* Supporting Clinical Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="text-xs sm:text-sm md:text-base text-[#6E6962] font-light tracking-wide leading-relaxed mb-6 sm:mb-8 max-w-2xl mx-auto"
        >
          Formulated under strict dermatological standards. Every molecule is engineered for optimal biocompatibility, reinforcing your epidermal barrier while delivering elevated sensory ritual.
        </motion.p>

        {/* Read Full Story Button */}
        {onLearnMore && (
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-50px' }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="mb-10 sm:mb-14"
          >
            <button
              type="button"
              onClick={onLearnMore}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-white hover:bg-[#1E2229] text-[#1E2229] hover:text-white border border-[#EAE5DD] text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-xs hover:shadow-md group cursor-pointer"
            >
              <span>Read Full About Us &amp; Heritage</span>
              <span className="text-[#C05674] transition-transform group-hover:translate-x-1">→</span>
            </button>
          </motion.div>
        )}

        {/* 3 Refined Minimal Luxury Pillars */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-50px' }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 pt-8 sm:pt-10 border-t border-[#EAE5DD] text-left"
        >
          <div className="p-5 sm:p-6 rounded-2xl bg-white/80 sm:bg-white/60 border border-[#EAE5DD]/80 space-y-2.5 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#EAE5DD] flex items-center justify-center text-[#C05674] shadow-xs">
              <Dna className="w-4 h-4" />
            </div>
            <h3 className="text-xs uppercase tracking-[0.16em] sm:tracking-[0.18em] font-bold text-[#1E2229]">
              Biomimetic Actives
            </h3>
            <p className="text-xs text-[#6E6962] font-light leading-relaxed">
              Molecules mapped to natural skin biology for deep biocompatible uptake and cellular restoration.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white/80 sm:bg-white/60 border border-[#EAE5DD]/80 space-y-2.5 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#EAE5DD] flex items-center justify-center text-[#C05674] shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="text-xs uppercase tracking-[0.16em] sm:tracking-[0.18em] font-bold text-[#1E2229]">
              Clinical Rigor
            </h3>
            <p className="text-xs text-[#6E6962] font-light leading-relaxed">
              Hypoallergenic, non-comedogenic, and rigorously validated by independent dermatologists.
            </p>
          </div>

          <div className="p-5 sm:p-6 rounded-2xl bg-white/80 sm:bg-white/60 border border-[#EAE5DD]/80 space-y-2.5 shadow-2xs hover:shadow-sm transition-shadow">
            <div className="w-9 h-9 rounded-xl bg-white border border-[#EAE5DD] flex items-center justify-center text-[#C05674] shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-xs uppercase tracking-[0.16em] sm:tracking-[0.18em] font-bold text-[#1E2229]">
              Sensory Luxury
            </h3>
            <p className="text-xs text-[#6E6962] font-light leading-relaxed">
              Weightless, silky textures designed to transform everyday treatment into a restorative daily ritual.
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
