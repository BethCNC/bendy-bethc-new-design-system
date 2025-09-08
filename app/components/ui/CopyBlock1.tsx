'use client';

import React from 'react';
import styles from './CopyBlock1.module.css';

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
    <section className={`${styles.copyBlock1} ${className}`}>
      <h2 className={styles.mainHeading}>
        Finding my peace has been a journey
      </h2>
      
      <ul className={styles.list}>
        <li className={styles.listItem}>
          The pain
        </li>
        <li className={styles.listItem}>
          The gaslighting
        </li>
        <li className={styles.listItem}>
          The fear
        </li>
        <li className={styles.listItem}>
          The loneliness
        </li>
      </ul>
      
      <h3 className={styles.transition}>
        It all led me to this
      </h3>
      
      <p className={styles.finalLine}>
        My story
      </p>
    </section>
  );
};

export default CopyBlock1;
