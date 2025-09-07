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
        sizeClass = isIconOnly ? 'btn-icon-sm' : 'btn-sm';
        break;
      case 'md':
        sizeClass = isIconOnly ? 'btn-icon-md' : 'btn-md';
        break;
      case 'lg':
        sizeClass = isIconOnly ? 'btn-icon-lg' : 'btn-lg';
        break;
      case 'xl':
        sizeClass = isIconOnly ? 'btn-icon-xl' : 'btn-xl';
        break;
    }
    
    // Just use the design system button classes
    return sizeClass;
  };

  return (
    <>
      <button
        type={type}
        onClick={onClick}
        disabled={disabled}
        className={`${getButtonStyles()} btn-variant-${variant} ${className}`.trim()}
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
      
      <style jsx>{`
        .btn-variant-primary {
          background: var(--surface-primary-default);
          color: var(--text-neutral-display);
          border: none;
        }
        
        .btn-variant-primary:hover:not(:disabled) {
          background: var(--surface-primary-hover);
        }
        
        .btn-variant-secondary {
          background: var(--surface-secondary-default);
          color: var(--text-neutral-display);
          border: none;
        }
        
        .btn-variant-secondary:hover:not(:disabled) {
          background: var(--surface-secondary-hover);
        }
        
        .btn-variant-tertiary {
          background: var(--surface-tertiary-default);
          color: var(--text-neutral-display);
          border: none;
        }
        
        .btn-variant-tertiary:hover:not(:disabled) {
          background: var(--surface-tertiary-hover);
        }
        
        .btn-variant-destructive {
          background: var(--surface-error-default);
          color: var(--text-neutral-inverse);
          border: none;
        }
        
        .btn-variant-destructive:hover:not(:disabled) {
          background: var(--surface-error-hover);
        }
        
        .btn-variant-outline {
          background: transparent;
          color: var(--text-neutral-body);
          border: 1px solid var(--border-neutral-default);
        }
        
        .btn-variant-outline:hover:not(:disabled) {
          border-color: var(--border-neutral-dark);
          background: var(--surface-neutral-hover);
        }
        
        .btn-variant-ghost {
          background: transparent;
          color: var(--text-neutral-body);
          border: none;
        }
        
        .btn-variant-ghost:hover:not(:disabled) {
          background: var(--surface-neutral-hover);
        }
        
        .btn-variant-link {
          background: transparent;
          color: var(--text-primary-default);
          border: none;
          text-decoration: underline;
        }
        
        .btn-variant-link:hover:not(:disabled) {
          color: var(--text-primary-hover);
        }
        
        button:disabled {
          background: var(--surface-neutral-disabled) !important;
          color: var(--text-neutral-disabled) !important;
          border-color: var(--border-neutral-disabled) !important;
          cursor: not-allowed;
        }
        
        button:focus-visible {
          outline: 2px solid var(--border-focus-ring);
          outline-offset: 2px;
        }
      `}</style>
    </>
  );
};

export default Button;