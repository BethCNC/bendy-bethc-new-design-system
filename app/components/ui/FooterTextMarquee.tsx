'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

/**
 * FooterTextMarquee - Large scrolling marquee text with animated yellow heart
 * 
 * Features:
 * - MASSIVE 96px display text using Behind The Nineties font
 * - Horizontal scrolling marquee animation
 * - Alternating phrases with yellow heart GIF
 * - Seamless infinite loop with multiple instances
 * - Fallback to emoji if GIF fails
 * - Responsive design scaling down for mobile
 * 
 * Design System: Uses Figma-accurate specifications
 * Performance: Optimized animation with transform3d
 * Accessibility: Reduced motion support
 */
const FooterTextMarquee: React.FC = () => {
  const [heartLoaded, setHeartLoaded] = useState(false);
  const [useGif, setUseGif] = useState(true);
  const [currentGifSrc, setCurrentGifSrc] = useState("/images/gifs/yellow-heart.gif");

  // Component mount logging for debugging
  useEffect(() => {
    console.log('🚀 FooterTextMarquee component mounted');
    console.log('Initial GIF source:', currentGifSrc);
    console.log('useGif state:', useGif);
  }, [currentGifSrc, useGif]);

  // EXACT FIGMA SPECS: TWO alternating phrases with animated yellow heart
  const phrases = [
    " Every view, every listen, every heart ",
    "Thank you for holding space for my story"
  ];

  // Heart element with GIF and fallbacks
  const heartElement = (
    <span 
      className="footer-marquee-heart-wrapper"
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        margin: '0 var(--spacing-md)',
        verticalAlign: 'middle',
      }}
    >
      {useGif ? (
        <Image 
          src={currentGifSrc}
          alt="Yellow heart"
          className="heart-gif"
          width={72}
          height={72}
          style={{
            width: '72px',
            height: '72px',
            display: 'inline-block',
          }}
          onLoad={(e) => {
            const target = e.target as HTMLImageElement;
            console.log('✅ Yellow heart GIF loaded successfully!');
            console.log('GIF src:', target.src);
            console.log('GIF naturalWidth x naturalHeight:', target.naturalWidth, 'x', target.naturalHeight);
            console.log('GIF complete:', target.complete);
            setHeartLoaded(true);
          }}
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            console.error('❌ GIF failed to load:', target.src);
            console.error('Error event:', e);
            console.error('Error type:', e.type);
            console.error('Error target:', target);
            
            // Try fallback GIFs before giving up
            if (currentGifSrc === "/images/gifs/yellow-heart.gif") {
              console.log('🔄 Trying black heart GIF...');
              setCurrentGifSrc("/images/gifs/black heart filled.gif");
            } else {
              console.log('🔄 All GIFs failed, using emoji fallback');
              setUseGif(false);
            }
          }}
        />
      ) : (
        <span 
          className="footer-marquee-heart"
          style={{
            fontSize: '72px',
            lineHeight: '1',
            display: 'inline-block',
          }}
        >
          💛
        </span>
      )}
    </span>
  );

  // Create marquee content with hearts at beginning and between phrases
  const marqueeContent = (
    <React.Fragment>
      {heartElement}
      {phrases.map((phrase, index) => (
        <React.Fragment key={index}>
          <span 
            className="footer-marquee-text"
            style={{
              fontFamily: 'var(--font-behind-the-nineties)',
              fontSize: '96px',
              fontWeight: '400',
              lineHeight: '128px',
              color: 'var(--text-neutral-inverse)',
              whiteSpace: 'nowrap',
              letterSpacing: '0',
            }}
          >
            {phrase}
          </span>
          {heartElement}
        </React.Fragment>
      ))}
    </React.Fragment>
  );

  // Create multiple instances for seamless infinite scrolling - increased for better effect
  const repeatedContent = Array(16).fill(null).map((_, index) => (
    <React.Fragment key={index}>
      {marqueeContent}
    </React.Fragment>
  ));

  return (
    <div 
      className="footer-marquee-container"
      style={{
        width: '100%',
        overflow: 'hidden',
        backgroundColor: 'var(--surface-neutral-inverse)',
        padding: 0,
        position: 'relative',
      }}
    >
      <div 
        className="footer-marquee-content"
        style={{
          display: 'flex',
          alignItems: 'center',
          animation: 'marqueeScroll 20s linear infinite',
          willChange: 'transform',
        }}
      >
        {repeatedContent}
      </div>

      <style jsx>{`
        @keyframes marqueeScroll {
          0% {
            transform: translate3d(100%, 0, 0);
          }
          100% {
            transform: translate3d(-100%, 0, 0);
          }
        }
        
        .footer-marquee-content {
          animation-duration: 20s !important;
        }
        
        /* Pause animation on hover for accessibility */
        .footer-marquee-container:hover .footer-marquee-content {
          animation-play-state: paused;
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          .footer-marquee-content {
            animation: none !important;
            transform: none !important;
            justify-content: center;
          }
          
          .footer-marquee-container {
            text-align: center;
          }
        }

        /* Responsive text sizes - scale down appropriately */
        @media (max-width: 809px) and (min-width: 391px) {
          .footer-marquee-text {
            font-size: 64px !important;
            line-height: 84px !important;
          }
          
          .footer-marquee-heart-wrapper {
            margin: 0 var(--spacing-sm) !important;
          }
          
          .heart-gif, .footer-marquee-heart {
            width: 54px !important;
            height: 54px !important;
            font-size: 54px !important;
          }
          
          .footer-marquee-content {
            animation-duration: 15s !important;
          }
        }

        @media (max-width: 390px) {
          .footer-marquee-container {
            padding: var(--spacing-lg) 0 !important;
          }
          
          .footer-marquee-text {
            font-size: 48px !important;
            line-height: 64px !important;
          }
          
          .footer-marquee-heart-wrapper {
            margin: 0 var(--spacing-xs) !important;
          }
          
          .heart-gif, .footer-marquee-heart {
            width: 36px !important;
            height: 36px !important;
            font-size: 36px !important;
          }
          
          .footer-marquee-content {
            animation-duration: 10s !important;
          }
        }
      `}</style>
    </div>
  );
};

export default FooterTextMarquee;