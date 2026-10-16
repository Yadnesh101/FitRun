// src/components/ui/Select.tsx

import React, { forwardRef } from 'react';
import { cn } from '../../lib/utils';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  hint?: string;
  required?: boolean;
  options: { value: string; label: string }[];
  placeholder?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(({
  label,
  error,
  hint,
  required,
  options,
  placeholder,
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
      <select
        ref={ref}
        id={inputId}
        className={cn('form-select', error && 'error', className)}
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {options.map(opt => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      {error && <p className="form-error">{error}</p>}
      {hint && !error && <p className="form-hint">{hint}</p>}
    </div>
  );
});

Select.displayName = 'Select';

export default Select;
