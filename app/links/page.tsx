import React from 'react';
import PageTitle from '../components/ui/PageTitle';
import ComingSoonCopyBlock from '../components/ui/ComingSoonCopyBlock';
import SocialPreview from '../components/ui/SocialPreview';
import ComingSoonVideo from '../components/ui/ComingSoonVideo';

export const metadata = {
  title: 'Links - Bendy BethC',
  description: 'Important links and resources for chronic illness community.',
};

export default function LinksPage() {
  return (
    <main className="bg-surface-neutral-inverse">
      <section className="padding-lg">
        <PageTitle title="Links" />
        <ComingSoonVideo 
          videoSrc="/videos/daisies.mp4"
          posterSrc="/videos/daisies_poster.jpg"
          altText="Daisies - Links background video"
        />
        <ComingSoonCopyBlock />
        <SocialPreview />
      </section>
    </main>
  );
}