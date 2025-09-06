'use client';

import React from 'react';

interface ComingSoonVideoProps {
  videoSrc: string;
  posterSrc: string;
  altText: string;
}

export default function ComingSoonVideo({ 
  videoSrc, 
  posterSrc, 
  altText 
}: ComingSoonVideoProps) {
  return (
    <div 
      className="coming-soon-video-container"
      style={{
        position: 'relative' as const,
        width: '100%',
        height: '100vh',
        overflow: 'hidden'
      }}
    >
      <video
        className="coming-soon-video"
        src={videoSrc}
        poster={posterSrc}
        autoPlay
        muted
        loop
        playsInline
        style={{
          position: 'absolute' as const,
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          minWidth: '100%',
          minHeight: '100%',
          width: 'auto',
          height: 'auto',
          objectFit: 'cover' as const,
          zIndex: -1
        }}
      >
        <source src={videoSrc} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Screen reader accessible description */}
      <div 
        className="sr-only"
        aria-label={altText}
      >
        {altText}
      </div>
    </div>
  );
}