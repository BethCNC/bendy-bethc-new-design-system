import React from 'react';

interface LabelProps {
  htmlFor?: string;
  required?: boolean;
  children: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Label: React.FC<LabelProps> = ({
  htmlFor,
  required = false,
  children,
  className = '',
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'text-body-sm',
    md: 'text-body-md', 
    lg: 'text-body-lg'
  };

  return (
    <label
      htmlFor={htmlFor}
      className={`${sizeClasses[size]} font-weight-medium text-text-neutral-heading mb-1 block ${className}`}
    >
      {children}
      {required && <span className="text-text-error ml-1" aria-label="required">*</span>}
    </label>
  );
};

export default Label;