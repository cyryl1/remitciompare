import { Link } from 'react-router-dom';
import { Zap, ArrowRight } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { cn, formatCurrency, formatRate } from '@/lib/utils';
import type { RateResult } from '@/api/rates';

interface RateRowProps {
  result: RateResult;
  sendCurrency: string;
  rank: number;
  className?: string;
}

const BADGE_MAP: Record<string, { label: string; variant: 'success' | 'info' | 'default' }> = {
  best_rate:  { label: 'Best Rate',    variant: 'success' },
  fastest:    { label: 'Fastest',      variant: 'info'    },
  lowest_fee: { label: 'Lowest Fee',   variant: 'success' },
};

export function RateRow({ result, sendCurrency, rank, className }: RateRowProps) {
  const isBest = result.badge === 'best_rate';

  return (
    <div
      className={cn(
        'bg-surface-white rounded-xl p-gutter flex flex-col md:flex-row gap-6 transition-colors hover:bg-slate-50',
        isBest
          ? 'border-2 border-vibrant-green shadow-card relative overflow-hidden'
          : 'border border-outline-variant shadow-card',
        className,
      )}
    >
      {/* Best badge ribbon */}
      {result.badge && BADGE_MAP[result.badge] && (
        <div className="absolute top-0 left-0 bg-vibrant-green text-deep-navy text-label-sm font-bold uppercase tracking-widest px-3 py-1 rounded-br-lg">
          {BADGE_MAP[result.badge].label}
        </div>
      )}

      {/* Provider info */}
      <div
        className={cn(
          'md:w-1/4 flex flex-col justify-center border-b md:border-b-0 md:border-r border-surface-variant pb-4 md:pb-0 pr-0 md:pr-6',
          isBest && 'pt-6 md:pt-0',
        )}
      >
        <div className="h-12 w-28 bg-surface-container-low rounded-lg flex items-center justify-center font-bold text-primary text-title-sm mb-3">
          {result.providerLogo ? (
            <img src={result.providerLogo} alt={result.providerName} className="object-contain w-full h-full p-1" />
          ) : (
            result.providerName.slice(0, 4)
          )}
        </div>
        <span className="text-label-sm text-on-surface-variant">#{rank}</span>
      </div>

      {/* Amounts grid */}
      <div className="flex-grow flex flex-col justify-center">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <p className="text-label-sm text-data-gray uppercase tracking-wide mb-1">Exchange Rate</p>
            <p className="text-body-md font-semibold text-on-surface">
              1 {sendCurrency} = {formatRate(result.exchangeRate)}
            </p>
          </div>
          <div>
            <p className="text-label-sm text-data-gray uppercase tracking-wide mb-1">Transfer Fee</p>
            <p className="text-body-md font-semibold text-on-surface">
              {formatCurrency(result.fee, sendCurrency)}
            </p>
          </div>
          <div className="col-span-2">
            <p className="text-label-sm text-data-gray uppercase tracking-wide mb-1">Delivery</p>
            <p className="text-body-md font-semibold text-on-surface flex items-center gap-1">
              <Zap size={14} className="text-vibrant-green" />
              {result.deliveryTime}
            </p>
          </div>
        </div>

        {/* Recipient gets + CTA */}
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between border-t border-surface-variant pt-4 gap-4">
          <div>
            <p className="text-label-sm text-data-gray uppercase tracking-wide mb-1">Recipient Gets</p>
            <p className="text-headline-sm font-bold text-primary">
              {result.receiveAmount.toLocaleString('en-GB', { minimumFractionDigits: 0 })}
            </p>
          </div>
          <Link
            to={`/providers/${result.providerSlug}/send`}
            state={{ result }}
            className={cn(
              'flex items-center gap-2 px-6 py-3 rounded-lg font-semibold text-label-lg shadow-sm transition-colors',
              isBest
                ? 'bg-vibrant-green text-deep-navy hover:brightness-110'
                : 'bg-primary text-on-primary hover:bg-primary-container',
            )}
          >
            Continue with {result.providerName}
            <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </div>
  );
}
