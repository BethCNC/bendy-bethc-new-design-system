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
  const sizeClasses = {
    sm: 'input-sm',
    md: 'input-md', 
    lg: 'input-lg'
  };

  const variantClasses = {
    default: 'input-default',
    error: 'input-error',
    warning: 'input-warning',
    success: 'input-success'
  };

  const baseClasses = 'input-base';
  const disabledClasses = disabled ? 'input-disabled' : '';

  return (
    <>
      <input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${disabledClasses} ${className}`.trim()}
        {...ariaProps}
      />
      
      <style jsx>{`
        .input-base {
          width: 100%;
          background: var(--surface-neutral-page);
          border: 1px solid var(--border-neutral-dark);
          border-radius: 4px;
          font-family: 'Overused Grotesk', sans-serif;
          font-size: 18px;
          line-height: 24px;
          font-weight: 400;
          color: var(--text-neutral-heading);
          transition: border-color 0.2s ease;
          box-sizing: border-box;
        }
        
        .input-base::placeholder {
          color: var(--text-neutral-disabled);
        }
        
        .input-md {
          padding: 8px;
          gap: 8px;
        }
        
        .input-sm {
          padding: 6px;
          gap: 6px;
          font-size: 16px;
          line-height: 22px;
        }
        
        .input-lg {
          padding: 10px;
          gap: 10px;
          font-size: 20px;
          line-height: 26px;
        }
        
        .input-default:hover:not(:disabled) {
          border-color: var(--border-primary-default);
        }
        
        .input-default:focus {
          border-color: var(--border-focus-ring);
          outline: none;
        }
        
        .input-error {
          border-color: var(--border-error-default);
        }
        
        .input-warning {
          border-color: var(--border-warning-default);
        }
        
        .input-success {
          border-color: var(--border-success-default);
        }
        
        .input-disabled {
          background: var(--surface-neutral-disabled);
          color: var(--text-neutral-disabled);
          border-color: var(--border-neutral-disabled);
          cursor: not-allowed;
        }
      `}</style>
    </>
  );
};

export default Input;