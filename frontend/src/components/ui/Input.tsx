import { forwardRef, type InputHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'prefix'> {
  label?: string;
  error?: string;
  hint?: string;
  prefix?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, prefix, suffix, className, id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={inputId} className="text-label-lg text-on-surface-variant">
            {label}
          </label>
        )}
        <div
          className={cn(
            'flex items-center gap-2 h-12 px-4 rounded-xl border bg-surface-white transition-colors',
            error
              ? 'border-error-red focus-within:ring-1 focus-within:ring-error-red'
              : 'border-outline-variant focus-within:border-primary focus-within:ring-1 focus-within:ring-primary',
          )}
        >
          {prefix && <span className="text-on-surface-variant shrink-0">{prefix}</span>}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'flex-1 bg-transparent outline-none text-body-md text-on-surface placeholder:text-outline',
              className,
            )}
            {...props}
          />
          {suffix && <span className="text-on-surface-variant shrink-0">{suffix}</span>}
        </div>
        {(error || hint) && (
          <p className={cn('text-label-sm', error ? 'text-error-red' : 'text-on-surface-variant')}>
            {error ?? hint}
          </p>
        )}
      </div>
    );
  },
);

Input.displayName = 'Input';
