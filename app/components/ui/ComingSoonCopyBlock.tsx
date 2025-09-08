'use client';

import React from 'react';

interface ComingSoonCopyBlockProps {
  className?: string;
}

const ComingSoonCopyBlock: React.FC<ComingSoonCopyBlockProps> = ({ className = '' }) => {
  return (
    <div className={`flex flex-col items-center justify-center gap-xl p-2xl p-lg w-full max-w-full text-center bg-neutral-card ${className}`}>
      {/* First line - Display text */}
      <div className="font-heading text-heading-h2 text-neutral-display text-center w-full">
        Something special is growing here
      </div>

      {/* Second line - Title text */}
      <div className="font-title text-title-lg text-neutral-display text-center w-full max-w-mobile-2xl">
        Like all the best things in my journey,<br />
        this needs a little more time to bloom.
      </div>

      {/* Third line - Title text with medium weight */}
      <div className="font-title text-title-lg text-neutral-display text-center w-full max-w-mobile-2xl font-medium">
        But trust me, it&apos;ll be worth the wait.
      </div>
    </div>
  );
};

export default ComingSoonCopyBlock;
