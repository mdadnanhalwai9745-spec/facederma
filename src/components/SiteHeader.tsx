import React, { useState, useEffect } from 'react';
import { ChevronDown, Menu, X, Search } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { FDLogo } from './FDLogo';

interface SiteHeaderProps {
  onGoHome?: () => void;
  onGoAbout?: () => void;
  onGoProducts?: () => void;
  onGoContact?: () => void;
  currentView?: 'home' | 'about' | 'product';
  onOpenImageManager?: () => void;
  onOpenPermanentStorage?: () => void;
}

export const SiteHeader: React.FC<SiteHeaderProps> = ({
  onGoHome,
  onGoAbout,
  onGoProducts,
  onGoContact,
  currentView = 'home',
  onOpenImageManager,
  onOpenPermanentStorage,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onGoHome) {
      onGoHome();
    } else {
      const heroEl = document.getElementById('hero') || document.getElementById('vibrant-hero-section');
      if (heroEl) {
        heroEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }
  };

  const handleAboutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onGoAbout) {
      onGoAbout();
    } else {
      window.location.hash = '#about';
    }
  };

  const handleProductsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onGoProducts) {
      onGoProducts();
    } else {
      const el = document.getElementById('products');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleContactClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onGoContact) {
      onGoContact();
    } else {
      const el = document.getElementById('contact');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onGoProducts) onGoProducts();
    else {
      const el = document.getElementById('products');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
    setIsSearchOpen(false);
  };

  return (
    <header
      id="main-site-header"
      className={`w-full z-50 fixed top-0 left-0 right-0 bg-white/98 backdrop-blur-md transition-all duration-300 border-b border-[#EAE5DD] ${
        isScrolled ? 'shadow-[0_4px_20px_rgba(0,0,0,0.06)]' : 'shadow-none'
      }`}
    >
      {/* Upper accent band across top of the header: decreased size by 10% */}
      <div className="w-full h-[0.27in] sm:h-[0.36in] bg-gradient-to-r from-[#B84B6A] via-[#D56F8B] to-[#B84B6A] flex items-center justify-start px-3 sm:px-5 lg:px-8 text-white transition-[height] duration-200 relative overflow-hidden">
        {/* Slow, steady, hard-edged shining line sweep across the entire bar */}
        <div className="animate-steady-hard-line">
          {/* Luminous reflection body */}
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent -skew-x-[24deg]" />
          {/* Hard, razor-sharp specular solid line core */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-2 sm:w-3 bg-white shadow-[0_0_10px_#ffffff,0_0_20px_#ffffff] -skew-x-[24deg]" />
        </div>

        {/* Brand statement with hard sun shine (no heating effect) */}
        <div className="relative z-10 flex items-center gap-1.5 sm:gap-2 select-none min-w-0">
          <span className="text-sun-hard-shine text-[7.5px] sm:text-[8.5px] font-bold tracking-[0.22em] sm:tracking-[0.26em] uppercase truncate">
            Face Derma® Cosmeceutical Skincare
          </span>
          <span className="animate-sun-star text-white text-[8.5px] sm:text-[10px] font-bold select-none shrink-0" aria-hidden="true">
            ✦
          </span>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* SINGLE UNIFIED HEADER ROW: Logo + FACE DERMA + 4 Nav Buttons + Search    */}
      {/* ========================================================================= */}
      <div className="w-full px-4 sm:px-6 lg:px-10 py-2 sm:py-2.5">
        <div className="w-full flex items-center justify-between gap-4 sm:gap-6">
          {/* LEFT: Logo Medallion + FACE DERMA + 4 Navigation Buttons directly on its right */}
          <div className="flex items-center gap-4 sm:gap-6 lg:gap-8 min-w-0">
            {/* Logo Medallion + FACE DERMA */}
            <a
              href="#hero"
              onClick={handleHomeClick}
              className="group flex items-center gap-2.5 sm:gap-3 cursor-pointer transition-transform hover:scale-[1.01] shrink-0"
              aria-label="Face Derma Home"
            >
              {/* Circular Medallion Logo (Increased by 20% to 46px) */}
              <div className="shrink-0 flex items-center justify-center p-0.5">
                <FDLogo size={46} className="transition-transform group-hover:scale-105 duration-300" />
              </div>

              {/* FACE DERMA Text & Tagline */}
              <div className="flex flex-col text-left justify-center">
                <div className="flex items-center">
                  <span
                    className="font-serif font-bold text-base sm:text-lg lg:text-xl tracking-[0.14em] text-[#C05674] uppercase leading-none select-none transition-colors group-hover:text-[#1E2229]"
                    style={{ fontFamily: "'Bodoni Moda', 'Playfair Display', 'Cormorant Garamond', 'Cinzel', serif" }}
                  >
                    FACE DERMA
                  </span>
                  <span
                    className="text-[9px] font-serif font-semibold text-[#8E8A83] -mt-1 ml-0.5"
                    style={{ fontFamily: "'Bodoni Moda', serif" }}
                  >
                    ®
                  </span>
                </div>
                <span className="text-[7.5px] sm:text-[8.5px] font-medium tracking-[0.22em] uppercase text-[#7D786F] mt-0.5">
                  COSMECEUTICAL SKINCARE
                </span>
              </div>
            </a>

            {/* The 4 Navigation Buttons directly on the RIGHT SIDE of website name (5% thicker typography) */}
            <nav className="hidden md:flex items-center gap-x-6 lg:gap-x-9 text-[11px] lg:text-[12.5px] font-extrabold tracking-[0.22em] uppercase text-[#1E2229]">
              {/* HOME */}
              <a
                href="#hero"
                onClick={handleHomeClick}
                className={`transition-colors py-1 hover:text-[#C05674] cursor-pointer relative font-extrabold ${
                  currentView === 'home' ? 'text-[#C05674]' : 'text-[#1E2229]'
                }`}
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}
              >
                <span>HOME</span>
                {currentView === 'home' && (
                  <span className="absolute -bottom-[8px] left-0 right-0 h-[2.5px] bg-[#C05674]" />
                )}
              </a>

              {/* PRODUCTS with Dropdown */}
              <div className="relative group py-1">
                <a
                  href="#products"
                  onClick={handleProductsClick}
                  className={`inline-flex items-center gap-1.5 transition-colors group-hover:text-[#C05674] cursor-pointer font-extrabold ${
                    currentView === 'product' ? 'text-[#C05674]' : 'text-[#1E2229]'
                  }`}
                  style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}
                >
                  <span>PRODUCTS</span>
                  <ChevronDown className="w-3 h-3 text-gray-500 group-hover:text-[#C05674] group-hover:rotate-180 transition-transform duration-200" />
                </a>

                {/* Mega Dropdown for Categories */}
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50 min-w-[220px]">
                  <div className="bg-white rounded-xl shadow-xl border border-[#EAE5DD] py-2 px-1 text-left">
                    <a
                      href="#products"
                      onClick={handleProductsClick}
                      className="block px-3.5 py-1.5 text-[11.5px] normal-case tracking-normal font-semibold text-[#1E2229] hover:bg-[#FAF9F6] hover:text-[#C05674] rounded-lg transition-colors cursor-pointer"
                    >
                      All 13 Clinical Formulations
                    </a>
                    <a
                      href="#products"
                      onClick={handleProductsClick}
                      className="block px-3.5 py-1.5 text-[11.5px] normal-case tracking-normal font-medium text-[#6E6962] hover:bg-[#FAF9F6] hover:text-[#C05674] rounded-lg transition-colors cursor-pointer"
                    >
                      Cleansers &amp; Washes
                    </a>
                    <a
                      href="#products"
                      onClick={handleProductsClick}
                      className="block px-3.5 py-1.5 text-[11.5px] normal-case tracking-normal font-medium text-[#6E6962] hover:bg-[#FAF9F6] hover:text-[#C05674] rounded-lg transition-colors cursor-pointer"
                    >
                      Hair Growth Serums
                    </a>
                    <a
                      href="#products"
                      onClick={handleProductsClick}
                      className="block px-3.5 py-1.5 text-[11.5px] normal-case tracking-normal font-medium text-[#6E6962] hover:bg-[#FAF9F6] hover:text-[#C05674] rounded-lg transition-colors cursor-pointer"
                    >
                      SPF 50+ Sun Protection
                    </a>
                  </div>
                </div>
              </div>

              {/* ABOUT */}
              <a
                href="#about"
                onClick={handleAboutClick}
                className={`transition-colors py-1 hover:text-[#C05674] cursor-pointer relative font-extrabold ${
                  currentView === 'about' ? 'text-[#C05674]' : 'text-[#1E2229]'
                }`}
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}
              >
                <span>ABOUT</span>
                {currentView === 'about' && (
                  <span className="absolute -bottom-[8px] left-0 right-0 h-[2.5px] bg-[#C05674]" />
                )}
              </a>

              {/* CONTACT */}
              <a
                href="#contact"
                onClick={handleContactClick}
                className="transition-colors py-1 hover:text-[#C05674] text-[#1E2229] cursor-pointer font-extrabold"
                style={{ fontFamily: "'Montserrat', sans-serif", fontWeight: 800 }}
              >
                <span>CONTACT</span>
              </a>
            </nav>
          </div>

          {/* RIGHT: Search Action + Mobile Hamburger */}
          <div className="flex items-center justify-end gap-2 sm:gap-3 shrink-0">
            {/* Search Icon Button */}
            <button
              type="button"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="p-1.5 rounded-full text-[#1E2229] hover:bg-gray-100 hover:text-[#C05674] transition-colors cursor-pointer"
              aria-label="Search Formulations"
              title="Search Formulations"
            >
              <Search className="w-4 h-4 sm:w-5 sm:h-5 stroke-[1.8]" />
            </button>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-1.5 rounded-lg text-[#1E2229] hover:bg-gray-100 transition-colors focus:outline-hidden cursor-pointer"
                aria-label={isMobileMenuOpen ? 'Close Navigation Menu' : 'Open Navigation Menu'}
                id="mobile-nav-toggle-btn"
              >
                {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 stroke-[1.8]" />}
              </button>
            </div>
          </div>
        </div>

        {/* Expandable Search Input Bar */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2.5 pb-1 overflow-hidden"
            >
              <form onSubmit={handleSearchSubmit} className="relative max-w-xl mx-auto">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search among 13 clinical formulations (e.g. Cleanser, Hair Serum, SPF)..."
                  autoFocus
                  className="w-full pl-9 pr-20 py-2 rounded-full bg-[#FAF9F6] border border-[#E0D9CF] text-[11px] text-[#1E2229] placeholder-[#8E8A83] focus:outline-none focus:border-[#C05674] focus:ring-1 focus:ring-[#C05674]"
                />
                <Search className="w-3.5 h-3.5 text-[#8E8A83] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 rounded-full bg-[#1E2229] hover:bg-[#C05674] text-white text-[9px] font-bold tracking-wider uppercase transition-colors"
                >
                  Search
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ========================================================================= */}
      {/* 3. MOBILE NAVIGATION DRAWER (Slide down on hamburger tap)                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="md:hidden border-t border-[#EAE5DD] bg-white px-5 py-5 shadow-2xl overflow-hidden"
          >
            <nav className="flex flex-col space-y-2">
              <a
                href="#hero"
                onClick={handleHomeClick}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-[0.18em] uppercase text-[#1E2229] hover:bg-[#FAF9F6] hover:text-[#C05674] transition-colors flex items-center justify-between"
              >
                <span>HOME</span>
              </a>
              <a
                href="#products"
                onClick={handleProductsClick}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-[0.18em] uppercase text-[#1E2229] hover:bg-[#FAF9F6] hover:text-[#C05674] transition-colors flex items-center justify-between"
              >
                <span>PRODUCTS</span>
                <span className="text-[10px] font-mono text-[#C05674] bg-[#C05674]/10 px-2 py-0.5 rounded-full">13 Formulations</span>
              </a>
              <a
                href="#about"
                onClick={handleAboutClick}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-[0.18em] uppercase text-[#1E2229] hover:bg-[#FAF9F6] hover:text-[#C05674] transition-colors flex items-center justify-between"
              >
                <span>ABOUT</span>
              </a>
              <a
                href="#contact"
                onClick={handleContactClick}
                className="px-3.5 py-2.5 rounded-xl text-xs font-bold tracking-[0.18em] uppercase text-[#1E2229] hover:bg-[#FAF9F6] hover:text-[#C05674] transition-colors flex items-center justify-between"
              >
                <span>CONTACT</span>
              </a>

              <div className="pt-3 border-t border-[#EAE5DD]">
                <a
                  href="https://wa.me/9779704491600?text=Hello%20Face%20Derma%C2%AE%2C%20I%20would%20like%20to%20inquire%20about%20your%20cosmeceutical%20skincare%20products."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-3 px-4 rounded-xl bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 shadow-sm transition-colors"
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                  <span>Chat on WhatsApp (+977 970 449 1600)</span>
                </a>
              </div>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

