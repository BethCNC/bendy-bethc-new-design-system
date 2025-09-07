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
      className={`footer-section ${className}`}
    >
      <div 
        className="footer-inner-container"
      >
        {/* Marquee Section */}
        <FooterTextMarquee />

        {/* CTA Container - Match Figma Layout */}
        <div className="footer-cta-container">
          {/* Social Icons Container */}
          <div className="social-icon-container">
            <Image src="/logos/social/facebook.svg" alt="Facebook" width={32} height={32} />
            <Image src="/logos/social/twitter.svg" alt="Twitter" width={32} height={32} />
            <Image src="/logos/social/instagram.svg" alt="Instagram" width={32} height={32} />
            <Image src="/logos/social/youtube.svg" alt="YouTube" width={32} height={32} />
            <Image src="/logos/social/github.svg" alt="GitHub" width={32} height={32} />
            <Image src="/logos/social/pinterest.svg" alt="Pinterest" width={32} height={32} />
          </div>

          {/* Copy Text Container - Three separate lines */}
          <div className="footer-copy-container">
            <p className="font-title-xs-medium footer-copy-text">
              Bend the Rules
            </p>
            <p className="font-title-xs-medium footer-copy-text">
              Break the Silence
            </p>
            <p className="font-title-xs-medium footer-copy-text">
              Join my Journey
            </p>
          </div>

          {/* CTA Group - Input and Button */}
          <div className="footer-cta-group">
            <form 
              className="footer-form"
              onSubmit={handleEmailSubmit}
            >
              <div className="footer-input-wrapper">
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
                  className="footer-email-field"
                />
              </div>
              <Button
                variant="primary"
                size="md"
                icon={PartyPopper}
                iconPosition="right"
                type="submit"
                disabled={isSubmitting}
                className="footer-submit-button"
                aria-label={isSubmitting ? "Submitting newsletter signup" : "Submit newsletter signup"}
              >
                {isSubmitting ? '...' : "I'm In"}
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section - Logo Left, Copyright Right */}
        <div className="footer-bottom-section">
          <Image
            src="/logos/horizontal.svg"
            alt="Bendy BethC Logo"
            width={236}
            height={50}
            className="footer-logo"
          />
          <p className="font-body-sm-regular footer-copyright">
            Copyright © 2025. All rights reserved
          </p>
        </div>
      </div>

      <style jsx global>{`
        /* Simple approach - just target the footer specifically */
        .footer-section {
          background: var(--surface-neutral-inverse);
          border-top: var(--border-width-lg) solid var(--border-neutral-dark);
          margin: 0;
          padding: 0;
        }
        
        .footer-inner-container {
          padding: var(--spacing-2xl) 0 var(--spacing-lg) 0;
          text-align: center;
          max-width: 1440px;
          margin: 0 auto;
        }
        
        .footer-cta-container {
          display: flex;
          flex-direction: column;
          gap: var(--spacing-lg);
          align-items: center;
          margin: var(--spacing-xl) 0;
        }
        
        .social-icon-container {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: var(--spacing-lg);
        }
        
        .footer-copy-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: var(--spacing-sm);
        }
        
        .footer-copy-text {
          color: var(--text-neutral-inverse);
          margin: 0;
        }
        
        .footer-cta-group {
          display: flex;
          gap: var(--spacing-sm);
          align-items: center;
        }
        
        .footer-form {
          display: flex;
          gap: var(--spacing-sm);
          align-items: center;
        }
        
        .footer-input-wrapper {
          min-width: 240px;
        }
        
        .footer-submit-button {
          white-space: nowrap;
        }
        
        .footer-bottom-section {
          margin-top: var(--spacing-xl);
          display: flex;
          justify-content: space-between;
          align-items: center;
          width: 100%;
          padding: 0 var(--spacing-lg);
        }
        
        .footer-logo {
          filter: brightness(0) invert(1);
        }
        
        .footer-copyright {
          color: var(--text-neutral-inverse);
          margin: 0;
        }
        
        /* Form Styling */
        .footer-email-field input {
          background-color: var(--surface-neutral-card) !important;
          border-color: var(--border-neutral-default) !important;
          color: var(--text-neutral-body) !important;
        }
        
        .footer-email-field input:focus {
          border-color: var(--border-focus-ring) !important;
        }
        
        /* Responsive - Design System Tokens Only */
        @media (max-width: 809px) {
          .footer-inner-container {
            padding: var(--spacing-lg);
          }
          
          .social-icon-container {
            gap: var(--spacing-md);
          }
          
          .footer-bottom-section {
            flex-direction: column;
            gap: var(--spacing-sm);
            text-align: center;
          }
        }
        
        /* Mobile Responsive */
        @media (max-width: 390px) {
          .footer-inner-container {
            padding: var(--spacing-md);
          }
          
          .social-icon-container {
            gap: var(--spacing-sm);
            flex-wrap: wrap;
          }
          
          .footer-cta-group {
            flex-direction: column;
            gap: var(--spacing-sm);
            width: 100%;
          }
          
          .footer-form {
            flex-direction: column;
            gap: var(--spacing-sm);
            width: 100%;
          }
          
          .footer-input-wrapper {
            width: 100%;
            min-width: auto;
          }
          
          .footer-submit-button {
            width: 100%;
          }
        }
      `}</style>
    </footer>
  );
};

export default Footer;