import React from 'react';
import Link from 'next/link';

interface MenuItemProps {
  label: string;
  href: string;
  isSelected?: boolean;
  isLast?: boolean;
}

const MenuItem: React.FC<MenuItemProps> = ({ 
  label, 
  href, 
  isSelected = false, 
  isLast = false 
}) => {
  return (
    <Link 
      href={href}
      className={`
        menu-item padding-md text-body-md text-decoration-none transition-all flex items-center justify-center
        ${isSelected 
          ? 'text-primary-default bg-surface-primary-hover' 
          : 'text-neutral-body bg-surface-neutral-page'
        }
        ${!isLast ? 'border-right-default' : ''}
      `}
      aria-current={isSelected ? 'page' : undefined}
    >
      {label}
    </Link>
  );
};

export default MenuItem;