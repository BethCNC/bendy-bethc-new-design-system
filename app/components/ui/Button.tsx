import React from 'react';

interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'tertiary';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  icon?: React.ComponentType;
  iconPosition?: 'left' | 'right';
  type?: 'button' | 'submit' | 'reset';
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({
  variant = 'primary',
  size = 'md',
  icon: Icon,
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
      {Icon && iconPosition === 'left' && <Icon className="icon" />}
      {children}
      {Icon && iconPosition === 'right' && <Icon className="icon" />}
    </button>
  );
};

export default Button;