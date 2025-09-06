'use client';

import React from 'react';

interface PageTitleProps {
  title?: string;
}

const PageTitle: React.FC<PageTitleProps> = ({ title }) => {
  return (
    <div 
      className="page-title"
      style={{
        padding: 'var(--margins-desktop)',
        textAlign: 'center',
      }}
    >
      {title && (
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 'var(--font-weight-regular)',
            fontSize: 'var(--font-size-display-display)',
            lineHeight: 'var(--line-height-display-display)',
            color: 'var(--text-neutral-heading)',
            margin: 0,
          }}
        >
          {title}
        </h1>
      )}

      <style jsx>{`
        @media (max-width: 809px) {
          .page-title {
            padding: var(--margins-tablet) !important;
          }
          
          .page-title h1 {
            font-size: var(--font-size-display-display-tablet) !important;
            line-height: var(--line-height-display-display-tablet) !important;
          }
        }
        
        @media (max-width: 390px) {
          .page-title {
            padding: var(--margins-mobile) !important;
          }
          
          .page-title h1 {
            font-size: var(--font-size-display-display-mobile) !important;
            line-height: var(--line-height-display-display-mobile) !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PageTitle;