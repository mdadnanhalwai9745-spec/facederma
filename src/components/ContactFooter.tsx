import React from 'react';
import { motion } from 'motion/react';
import { MapPin, Phone, Mail, MessageCircle, ArrowUp, ExternalLink } from 'lucide-react';
import { ContactInfo } from '../types';
import { FDLogo } from './FDLogo';

interface ContactSectionProps {
  contact: ContactInfo;
}

export const ContactFooter: React.FC<ContactSectionProps> = ({ contact }) => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Google Maps embed URL centered at Maharajgunj-3, Kathmandu, Nepal
  // Coordinates for Maharajgunj-3, Kathmandu: ~27.7363, 85.3305
  const embedMapUrl = `https://maps.google.com/maps?q=Maharajgunj-3,%20Kathmandu,%20Nepal&t=&z=16&ie=UTF8&iwloc=&output=embed`;
  const googleMapsDirectionsUrl = 'https://goo.gl/maps/LqhsQdK3TWS9HZif6?g_st=aw';

  const contactCards = [
    {
      id: 'address',
      title: 'Address',
      value: 'Maharajgunj-3, Kathmandu, Nepal',
      subtext: 'Open in Google Maps',
      href: googleMapsDirectionsUrl,
      target: '_blank',
      rel: 'noopener noreferrer',
      icon: MapPin,
      iconColor: 'text-[#C05674]',
      hoverBg: 'group-hover:bg-[#C05674]',
      hoverText: 'group-hover:text-[#C05674]'
    },
    {
      id: 'phone',
      title: 'Phone',
      value: '+977 970 449 1600',
      subtext: 'Call us directly',
      href: 'tel:+9779704491600',
      target: undefined,
      rel: undefined,
      icon: Phone,
      iconColor: 'text-[#C05674]',
      hoverBg: 'group-hover:bg-[#C05674]',
      hoverText: 'group-hover:text-[#C05674]'
    },
    {
      id: 'email',
      title: 'Email',
      value: 'info@myfacedema.com',
      subtext: 'Send us an inquiry',
      href: 'mailto:info@myfacedema.com',
      target: undefined,
      rel: undefined,
      icon: Mail,
      iconColor: 'text-[#C05674]',
      hoverBg: 'group-hover:bg-[#C05674]',
      hoverText: 'group-hover:text-[#C05674]'
    },
    {
      id: 'whatsapp',
      title: 'WhatsApp',
      value: '+977 970 449 1600',
      subtext: 'Instant chat on WhatsApp',
      href: 'https://wa.me/9779704491600',
      target: '_blank',
      rel: 'noopener noreferrer',
      icon: MessageCircle,
      iconColor: 'text-[#C05674]',
      hoverBg: 'group-hover:bg-[#C05674]',
      hoverText: 'group-hover:text-[#C05674]'
    }
  ];

  return (
    <footer id="contact" className="relative bg-gradient-to-r from-[#C05674] via-[#D4718C] to-[#C05674] text-white pt-12 sm:pt-16 md:pt-20 pb-7 sm:pb-10 border-0 overflow-hidden">
      {/* Subtle ambient luxury backdrop aura */}
      <div className="absolute top-0 left-1/4 w-80 h-80 bg-white/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-10 w-72 h-72 bg-black/10 rounded-full blur-3xl pointer-events-none" />

      {/* Container scaled down by 10% (max-w-6xl) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 md:px-8 relative z-10">
        
        {/* Full-width 2-Column Luxury Layout with 10% tighter margins */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 items-stretch mb-8 sm:mb-14">
          
          {/* ============================================================= */}
          {/* LEFT SIDE: Title, Description, & Staggered Contact Info Cards */}
          {/* ============================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <div>
              {/* Subtle Eyebrow */}
              <span className="text-[10px] sm:text-[11px] font-semibold tracking-[0.25em] sm:tracking-[0.28em] uppercase text-white/90 block mb-1.5">
                Concierge &amp; Atelier
              </span>

              {/* Section Title */}
              <h2
                className="font-serif text-2xl sm:text-3xl md:text-4xl font-light text-white tracking-tight leading-tight"
                style={{ fontFamily: "'Bodoni Moda', 'Cormorant Garamond', 'Playfair Display', serif" }}
              >
                Get in Touch
              </h2>

              {/* Short Elegant Description */}
              <p className="text-xs sm:text-sm text-white/85 font-light leading-relaxed mt-2.5 sm:mt-3 mb-5 sm:mb-6">
                We’re here to assist you with your skincare journey. Reach out anytime.
              </p>

              {/* Contact Details in Compact Vertical Layout (-10% sizing) */}
              <div className="space-y-2.5">
                {contactCards.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <motion.a
                      key={item.id}
                      href={item.href}
                      target={item.target}
                      rel={item.rel}
                      id={`contact-${item.id}-link`}
                      initial={{ opacity: 0, x: -14 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{
                        duration: 0.5,
                        delay: 0.1 + index * 0.08,
                        ease: [0.16, 1, 0.3, 1]
                      }}
                      className="group p-3 sm:p-3.5 rounded-xl bg-white/95 hover:bg-white backdrop-blur-md border border-white/20 hover:border-white transition-all duration-300 shadow-sm hover:shadow-lg flex items-center gap-3 cursor-pointer min-h-[48px]"
                    >
                      {/* Icon with Subtle Scaling on Hover */}
                      <div
                        className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-[#FAF8F5] border border-[#E2DAD1] flex items-center justify-center shrink-0 text-[#C05674] group-hover:bg-[#C05674] group-hover:text-white transition-all duration-300 group-hover:scale-105 shadow-2xs"
                      >
                        <Icon className="w-4 h-4 transition-transform duration-300 group-hover:scale-110" />
                      </div>

                      {/* Details */}
                      <div className="flex-1 min-w-0">
                        <span className="text-[9px] uppercase tracking-[0.2em] text-[#8E8A83] font-medium block">
                          {item.title}
                        </span>
                        <p
                          className="text-xs sm:text-sm font-medium text-[#1E2229] group-hover:text-[#C05674] transition-colors truncate mt-0.5"
                        >
                          {item.value}
                        </p>
                      </div>

                      {/* Small Direction Arrow / External Indicator */}
                      <div className="text-gray-400 group-hover:text-[#1E2229] transition-colors pr-1">
                        <ExternalLink className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100 transition-opacity" />
                      </div>
                    </motion.a>
                  );
                })}
              </div>
            </div>
          </motion.div>

          {/* ============================================================= */}
          {/* RIGHT SIDE: Embedded Google Map (-10% height)                  */}
          {/* ============================================================= */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col"
          >
            <div className="w-full h-full min-h-[250px] sm:min-h-[396px] rounded-2xl overflow-hidden border border-white/30 shadow-md hover:shadow-2xl transition-all duration-500 bg-white relative group">
              {/* Interactive Iframe Container with Subtle Hover Zoom */}
              <div className="w-full h-full overflow-hidden min-h-[250px] sm:min-h-[396px]">
                <iframe
                  title="Face Derma Location - Maharajgunj-3, Kathmandu, Nepal"
                  src={embedMapUrl}
                  width="100%"
                  height="100%"
                  style={{ border: 0, minHeight: '250px' }}
                  allowFullScreen={true}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="w-full h-full min-h-[250px] sm:min-h-[396px] grayscale-[15%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-700 ease-out"
                />
              </div>

              {/* Floating Glassmorphic Location Badge */}
              <div className="absolute top-3 left-3 sm:left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E2DAD1] shadow-xs flex items-center gap-2 pointer-events-none">
                <div className="w-2 h-2 rounded-full bg-[#C05674] animate-pulse" />
                <span className="text-[10px] sm:text-[11px] tracking-wider uppercase font-semibold text-[#1E2229]">
                  Face Derma • Kathmandu, Nepal
                </span>
              </div>

              {/* Bottom Right Direct Link */}
              <a
                href={googleMapsDirectionsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-3 right-3 sm:right-4 bg-white/95 hover:bg-white backdrop-blur-md px-3 py-1.5 rounded-lg border border-[#E2DAD1] text-[10px] sm:text-[11px] font-medium tracking-wide text-[#1E2229] hover:text-[#C05674] shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <span>View on Google Maps</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          </motion.div>

        </div>

        {/* ============================================================= */}
        {/* BOTTOM MINIMAL LUXURY FOOTER BAR                              */}
        {/* ============================================================= */}
        <div className="pt-5 sm:pt-6 border-t border-white/25 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/80 text-center sm:text-left">
          <div className="flex flex-col sm:flex-row items-center gap-2.5 sm:gap-4">
            <div className="flex items-center gap-2.5">
              <FDLogo size={32} className="shadow-xs" />
              <span
                className="font-serif font-bold text-base tracking-[0.05em] text-white inline-flex items-start"
                style={{ fontFamily: "'Bodoni Moda', 'Cormorant Garamond', serif" }}
              >
                Face Derma<span className="text-[9px] -mt-0.5 ml-0.5 font-semibold text-white/90">®</span>
              </span>
            </div>
            <span className="text-[10px] sm:text-[11px] font-light text-white/85">
              © {new Date().getFullYear()} Face Derma Cosmetic Laboratories. All rights reserved.
            </span>
          </div>

          <div className="flex items-center space-x-6 text-[10px] sm:text-[11px] uppercase tracking-widest text-white">
            <button
              onClick={scrollToTop}
              className="inline-flex items-center gap-1.5 hover:text-white transition-colors py-1.5 px-3 rounded-lg bg-white/10 hover:bg-white/20 min-h-[40px] cursor-pointer"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5 text-white" />
            </button>
          </div>
        </div>

      </div>
    </footer>
  );
};
