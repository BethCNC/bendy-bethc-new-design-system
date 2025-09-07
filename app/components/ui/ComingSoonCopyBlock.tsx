'use client';

import React from 'react';

interface ComingSoonCopyBlockProps {
  className?: string;
}

const ComingSoonCopyBlock: React.FC<ComingSoonCopyBlockProps> = ({ className = '' }) => {
  return (
    <div 
      className={`coming-soon-copy-block ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 'var(--spacing-xl-mobile, 48px)',
        padding: '60px var(--spacing-lg-mobile, 24px) 60px var(--spacing-xl-mobile, 48px)',
        width: '100%',
        maxWidth: '100%',
        textAlign: 'center',
      }}
    >
      {/* First line - Display text */}
      <div 
        className="copy-line-1"
        style={{
          fontFamily: 'var(--font-family-display-mobile, "Behind The Nineties", serif)',
          fontSize: 'var(--font-size-display-display-mobile, 72px)',
          lineHeight: 'var(--line-height-display-display-mobile, 80px)',
          fontWeight: 400,
          color: 'var(--text-neutral-inverse, #FFFFFF)',
          textAlign: 'center',
          width: '100%',
        }}
      >
        Something special is growing here
      </div>

      {/* Second line - Title text */}
      <div 
        className="copy-line-2"
        style={{
          fontFamily: 'var(--font-family-body-mobile, "Overused Grotesk", sans-serif)',
          fontSize: 'var(--font-size-title-lg-mobile, 30px)',
          lineHeight: 'var(--line-height-title-lg-mobile, 40px)',
          fontWeight: 400,
          color: 'var(--text-neutral-inverse, #FFFFFF)',
          textAlign: 'center',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        Like all the best things in my journey,<br />
        this needs a little more time to bloom.
      </div>

      {/* Third line - Title text with medium weight */}
      <div 
        className="copy-line-3"
        style={{
          fontFamily: 'var(--font-family-body-mobile, "Overused Grotesk", sans-serif)',
          fontSize: 'var(--font-size-title-lg-mobile, 30px)',
          lineHeight: 'var(--line-height-title-lg-mobile, 40px)',
          fontWeight: 500,
          color: 'var(--text-neutral-inverse, #FFFFFF)',
          textAlign: 'center',
          width: '100%',
          maxWidth: '600px',
        }}
      >
        But trust me, it&apos;ll be worth the wait.
      </div>

      <style jsx>{`
        /* Tablet responsive adjustments */
        @media (min-width: 810px) {
          .coming-soon-copy-block {
            gap: var(--spacing-xl-tablet, 48px);
            padding: 60px var(--spacing-lg-tablet, 24px) 60px var(--spacing-xl-tablet, 48px);
          }
          
          .copy-line-1 {
            font-family: var(--font-family-display-tablet, "Behind The Nineties", serif);
            font-size: var(--font-size-display-display-tablet, 96px);
            line-height: var(--line-height-display-display-tablet, 108px);
          }
          
          .copy-line-2,
          .copy-line-3 {
            font-family: var(--font-family-body-tablet, "Overused Grotesk", sans-serif);
            font-size: var(--font-size-title-lg-tablet, 36px);
            line-height: var(--line-height-title-lg-tablet, 48px);
          }
        }

        /* Desktop responsive adjustments */
        @media (min-width: 1440px) {
          .coming-soon-copy-block {
            gap: var(--spacing-xl-desktop, 48px);
            padding: 60px var(--spacing-lg-desktop, 32px) 60px var(--spacing-xl-desktop, 48px);
          }
          
          .copy-line-1 {
            font-family: var(--font-family-display-desktop, "Behind The Nineties", serif);
            font-size: var(--font-size-display-display-desktop, 128px);
            line-height: var(--line-height-display-display-desktop, 140px);
          }
          
          .copy-line-2,
          .copy-line-3 {
            font-family: var(--font-family-body-desktop, "Overused Grotesk", sans-serif);
            font-size: var(--font-size-title-lg-desktop, 48px);
            line-height: var(--line-height-title-lg-desktop, 60px);
          }
        }
      `}</style>
    </div>
  );
};

export default ComingSoonCopyBlock;
