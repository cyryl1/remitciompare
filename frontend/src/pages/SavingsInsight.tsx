import { useState } from 'react';
import { TrendingUp, Search, PiggyBank, ArrowRightLeft } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { formatCurrency } from '@/lib/utils';

export default function SavingsInsight() {
  const [timeframe, setTimeframe] = useState('This Year');
  const timeframes = ['This Month', '3 Months', '6 Months', 'This Year', 'All Time'];

  return (
    <PageWrapper className="py-section-gap flex flex-col gap-stack-lg min-h-screen">
      {/* ── Page Hero & Time Selector ─────────────────────────────────── */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 border-b border-surface-variant pb-8">
        <div className="max-w-2xl">
          <h1 className="font-display text-headline-lg text-primary mb-4">Your RemitCompare Insights</h1>
          <p className="text-body-xl text-on-surface-variant">
            See how your transfer decisions have helped you get more value from every send.
          </p>
        </div>
        <div className="flex bg-surface-container-low p-1 rounded-lg shadow-inner overflow-x-auto w-full md:w-auto">
          {timeframes.map((tf) => (
            <button
              key={tf}
              onClick={() => setTimeframe(tf)}
              className={`px-4 py-2 text-label-sm whitespace-nowrap rounded-md transition-colors ${
                timeframe === tf
                  ? 'bg-surface-white text-primary shadow-sm font-semibold'
                  : 'text-on-surface-variant hover:text-primary'
              }`}
            >
              {tf}
            </button>
          ))}
        </div>
      </header>

      {/* ── Key Metrics Bento Grid ────────────────────────────────────── */}
      <section className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Potential Savings Hero Card */}
        <div className="md:col-span-6 bg-primary text-on-primary rounded-xl p-8 flex flex-col justify-between shadow-sm relative overflow-hidden">
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-vibrant-green opacity-10 rounded-full blur-3xl" />
          
          <div>
            <h2 className="text-label-sm uppercase tracking-wider text-primary-fixed-dim mb-2">Total Potential Savings</h2>
            <div className="font-display text-display-lg mb-4">
              {formatCurrency(128450, 'NGN')}
            </div>
          </div>
          
          <div className="inline-flex items-center gap-2 bg-on-primary-fixed-variant/20 border border-vibrant-green/30 px-3 py-1.5 rounded-full self-start">
            <TrendingUp size={16} className="text-vibrant-green" />
            <span className="text-label-sm text-vibrant-green font-semibold">+8.4% better value</span>
          </div>
        </div>

        {/* Supporting Cards Grid */}
        <div className="md:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Comparisons Made */}
          <div className="bg-surface-white rounded-xl p-6 border border-surface-variant shadow-sm flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-label-sm text-on-surface-variant uppercase">Comparisons Made</h3>
              <Search size={20} className="text-data-gray" />
            </div>
            <div className="font-display text-headline-lg text-primary">14</div>
            <p className="text-label-sm text-data-gray mt-2">Across 4 routes</p>
          </div>

          {/* Average Saving */}
          <div className="bg-surface-white rounded-xl p-6 border border-surface-variant shadow-sm flex flex-col justify-center">
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-label-sm text-on-surface-variant uppercase">Average Saving</h3>
              <PiggyBank size={20} className="text-data-gray" />
            </div>
            <div className="font-display text-headline-lg text-primary">{formatCurrency(9175, 'NGN')}</div>
            <p className="text-label-sm text-data-gray mt-2">Per transfer</p>
          </div>

          {/* Total Compared */}
          <div className="sm:col-span-2 bg-surface-white rounded-xl p-6 border border-surface-variant shadow-sm flex justify-between items-center">
            <div>
              <h3 className="text-label-sm text-on-surface-variant uppercase mb-2">Total Value Compared</h3>
              <div className="font-display text-headline-lg text-primary">{formatCurrency(8500, 'GBP')}</div>
            </div>
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center">
              <ArrowRightLeft size={32} className="text-primary" />
            </div>
          </div>
        </div>
      </section>
    </PageWrapper>
  );
}
