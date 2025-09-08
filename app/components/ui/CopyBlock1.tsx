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
    <section className={`bg-neutral-inverse p-mobile flex flex-col items-center gap-lg min-h-mobile-2xl justify-center md:p-tablet lg:p-desktop ${className}`}>
      <h2 className="font-display text-heading-h3 font-normal text-neutral-inverse text-center m-0">
        Finding my peace has been a journey
      </h2>
      
      <ul className="flex flex-col gap-sm items-center m-0 p-0 list-none">
        <li className="font-title text-title-xl font-medium text-neutral-inverse text-center m-0">
          The pain
        </li>
        <li className="font-title text-title-xl font-medium text-neutral-inverse text-center m-0">
          The gaslighting
        </li>
        <li className="font-title text-title-xl font-medium text-neutral-inverse text-center m-0">
          The fear
        </li>
        <li className="font-title text-title-xl font-medium text-neutral-inverse text-center m-0">
          The loneliness
        </li>
      </ul>
      
      <h3 className="font-display text-heading-h1 font-normal text-neutral-inverse text-center m-0">
        It all led me to this
      </h3>
      
      <p className="font-title text-title-xl font-medium text-neutral-inverse text-center m-0">
        My story
      </p>
    </section>
  );
};

export default CopyBlock1;
