'use client';

import React from 'react';

interface CopyBlock1Props {
  className?: string;
}

/**
 * CopyBlock1 - First copy section after video
 * 
 * Content: Personal journey narrative with emotional impact
 * Design: Dark gradient background with centered white text
 * Typography: Mix of display and title fonts for hierarchy
 * 
 * Design System: Uses semantic tokens for all styling
 * Accessibility: Proper heading hierarchy, semantic HTML
 * Responsive: Mobile-first typography scaling
 */
const CopyBlock1: React.FC<CopyBlock1Props> = ({ className = '' }) => {
  return (
    <section 
      className={`copy-block-1 ${className}`}
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
        className="copy-block-1__main-heading"
        style={{
          fontFamily: 'var(--font-family-display-mobile)',
          fontSize: 'var(--font-size-heading-h3-mobile)',
          fontWeight: 'var(--font-weight-regular)',
          lineHeight: 'var(--line-height-heading-h3-mobile)',
          color: 'var(--text-neutral-inverse)',
          textAlign: 'center',
          margin: 0,
        }}
      >
        Finding my peace has been a journey
      </h2>
      
      <ul 
        className="copy-block-1__list"
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: 'var(--spacing-sm)',
          alignItems: 'center',
          margin: 0,
          padding: 0,
          listStyle: 'none',
        }}
      >
        <li 
          className="copy-block-1__list-item"
          style={{
            fontFamily: 'var(--font-family-title-mobile)',
            fontSize: 'var(--font-size-title-xl-mobile)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 'var(--line-height-title-xl-mobile)',
            color: 'var(--text-neutral-inverse)',
            textAlign: 'center',
            margin: 0,
          }}
        >
          The pain
        </li>
        <li 
          className="copy-block-1__list-item"
          style={{
            fontFamily: 'var(--font-family-title-mobile)',
            fontSize: 'var(--font-size-title-xl-mobile)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 'var(--line-height-title-xl-mobile)',
            color: 'var(--text-neutral-inverse)',
            textAlign: 'center',
            margin: 0,
          }}
        >
          The gaslighting
        </li>
        <li 
          className="copy-block-1__list-item"
          style={{
            fontFamily: 'var(--font-family-title-mobile)',
            fontSize: 'var(--font-size-title-xl-mobile)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 'var(--line-height-title-xl-mobile)',
            color: 'var(--text-neutral-inverse)',
            textAlign: 'center',
            margin: 0,
          }}
        >
          The fear
        </li>
        <li 
          className="copy-block-1__list-item"
          style={{
            fontFamily: 'var(--font-family-title-mobile)',
            fontSize: 'var(--font-size-title-xl-mobile)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 'var(--line-height-title-xl-mobile)',
            color: 'var(--text-neutral-inverse)',
            textAlign: 'center',
            margin: 0,
          }}
        >
          The loneliness
        </li>
      </ul>
      
      <h3 
        className="copy-block-1__transition"
        style={{
          fontFamily: 'var(--font-family-display-mobile)',
          fontSize: 'var(--font-size-heading-h1-mobile)',
          fontWeight: 'var(--font-weight-regular)',
          lineHeight: 'var(--line-height-heading-h1-mobile)',
          color: 'var(--text-neutral-inverse)',
          textAlign: 'center',
          margin: 0,
        }}
      >
        It all led me to this
      </h3>
      
      <p 
        className="copy-block-1__final-line"
        style={{
          fontFamily: 'var(--font-family-title-mobile)',
          fontSize: 'var(--font-size-title-xl-mobile)',
          fontWeight: 'var(--font-weight-medium)',
          lineHeight: 'var(--line-height-title-xl-mobile)',
          color: 'var(--text-neutral-inverse)',
          textAlign: 'center',
          margin: 0,
        }}
      >
        My story. The one thing I still have.
      </p>
      
      <style jsx>{`
        @media (min-width: 810px) {
          .copy-block-1 {
            padding: var(--margins-tablet) !important;
          }
          .copy-block-1__main-heading {
            font-family: var(--font-family-display-tablet) !important;
            font-size: var(--font-size-heading-h3-tablet) !important;
            line-height: var(--line-height-heading-h3-tablet) !important;
          }
          .copy-block-1__list-item {
            font-family: var(--font-family-title-tablet) !important;
            font-size: var(--font-size-title-xl-tablet) !important;
            line-height: var(--line-height-title-xl-tablet) !important;
          }
          .copy-block-1__transition {
            font-family: var(--font-family-display-tablet) !important;
            font-size: var(--font-size-heading-h1-tablet) !important;
            line-height: var(--line-height-heading-h1-tablet) !important;
          }
          .copy-block-1__final-line {
            font-family: var(--font-family-title-tablet) !important;
            font-size: var(--font-size-title-xl-tablet) !important;
            line-height: var(--line-height-title-xl-tablet) !important;
          }
        }

        @media (min-width: 1440px) {
          .copy-block-1 {
            padding: var(--margins-desktop) !important;
          }
          .copy-block-1__main-heading {
            font-family: var(--font-family-display-desktop) !important;
            font-size: var(--font-size-heading-h3-desktop) !important;
            line-height: var(--line-height-heading-h3-desktop) !important;
          }
          .copy-block-1__list-item {
            font-family: var(--font-family-title-desktop) !important;
            font-size: var(--font-size-title-xl-desktop) !important;
            line-height: var(--line-height-title-xl-desktop) !important;
          }
          .copy-block-1__transition {
            font-family: var(--font-family-display-desktop) !important;
            font-size: var(--font-size-heading-h1-desktop) !important;
            line-height: var(--line-height-heading-h1-desktop) !important;
          }
          .copy-block-1__final-line {
            font-family: var(--font-family-title-desktop) !important;
            font-size: var(--font-size-title-xl-desktop) !important;
            line-height: var(--line-height-title-xl-desktop) !important;
          }
        }
      `}</style>
    </section>
  );
};

export default CopyBlock1;
