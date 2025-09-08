import React from 'react';
import PageTitle from '../components/ui/PageTitle';
import ComingSoonCopyBlock from '../components/ui/ComingSoonCopyBlock';
import SocialPreview from '../components/ui/SocialPreview';
import ComingSoonVideo from '../components/ui/ComingSoonVideo';

export const metadata = {
  title: 'Contact Me - Bendy BethC',
  description: 'Get in touch about chronic illness advocacy, collaborations, or questions.',
};

export default function ContactPage() {
  return (
    <main className="bg-surface-neutral-inverse">
      <section className="padding-lg">
        <PageTitle title="Contact Me" />
        <ComingSoonCopyBlock />
        <ComingSoonVideo 
          videoSrc="/videos/contact/wildflowers_under_10MB_1.mp4"
          posterSrc="/videos/contact/wildflowers_poster.jpg"
          altText="Wildflowers - Contact Me background video"
        />
        <SocialPreview />
      </section>
    </main>
  );
}