import React from 'react';
import { LucideIcon } from 'lucide-react';
import Icon from './Icon';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'destructive' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: LucideIcon;
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
  children?: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  'aria-label'?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon,
  iconPosition = 'right',
  type = 'button',
  children,
  onClick,
  disabled = false,
  className = '',
  'aria-label': ariaLabel,
  ...props
}) => {
  const isIconOnly = !children || (typeof children === 'string' && children.trim() === '');
  
  const getButtonStyles = () => {
    // Use design system button classes
    let sizeClass = '';
    switch (size) {
      case 'sm':
        sizeClass = isIconOnly ? 'button-sm button-sm-radius' : 'button-sm button-sm-radius';
        break;
      case 'md':
        sizeClass = isIconOnly ? 'button-md button-md-radius' : 'button-md button-md-radius';
        break;
      case 'lg':
        sizeClass = isIconOnly ? 'button-lg button-lg-radius' : 'button-lg button-lg-radius';
        break;
      case 'xl':
        sizeClass = isIconOnly ? 'button-xl button-xl-radius' : 'button-xl button-xl-radius';
        break;
    }
    
    return sizeClass;
  };

  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'primary':
        return 'bg-primary text-neutral-display hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-border-focus-ring focus-visible:outline-offset-2';
      case 'secondary':
        return 'bg-secondary text-neutral-display hover:bg-secondary-hover focus-visible:outline-2 focus-visible:outline-border-focus-ring focus-visible:outline-offset-2';
      case 'tertiary':
        return 'bg-tertiary text-neutral-display hover:bg-tertiary-hover focus-visible:outline-2 focus-visible:outline-border-focus-ring focus-visible:outline-offset-2';
      case 'destructive':
        return 'bg-error text-neutral-display hover:bg-error-hover focus-visible:outline-2 focus-visible:outline-border-focus-ring focus-visible:outline-offset-2';
      case 'outline':
        return 'bg-transparent text-neutral-body border border-neutral-default hover:border-neutral-dark hover:bg-neutral-hover focus-visible:outline-2 focus-visible:outline-border-focus-ring focus-visible:outline-offset-2';
      case 'ghost':
        return 'bg-transparent text-neutral-body hover:bg-neutral-hover focus-visible:outline-2 focus-visible:outline-border-focus-ring focus-visible:outline-offset-2';
      case 'link':
        return 'bg-transparent text-primary-default underline hover:text-primary-hover focus-visible:outline-2 focus-visible:outline-border-focus-ring focus-visible:outline-offset-2';
      default:
        return 'bg-primary text-neutral-display hover:bg-primary-hover focus-visible:outline-2 focus-visible:outline-border-focus-ring focus-visible:outline-offset-2';
    }
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${getButtonStyles()} ${getVariantClasses(variant)} text-body-md font-medium ${disabled ? 'bg-neutral-disabled text-neutral-disabled cursor-not-allowed' : ''} ${className}`.trim()}
      aria-label={ariaLabel || (isIconOnly && typeof children === 'string' ? children : undefined)}
      {...props}
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