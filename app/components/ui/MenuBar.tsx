'use client';

import { FunctionComponent } from 'react';
import { usePathname } from 'next/navigation';
import MenuItem from './MenuItem';

const MenuBar: FunctionComponent = () => {
  const pathname = usePathname();

  // Determine current page for navigation
  const getCurrentPage = () => {
    if (pathname === '/') return 'home';
    if (pathname === '/about') return 'about';
    if (pathname === '/blog') return 'blog';
    if (pathname === '/resources') return 'resources';
    if (pathname === '/contact') return 'contact';
    if (pathname === '/links') return 'links';
    return 'home';
  };

  const currentPage = getCurrentPage();

  // Define navigation links - matches Figma extraction
  const menuItems = [
    { label: 'Home', href: '/', isSelected: currentPage === 'home' },
    { label: 'About Me', href: '/about', isSelected: currentPage === 'about' },
    { label: 'Blog', href: '/blog', isSelected: currentPage === 'blog' },
    { label: 'Resources', href: '/resources', isSelected: currentPage === 'resources' },
    { label: 'Contact Me', href: '/contact', isSelected: currentPage === 'contact' },
    { label: 'Links', href: '/links', isSelected: currentPage === 'links' }
  ];

  return (
    <div className="container">
      <nav 
        className="bg-surface-neutral-page grid grid-mobile-4 border-default border-radius-md overflow-hidden" 
        role="navigation" 
        aria-label="Main navigation"
      >
        {menuItems.map((item, index) => (
          <MenuItem
            key={index}
            label={item.label}
            href={item.href}
            isSelected={item.isSelected}
            isLast={index === menuItems.length - 1}
          />
        ))}
      </nav>
    </div>
  );
};

export default MenuBar;