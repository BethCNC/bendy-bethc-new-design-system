'use client';

import React from 'react';
import styles from './ComingSoonCopyBlock.module.css';

interface ComingSoonCopyBlockProps {
  className?: string;
}

const ComingSoonCopyBlock: React.FC<ComingSoonCopyBlockProps> = ({ className = '' }) => {
  return (
    <div className={`${styles.comingSoonCopyBlock} ${className}`}>
      {/* First line - Display text */}
      <div className={styles.copyLine1}>
        Something special is growing here
      </div>

      {/* Second line - Title text */}
      <div className={styles.copyLine2}>
        Like all the best things in my journey,<br />
        this needs a little more time to bloom.
      </div>

      {/* Third line - Title text with medium weight */}
      <div className={styles.copyLine3}>
        But trust me, it&apos;ll be worth the wait.
      </div>
    </div>
  );
};

export default ComingSoonCopyBlock;
