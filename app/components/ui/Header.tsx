'use client';

import { FunctionComponent } from 'react';
import Image from 'next/image';

const Header: FunctionComponent = () => {
  return (
    <header 
      className="bg-neutral-card p-lg p-mobile text-center m-0 flex flex-col items-center justify-center sticky top-0 z-100 overflow-hidden cursor-pointer transition-all duration-300 ease-in-out md:p-tablet lg:p-desktop"
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
        className="header-video absolute top-0 left-0 w-full h-full object-cover opacity-0 transition-opacity duration-300 ease-in-out z-10"
        muted 
        loop 
        preload="metadata"
      >
        <source src="/videos/clouds.mp4" type="video/mp4" />
        <source src="/videos/clouds_halfsize.mp4" type="video/mp4" />
      </video>
      
      {/* Logo container - matches horizontal dark logo: 472px × 100px */}
      <div className="logo-container h-25 w-118 max-w-full flex items-center justify-center relative z-20"
      >
        <Image 
          src="/logos/bendy-beth-logo-horizontal.svg"
          alt="bendy beth logo"
          width={472}
          height={100}
          priority
          className="h-auto w-full max-w-118 block text-neutral-inverse"
        />
      </div>
    </header>
  );
};

export default Header;