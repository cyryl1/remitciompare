import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { History, CalendarDays, ArrowRightLeft, Search, Filter, Plus, ArrowRight, Heart } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageSpinner } from '@/components/ui/Spinner';
import { useComparisonHistory } from '@/hooks/useComparison';
import { formatCurrency } from '@/lib/utils';
import { useCompareStore } from '@/store/compareStore';

export default function CompareHistory() {
  const navigate = useNavigate();
  const { data: history, isLoading } = useComparisonHistory();
  const setParams = useCompareStore(s => s.setParams);

  const [search, setSearch] = useState('');

  const handleRecompare = (item: any) => {
    setParams({
      sendAmount: item.sendAmount,
      sendCurrency: item.sendCurrency,
      receiveCurrency: item.receiveCurrency,
    });
    navigate('/compare/results');
  };

  return (
    <PageWrapper className="py-stack-lg min-h-screen flex flex-col gap-stack-lg md:gap-section-gap w-full">
      {/* ── Page Header & Stats ───────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-md">
        <div>
          <h1 className="font-display text-headline-lg text-primary mb-2">Comparison History</h1>
          <p className="text-body-md text-on-surface-variant">Review your previous comparisons and quickly check current rates again.</p>
          
          <div className="flex flex-wrap gap-4 mt-6">
            <div className="bg-surface-white border border-outline-variant rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
              <History size={16} className="text-outline" />
              <span className="text-label-sm text-on-surface-variant">Total Comparisons:</span>
              <span className="font-mono text-primary font-semibold">{history?.data?.length || 0}</span>
            </div>
            <div className="bg-surface-white border border-outline-variant rounded-lg px-4 py-2 flex items-center gap-2 shadow-sm">
              <CalendarDays size={16} className="text-outline" />
              <span className="text-label-sm text-on-surface-variant">This Month:</span>
              <span className="font-mono text-primary font-semibold">{Math.min(history?.data?.length || 0, 5)}</span>
            </div>
          </div>
        </div>
        <Button onClick={() => navigate('/compare')} size="lg" className="bg-vibrant-green text-deep-navy shadow-sm w-full md:w-auto">
          <Plus size={18} className="mr-2" />
          New Comparison
        </Button>
      </section>

      {/* ── Main Layout: Sidebar & Content ────────────────────────────── */}
      <div className="flex flex-col lg:flex-row gap-gutter">
        {/* Sidebar */}
        <aside className="w-full lg:w-1/4 flex flex-col gap-stack-lg">
          {/* Saved Routes (Mocked) */}
          <div className="bg-surface-white border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h2 className="font-display text-headline-sm text-primary mb-4 flex items-center gap-2">
              <Heart className="text-error fill-error" size={20} />
              Saved Routes
            </h2>
            <ul className="space-y-3">
              <li className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-transparent hover:border-outline-variant transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇬🇧 🇳🇬</span>
                  <span className="font-mono text-sm text-primary font-semibold">GBP → NGN</span>
                </div>
                <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100 group-hover:text-vibrant-green transition-all" />
              </li>
              <li className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border border-transparent hover:border-outline-variant transition-colors group cursor-pointer">
                <div className="flex items-center gap-3">
                  <span className="text-xl">🇺🇸 🇮🇳</span>
                  <span className="font-mono text-sm text-primary font-semibold">USD → INR</span>
                </div>
                <ArrowRight size={16} className="text-primary opacity-0 group-hover:opacity-100 group-hover:text-vibrant-green transition-all" />
              </li>
            </ul>
          </div>

          {/* Filters */}
          <div className="bg-surface-white border border-outline-variant rounded-2xl p-6 shadow-sm">
            <h3 className="font-display text-headline-sm text-primary mb-4 flex items-center gap-2">
              <Filter size={20} />
              Filters
            </h3>
            <div className="space-y-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Search</label>
                <div className="relative">
                  <Search size={18} className="absolute left-3 top-2.5 text-outline" />
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search..."
                    className="w-full pl-10 pr-3 py-2 bg-surface-container-low border border-outline-variant rounded-lg focus-ring text-body-md"
                  />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* History List */}
        <div className="w-full lg:w-3/4 flex flex-col gap-4">
          {isLoading ? (
            <PageSpinner />
          ) : history?.data?.length === 0 ? (
            <div className="text-center py-20 bg-surface-white rounded-2xl border border-outline-variant">
              <History size={48} className="mx-auto text-secondary opacity-20 mb-4" />
              <h3 className="font-display text-headline-sm text-primary mb-2">No history yet</h3>
              <p className="text-body-md text-on-surface-variant mb-6">Compare rates to see your history here.</p>
              <Button className="text-white" onClick={() => navigate('/compare')}>Compare Rates</Button>
            </div>
          ) : (
            history?.data
              ?.filter((item: any) => {
                if (!search) return true;
                const searchLower = search.toLowerCase();
                return (
                  item.sendCurrency.toLowerCase().includes(searchLower) ||
                  item.receiveCurrency.toLowerCase().includes(searchLower) ||
                  (item.bestProviderName && item.bestProviderName.toLowerCase().includes(searchLower))
                );
              })
              .map((item: any) => (
              <div key={item.id} className="bg-surface-white border border-outline-variant rounded-2xl p-5 hover:shadow-card-hover transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 group relative overflow-hidden">
                <div className="absolute left-0 top-0 bottom-0 w-1 bg-outline-variant group-hover:bg-vibrant-green transition-colors" />
                
                <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full pl-3">
                  {/* Route & Date */}
                  <div className="flex flex-col gap-1 min-w-[140px]">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-primary font-semibold">{item.sendCurrency} → {item.receiveCurrency}</span>
                    </div>
                    <span className="text-label-sm text-on-surface-variant">
                      {new Date(item.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  {/* Amount */}
                  <div className="flex flex-col gap-1 flex-1">
                    <span className="text-label-sm text-data-gray uppercase">Sent Amount</span>
                    <span className="font-mono text-body-md font-semibold text-on-surface">
                      {formatCurrency(item.sendAmount, item.sendCurrency)}
                    </span>
                  </div>

                  {/* Top Result */}
                  <div className="flex flex-col gap-1 flex-1 bg-surface-container-lowest p-2 rounded-lg border border-surface-variant">
                    <span className="text-label-sm text-data-gray uppercase">Best Quote Found</span>
                    <div className="flex items-center justify-between">
                      <span className="text-body-sm font-semibold text-primary">{item.bestProviderName || 'Multiple'}</span>
                      <span className="font-mono text-body-sm font-bold text-vibrant-green">
                        {item.bestReceiveAmount?.toLocaleString() || '-'} {item.receiveCurrency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="w-full md:w-auto flex justify-end">
                  <Button variant="outline" size="sm" onClick={() => handleRecompare(item)}>
                    Check Rates Again
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </PageWrapper>
  );
}
