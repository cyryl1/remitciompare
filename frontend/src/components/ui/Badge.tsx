import { type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type BadgeVariant = 'default' | 'success' | 'warning' | 'error' | 'info' | 'navy';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: BadgeVariant;
}

const variantClasses: Record<BadgeVariant, string> = {
  default: 'bg-surface-container text-on-surface-variant',
  success: 'bg-vibrant-green/15 text-green-800',
  warning: 'bg-amber-100 text-amber-800',
  error:   'bg-error-container text-on-error-container',
  info:    'bg-primary-fixed text-primary',
  navy:    'bg-deep-navy text-white',
};

export function Badge({ variant = 'default', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-label-sm font-medium',
        variantClasses[variant],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
