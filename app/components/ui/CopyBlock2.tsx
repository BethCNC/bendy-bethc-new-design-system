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
    <section className={`bg-neutral-inverse p-mobile flex flex-col items-center gap-lg min-h-mobile-2xl justify-center md:p-tablet lg:p-desktop ${className}`}>
      <h2 className="font-display text-heading-h2 font-normal text-neutral-inverse text-center m-0">
        This isn&apos;t content
      </h2>
      
      <h3 className="font-display text-heading-h3 font-normal text-neutral-inverse text-center m-0">
        It&apos;s proof of what it really takes to get answers
      </h3>
      
      <h2 className="font-display text-heading-h2 font-normal text-neutral-inverse text-center m-0">
        What it means to keep going<br />when no one believes you.
      </h2>
    </section>
  );
};

export default CopyBlock2;
