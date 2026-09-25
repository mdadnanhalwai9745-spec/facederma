import React, { useState, useEffect } from 'react';
import { Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenImageManager?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenImageManager }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header
      id="top-nav"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? 'bg-[#FAF9F6]/90 backdrop-blur-md py-4 border-b border-[#EDE8DF]/80 shadow-[0_4px_24px_rgba(30,29,27,0.03)]'
          : 'bg-[#FAF9F6]/60 backdrop-blur-sm py-6 border-b border-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex items-center justify-between">
        {/* Brand Luxury Wordmark */}
        <a
          href="#hero"
          onClick={(e) => {
            e.preventDefault();
            scrollToSection('hero');
          }}
          className="group flex items-start"
          id="brand-logo-link"
        >
          <span
            className="font-serif font-bold text-xl md:text-2xl tracking-[0.05em] text-[#111111] transition-colors group-hover:text-[#C5A880]"
            style={{ fontFamily: "'Bodoni Moda', 'Cormorant Garamond', serif" }}
          >
            Face Derma
          </span>
          <span
            className="text-[8px] font-serif font-semibold text-[#111111] -mt-0.5 ml-0.5"
            style={{ fontFamily: "'Bodoni Moda', serif" }}
          >
            ®
          </span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-10 text-xs font-medium tracking-[0.2em] uppercase text-[#4A4742]">
          <button
            onClick={() => scrollToSection('hero')}
            className="hover:text-[#C5A880] transition-colors duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A880] hover:after:w-full after:transition-all after:duration-300"
            id="nav-home"
          >
            Home
          </button>
          <button
            onClick={() => scrollToSection('products')}
            className="hover:text-[#C5A880] transition-colors duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A880] hover:after:w-full after:transition-all after:duration-300"
            id="nav-products"
          >
            Products
          </button>
          <button
            onClick={() => scrollToSection('contact')}
            className="hover:text-[#C5A880] transition-colors duration-300 relative py-1 after:content-[''] after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[1px] after:bg-[#C5A880] hover:after:w-full after:transition-all after:duration-300"
            id="nav-contact"
          >
            Contact
          </button>
        </nav>

        {/* Action Controls */}
        <div className="flex items-center space-x-4">
          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#1E1D1B] hover:text-[#C5A880] transition-colors focus:outline-hidden"
            aria-label="Toggle navigation menu"
            id="mobile-menu-btn"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#FAF9F6] border-b border-[#EDE8DF] px-6 py-6 shadow-xl animate-in slide-in-from-top-2 duration-300">
          <nav className="flex flex-col space-y-5 text-sm font-medium tracking-[0.2em] uppercase text-[#4A4742]">
            <button
              onClick={() => scrollToSection('hero')}
              className="text-left py-1 hover:text-[#C5A880] transition-colors"
            >
              Home
            </button>
            <button
              onClick={() => scrollToSection('products')}
              className="text-left py-1 hover:text-[#C5A880] transition-colors"
            >
              Products
            </button>
            <button
              onClick={() => scrollToSection('contact')}
              className="text-left py-1 hover:text-[#C5A880] transition-colors"
            >
              Contact
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
