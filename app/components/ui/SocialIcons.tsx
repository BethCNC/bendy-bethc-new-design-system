import React from 'react';
import { 
  Instagram, 
  Facebook, 
  Github, 
  ExternalLink,
  Palette
} from 'lucide-react';
import Icon from './Icon';

interface SocialIconsProps {
  brands?: string[];
  variant?: 'white' | 'dark';
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

const iconMap = {
  instagram: Instagram,
  facebook: Facebook,
  github: Github,
  pinterest: Palette, // Using Palette as Pinterest substitute
  website: ExternalLink,
};

const SocialIcons: React.FC<SocialIconsProps> = ({ 
  brands = [], 
  variant = 'white',
  size = 'md'
}) => {
  const iconColor = variant === 'white' ? 'text-neutral-inverse' : 'text-neutral-body';
  
  return (
    <div className="flex gap-md items-center justify-center">
      {brands.map((brand) => {
        const IconComponent = iconMap[brand as keyof typeof iconMap];
        
        if (!IconComponent) return null;
        
        return (
          <a
            key={brand}
            href="#"
            className={`${iconColor} hover:opacity-70 transition-opacity`}
            aria-label={`Follow on ${brand}`}
          >
            <Icon
              icon={IconComponent}
              size={size}
              variant="button"
              aria-hidden={true}
            />
          </a>
        );
      })}
    </div>
  );
};

export default SocialIcons;