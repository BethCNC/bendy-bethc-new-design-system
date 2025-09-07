'use client';

import React from 'react';

interface ZebraVideoProps {
  className?: string;
}

const ZebraVideo: React.FC<ZebraVideoProps> = ({ className = '' }) => {
  return (
    <div 
      className={`zebra-video-container ${className}`}
      style={{
        position: 'relative' as const,
        width: '100%',
        height: '60vh',
        overflow: 'hidden',
        marginBottom: 'var(--spacing-lg, 24px)'
      }}
    >
      <video
        className="zebra-video"
        src="/videos/zebra_slow.mp4"
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
          zIndex: 0
        }}
      >
        <source src="/videos/zebra_slow.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      {/* Screen reader accessible description */}
      <div 
        className="sr-only"
        aria-label="Zebra video - representing the journey of finding peace"
      >
        A slow-motion video of a zebra, representing the journey of finding peace through challenges.
      </div>

      <style jsx>{`
        @media (min-width: 1440px) {
          .zebra-video-container {
            height: 894px !important;
          }
        }
      `}</style>
    </div>
  );
};

export default ZebraVideo;
