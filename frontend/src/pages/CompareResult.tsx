import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { RefreshCw, Filter, AlertCircle, Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { RateRow } from '@/components/providers/RateRow';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useCompareStore } from '@/store/compareStore';
import { useCompareRates } from '@/hooks/useRates';
import { formatRate } from '@/lib/utils';

type SortOption = 'value' | 'speed' | 'fee';

export default function CompareResult() {
  const navigate = useNavigate();
  const params = useCompareStore();
  const { data: rates, isLoading, isError, refetch, isFetching } = useCompareRates(params);

  const [sort, setSort] = useState<SortOption>('value');

  const sortedRates = useMemo(() => {
    if (!rates) return [];
    return [...rates].sort((a, b) => {
      if (sort === 'value') return b.receiveAmount - a.receiveAmount;
      if (sort === 'fee') return a.fee - b.fee;
      // speed sort is complex, let's just leave it basic for MVP
      return 0;
    });
  }, [rates, sort]);

  if (!params.hasSearched) {
    // If they landed here directly without searching, send them back
    navigate('/compare');
    return null;
  }

  return (
    <div className="flex-grow flex flex-col bg-surface min-h-screen">
      {/* ── Subheader / Search Summary ────────────────────────────────── */}
      <div className="bg-surface-white border-b border-surface-variant py-4 sticky top-20 z-40 shadow-sm">
        <div className="max-w-container-max mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-4 text-primary font-display font-semibold text-headline-sm">
            <span className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              {params.sendAmount.toLocaleString('en-GB')} {params.sendCurrency}
            </span>
            <ArrowRightIcon className="text-secondary opacity-50" />
            <span className="flex items-center gap-2">
              <span className="text-2xl">🌍</span>
              {params.receiveCurrency}
            </span>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate('/compare')}>
            <Edit2 size={14} />
            Edit transfer
          </Button>
        </div>
      </div>

      <PageWrapper className="flex-grow py-section-gap w-full grid grid-cols-1 gap-stack-lg">
        {/* ── Header & Toolbar ────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end border-b border-surface-variant pb-4 gap-4">
          <div>
            <h1 className="font-display text-headline-lg text-primary mb-2">Compare Providers</h1>
            <p className="text-body-md text-on-surface-variant flex items-center gap-2">
              {rates?.length ?? 0} providers compared
              <span className="w-1 h-1 rounded-full bg-data-gray" />
              Updated just now
            </p>
          </div>
          <div className="flex items-center gap-4">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value as SortOption)}
              className="bg-surface-white border border-outline-variant rounded-lg px-4 py-2 text-label-sm text-on-surface focus-ring appearance-none"
            >
              <option value="value">Sort by: Best Value</option>
              <option value="speed">Sort by: Fastest</option>
              <option value="fee">Sort by: Lowest Fee</option>
            </select>
            <Button variant="outline" size="sm">
              <Filter size={16} /> Filters
            </Button>
            <button
              onClick={() => refetch()}
              className={`text-secondary hover:text-primary transition-colors ${isFetching ? 'animate-spin-slow' : ''}`}
              title="Refresh Rates"
            >
              <RefreshCw size={20} />
            </button>
          </div>
        </div>

        {/* ── Content ─────────────────────────────────────────────────── */}
        {isLoading ? (
          <PageSpinner label="Fetching best rates..." />
        ) : isError ? (
          <div className="bg-error-container p-6 rounded-xl flex items-center gap-4">
            <AlertCircle className="text-error" size={32} />
            <div>
              <h3 className="text-headline-sm font-semibold text-error mb-1">Failed to fetch rates</h3>
              <p className="text-body-md text-on-error-container">Please try again later.</p>
            </div>
            <Button variant="danger" className="ml-auto" onClick={() => refetch()}>Retry</Button>
          </div>
        ) : sortedRates.length === 0 ? (
          <div className="text-center py-20 bg-surface-white rounded-xl border border-outline-variant">
            <h3 className="text-headline-sm font-semibold text-primary mb-2">No routes found</h3>
            <p className="text-body-md text-on-surface-variant">
              We couldn't find any providers supporting transfers from {params.sendCurrency} to {params.receiveCurrency}.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {sortedRates.map((rate, idx) => (
              <RateRow
                key={rate.providerId}
                result={rate}
                sendCurrency={params.sendCurrency}
                rank={idx + 1}
              />
            ))}
          </div>
        )}
      </PageWrapper>
    </div>
  );
}

function ArrowRightIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={`w-6 h-6 ${className}`}>
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
