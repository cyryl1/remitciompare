import { forwardRef, type SelectHTMLAttributes } from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: SelectOption[];
  error?: string;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, options, error, className, id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="flex flex-col gap-1">
        {label && (
          <label htmlFor={selectId} className="text-label-lg text-on-surface-variant">
            {label}
          </label>
        )}
        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'w-full h-12 pl-4 pr-10 rounded-xl border bg-surface-white text-body-md text-on-surface appearance-none outline-none transition-colors',
              error
                ? 'border-error-red focus:ring-1 focus:ring-error-red'
                : 'border-outline-variant focus:border-primary focus:ring-1 focus:ring-primary',
              className,
            )}
            {...props}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown
            size={16}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-on-surface-variant pointer-events-none"
          />
        </div>
        {error && <p className="text-label-sm text-error-red">{error}</p>}
      </div>
    );
  },
);

Select.displayName = 'Select';
