'use client';

import React from 'react';

export default function ComingSoonMessage() {
  return (
    <div
      className="coming-soon-message-container"
      role="region"
      aria-label="Coming soon message"
      style={{
        background: 'var(--surface-neutral-page)',
        width: '100%',
        padding: 'var(--spacing-3xl) var(--spacing-lg)',
        textAlign: 'center' as const
      }}
    >
      <div 
        className="coming-soon-text-content"
        style={{
          display: 'flex',
          flexDirection: 'column' as const,
          gap: 'var(--spacing-3xl)',
          maxWidth: 'var(--container-max-width)',
          margin: '0 auto'
        }}
      >
        <h2 
          className="coming-soon-headline text-display"
          style={{
            color: 'var(--text-neutral-heading)',
            margin: 0
          }}
        >
          Something special is growing here
        </h2>
        <p 
          className="coming-soon-body-text text-heading-h3"
          style={{
            color: 'var(--text-neutral-body)',
            margin: 0,
            lineHeight: 'var(--line-height-body-lg)'
          }}
        >
          Like all the best things in my journey,
          <br />
          this needs a little more time to bloom.
        </p>
        <p 
          className="coming-soon-cta-text text-heading-h3"
          style={{
            color: 'var(--text-neutral-body)',
            margin: 0
          }}
        >
          But trust me, it'll be worth the wait.
        </p>
      </div>
    </div>
  );
}