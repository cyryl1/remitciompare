import { useState } from 'react';
import { ArrowUpDown, Search, Activity, CalendarDays, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useRateHistory } from '@/hooks/useRates';
import { formatCurrency, formatRate } from '@/lib/utils';
import { PageSpinner } from '@/components/ui/Spinner';
import { useCompareStore } from '@/store/compareStore';

const TIME_RANGES = ['7D', '14D', '30D', '90D', '6M', '1Y'];

export default function RateHistory() {
  const { sendCurrency, receiveCurrency, setParams } = useCompareStore();
  const [fromCur, setFromCur] = useState(sendCurrency);
  const [toCur, setToCur] = useState(receiveCurrency);
  const [range, setRange] = useState('30D');

  const { data: history, isLoading } = useRateHistory({
    sendCurrency: fromCur,
    receiveCurrency: toCur,
    days: parseInt(range) || 30
  });

  const handleSwap = () => {
    setFromCur(toCur);
    setToCur(fromCur);
  };

  const handleUpdate = () => {
    setParams({ sendCurrency: fromCur, receiveCurrency: toCur, sendAmount: 1000 });
  };

  return (
    <PageWrapper className="py-stack-lg min-h-screen">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <header className="mb-stack-lg">
        <h1 className="font-display text-headline-lg text-primary mb-stack-sm">Rate History</h1>
        <p className="text-body-xl text-on-surface-variant max-w-2xl">
          See how remittance rates have changed over time across providers.
        </p>
      </header>

      {/* ── Corridor Selector ─────────────────────────────────────────── */}
      <section className="bg-surface-white rounded-xl shadow-sm border border-outline-variant p-stack-md mb-stack-lg flex flex-col md:flex-row items-center gap-stack-md z-10 relative">
        <div className="flex-1 w-full flex flex-col sm:flex-row items-center gap-4">
          <div className="flex-1 w-full">
            <label className="block text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">You send</label>
            <div className="relative flex items-center bg-surface-container-low border border-outline-variant rounded-lg focus-within:ring-2 focus-within:ring-secondary">
              <span className="pl-3 font-mono text-on-surface font-semibold">1,000</span>
              <input type="text" className="w-full bg-transparent border-none focus:ring-0 py-3 pl-2 pr-4 invisible pointer-events-none" />
              <div className="flex items-center gap-2 pr-3 border-l border-outline-variant pl-3">
                <span className="text-xl">🇬🇧</span>
                <select
                  value={fromCur}
                  onChange={(e) => setFromCur(e.target.value)}
                  className="bg-transparent font-medium text-primary outline-none"
                >
                  <option value="GBP">GBP</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>
          <div className="flex justify-center -mx-2 z-10 mt-6 sm:mt-0">
            <button
              onClick={handleSwap}
              className="w-10 h-10 rounded-full bg-surface-container hover:bg-surface-variant flex items-center justify-center text-primary transition-colors border border-outline-variant shadow-sm"
            >
              <ArrowUpDown size={18} />
            </button>
          </div>
          <div className="flex-1 w-full">
            <label className="block text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Recipient gets</label>
            <div className="relative flex items-center bg-surface-container-low border border-outline-variant rounded-lg focus-within:ring-2 focus-within:ring-secondary">
              <div className="flex-1 py-3 pl-4">
                <span className="font-mono text-on-surface-variant italic">Select provider...</span>
              </div>
              <div className="flex items-center gap-2 pr-3 border-l border-outline-variant pl-3">
                <span className="text-xl">🇳🇬</span>
                <select
                  value={toCur}
                  onChange={(e) => setToCur(e.target.value)}
                  className="bg-transparent font-medium text-primary outline-none"
                >
                  <option value="NGN">NGN</option>
                  <option value="INR">INR</option>
                  <option value="PHP">PHP</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="w-full md:w-auto self-end md:self-auto mt-4 md:mt-0">
          <Button onClick={handleUpdate} size="lg" className="bg-vibrant-green text-deep-navy w-full md:w-auto">
            <Search size={18} className="mr-2" />
            Compare Current Rates
          </Button>
        </div>
      </section>

      {/* ── Main Content Grid ─────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter mb-section-gap">
        {/* Left Column: Chart */}
        <div className="lg:col-span-2 flex flex-col gap-gutter">
          <div className="bg-surface-white rounded-xl shadow-sm border border-outline-variant p-stack-md flex flex-col h-[500px]">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-stack-md gap-4">
              <h2 className="font-display text-headline-sm text-primary">
                {fromCur} → {toCur} Rate History
              </h2>
              {/* Range Toggle */}
              <div className="flex bg-surface-container rounded-lg p-1">
                {TIME_RANGES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setRange(r)}
                    className={`px-3 py-1 text-label-sm rounded-md transition-all ${
                      range === r
                        ? 'bg-surface-white text-primary font-bold shadow-sm'
                        : 'text-on-surface-variant hover:bg-surface-variant'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>

            {/* Chart placeholder */}
            <div className="flex-1 w-full bg-surface-container-lowest rounded-lg border border-outline-variant relative overflow-hidden flex flex-col items-center justify-center">
              {isLoading ? (
                <PageSpinner />
              ) : (
                <>
                  <Activity size={48} className="text-secondary opacity-20 mb-4" />
                  <p className="text-body-md text-on-surface-variant font-medium">Interactive Chart Coming Soon</p>
                  <p className="text-label-sm text-data-gray mt-2">Displaying simulated data for {fromCur}/{toCur} over {range}</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Statistics & Highlights */}
        <div className="lg:col-span-1 flex flex-col gap-gutter">
          {/* Best Time to Send */}
          <div className="bg-primary-container text-on-primary-container rounded-xl p-stack-md shadow-sm border border-primary/20">
            <h3 className="font-display text-headline-sm mb-4 flex items-center gap-2">
              <CalendarDays className="text-primary-fixed" size={20} />
              Best Time to Send
            </h3>
            <p className="text-body-md mb-4">
              Based on historical data for the past 30 days, <span className="font-semibold text-primary">Mid-Month (15th-18th)</span> typically offers the most favorable exchange rates for {fromCur} to {toCur}.
            </p>
          </div>

          {/* Rate Highlights */}
          <div className="bg-surface-white rounded-xl shadow-sm border border-outline-variant p-stack-md">
            <h3 className="font-display text-headline-sm text-primary mb-4 flex items-center gap-2">
              <TrendingUp className="text-vibrant-green" size={20} />
              {range} Highlights
            </h3>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-3 border-b border-surface-variant">
                <span className="text-label-sm text-data-gray uppercase">Highest Rate</span>
                <div className="text-right">
                  <div className="font-mono text-body-md font-bold text-vibrant-green">1,895.50</div>
                  <div className="text-label-sm text-on-surface-variant">Oct 18 • Remitly</div>
                </div>
              </div>
              <div className="flex justify-between items-center pb-3 border-b border-surface-variant">
                <span className="text-label-sm text-data-gray uppercase">Lowest Rate</span>
                <div className="text-right">
                  <div className="font-mono text-body-md font-bold text-error">1,780.20</div>
                  <div className="text-label-sm text-on-surface-variant">Oct 2 • Bank Transfer</div>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-label-sm text-data-gray uppercase">Average (Top 5)</span>
                <div className="font-mono text-body-md font-bold text-primary">1,845.00</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
