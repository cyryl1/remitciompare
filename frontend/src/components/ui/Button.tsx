import { forwardRef, type ButtonHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

type Variant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type Size    = 'sm' | 'md' | 'lg';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  fullWidth?: boolean;
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-primary text-on-primary hover:bg-primary-container active:scale-[0.98] shadow-sm',
  secondary:
    'bg-vibrant-green text-deep-navy font-semibold hover:brightness-110 active:scale-[0.98] shadow-sm',
  outline:
    'border border-outline text-on-surface bg-transparent hover:bg-surface-container-low',
  ghost:
    'bg-transparent text-primary hover:bg-surface-container-low',
  danger:
    'bg-error text-on-error hover:bg-red-800 active:scale-[0.98]',
};

const sizeClasses: Record<Size, string> = {
  sm: 'h-8 px-3 text-label-sm rounded',
  md: 'h-10 px-5 text-label-lg rounded-lg',
  lg: 'h-12 px-6 text-title-sm rounded-xl',
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      fullWidth = false,
      className,
      disabled,
      children,
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 font-medium transition-all duration-150 focus-ring select-none',
          variantClasses[variant],
          sizeClasses[size],
          fullWidth && 'w-full',
          (disabled || loading) && 'opacity-50 cursor-not-allowed pointer-events-none',
          className,
        )}
        {...props}
      >
        {loading ? (
          <span className="w-4 h-4 rounded-full border-2 border-current border-t-transparent animate-spin-slow" />
        ) : null}
        {children}
      </button>
    );
  },
);

Button.displayName = 'Button';
