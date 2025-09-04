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
      className={`bg-surface-neutral-inverse border-top-default ${className}`}
    >
      <div className="container padding-lg">
        {/* Marquee Section */}
        <FooterTextMarquee />

        {/* Call-to-Action Text */}
        <div className="margin-md">
          <p className="text-body-lg text-neutral-inverse">
            Bend the Rules, Break the Silence, Join My Journey
          </p>
        </div>

        {/* Newsletter Section */}
        <div className="margin-md">
          <form onSubmit={handleEmailSubmit} className="grid grid-mobile-4 items-center gap-md">
            <Input
              type="email"
              value={email}
              onChange={(value) => setEmail(value)}
              placeholder="user@someuseremail.com"
              required
              className="grid-mobile-3"
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
        <div className="margin-md">
          <SocialIcons brands={['instagram', 'facebook', 'github', 'pinterest', 'website']} variant="white" />
        </div>

        {/* Bottom Section */}
        <div className="margin-md flex flex-col items-center gap-md">
          <Image
            src="/logos/horizontal.svg"
            alt="Bendy BethC Logo"
            width={200}
            height={50}
            className="brightness-0 invert"
          />
          <p className="text-body-sm text-neutral-inverse">
            Copyright © 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;