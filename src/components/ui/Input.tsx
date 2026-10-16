// src/components/ui/Input.tsx

import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({
  label,
  error,
  hint,
  required,
  leftIcon,
  rightIcon,
  className,
  id,
  ...props
}, ref) => {
  const inputId = id || label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={inputId} className={cn('form-label', required && 'required')}>
          {label}
        </label>
      )}
      <div style={{ position: 'relative' }}>
        {leftIcon && (
          <span style={{
            position: 'absolute', left: '0.875rem', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--clr-text-3)',
            pointerEvents: 'none',
          }}>
            {leftIcon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn('form-input', error && 'error', className)}
          style={leftIcon ? { paddingLeft: '2.75rem' } : undefined}
          {...props}
        />
        {rightIcon && (
          <span style={{
            position: 'absolute', right: '0.875rem', top: '50%',
            transform: 'translateY(-50%)', color: 'var(--clr-text-3)',
          }}>
            {rightIcon}
          </span>
        )}
      </div>
      {error && <p className="form-error">{error}</p>}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
