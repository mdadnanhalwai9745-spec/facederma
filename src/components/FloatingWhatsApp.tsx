import React, { useState } from 'react';
import { MessageCircle, X, Send, Sparkles, CheckCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FloatingWhatsAppProps {
  whatsappRaw?: string;
}

const PRESET_MESSAGES = [
  '🥥 I would like to order CO-CO MAGIC Extra Virgin Coconut Oil',
  '☀️ Inquire about FD-SHIELD Sun Screen Spray SPF 50+',
  '🌿 Need a dermatologist product recommendation for my skin',
  '📦 Inquire about clinic wholesale and retail distribution',
];

export const FloatingWhatsApp: React.FC<FloatingWhatsAppProps> = ({
  whatsappRaw = '9779704491600',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState('');

  const handleSendMessage = (customText?: string) => {
    const textToSend = (customText || message || 'Hello Face Derma®, I would like to inquire about your cosmeceutical skincare products.').trim();
    const url = `https://wa.me/${whatsappRaw}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <aside
      aria-label="Contact via WhatsApp"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end print:hidden select-none"
    >
      {/* ========================================================================= */}
      {/* 1. INTERACTIVE WHATSAPP CHAT POPUP WINDOW                                 */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 18, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 14, scale: 0.94 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="mb-3.5 w-[calc(100vw-36px)] sm:w-[360px] max-w-[380px] rounded-2xl bg-white shadow-[0_20px_60px_rgba(0,0,0,0.22),0_4px_16px_rgba(37,211,102,0.18)] border border-[#EAE5DD] overflow-hidden flex flex-col font-sans"
          >
            {/* Header: Face Derma Brand WhatsApp Header */}
            <div className="bg-gradient-to-r from-[#075E54] to-[#128C7E] px-4 py-3.5 text-white flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center font-serif font-black text-[#075E54] text-base shadow-xs">
                    FD
                  </div>
                  {/* Active Online Indicator */}
                  <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-[#25D366] border-2 border-[#075E54]" />
                </div>
                <div className="text-left">
                  <div className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                    <span>Face Derma® Support</span>
                    <Sparkles className="w-3 h-3 text-[#F5C26B]" />
                  </div>
                  <p className="text-[11px] text-white/85 font-light">
                    Online • Typically replies instantly
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors cursor-pointer"
                aria-label="Close WhatsApp chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Chat Body: Authentic WhatsApp Pattern Background */}
            <div className="p-4 bg-[#EFEAE2] flex-1 max-h-[380px] overflow-y-auto space-y-3 text-left">
              {/* Automated Welcome Bubble */}
              <div className="relative max-w-[85%] bg-white p-3 rounded-2xl rounded-tl-xs shadow-xs text-xs text-[#1E1D1B] leading-relaxed">
                <p className="font-semibold text-[#075E54] text-[11px] mb-1">
                  Face Derma® Cosmeceutical Skincare
                </p>
                <p>
                  Hello! 👋 Welcome to Face Derma®. How can our skincare specialists assist you with your formulation inquiries today?
                </p>
                <div className="flex items-center justify-end gap-1 mt-1 text-[9.5px] text-gray-400">
                  <span>Just now</span>
                  <CheckCheck className="w-3.5 h-3.5 text-[#34B7F1]" />
                </div>
              </div>

              {/* Quick Inquiry Options */}
              <div className="pt-1">
                <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-2">
                  Frequently Asked Inquiries:
                </p>
                <div className="flex flex-col gap-1.5">
                  {PRESET_MESSAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSendMessage(preset)}
                      className="w-full text-left text-xs bg-white/90 hover:bg-white p-2.5 rounded-xl border border-black/5 hover:border-[#25D366] text-[#2C2926] hover:text-[#075E54] font-medium transition-all shadow-2xs hover:shadow-xs active:scale-[0.99] cursor-pointer flex items-center justify-between group"
                    >
                      <span className="line-clamp-1">{preset}</span>
                      <Send className="w-3 h-3 text-gray-400 group-hover:text-[#25D366] shrink-0 ml-1.5 transition-colors" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Chat Footer: Interactive Input & Send Button */}
            <div className="p-3 bg-white border-t border-[#EAE5DD] flex items-center gap-2">
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSendMessage();
                  }
                }}
                placeholder="Type your WhatsApp message..."
                className="flex-1 bg-[#F0F2F5] text-xs text-[#1E1D1B] placeholder-gray-500 px-3.5 py-2.5 rounded-full border border-transparent focus:border-[#25D366] focus:bg-white focus:outline-none transition-all"
              />
              <button
                type="button"
                onClick={() => handleSendMessage()}
                className="p-2.5 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
                aria-label="Send message on WhatsApp"
                title="Send on WhatsApp"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* 2. FLOATING WHATSAPP BUTTON WITH "CHAT ON WHATSAPP" PILL                  */}
      {/* ========================================================================= */}
      <div className="flex items-center gap-2.5">
        {/* Floating Pill Label */}
        {!isOpen && (
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="hidden sm:flex items-center gap-2 py-2 px-3.5 rounded-full bg-white/95 hover:bg-white text-[#1E1D1B] hover:text-[#075E54] border border-[#EAE5DD] shadow-[0_6px_20px_rgba(0,0,0,0.12)] text-xs font-bold tracking-wide transition-all duration-300 hover:scale-105 cursor-pointer backdrop-blur-xs group"
          >
            <span className="w-2 h-2 rounded-full bg-[#25D366] animate-pulse" />
            <span>Chat on WhatsApp</span>
          </button>
        )}

        {/* Main Floating WhatsApp Circular Action Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? 'Close WhatsApp Chat' : 'Chat on WhatsApp'}
          title="Chat with Face Derma on WhatsApp"
          className="group relative flex items-center justify-center w-14 h-14 sm:w-15 sm:h-15 rounded-full bg-[#25D366] text-white shadow-[0_10px_26px_rgba(37,211,102,0.45)] hover:shadow-[0_14px_34px_rgba(37,211,102,0.65)] hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer focus:outline-none focus:ring-4 focus:ring-[#25D366]/40"
        >
          {/* Subtle breathing ripple halo */}
          {!isOpen && (
            <span
              className="absolute inset-0 rounded-full bg-[#25D366] opacity-35 animate-ping pointer-events-none"
              style={{ animationDuration: '3.2s' }}
              aria-hidden="true"
            />
          )}

          {isOpen ? (
            <X className="w-7 h-7 relative z-10 transition-transform duration-300 rotate-0" />
          ) : (
            <svg
              className="w-7 h-7 sm:w-8 sm:h-8 fill-current relative z-10 transition-transform duration-300 group-hover:scale-105"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.65 3.742-.983zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          )}
        </button>
      </div>
    </aside>
  );
};
