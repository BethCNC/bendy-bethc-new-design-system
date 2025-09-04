import React from 'react';

interface InputProps {
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

const Input: React.FC<InputProps> = ({ 
  type = "text", 
  value, 
  onChange, 
  placeholder, 
  required, 
  className = "" 
}) => {
  return (
    <input
      type={type}
      value={value}
      onChange={(e) => onChange?.(e.target.value)}
      placeholder={placeholder}
      required={required}
      className={`input-field padding-sm bg-surface-neutral-card text-neutral-body border-default border-radius-md ${className}`}
    />
  );
};

export default Input;