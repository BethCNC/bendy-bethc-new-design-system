'use client';

import { FunctionComponent } from 'react';
import Image from 'next/image';

const Header: FunctionComponent = () => {
  return (
    <header 
      className="header-section"
      style={{
        background: 'var(--surface-neutral-card)', // #f1f2f2
        padding: 'var(--spacing-lg) var(--margins-mobile)', // mobile-first padding 
        textAlign: 'center' as const,
        margin: 0,
        display: 'flex',
        flexDirection: 'column' as const,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'sticky' as const,
        top: 0,
        zIndex: 100,
        overflow: 'hidden',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
      }}
      onMouseEnter={(e) => {
        const video = e.currentTarget.querySelector('.header-video') as HTMLVideoElement;
        if (video) {
          video.style.opacity = '1';
          video.play().catch(err => console.log('Video autoplay blocked:', err));
        }
      }}
      onMouseLeave={(e) => {
        const video = e.currentTarget.querySelector('.header-video') as HTMLVideoElement;
        if (video && !video.paused) {
          video.style.opacity = '0';
          video.pause();
          video.currentTime = 0;
        }
      }}
      onTouchStart={(e) => {
        const video = e.currentTarget.querySelector('.header-video') as HTMLVideoElement;
        if (video) {
          video.style.opacity = '1';
          video.play().catch(err => console.log('Video autoplay blocked:', err));
        }
      }}
      onTouchEnd={(e) => {
        const video = e.currentTarget.querySelector('.header-video') as HTMLVideoElement;
        if (video && !video.paused) {
          setTimeout(() => {
            video.style.opacity = '0';
            video.pause();
            video.currentTime = 0;
          }, 2000); // Show video for 2 seconds on mobile tap
        }
      }}
    >
      {/* Background clouds video for hover effect */}
      <video 
        className="header-video"
        muted 
        loop 
        preload="metadata"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          opacity: 0,
          transition: 'opacity 0.3s ease',
          zIndex: 1,
        }}
      >
        <source src="/videos/clouds.mp4" type="video/mp4" />
        <source src="/videos/clouds_halfsize.mp4" type="video/mp4" />
      </video>
      
      {/* Logo container - matches actual logo: 472px × 100px */}
      <div 
        className="logo-container"
        style={{
          height: '100px',
          width: '472px',
          maxWidth: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          zIndex: 10,
        }}
      >
        <Image 
          src="/logos/bendy-beth-logo-horizontal.svg"
          alt="bendy beth logo"
          width={472}
          height={100}
          priority
          style={{
            height: 'auto',
            width: '100%',
            maxWidth: '472px',
            display: 'block',
          }}
        />
      </div>

      <style jsx>{`
        :global(:root) {
          --header-height: 148px;
        }
        
        .header-section:hover .header-video {
          opacity: 1;
        }
        
        /* Responsive padding using design system tokens */
        @media (max-width: 809px) {
          .header-section {
            padding: var(--spacing-lg) var(--margins-tablet) !important;
          }
        }
        
        @media (max-width: 390px) {
          .header-section {
            padding: var(--spacing-lg) var(--margins-mobile) !important;
          }
        }

        @media (min-width: 810px) {
          .header-section {
            padding: var(--spacing-lg) var(--margins-desktop) !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header;