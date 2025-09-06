'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PartyPopper } from 'lucide-react';
import FooterTextMarquee from './FooterTextMarquee';
import SocialIcons from './SocialIcons';
import Input from './Input';
import Button from './Button';
import Icon from './Icon';

export type FooterVariant = 'desktop' | 'mobile';

export interface FooterProps {
  variant?: FooterVariant;
  className?: string;
}

export const Footer: React.FC<FooterProps> = ({
  variant = 'desktop',
  className = ''
}) => {
  const [email, setEmail] = useState('');

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Email submitted:', email);
    setEmail('');
  };

  return (
    <footer 
      className={`footer-section ${className}`}
      style={{
        background: 'var(--surface-neutral-inverse)',
        borderTop: 'var(--border-width-lg) solid var(--border-neutral-dark)',
        marginTop: 'var(--margins-desktop)',
      }}
    >
      <div 
        style={{
          padding: 'var(--margins-desktop)',
          textAlign: 'center',
        }}
      >
        {/* Marquee Section */}
        <FooterTextMarquee />

        {/* Call-to-Action Text */}
        <div style={{ margin: 'var(--spacing-xl) 0' }}>
          <p
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-body-lg)',
              lineHeight: 'var(--line-height-body-lg)',
              color: 'var(--text-neutral-inverse)',
              margin: 0,
            }}
          >
            Bend the Rules, Break the Silence, Join My Journey
          </p>
        </div>

        {/* Newsletter Section */}
        <div style={{ margin: '32px 0', display: 'flex', justifyContent: 'center', gap: 'var(--spacing-md)' }}>
          <form 
            onSubmit={handleEmailSubmit} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: 'var(--spacing-md)',
              maxWidth: 'var(--content-max-width, 600px)',
              width: '100%',
            }}
          >
            <Input
              type="email"
              value={email}
              onChange={(value) => setEmail(value)}
              placeholder="user@someuseremail.com"
              required
            />
            <Button
              variant="primary"
              size="md"
              icon={PartyPopper}
              iconPosition="right"
              type="submit"
            >
              I&apos;m In
            </Button>
          </form>
        </div>

        {/* Social Icons */}
        <div style={{ margin: 'var(--spacing-xl) 0' }}>
          <SocialIcons brands={['instagram', 'facebook', 'github', 'pinterest', 'website']} variant="white" />
        </div>

        {/* Bottom Section */}
        <div 
          style={{ 
            margin: 'var(--spacing-xl) 0', 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            gap: 'var(--spacing-md)' 
          }}
        >
          <Image
            src="/logos/horizontal.svg"
            alt="Bendy BethC Logo"
            width={200}
            height={50}
            style={{ filter: 'brightness(0) invert(1)' }}
          />
          <p 
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--font-size-body-sm)',
              lineHeight: 'var(--line-height-body-sm)',
              color: 'var(--text-neutral-inverse)',
              margin: 0,
            }}
          >
            Copyright © 2025. All rights reserved.
          </p>
        </div>
      </div>

      <style jsx>{`
        @media (max-width: 809px) {
          .footer-section {
            margin-top: var(--margins-tablet) !important;
          }
          
          .footer-section > div {
            padding: var(--margins-tablet) !important;
          }
        }
        
        @media (max-width: 390px) {
          .footer-section {
            margin-top: var(--margins-mobile) !important;
            border-top: var(--border-width-md) solid var(--border-neutral-dark) !important;
          }
          
          .footer-section > div {
            padding: var(--margins-mobile) !important;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;