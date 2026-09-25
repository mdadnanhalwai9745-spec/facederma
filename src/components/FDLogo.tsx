import React, { useState, useEffect } from 'react';
import { getAssetUrl } from '../utils/assetPath';

interface FDLogoProps {
  className?: string;
  size?: number;
}

export const FDLogo: React.FC<FDLogoProps> = ({ className = '', size = 46 }) => {
  // Try primary brand logo images first (/brand_logo.jpg or /logo.jpg)
  const [attemptIndex, setAttemptIndex] = useState(0);
  const sources = [
    getAssetUrl('/brand_logo.jpg'),
    getAssetUrl('/logo.jpg'),
    getAssetUrl('/products/permanent/brand_logo.jpg'),
  ];
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const handleUpdate = () => {
      setHasError(false);
      setAttemptIndex(0);
    };

    window.addEventListener('facederma_image_updated', handleUpdate);
    window.addEventListener('storage', handleUpdate);
    return () => {
      window.removeEventListener('facederma_image_updated', handleUpdate);
      window.removeEventListener('storage', handleUpdate);
    };
  }, []);

  const handleImgError = () => {
    if (attemptIndex < sources.length - 1) {
      setAttemptIndex(prev => prev + 1);
    } else {
      setHasError(true);
    }
  };

  if (!hasError) {
    return (
      <div
        className={`relative rounded-full overflow-hidden border border-[#D4AF37]/60 shadow-[0_2px_10px_rgba(0,0,0,0.25)] flex items-center justify-center shrink-0 select-none bg-black ${className}`}
        style={{
          width: size,
          height: size,
        }}
      >
        <img
          src={sources[attemptIndex]}
          alt="Face Derma Official Logo"
          className="w-full h-full object-contain rounded-full"
          onError={handleImgError}
        />
      </div>
    );
  }

  return (
    <div
      className={`relative rounded-full overflow-hidden flex items-center justify-center shrink-0 select-none border border-[#D4AF37]/50 shadow-[0_2px_12px_rgba(0,0,0,0.35)] ${className}`}
      style={{
        width: size,
        height: size,
        background: 'radial-gradient(circle at 50% 50%, #181614 0%, #0e0d0b 70%, #030303 100%)',
      }}
    >
      <svg
        viewBox="0 0 400 400"
        className="w-full h-full"
      >
        <defs>
          {/* Authentic Bright Gold Metallic Gradients */}
          <linearGradient id="fdGoldBright" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFF9DB" />
            <stop offset="25%" stopColor="#F5D061" />
            <stop offset="50%" stopColor="#D8A535" />
            <stop offset="75%" stopColor="#F9E284" />
            <stop offset="100%" stopColor="#B37D1A" />
          </linearGradient>

          <linearGradient id="fdGoldWarm" x1="20%" y1="0%" x2="80%" y2="100%">
            <stop offset="0%" stopColor="#FFF3B8" />
            <stop offset="40%" stopColor="#E6B84E" />
            <stop offset="70%" stopColor="#C89228" />
            <stop offset="100%" stopColor="#8A5A0A" />
          </linearGradient>

          <linearGradient id="fdRingGlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FFECA0" />
            <stop offset="50%" stopColor="#F5CD53" />
            <stop offset="100%" stopColor="#D49E2C" />
          </linearGradient>

          {/* Deep Drop Shadow for the central 3D Monogram */}
          <filter id="fdDropShadow" x="-30%" y="-30%" width="160%" height="160%">
            <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#000000" floodOpacity="0.9" />
          </filter>

          {/* Upper Circular Arc for arched "FACE DERMA" text with proper headroom */}
          <path
            id="fdUpperTextArc"
            d="M 80,200 A 120,120 0 0,1 320,200"
            fill="none"
          />
        </defs>

        {/* Outer Circular Glowing Frame */}
        <circle
          cx="200"
          cy="200"
          r="184"
          fill="none"
          stroke="url(#fdRingGlow)"
          strokeWidth="6"
        />

        {/* Inner Precision Hairline Accent Ring */}
        <circle
          cx="200"
          cy="200"
          r="174"
          fill="none"
          stroke="url(#fdGoldBright)"
          strokeWidth="1.5"
          opacity="0.6"
        />

        {/* Lower Left Undulating Golden Wave Accent */}
        <g stroke="url(#fdGoldBright)" fill="none" opacity="0.8">
          <path d="M 60,250 C 76,310 144,354 240,356 C 265,356 295,350 326,336" strokeWidth="1.6" />
          <path d="M 64,260 C 82,315 148,350 238,352 C 260,352 288,346 318,332" strokeWidth="1.5" />
          <path d="M 68,270 C 88,320 152,346 236,348 C 256,348 282,342 310,328" strokeWidth="1.4" />
          <path d="M 74,280 C 96,324 156,342 234,344 C 252,344 276,338 302,324" strokeWidth="1.3" />
        </g>

        {/* Arched Upper Title: FACE DERMA in Serif Capitals */}
        <text
          fill="url(#fdGoldBright)"
          fontSize="27"
          fontWeight="700"
          letterSpacing="7"
          style={{
            fontFamily: "'Bodoni Moda', 'Playfair Display', 'Cormorant Garamond', 'Cinzel', serif",
            filter: 'drop-shadow(0px 2px 3px rgba(0,0,0,0.9))',
          }}
        >
          <textPath
            href="#fdUpperTextArc"
            startOffset="50%"
            textAnchor="middle"
          >
            FACE DERMA
          </textPath>
        </text>

        {/* Central Interlocking 3D Gold Serif Monogram: 'F' & 'D' */}
        <g filter="url(#fdDropShadow)">
          {/* Majestic Tall Serif 'F' */}
          <text
            x="172"
            y="238"
            textAnchor="middle"
            fill="url(#fdGoldBright)"
            fontSize="135"
            fontWeight="900"
            style={{
              fontFamily: "'Playfair Display', 'Bodoni Moda', 'Cormorant Garamond', serif",
              letterSpacing: '-2px',
            }}
          >
            F
          </text>

          {/* Interlocking Intersecting Curve linking F to D */}
          <path
            d="M 152,180 C 190,176 208,202 188,230 C 178,244 162,248 142,246"
            fill="none"
            stroke="url(#fdGoldWarm)"
            strokeWidth="9"
            strokeLinecap="round"
          />

          {/* Prominent Serif 'D' Anchored on Lower Right */}
          <text
            x="230"
            y="286"
            textAnchor="middle"
            fill="url(#fdGoldBright)"
            fontSize="135"
            fontWeight="900"
            style={{
              fontFamily: "'Playfair Display', 'Bodoni Moda', 'Cormorant Garamond', serif",
              letterSpacing: '-2px',
            }}
          >
            D
          </text>
        </g>
      </svg>
    </div>
  );
};

