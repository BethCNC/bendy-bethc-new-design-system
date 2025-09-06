'use client';

import { FunctionComponent } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const MenuBar: FunctionComponent = () => {
  const pathname = usePathname();

  // Define navigation links - matches Figma extraction
  const menuItems = [
    { label: 'Home', href: '/', isSelected: pathname === '/' },
    { label: 'About Me', href: '/about', isSelected: pathname === '/about' },
    { label: 'Blog', href: '/blog', isSelected: pathname === '/blog' },
    { label: 'Resources', href: '/resources', isSelected: pathname === '/resources' },
    { label: 'Contact Me', href: '/contact', isSelected: pathname === '/contact' },
    { label: 'Links', href: '/links', isSelected: pathname === '/links' }
  ];

  return (
    <nav 
      className="nav-menubar"
      style={{
        display: 'flex',
        width: '100%',
        borderTop: 'var(--border-width-lg) solid var(--border-neutral-dark)',
        borderBottom: 'var(--border-width-lg) solid var(--border-neutral-dark)',
        margin: 0,
        padding: 0,
        position: 'relative',
        zIndex: 1,
      }}
      role="navigation" 
      aria-label="Main navigation"
    >
      {menuItems.map((item, index) => (
        <div 
          key={index}
          className={`nav-menuitem ${item.isSelected ? 'selected' : ''}`}
          style={{
            flex: 1,
            background: 'var(--surface-neutral-card)',
            borderRight: index === menuItems.length - 1 ? 'none' : 'var(--border-width-md) solid var(--border-neutral-dark)',
            padding: 0,
            margin: 0,
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: 'auto',
          }}
        >
          <Link 
            href={item.href}
            className="font-title-xs-medium"
            style={{
              color: 'var(--text-neutral-heading)',
              textDecoration: 'none',
              padding: 'var(--ui-menu-item-v-padding-desktop) var(--ui-menu-item-h-padding-desktop)',
              margin: 0,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '100%',
              height: '100%',
              minHeight: 'auto',
              boxSizing: 'border-box',
            }}
          >
            {item.label}
          </Link>
        </div>
      ))}

      <style jsx>{`
        .nav-menuitem.selected {
          background: var(--surface-secondary-default) !important;
        }
        
        .nav-menuitem:hover {
          background: var(--surface-primary-hover) !important;
          transform: none !important;
          box-shadow: none !important;
        }
        
        .nav-menuitem a:hover {
          background: none !important;
          transform: none !important;
        }

        /* Tablet: 3x2 grid layout (391px to 809px) */
        @media (max-width: 809px) and (min-width: 391px) {
          .nav-menubar {
            border-top: var(--border-width-md) solid var(--border-neutral-dark) !important;
            border-bottom: var(--border-width-md) solid var(--border-neutral-dark) !important;
            flex-wrap: wrap;
          }
          
          .nav-menuitem {
            border-right: var(--border-width-md) solid var(--border-neutral-dark) !important;
            border-bottom: var(--border-width-md) solid var(--border-neutral-dark) !important;
            flex: 0 0 33.333% !important;
            width: 33.333%;
          }
          
          .nav-menuitem:nth-child(3n) {
            border-right: none !important;
          }
          
          .nav-menuitem:nth-child(n+4) {
            border-bottom: none !important;
          }

          .nav-menuitem a {
            padding: var(--ui-menu-item-v-padding-tablet) var(--ui-menu-item-h-padding-tablet) !important;
          }
        }

        /* Mobile: responsive borders and 2x3 grid (390px and below) */
        @media (max-width: 390px) {
          .nav-menubar {
            border-top: var(--border-width-sm) solid var(--border-neutral-dark) !important;
            border-bottom: var(--border-width-sm) solid var(--border-neutral-dark) !important;
            flex-wrap: wrap;
            margin: 0;
          }
          
          .nav-menuitem {
            border-right: var(--border-width-sm) solid var(--border-neutral-dark) !important;
            border-bottom: var(--border-width-sm) solid var(--border-neutral-dark) !important;
            flex: 0 0 50% !important;
            width: 50%;
          }
          
          .nav-menuitem:nth-child(2n) {
            border-right: none !important;
          }
          
          .nav-menuitem:nth-child(5),
          .nav-menuitem:nth-child(6) {
            border-bottom: none !important;
          }
          
          .nav-menuitem:last-child {
            border-right: none !important;
          }

          .nav-menuitem a {
            padding: var(--ui-menu-item-v-padding-mobile) var(--ui-menu-item-h-padding-mobile) !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default MenuBar;