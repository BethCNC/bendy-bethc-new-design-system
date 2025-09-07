'use client';

import React from 'react';

interface PageTitleProps {
  title?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title = "Hello Bendy Friends!" }) => {
  return (
    <div 
      className="page-title"
      style={{
        padding: 'var(--spacing-xl) var(--margins-mobile)',
        backgroundColor: 'var(--surface-neutral-inverse)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-start',
        width: '100%',
        boxSizing: 'border-box',
      }}
    >
      <h1
        style={{
          fontFamily: 'var(--font-behind-the-nineties)',
          fontWeight: 'var(--font-weight-regular)',
          fontSize: 'var(--font-size-display-display-mobile)',
          lineHeight: 'var(--line-height-display-display-mobile)',
          color: 'var(--text-neutral-inverse)',
          margin: 0,
          flex: '1 1 0',
          minWidth: '1px',
          minHeight: '1px',
        }}
      >
        {title}
      </h1>

      <style jsx>{`
        @media (min-width: 810px) {
          .page-title {
            padding: var(--spacing-xl) var(--margins-tablet) !important;
          }
          h1 {
            font-size: var(--font-size-display-display-tablet) !important;
            line-height: var(--line-height-display-display-tablet) !important;
          }
        }

        @media (min-width: 1440px) {
          .page-title {
            padding: var(--spacing-xl) var(--margins-desktop) !important;
          }
          h1 {
            font-size: var(--font-size-display-display-desktop) !important;
            line-height: var(--line-height-display-display-desktop) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PageTitle;