import React from 'react';
import Label from './Label';
import Input from './Input';

interface FieldProps {
  label?: string;
  required?: boolean;
  error?: string;
  warning?: string;
  success?: string;
  hint?: string;
  children?: React.ReactNode;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  // Input props
  type?: string;
  value?: string;
  onChange?: (value: string) => void;
  placeholder?: string;
  id?: string;
}

const Field: React.FC<FieldProps> = ({
  label,
  required = false,
  error,
  warning,
  success,
  hint,
  children,
  className = '',
  size = 'md',
  disabled = false,
  // Input props
  type,
  value,
  onChange,
  placeholder,
  id
}) => {
  const fieldId = id || `field-${Math.random().toString(36).substr(2, 9)}`;
  const messageId = `${fieldId}-message`;
  
  // Determine variant based on state
  const getVariant = () => {
    if (error) return 'error';
    if (warning) return 'warning';
    if (success) return 'success';
    return 'default';
  };

  const getMessage = () => {
    if (error) return error;
    if (warning) return warning;
    if (success) return success;
    return hint;
  };

  const getMessageColor = () => {
    if (error) return 'text-text-error';
    if (warning) return 'text-text-warning';
    if (success) return 'text-text-success';
    return 'text-text-neutral-subtle';
  };

  const message = getMessage();
  const variant = getVariant();

  return (
    <div className={`field-container space-y-1 ${className}`}>
      {label && (
        <Label htmlFor={fieldId} required={required} size={size}>
          {label}
        </Label>
      )}
      
      <div className="relative">
        {children || (
          <Input
            id={fieldId}
            type={type}
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            required={required}
            disabled={disabled}
            size={size}
            variant={variant}
            aria-describedby={message ? messageId : undefined}
            aria-invalid={error ? 'true' : 'false'}
          />
        )}
      </div>
      
      {message && (
        <p 
          id={messageId}
          className={`text-body-sm ${getMessageColor()} mt-1`}
          role={error ? 'alert' : undefined}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Field;