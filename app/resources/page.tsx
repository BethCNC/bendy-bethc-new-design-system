import React from 'react';
import PageTitle from '../components/ui/PageTitle';
import ComingSoonCopyBlock from '../components/ui/ComingSoonCopyBlock';
import SocialPreview from '../components/ui/SocialPreview';
import ComingSoonVideo from '../components/ui/ComingSoonVideo';

export const metadata = {
  title: 'Resources - Bendy BethC',
  description: 'Helpful resources for chronic illness, EDS, MCAS, POTS, and autism advocacy.',
};

export default function ResourcesPage() {
  return (
    <main className="bg-surface-neutral-inverse">
      <section className="padding-lg">
        <PageTitle title="Resources" />
        <ComingSoonCopyBlock />
        <ComingSoonVideo 
          videoSrc="/videos/blooming-red.mp4"
          posterSrc="/videos/blooming-red_poster.jpg"
          altText="Blooming Red Flowers - Resources background video"
        />
        <SocialPreview />
      </section>
    </main>
  );
}