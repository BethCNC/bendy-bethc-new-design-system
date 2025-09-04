import React from 'react';
import { LucideIcon } from 'lucide-react';

interface IconProps {
  icon: LucideIcon;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'button' | 'chip';
  className?: string;
  'aria-label'?: string;
  'aria-hidden'?: boolean;
}

/**
 * Standardized Icon component using Lucide React icons
 * Follows Figma component specifications for sizing and accessibility
 */
const Icon: React.FC<IconProps> = ({ 
  icon: IconComponent, 
  size = 'md', 
  variant = 'button',
  className = '',
  'aria-label': ariaLabel,
  'aria-hidden': ariaHidden = false,
  ...props 
}) => {
  // Generate size class based on variant and size
  const sizeClass = `icon-${variant}-${size}`;
  
  // Combine classes
  const combinedClassName = `${sizeClass} ${className}`.trim();

  return (
    <IconComponent
      className={combinedClassName}
      aria-label={ariaLabel}
      aria-hidden={ariaHidden}
      {...props}
    />
  );
};

export default Icon;