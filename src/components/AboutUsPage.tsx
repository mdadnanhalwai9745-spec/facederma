import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck,
  Award,
  Sparkles,
  ArrowLeft,
  CheckCircle2,
  MapPin,
  Clock,
  Phone,
  MessageCircle,
  ExternalLink,
  ChevronRight,
  HeartHandshake,
  FlaskConical,
  Microscope,
} from 'lucide-react';
import { Product, ContactInfo } from '../types';
import { FDLogo } from './FDLogo';

interface AboutUsPageProps {
  products: Product[];
  contact: ContactInfo;
  onBackToHome: () => void;
  onSelectProduct: (product: Product) => void;
}

export const AboutUsPage: React.FC<AboutUsPageProps> = ({
  products,
  contact,
  onBackToHome,
  onSelectProduct,
}) => {
  // Ensure page scrolls to top upon opening
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const pillars = [
    {
      icon: <FlaskConical className="w-6 h-6 text-[#C05674]" />,
      title: 'Active Concentration Integrity',
      description:
        'Every Face Derma® formulation is powered by clinically validated bio-actives at therapeutic concentrations — from 10% pure Niacinamide with Zinc PCA to medical-grade Ketoconazole and cold-pressed extra virgin botanicals.',
    },
    {
      icon: <Microscope className="w-6 h-6 text-[#C05674]" />,
      title: 'Dermatologist-Engineered',
      description:
        'Developed specifically to treat South Asian and global environmental skin stressors, UV damage, humidity-induced acne, and epidermal barrier breakdown with zero greasy residue or white cast.',
    },
    {
      icon: <Award className="w-6 h-6 text-[#C05674]" />,
      title: 'ISO & GMP Certified Standards',
      description:
        'Manufactured in certified clean-room laboratories under strict ISO 22000 and Good Manufacturing Practices (GMP) to guarantee purity, sterile stability, and batch-to-batch consistency.',
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-[#C05674]" />,
      title: 'Non-Comedogenic & Cruelty-Free',
      description:
        'Our formulas are 100% cruelty-free, paraben-safe, and non-comedogenic. We prioritize skin barrier longevity over harsh instant gratification, respecting cellular biology.',
    },
  ];

  const milestones = [
    {
      year: 'Maharajgunj-3',
      title: 'The Clinical Inception',
      desc: 'Founded in Kathmandu, Nepal with a commitment to bring pharmaceutical-grade dermatological care directly to discerning patients.',
    },
    {
      year: '13 Solutions',
      title: 'The Core Formulary',
      desc: 'Refining 13 targeted treatments across cleansers, sunscreens, hair follicle restorers, depigmentation creams, and barrier hydrators.',
    },
    {
      year: '100% Tested',
      title: 'Standard of Excellence',
      desc: 'Stringent multi-phase stability testing ensuring biocompatibility and maximum efficacy for sensitive and sensitized complexions.',
    },
  ];

  return (
    <div id="about-us-page" className="min-h-screen bg-[#FAF9F6] text-[#1E2229] pt-6 pb-20 selection:bg-[#C05674] selection:text-white">
      {/* ========================================================================= */}
      {/* TOP SUB-NAV BAR: BREADCRUMB & BACK TO HERO                               */}
      {/* ========================================================================= */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8">
        <div className="flex items-center justify-between py-3 border-b border-[#EAE5DD]">
          <div className="flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-neutral-500">
            <button
              type="button"
              onClick={onBackToHome}
              className="hover:text-[#1E2229] transition-colors flex items-center gap-1.5"
            >
              <span>Home</span>
            </button>
            <ChevronRight className="w-3 h-3 text-neutral-400" />
            <span className="text-[#C05674]">About Face Derma®</span>
          </div>

          <button
            type="button"
            onClick={onBackToHome}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white hover:bg-[#1E2229] text-[#1E2229] hover:text-white border border-[#EAE5DD] text-xs font-bold tracking-wider uppercase transition-all duration-200 shadow-2xs group"
          >
            <ArrowLeft className="w-3.5 h-3.5 transition-transform group-hover:-translate-x-1" />
            <span>Back to Home &amp; Hero</span>
          </button>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* HERO BANNER: BRAND LUXURY PRESENTATION                                   */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16 sm:mb-24">
        <div className="relative rounded-3xl bg-radial from-[#242220] to-[#121110] text-white p-8 sm:p-14 md:p-20 overflow-hidden shadow-2xl border border-white/10">
          {/* Subtle Ambient Glows */}
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#C05674]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-[#C05674]/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/15 text-xs font-semibold tracking-wider uppercase text-[#C05674]">
              <Sparkles className="w-3.5 h-3.5 text-[#C05674]" />
              <span>The Science of Dermal Longevity</span>
            </div>

            <h1
              className="text-3xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight text-white leading-tight"
              style={{ fontFamily: "'Bodoni Moda', 'Playfair Display', serif" }}
            >
              Face Derma<span className="text-[#C05674]">®</span>
            </h1>

            <p className="text-base sm:text-xl text-neutral-300 font-light leading-relaxed">
              We bridge clinical dermatology with pharmaceutical-grade cosmetic chemistry.
              Formulated with surgical precision in Kathmandu, Nepal, our mission is to deliver uncompromising skin and trichological health through transparent bio-actives.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                type="button"
                onClick={onBackToHome}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-[#C05674] hover:bg-[#A8435F] text-white text-xs font-bold tracking-wider uppercase transition-all duration-300 shadow-xl hover:scale-105 active:scale-95 cursor-pointer"
              >
                <span>Explore 13 Clinical Formulations</span>
              </button>

              <a
                href="https://wa.me/9779704491600"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 text-xs font-semibold tracking-wider uppercase transition-all duration-200"
              >
                <MessageCircle className="w-4 h-4 text-[#C05674]" />
                <span>WhatsApp Clinical Concierge</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* PHILOSOPHY & STORY SECTION                                               */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-6">
            <div className="flex items-center gap-3">
              <span className="w-8 h-[1px] bg-[#C05674]" />
              <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C05674]">
                Our Clinical Heritage
              </span>
            </div>

            <h2
              className="text-2xl sm:text-4xl font-serif font-bold text-[#1E2229] leading-tight"
              style={{ fontFamily: "'Bodoni Moda', 'Playfair Display', serif" }}
            >
              Born from Dermatological Practice. Formulated for Real Results.
            </h2>

            <div className="space-y-4 text-sm sm:text-base text-[#4A4742] leading-relaxed font-light">
              <p>
                Face Derma was born out of a clinical need observed every day in dermatology practices: patients were overwhelmed with marketing promises that offered minimal bio-active potency, irritating fragrances, and ineffective concentrations.
              </p>
              <p>
                Headquartered in <strong>Maharajgunj-3, Kathmandu</strong>, our laboratory team set out to engineer a cohesive catalog of 13 dedicated dermatological formulations. We formulate for extreme photoprotection (SPF 50+ PA+++), chronic barrier restoration, fungal and scalp therapy, non-stripping syndet cleansing, and multi-molecular dermal hydration.
              </p>
              <p>
                Every ingredient in a Face Derma® bottle serves a therapeutic biological purpose. We refuse filler ingredients, unnecessary colorants, and aggressive fragrances that compromise delicate epidermal mantles.
              </p>
            </div>

            <div className="pt-2 grid grid-cols-3 gap-4 border-t border-[#EAE5DD]">
              {milestones.map((m, idx) => (
                <div key={idx} className="space-y-1">
                  <span className="font-serif text-lg sm:text-xl font-bold text-[#1E2229] block">
                    {m.year}
                  </span>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-[#C05674]">
                    {m.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 font-light hidden sm:block">
                    {m.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="lg:col-span-5">
            <div className="relative rounded-3xl overflow-hidden shadow-xl border border-[#EAE5DD] bg-white p-6 sm:p-8">
              <div className="relative aspect-4/5 rounded-2xl overflow-hidden bg-[#FAF9F6] border border-[#EAE5DD] p-6 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono uppercase bg-white px-2 py-1 rounded border border-[#EAE5DD] text-[#C05674] font-bold">
                    Lab Verified
                  </span>
                  <ShieldCheck className="w-5 h-5 text-[#C05674]" />
                </div>

                <div className="space-y-3">
                  <FDLogo className="h-10 text-[#1E2229]" />
                  <h3 className="font-serif text-2xl font-bold text-[#1E2229]">
                    Pharmaceutical Standards
                  </h3>
                  <p className="text-xs text-[#6B665E] font-light leading-relaxed">
                    Every batch undergoes HPLC analysis, clinical tolerance screening, and ISO 22000 certified clean-room manufacturing.
                  </p>
                </div>

                <div className="pt-4 border-t border-[#EAE5DD] flex items-center justify-between text-[11px] font-semibold text-[#1E2229]">
                  <span>Maharajgunj Clinical HQ</span>
                  <span className="text-[#C05674]">• Kathmandu</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 4 CORE FORMULATION PILLARS                                               */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-24">
        <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
          <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C05674]">
            Pillars of Formulation
          </span>
          <h2
            className="text-2xl sm:text-4xl font-serif font-bold text-[#1E2229]"
            style={{ fontFamily: "'Bodoni Moda', 'Playfair Display', serif" }}
          >
            The Face Derma® Standard
          </h2>
          <p className="text-xs sm:text-sm text-neutral-500 font-light">
            Our strict pharmaceutical guidelines govern every droplet, bar, and tablet we craft.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl p-7 border border-[#EAE5DD] shadow-xs hover:shadow-lg transition-all duration-300 flex flex-col justify-between space-y-4 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-xl bg-[#FAF9F6] border border-[#EAE5DD] flex items-center justify-center">
                {pillar.icon}
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-[#1E2229]">{pillar.title}</h3>
                <p className="text-xs text-[#6B665E] leading-relaxed font-light">
                  {pillar.description}
                </p>
              </div>
              <div className="pt-2 flex items-center gap-1.5 text-[11px] font-semibold text-[#C05674] uppercase tracking-wider">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#C05674]" />
                <span>Verified Quality</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* 13 FORMULATIONS PORTFOLIO SHOWCASE                                        */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-24">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div className="space-y-2">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#C05674]">
              Complete Formulary
            </span>
            <h2
              className="text-2xl sm:text-4xl font-serif font-bold text-[#1E2229]"
              style={{ fontFamily: "'Bodoni Moda', 'Playfair Display', serif" }}
            >
              The 13 Clinical Formulations
            </h2>
            <p className="text-xs sm:text-sm text-neutral-500 font-light">
              Click any clinical formulation to view pharmaceutical indications, ingredients, and usage.
            </p>
          </div>

          <button
            type="button"
            onClick={onBackToHome}
            className="self-start md:self-auto inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#1E2229] hover:bg-[#C05674] text-white text-xs font-bold tracking-wider uppercase transition-all shadow-xs cursor-pointer"
          >
            <span>View Interactive Grid</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 sm:gap-6">
          {products.map((p) => (
            <div
              key={p.id}
              onClick={() => onSelectProduct(p)}
              className="group bg-white rounded-2xl overflow-hidden border border-[#EAE5DD] hover:border-[#C05674] shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col justify-between"
            >
              <div className="aspect-square w-full bg-[#FAF9F6] overflow-hidden flex items-center justify-center relative select-none">
                {p.image ? (
                  <img
                    src={p.image}
                    alt={p.name}
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                ) : (
                  <span className="text-[9px] font-mono uppercase bg-white/90 backdrop-blur-xs px-1.5 py-0.5 rounded-xs border border-[#EAE5DD] text-[#C05674] font-semibold">
                    {p.id.toUpperCase()}
                  </span>
                )}
              </div>

              <div className="p-3 sm:p-4 space-y-1">
                <span className="text-[10px] font-semibold text-[#C05674] uppercase tracking-wider block truncate">
                  {p.category}
                </span>
                <h4 className="text-xs font-bold text-[#1E2229] line-clamp-2 group-hover:text-[#C05674] transition-colors">
                  {p.name}
                </h4>
                <p className="text-[10px] text-neutral-400 font-light">
                  {p.volume}
                </p>

                <div className="mt-3 pt-2 border-t border-neutral-100 flex items-center justify-between text-[10px] font-bold text-neutral-700 group-hover:text-[#C05674]">
                  <span>Details</span>
                  <ChevronRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ========================================================================= */}
      {/* CLINICAL LOCATION & CONSULTATION INFO                                    */}
      {/* ========================================================================= */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 mb-16">
        <div className="rounded-3xl bg-white border border-[#EAE5DD] p-8 sm:p-12 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <div className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] uppercase text-[#C05674]">
                <MapPin className="w-4 h-4 text-[#C05674]" />
                <span>Clinical Headquarters</span>
              </div>

              <h2
                className="text-2xl sm:text-3xl font-serif font-bold text-[#1E2229]"
                style={{ fontFamily: "'Bodoni Moda', 'Playfair Display', serif" }}
              >
                Visit Us in Maharajgunj, Kathmandu
              </h2>

              <p className="text-sm text-[#4A4742] font-light leading-relaxed">
                Whether you need assistance choosing the right concentration of bio-actives or require bulk clinical supply for medical practices, our team is directly available.
              </p>

              <div className="space-y-2.5 pt-2 text-xs sm:text-sm text-[#1E2229]">
                <div className="flex items-center gap-3">
                  <MapPin className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>{contact.address}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>{contact.hours}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-neutral-400 shrink-0" />
                  <span>{contact.phone}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 flex flex-col sm:flex-row lg:flex-col gap-3">
              <a
                href={contact.mapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#FAF9F6] hover:bg-[#F2ECE1] border border-[#EAE5DD] text-xs font-bold tracking-wider uppercase text-[#1E2229] hover:text-[#C05674] transition-colors shadow-2xs"
              >
                <MapPin className="w-4 h-4 text-[#C05674]" />
                <span>Open Google Maps</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              <a
                href={`https://wa.me/${contact.whatsappRaw}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#C05674] hover:bg-[#A8435F] text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-xs"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Direct WhatsApp Inquiries</span>
              </a>

              <button
                type="button"
                onClick={onBackToHome}
                className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#1E2229] hover:bg-black text-white text-xs font-bold tracking-wider uppercase transition-colors shadow-xs cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Return to Home &amp; Hero</span>
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
