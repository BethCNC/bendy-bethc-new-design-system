'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';

interface InstagramPost {
  id: string;
  imageUrl: string;
  alt: string;
  permalink: string;
  media_type: string;
  timestamp: string;
  caption?: string;
}

interface SocialPreviewProps {
  className?: string;
}

const SocialPreview: React.FC<SocialPreviewProps> = ({ className = '' }) => {
  const [posts, setPosts] = useState<InstagramPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInstagramPosts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch('/api/instagram');
        const data = await response.json();
        
        if (data.success) {
          setPosts(data.posts.slice(0, 9)); // Limit to 9 posts as per Figma
        } else {
          setError(data.error || 'Failed to fetch Instagram posts');
        }
      } catch (err) {
        console.error('Error fetching Instagram posts:', err);
        setError('Failed to fetch Instagram posts');
      } finally {
        setLoading(false);
      }
    };

    fetchInstagramPosts();
  }, []);

  return (
    <div 
      className={`social-preview ${className}`}
      style={{
        display: 'flex',
        flexDirection: 'column',
        width: '100vw',
        maxWidth: '100vw',
        margin: 0,
        marginLeft: 'calc(-50vw + 50%)',
        marginRight: 'calc(-50vw + 50%)',
        position: 'relative',
        left: '50%',
        right: '50%',
        transform: 'translateX(-50%)',
      }}
    >
      {/* Quote Section */}
      <div 
        className="quote-section"
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          alignSelf: 'stretch',
          gap: 'var(--spacing-md-mobile, 12px)',
          padding: 'var(--spacing-lg-mobile, 24px) var(--spacing-2xl-mobile, 64px)',
          backgroundColor: 'var(--surface-warning-subtle, #F0F081)',
          width: '100%',
        }}
      >
        <blockquote 
          className="quote-text"
          style={{
            fontFamily: 'var(--font-family-body-mobile, "Overused Grotesk", sans-serif)',
            fontSize: 'var(--font-size-title-lg-mobile, 30px)',
            lineHeight: 'var(--line-height-title-lg-mobile, 40px)',
            fontWeight: 600,
            color: 'var(--text-neutral-heading, #252626)',
            textAlign: 'center',
            margin: 0,
            fontStyle: 'normal',
          }}
        >
          &ldquo;Alone we can do so little; together we can do so much&rdquo; – Helen Keller
        </blockquote>
      </div>

      {/* Instagram Feed Section */}
      <div 
        className="instagram-feed-section"
        style={{
          display: 'flex',
          flexDirection: 'column',
          width: '100%',
          height: '427px',
          overflowX: 'auto',
          overflowY: 'hidden',
        }}
      >
        {loading ? (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-neutral-body, #0C0D0D)',
              fontFamily: 'var(--font-family-body-mobile, "Overused Grotesk", sans-serif)',
            }}
          >
            Loading Instagram feed...
          </div>
        ) : error ? (
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '100%',
              color: 'var(--text-neutral-body, #0C0D0D)',
              fontFamily: 'var(--font-family-body-mobile, "Overused Grotesk", sans-serif)',
            }}
          >
            {error}
          </div>
        ) : (
          <div 
            className="instagram-posts-container"
            style={{
              display: 'flex',
              height: '100%',
              gap: 0,
            }}
          >
            {posts.map((post, index) => (
              <a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                className="instagram-post"
                style={{
                  display: 'block',
                  width: '240px',
                  height: '427px',
                  flexShrink: 0,
                  position: 'relative',
                  overflow: 'hidden',
                  cursor: 'pointer',
                  transition: 'transform 0.2s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Image
                  src={post.imageUrl}
                  alt={post.alt}
                  fill
                  style={{
                    objectFit: 'cover',
                  }}
                  sizes="200px"
                />
                
                {/* Video indicator for video posts */}
                {post.media_type === 'VIDEO' && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      width: '20px',
                      height: '20px',
                      backgroundColor: 'rgba(0, 0, 0, 0.7)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '12px',
                    }}
                  >
                    ▶
                  </div>
                )}
              </a>
            ))}
            
            {/* Fallback posts if we don't have enough Instagram posts */}
            {posts.length < 9 && Array.from({ length: Math.max(0, 9 - posts.length) }).map((_, index) => (
              <div
                key={`placeholder-${index}`}
                className="instagram-post-placeholder"
                style={{
                  width: '240px',
                  height: '427px',
                  flexShrink: 0,
                  backgroundColor: 'var(--surface-neutral-subtle, #f8f9fa)',
                  border: '1px solid var(--border-neutral-subtle, #e9ecef)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-neutral-body, #0C0D0D)',
                  fontFamily: 'var(--font-family-body-mobile, "Overused Grotesk", sans-serif)',
                  fontSize: '14px',
                }}
              >
                Coming Soon
              </div>
            ))}
          </div>
        )}
      </div>

      <style jsx>{`
        /* Tablet responsive adjustments */
        @media (min-width: 810px) {
          .quote-section {
            padding: var(--spacing-lg-tablet, 24px) var(--spacing-2xl-tablet, 64px);
            gap: var(--spacing-md-tablet, 12px);
          }
          
          .quote-text {
            font-family: var(--font-family-body-tablet, "Overused Grotesk", sans-serif);
            font-size: var(--font-size-title-lg-tablet, 36px);
            line-height: var(--line-height-title-lg-tablet, 48px);
          }
        }

        /* Desktop responsive adjustments */
        @media (min-width: 1440px) {
          .quote-section {
            padding: var(--spacing-lg-desktop, 32px) var(--spacing-2xl-desktop, 96px);
            gap: var(--spacing-md-desktop, 12px);
          }
          
          .quote-text {
            font-family: var(--font-family-body-desktop, "Overused Grotesk", sans-serif);
            font-size: var(--font-size-title-lg-desktop, 36px);
            line-height: var(--line-height-title-lg-desktop, 48px);
          }
        }

        /* Hide scrollbar for Instagram feed */
        .instagram-feed-section::-webkit-scrollbar {
          display: none;
        }

        .instagram-feed-section {
          -ms-overflow-style: none;  /* IE and Edge */
          scrollbar-width: none;  /* Firefox */
        }
      `}</style>
    </div>
  );
};

export default SocialPreview;
