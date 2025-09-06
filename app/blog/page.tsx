import React from 'react';
import PageTitle from '../components/ui/PageTitle';

export const metadata = {
  title: 'Blog - Bendy BethC',
  description: 'Read about my health journey, chronic illness advocacy, and daily life with EDS, MCAS, POTS, and autism.',
};

export default function BlogPage() {
  return (
    <main className="bg-surface-neutral-inverse">
      <section className="padding-lg">
        <PageTitle title="Blog" />
        <div className="container">
          <p>Blog content coming soon...</p>
        </div>
      </section>
    </main>
  );
}