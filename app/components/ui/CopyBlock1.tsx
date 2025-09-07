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
        padding: 'var(--margins-desktop)',
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
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--font-heading-H3-desktop)',
          fontWeight: 'var(--font-weight-regular)',
          lineHeight: 'var(--line-height-heading-H3-desktop)',
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
            fontFamily: 'var(--font-title)',
            fontSize: 'var(--font-title-xl-desktop)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 'var(--line-height-title-xl-desktop)',
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
            fontFamily: 'var(--font-title)',
            fontSize: 'var(--font-title-xl-desktop)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 'var(--line-height-title-xl-desktop)',
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
            fontFamily: 'var(--font-title)',
            fontSize: 'var(--font-title-xl-desktop)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 'var(--line-height-title-xl-desktop)',
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
            fontFamily: 'var(--font-title)',
            fontSize: 'var(--font-title-xl-desktop)',
            fontWeight: 'var(--font-weight-medium)',
            lineHeight: 'var(--line-height-title-xl-desktop)',
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
          fontFamily: 'var(--font-display)',
          fontSize: 'var(--font-heading-H1-desktop)',
          fontWeight: 'var(--font-weight-regular)',
          lineHeight: 'var(--line-height-heading-H1-desktop)',
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
          fontFamily: 'var(--font-title)',
          fontSize: 'var(--font-title-xl-desktop)',
          fontWeight: 'var(--font-weight-medium)',
          lineHeight: 'var(--line-height-title-xl-desktop)',
          color: 'var(--text-neutral-inverse)',
          textAlign: 'center',
          margin: 0,
        }}
      >
        My story. The one thing I still have.
      </p>
    </section>
  );
};

export default CopyBlock1;
