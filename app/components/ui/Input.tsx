import React from 'react';

interface InputProps {
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  id?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'error' | 'warning' | 'success';
  'aria-describedby'?: string;
}

const Input: React.FC<InputProps> = ({ 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required, 
  disabled = false,
  className = "",
  id,
  size = 'md',
  variant = 'default',
  ...ariaProps
}) => {
  const getSizeClasses = (size: string) => {
    switch (size) {
      case 'sm':
        return 'p-1.5 text-body-sm';
      case 'md':
        return 'p-2 text-body-md';
      case 'lg':
        return 'p-2.5 text-body-lg';
      default:
        return 'p-2 text-body-md';
    }
  };

  const getVariantClasses = (variant: string) => {
    switch (variant) {
      case 'error':
        return 'border-error-default focus:border-error-default';
      case 'warning':
        return 'border-warning-default focus:border-warning-default';
      case 'success':
        return 'border-success-default focus:border-success-default';
      default:
        return 'border-neutral-dark hover:border-primary-default focus:border-border-focus-ring';
    }
  };

  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      required={required}
      disabled={disabled}
      className={`w-full bg-neutral-page border rounded-md font-body text-neutral-heading transition-colors duration-200 focus:outline-none ${getSizeClasses(size)} ${getVariantClasses(variant)} ${disabled ? 'bg-neutral-disabled text-neutral-disabled border-neutral-disabled cursor-not-allowed' : ''} ${className}`.trim()}
      {...ariaProps}
    />
  );
};

export default Input;