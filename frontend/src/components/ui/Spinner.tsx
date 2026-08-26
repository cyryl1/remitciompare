import { cn } from '@/lib/utils';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  label?: string;
}

const sizeMap = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };

export function Spinner({ size = 'md', className, label = 'Loading…' }: SpinnerProps) {
  return (
    <div role="status" aria-label={label} className={cn('flex items-center justify-center', className)}>
      <span
        className={cn(
          'rounded-full border-2 border-outline-variant border-t-primary animate-spin-slow',
          sizeMap[size],
        )}
      />
      <span className="sr-only">{label}</span>
    </div>
  );
}

export function PageSpinner({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
      <Spinner size="lg" label={label} />
      {label !== 'Loading…' && <span className="text-body-sm text-data-gray">{label}</span>}
    </div>
  );
}
