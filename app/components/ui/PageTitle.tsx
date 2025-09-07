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
        padding: 'var(--spacing-xl-mobile) var(--margins-mobile)',
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
          fontSize: 'var(--font-display-display-mobile)',
          lineHeight: 'var(--line-display-display-mobile)',
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
            padding: var(--spacing-xl) var(--margins-desktop) !important;
          }
          
          .page-title h1 {
            font-size: var(--font-display-display-desktop) !important;
            line-height: var(--line-display-display-desktop) !important;
          }
        }
        
        @media (min-width: 390px) and (max-width: 809px) {
          .page-title {
            padding: var(--spacing-xl-tablet) var(--margins-tablet) !important;
          }
          
          .page-title h1 {
            font-size: var(--font-display-display-tablet) !important;
            line-height: var(--line-display-display-tablet) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PageTitle;