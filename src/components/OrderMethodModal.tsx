import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, MessageCircle, Mail, Sparkles, ShieldCheck, ArrowUpRight } from 'lucide-react';
import { Product, ContactInfo } from '../types';

interface OrderMethodModalProps {
  isOpen: boolean;
  product: Product | null;
  contact: ContactInfo;
  onClose: () => void;
}

export const OrderMethodModal: React.FC<OrderMethodModalProps> = ({
  isOpen,
  product,
  contact,
  onClose,
}) => {
  // Prevent body scrolling when modal is open and handle escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose]);

  if (!isOpen || !product) return null;

  // WhatsApp configuration
  const whatsappText = encodeURIComponent(
    `Hello, I want to order this product: ${product.name}`
  );
  const whatsappUrl = `https://wa.me/${contact.whatsappRaw || '9779704491600'}?text=${whatsappText}`;

  // Email configuration
  const emailSubject = encodeURIComponent(`Product Order - ${product.name}`);
  const emailBody = encodeURIComponent(
    `I would like to order this product:\n\n- Product: ${product.name}\n- Reference: ${product.id}\n- Volume: ${product.volume || 'Standard'}\n\nPlease confirm availability and concierge delivery details.\n\nThank you.`
  );
  const emailUrl = `mailto:${contact.email || 'info@myfacedema.com'}?subject=${emailSubject}&body=${emailBody}`;

  return (
    <AnimatePresence>
      <div
        id="order-method-modal-overlay"
        className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
      >
        {/* Glassmorphic Backdrop with soft blur */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: 'easeOut' }}
          onClick={onClose}
          className="fixed inset-0 bg-black/40 backdrop-blur-md transition-opacity"
        />

        {/* Centered Glassmorphic Modal Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 14 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.94, y: 14 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-md bg-white/95 backdrop-blur-xl border border-white/80 rounded-3xl p-6 sm:p-8 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.25)] text-[#1E2229] z-10 overflow-hidden"
        >
          {/* Subtle luxury ambient sheen */}
          <div className="absolute -top-24 -right-24 w-48 h-48 rounded-full bg-[#C05674]/15 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-48 h-48 rounded-full bg-[#FAF9F6] blur-3xl pointer-events-none" />

          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute top-4 right-4 p-2 sm:p-2.5 rounded-full text-[#7A756D] hover:text-[#1E2229] hover:bg-[#FAF9F6] transition-colors focus:outline-none focus:ring-2 focus:ring-[#C05674]"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Selected Product Pill Preview */}
          <div className="flex items-center gap-3.5 p-3 rounded-2xl bg-[#FAF9F6] border border-[#EAE5DD] mb-6">
            <div className="w-14 h-14 rounded-xl bg-white border border-[#EAE5DD] overflow-hidden p-1.5 flex items-center justify-center shrink-0 shadow-xs select-none">
              <span className="font-mono text-xs font-bold text-[#C05674]">FD</span>
            </div>
            <div className="min-w-0 flex-1">
              <span className="text-[10px] uppercase font-mono tracking-widest text-[#C05674] block truncate">
                {product.category || 'Clinical Formulation'}
              </span>
              <h4 className="font-serif text-sm font-semibold text-[#1E2229] truncate">
                {product.name}
              </h4>
              {product.volume && (
                <span className="text-[11px] text-[#8E8A83] font-light">
                  {product.volume}
                </span>
              )}
            </div>
          </div>

          {/* Modal Header */}
          <div className="text-center mb-7 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#C05674]/15 text-[#C05674] text-[10px] font-semibold uppercase tracking-[0.2em]">
              <Sparkles className="w-3 h-3" />
              <span>Direct Concierge</span>
            </div>
            <h3 className="font-serif text-2xl sm:text-3xl font-light text-[#1E2229] tracking-tight">
              Choose Order Method
            </h3>
            <p className="text-xs sm:text-sm text-[#6B665E] font-light leading-relaxed max-w-xs mx-auto">
              Select how you would like to connect with our clinical team to complete your order.
            </p>
          </div>

          {/* Action Buttons: WhatsApp & Email */}
          <div className="space-y-3.5">
            {/* 1. Order via WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={onClose}
              className="group relative flex items-center justify-between w-full min-h-[52px] px-5 py-3.5 rounded-2xl bg-[#C05674] hover:bg-[#A8435F] active:scale-[0.99] text-white font-medium text-sm transition-all duration-300 shadow-xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                  <MessageCircle className="w-5 h-5 fill-current" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm tracking-wide">
                    Order via WhatsApp
                  </div>
                  <div className="text-[11px] text-white/85 font-light">
                    Instant concierge chat &amp; inquiry
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>

            {/* 2. Order via Email */}
            <a
              href={emailUrl}
              onClick={onClose}
              className="group relative flex items-center justify-between w-full min-h-[52px] px-5 py-3.5 rounded-2xl bg-[#1E2229] hover:bg-black active:scale-[0.99] text-white font-medium text-sm transition-all duration-300 shadow-xs"
            >
              <div className="flex items-center gap-3.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="text-left">
                  <div className="font-semibold text-sm tracking-wide">
                    Order via Email
                  </div>
                  <div className="text-[11px] text-[#D8D4CC] font-light">
                    Formal prescription &amp; delivery order
                  </div>
                </div>
              </div>
              <ArrowUpRight className="w-4 h-4 text-white/80 group-hover:text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* Guarantee & Privacy Footnote */}
          <div className="mt-6 pt-5 border-t border-[#EAE5DD] flex items-center justify-center gap-2 text-[11px] text-[#8E8A83] font-light">
            <ShieldCheck className="w-3.5 h-3.5 text-[#C05674]" />
            <span>Secure official response from Face Derma clinic</span>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
