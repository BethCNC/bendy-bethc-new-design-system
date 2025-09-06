'use client';

import type { Metadata } from 'next';
import { usePathname } from 'next/navigation';
import StyledComponentsRegistry from './lib/registry';
import { overusedGrotesk, behindTheNineties } from './lib/fonts';
// Import design system styles (CSS custom properties approach)
import '../design-system/css/fonts.css';
import '../design-system/css/responsive.css';  
import '../design-system/src/complete-design-system.css';
import '../design-system/css/globals.css';
import Header from './components/ui/Header';
import MenuBar from './components/ui/MenuBar';
import Footer from './components/ui/Footer';
import CustomCursor from './components/ui/CustomCursor';
import AnimationProvider from './components/providers/AnimationProvider';

// Note: Metadata moved to head.tsx or handled differently for client components

// NOTE: This layout is a client component; do not export `metadata` here.

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isHomepage = pathname === '/';

  return (
    <html lang="en" className={`${overusedGrotesk.variable} ${behindTheNineties.variable}`}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="manifest" href="/site.webmanifest" crossOrigin="use-credentials" />
        <link rel="icon" href="/favicon-16x16.png" sizes="16x16" type="image/png" />
        <link rel="icon" href="/favicon-32x32.png" sizes="32x32" type="image/png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" sizes="180x180" type="image/png" />
        <link rel="icon" href="/android-chrome-192x192.png" sizes="192x192" type="image/png" />
        <link rel="icon" href="/android-chrome-512x512.png" sizes="512x512" type="image/png" />
      </head>
      <body className={`${overusedGrotesk.variable} ${behindTheNineties.variable}`}>
        <StyledComponentsRegistry>
          <AnimationProvider 
            showPreloader={isHomepage}
          >
            {/* Custom Cursor - global cursor for interactive elements */}
            <CustomCursor />
            
            {/* Header - logo with clouds video hover effect */}
            <Header />
            
            {/* MenuBar - appears on every page */}
            <MenuBar />
            
            <div>
              {children}
            </div>
            
            {/* Footer - appears on every page */}
            <Footer />
          </AnimationProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  );
}