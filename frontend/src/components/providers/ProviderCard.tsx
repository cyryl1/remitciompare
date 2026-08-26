import { Link } from 'react-router-dom';
import { Star, ArrowUpRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import type { Provider } from '@/api/providers';

interface ProviderCardProps {
  provider: Provider;
  className?: string;
}

export function ProviderCard({ provider, className }: ProviderCardProps) {
  return (
    <Card
      hover
      className={cn('flex flex-col gap-4', className)}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3">
        <div className="w-16 h-10 rounded-lg bg-surface-container-low flex items-center justify-center overflow-hidden shrink-0">
          {provider.logo ? (
            <img src={provider.logo} alt={provider.name} className="object-contain w-full h-full p-1" />
          ) : (
            <span className="text-title-sm font-bold text-primary">{provider.name.slice(0, 2)}</span>
          )}
        </div>

        {provider.isFeatured && (
          <Badge variant="navy">Featured</Badge>
        )}
      </div>

      {/* Name + tagline */}
      <div>
        <h3 className="text-title-md text-on-surface font-semibold">{provider.name}</h3>
        {provider.tagline && (
          <p className="text-label-sm text-on-surface-variant mt-0.5">{provider.tagline}</p>
        )}
      </div>

      {/* Rating */}
      <div className="flex items-center gap-1.5">
        <Star size={14} className="text-vibrant-green fill-vibrant-green" />
        <span className="text-label-lg font-semibold text-on-surface">{provider.rating.toFixed(1)}</span>
        <span className="text-label-sm text-on-surface-variant">({provider.reviewCount.toLocaleString()})</span>
      </div>

      {/* Delivery methods */}
      <div className="flex flex-wrap gap-1.5">
        {provider.deliveryMethods.slice(0, 3).map((m) => (
          <Badge key={m} variant="default">{m}</Badge>
        ))}
      </div>

      {/* CTA */}
      <Link
        to={`/providers/${provider.slug}`}
        className="mt-auto flex items-center justify-between px-4 py-2.5 rounded-lg border border-outline-variant text-label-lg font-medium text-secondary hover:bg-surface-container-low transition-colors"
      >
        View Details
        <ArrowUpRight size={15} />
      </Link>
    </Card>
  );
}
