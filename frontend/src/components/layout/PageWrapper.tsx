import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  narrow?: boolean; // max-w-3xl for auth / focused pages
}

export function PageWrapper({ children, className, narrow = false }: PageWrapperProps) {
  return (
    <div
      className={cn(
        'mx-auto px-gutter py-stack-lg',
        narrow ? 'max-w-3xl' : 'max-w-container-max',
        className,
      )}
    >
      {children}
    </div>
  );
}
