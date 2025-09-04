import React from 'react';
import { LucideIcon } from 'lucide-react';
import Icon from './Icon';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  type = 'button',
  children,
  onClick,
  className = ''
}) => {
  const getButtonStyles = () => {
    let baseStyles = 'btn text-body-md';
    
    // Size classes using component tokens
    switch (size) {
      case 'sm':
        baseStyles += ' btn-sm text-body-sm';
        break;
      case 'md':
        baseStyles += ' btn-md';
        break;
      case 'lg':
        baseStyles += ' btn-lg text-body-lg';
        break;
      case 'xl':
        baseStyles += ' btn-xl text-body-xl';
        break;
    }
    
    // Variant styles using semantic tokens
    switch (variant) {
      case 'primary':
        baseStyles += ' bg-surface-primary-default text-neutral-inverse';
        break;
      case 'secondary':
        baseStyles += ' bg-surface-secondary-default text-neutral-inverse';
        break;
      case 'tertiary':
        baseStyles += ' bg-surface-tertiary-default text-neutral-inverse';
        break;
    }

    return baseStyles;
  };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${getButtonStyles()} ${className}`}
      aria-label={typeof children === 'string' ? children : undefined}
    >
      {icon && iconPosition === 'left' && (
        <Icon 
          icon={icon} 
          size={size}
          variant="button"
          aria-hidden={true}
        />
      )}
      {children}
      {icon && iconPosition === 'right' && (
        <Icon 
          icon={icon} 
          size={size}
          variant="button"
          aria-hidden={true}
        />
      )}
    </button>
  );
};

export default Button;