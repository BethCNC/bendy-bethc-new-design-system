'use client';

import React from 'react';

interface CopyBlock2Props {
  className?: string;
}

/**
 * CopyBlock2 - Second copy section after first copy block
 * 
 * Content: Powerful statements about the journey and persistence
 * Design: Light background with dark text, centered layout
 * Typography: Mix of H2 and H3 heading styles for hierarchy
 * 
 * Design System: Uses semantic tokens for all styling
 * Accessibility: Proper heading hierarchy, semantic HTML
 * Responsive: Mobile-first typography scaling
 */
const CopyBlock2: React.FC<CopyBlock2Props> = ({ className = '' }) => {
  return (
    <section 
      className={`copy-block-2 ${className}`}
      style={{
        backgroundColor: 'var(--surface-neutral-inverse)',
        padding: 'var(--margins-mobile)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 'var(--spacing-lg)',
        minHeight: '400px',
        justifyContent: 'center',
      }}
    >
      <h2 
        className="copy-block-2__first-line"
        style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-heading-h2)',
          fontWeight: 'var(--font-weight-regular)',
          lineHeight: 'var(--line-height-heading-h2)',
          color: 'var(--text-neutral-inverse)',
          textAlign: 'center',
          margin: 0,
        }}
      >
        This isn&apos;t content
      </h2>
      
      <h3 
        className="copy-block-2__second-line"
        style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-heading-h3)',
          fontWeight: 'var(--font-weight-regular)',
          lineHeight: 'var(--line-height-heading-h3)',
          color: 'var(--text-neutral-inverse)',
          textAlign: 'center',
          margin: 0,
        }}
      >
        It&apos;s proof of what it really takes to get answers
      </h3>
      
      <h2 
        className="copy-block-2__third-line"
        style={{
          fontFamily: 'var(--font-family-display)',
          fontSize: 'var(--font-size-heading-h2)',
          fontWeight: 'var(--font-weight-regular)',
          lineHeight: 'var(--line-height-heading-h2)',
          color: 'var(--text-neutral-inverse)',
          textAlign: 'center',
          margin: 0,
        }}
      >
        What it means to keep going<br />when no one believes you.
      </h2>

      <style jsx>{`
        @media (min-width: 810px) {
          .copy-block-2 {
            padding: var(--margins-tablet) !important;
          }
        }

        @media (min-width: 1440px) {
          .copy-block-2 {
            padding: var(--margins-desktop) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CopyBlock2;
