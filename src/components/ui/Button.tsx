// src/components/ui/Button.tsx

import React from 'react';
import { cn } from '../../lib/utils';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  loading?: boolean;
  block?: boolean;
  as?: 'button' | 'a';
  href?: string;
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  block = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  const classes = cn(
    'btn',
    `btn-${variant}`,
    size !== 'md' && `btn-${size}`,
    block && 'btn-block',
    className
  );

  return (
    <button className={classes} disabled={disabled || loading} {...props}>
      {loading && <span className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />}
      {children}
    </button>
  );
}

export default Button;
