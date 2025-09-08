'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { PartyPopper } from 'lucide-react';
import FooterTextMarquee from './FooterTextMarquee';
import Field from './Field';
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
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');
    setSubmitSuccess(false);
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log('Email submitted:', email);
      
      setSubmitSuccess(true);
      setEmail('');
      
      // Reset success message after 3 seconds
      setTimeout(() => setSubmitSuccess(false), 3000);
    } catch (error) {
      setEmailError('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer 
      className={`bg-neutral-inverse border-t border-t-lg border-neutral-dark m-0 p-0 ${className}`}
    >
      <div className="p-2xl pb-lg text-center max-w-1440 mx-auto md:p-lg sm:p-md">
        {/* Marquee Section */}
        <FooterTextMarquee />

        {/* CTA Container - Match Figma Layout */}
        <div className="flex flex-col gap-lg items-center my-xl md:gap-md sm:gap-sm">
          {/* Social Icons Container */}
          <div className="flex justify-center items-center gap-lg md:gap-md sm:gap-sm sm:flex-wrap">
            <Image src="/logos/social/facebook.svg" alt="Facebook" width={32} height={32} />
            <Image src="/logos/social/twitter.svg" alt="Twitter" width={32} height={32} />
            <Image src="/logos/social/instagram.svg" alt="Instagram" width={32} height={32} />
            <Image src="/logos/social/youtube.svg" alt="YouTube" width={32} height={32} />
            <Image src="/logos/social/github.svg" alt="GitHub" width={32} height={32} />
            <Image src="/logos/social/pinterest.svg" alt="Pinterest" width={32} height={32} />
          </div>

          {/* Copy Text Container - Three separate lines */}
          <div className="flex flex-col items-center text-center gap-sm">
            <p className="text-title-xs font-medium text-neutral-inverse m-0">
              Bend the Rules
            </p>
            <p className="text-title-xs font-medium text-neutral-inverse m-0">
              Break the Silence
            </p>
            <p className="text-title-xs font-medium text-neutral-inverse m-0">
              Join my Journey
            </p>
          </div>

          {/* CTA Group - Input and Button */}
          <div className="flex gap-sm items-center sm:flex-col sm:gap-sm sm:w-full">
            <form 
              className="flex gap-sm items-center sm:flex-col sm:gap-sm sm:w-full"
              onSubmit={handleEmailSubmit}
            >
              <div className="min-w-60 sm:w-full sm:min-w-auto">
                <Field
                  type="email"
                  value={email}
                  onChange={(value) => setEmail(value)}
                  placeholder="user@someuseremail.com"
                  required
                  disabled={isSubmitting}
                  error={emailError}
                  success={submitSuccess ? 'Thanks for joining!' : undefined}
                  size="md"
                  className="bg-neutral-card border-neutral-default text-neutral-body focus:border-border-focus-ring"
                />
              </div>
              <Button
                variant="primary"
                size="md"
                icon={PartyPopper}
                iconPosition="right"
                type="submit"
                disabled={isSubmitting}
                className="whitespace-nowrap sm:w-full"
                aria-label={isSubmitting ? "Submitting newsletter signup" : "Submit newsletter signup"}
              >
                {isSubmitting ? '...' : "I'm In"}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section - Logo Left, Copyright Right */}
        <div className="mt-xl flex justify-between items-center w-full px-lg md:flex-col md:gap-sm md:text-center">
          <Image
            src="/logos/horizontal.svg"
            alt="Bendy BethC Logo"
            width={236}
            height={50}
            className="brightness-0 invert"
          />
          <p className="text-body-sm font-normal text-neutral-inverse m-0">
            Copyright © 2025. All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;