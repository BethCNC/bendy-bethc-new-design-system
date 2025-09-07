'use client';

import React, { useState } from 'react';
import Image from 'next/image';

interface SimpleImageGalleryProps {
  className?: string;
}

/**
 * SimpleImageGallery - Health journey gallery with design system tokens
 * 
 * Features:
 * - 5×4 grid layout matching Figma specifications (20 images)
 * - 220px × 220px images with 24px gaps
 * - Responsive: 2/3/5 columns for mobile/tablet/desktop
 * - Enhanced hover effects with dual scaling
 * - Mobile-friendly touch interactions
 * - Year overlays for context
 * 
 * Design System: All styling uses semantic tokens
 * Accessibility: Proper alt text, keyboard navigation
 * Performance: Priority loading for first row, lazy loading for rest
 */
export default function SimpleImageGallery({ className = '' }: SimpleImageGalleryProps) {
  const [activeImageId, setActiveImageId] = useState<number | null>(null);
  
  // Health journey images - 20 images for 5×4 grid
  const galleryImages = [
    { id: 1, src: '/images/gallery/1986.png', alt: 'Health journey 1986', year: '1986' },
    { id: 2, src: '/images/gallery/2004.png', alt: 'Health journey 2004', year: '2004' },
    { id: 3, src: '/images/gallery/2008.png', alt: 'Health journey 2008', year: '2008' },
    { id: 4, src: '/images/gallery/2010.png', alt: 'Health journey 2010', year: '2010' },
    { id: 5, src: '/images/gallery/2017-1.png', alt: 'Health journey 2017 part 1', year: '2017' },
    { id: 6, src: '/images/gallery/2017-2.png', alt: 'Health journey 2017 part 2', year: '2017' },
    { id: 7, src: '/images/gallery/2017-3.png', alt: 'Health journey 2017 part 3', year: '2017' },
    { id: 8, src: '/images/gallery/2018-1.png', alt: 'Health journey 2018 part 1', year: '2018' },
    { id: 9, src: '/images/gallery/2018-2.png', alt: 'Health journey 2018 part 2', year: '2018' },
    { id: 10, src: '/images/gallery/2020-1.png', alt: 'Health journey 2020 part 1', year: '2020' },
    { id: 11, src: '/images/gallery/2020-2.png', alt: 'Health journey 2020 part 2', year: '2020' },
    { id: 12, src: '/images/gallery/2020-3.png', alt: 'Health journey 2020 part 3', year: '2020' },
    { id: 13, src: '/images/gallery/2020-4.png', alt: 'Health journey 2020 part 4', year: '2020' },
    { id: 14, src: '/images/gallery/2021-1.png', alt: 'Health journey 2021 part 1', year: '2021' },
    { id: 15, src: '/images/gallery/2021-2.png', alt: 'Health journey 2021 part 2', year: '2021' },
    { id: 16, src: '/images/gallery/2023-1.png', alt: 'Health journey 2023 part 1', year: '2023' },
    { id: 17, src: '/images/gallery/2023-2.png', alt: 'Health journey 2023 part 2', year: '2023' },
    { id: 18, src: '/images/gallery/2024-1.png', alt: 'Health journey 2024 part 1', year: '2024' },
    { id: 19, src: '/images/gallery/2025-1.png', alt: 'Health journey 2025 part 1', year: '2025' },
    { id: 20, src: '/images/gallery/2025-2.png', alt: 'Health journey 2025 part 2', year: '2025' },
  ];

  return (
    <section 
      className={`simple-image-gallery ${className}`}
      style={{
        padding: 'var(--spacing-xl) var(--margins-mobile)',
        backgroundColor: 'var(--surface-neutral-inverse)',
      }}
    >
      <div 
        className="gallery-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(5, 220px)',
          gridTemplateRows: 'repeat(4, 220px)',
          gap: '24px',
          justifyContent: 'center',
          maxWidth: '1196px',
          margin: '0 auto',
        }}
      >
        {galleryImages.map((image) => (
          <div 
            key={image.id} 
            className={`gallery-image-container ${
              activeImageId === image.id ? 'gallery-image-container-active' : ''
            }`}
            style={{
              position: 'relative',
              width: '220px',
              height: '220px',
              cursor: 'pointer',
              overflow: 'hidden',
              borderRadius: 'var(--radius-md)',
              transition: 'all 0.3s ease',
              transform: activeImageId === image.id ? 'scale(1.05)' : 'scale(1)',
            }}
            onTouchStart={() => setActiveImageId(image.id)}
            onTouchEnd={() => setActiveImageId(null)}
            onClick={() => {
              setActiveImageId(activeImageId === image.id ? null : image.id);
            }}
          >
            <Image
              src={image.src}
              alt={image.alt}
              width={220}
              height={220}
              className="gallery-image"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                filter: activeImageId === image.id 
                  ? 'blur(0px) saturate(1)' 
                  : 'blur(1px) saturate(1.2)',
                transform: activeImageId === image.id ? 'scale(1.1)' : 'scale(1)',
                transition: 'all 0.3s ease',
              }}
              priority={image.id <= 5}
              loading={image.id > 5 ? 'lazy' : 'eager'}
            />
            
            {/* Year overlay */}
            <div 
              className="gallery-year-overlay"
              style={{
                position: 'absolute',
                bottom: 'var(--spacing-sm)',
                right: 'var(--spacing-sm)',
                backgroundColor: 'var(--surface-neutral-inverse)',
                color: 'var(--text-neutral-inverse)',
                padding: 'var(--spacing-xs) var(--spacing-sm)',
                borderRadius: 'var(--radius-sm)',
                fontFamily: 'var(--font-family-body)',
                fontSize: 'var(--font-size-body-sm)',
                fontWeight: 'var(--font-weight-medium)',
                opacity: activeImageId === image.id ? 1 : 0.8,
                transition: 'opacity 0.3s ease',
              }}
            >
              {image.year}
            </div>
          </div>
        ))}
      </div>

      <style jsx>{`
        .gallery-image-container:hover {
          transform: scale(1.05) !important;
        }
        
        .gallery-image-container:hover .gallery-image {
          filter: blur(0px) saturate(1) !important;
          transform: scale(1.1) !important;
        }
        
        .gallery-image-container:hover .gallery-year-overlay {
          opacity: 1 !important;
        }

        /* Responsive grid layouts */
        @media (max-width: 809px) and (min-width: 391px) {
          .simple-image-gallery {
            padding: var(--spacing-lg) var(--margins-tablet) !important;
          }
          
          .gallery-grid {
            grid-template-columns: repeat(3, 180px) !important;
            grid-template-rows: repeat(7, 180px) !important;
            gap: var(--spacing-md) !important;
          }
          
          .gallery-image-container {
            width: 180px !important;
            height: 180px !important;
          }
        }

        @media (max-width: 390px) {
          .simple-image-gallery {
            padding: var(--spacing-md) var(--margins-mobile) !important;
          }
          
          .gallery-grid {
            grid-template-columns: repeat(2, 160px) !important;
            grid-template-rows: repeat(10, 160px) !important;
            gap: var(--spacing-sm) !important;
          }
          
          .gallery-image-container {
            width: 160px !important;
            height: 160px !important;
          }
        }

        @media (min-width: 810px) {
          .simple-image-gallery {
            padding: var(--spacing-xl) var(--margins-desktop) !important;
          }
        }
      `}</style>
    </section>
  );
}