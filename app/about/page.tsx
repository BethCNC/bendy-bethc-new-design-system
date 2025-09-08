import React from 'react';
import PageTitle from '../components/ui/PageTitle';
import ComingSoonCopyBlock from '../components/ui/ComingSoonCopyBlock';
import SocialPreview from '../components/ui/SocialPreview';
import ComingSoonVideo from '../components/ui/ComingSoonVideo';

export const metadata = {
  title: 'About Me - Bendy BethC',
  description: 'Learn about my journey with EDS, MCAS, POTS, and late-diagnosed autism.',
};

export default function AboutPage() {
  return (
    <main className="bg-surface-neutral-inverse">
      <section className="padding-lg">
        <PageTitle title="About Me" />
        <ComingSoonCopyBlock />
        <ComingSoonVideo 
          videoSrc="/videos/about/bethandgeorge.mp4"
          posterSrc="/videos/about/bethandgeorge_poster.jpg"
          altText="Beth and George - About Me background video"
        />
        <SocialPreview />
      </section>
    </main>
  );
}