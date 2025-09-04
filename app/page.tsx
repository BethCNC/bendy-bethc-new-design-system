import React from 'react';
import Hero from './components/ui/Hero';
import SimpleImageGallery from './components/ui/SimpleImageGallery';
import FeatureCardGrid from './components/ui/FeatureCardGrid';
import AnimatedCopyBlock from './components/ui/AnimatedCopyBlock';
import PageTitle from './components/ui/PageTitle';


/**
 * HomePage - Main landing page for Bendy BethC health journey
 * 
 * User Flow:
 * 1. Hero - Video introduction with story text
 * 2. Gallery - Visual proof of health journey (5x4 grid)
 * 3. Story CTA - Transition to deeper content
 * 4. Feature Cards - Navigation to other sections
 * 
 * Design System: All components use verified design tokens
 * Accessibility: Proper heading hierarchy, ARIA labels, focus management
 * Performance: Optimized images, lazy loading, proper video handling
 */
export const dynamic = 'force-static'; // Prefer static for SEO on homepage

export const metadata = {
  title: 'Bendy BethC - Health Journey & Chronic Illness Advocacy',
  description: 'Documenting my journey with EDS, MCAS, POTS, and late-diagnosed autism. Sharing resources, stories, and advocacy for the chronic illness community.',
  keywords: 'EDS, MCAS, POTS, autism, chronic illness, health journey, advocacy',
  openGraph: {
    title: 'Bendy BethC - Health Journey & Chronic Illness Advocacy',
    description: 'Documenting my journey with EDS, MCAS, POTS, and late-diagnosed autism.',
    type: 'website',
    url: 'https://bethcartrettenc.com',
  },
};

export default function HomePage() {
  const copyBlockLines = [
    "This isn't content.",
    "It's proof of what it really takes to get answers.",
    "What it means to keep going when no one believes you."
  ];

  return (
    <main className="bg-surface-neutral-inverse">
      {/* Hero Section - Video with story text */}
      <section data-hero className="padding-lg">
        <Hero />
      </section>
      
      {/* Copy Block - Above gallery as per Figma design */}
      <section data-copy-block className="padding-lg">
        <AnimatedCopyBlock 
          lines={copyBlockLines}
          stagger={0.4}
          duration={1.5}
          triggerStart="top 75%"
          triggerEnd="bottom 25%"
        />
      </section>
      
      {/* Health Journey Gallery - Visual proof of invisible illness becoming visible */}
      <section data-gallery className="padding-lg">
        <div className="container">
          <SimpleImageGallery />
        </div>
      </section>
      
      {/* Feature Cards - Navigation to other sections */}
      <section data-feature-cards className="padding-lg">
        <FeatureCardGrid />
      </section>
    </main>
  );
}