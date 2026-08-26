import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowDown, ArrowUpDown } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useCompareStore } from '@/store/compareStore';

const CURRENCIES = [
  { code: 'GBP', flag: '🇬🇧', name: 'British Pound' },
  { code: 'USD', flag: '🇺🇸', name: 'US Dollar' },
  { code: 'EUR', flag: '🇪🇺', name: 'Euro' },
  { code: 'NGN', flag: '🇳🇬', name: 'Nigerian Naira' },
  { code: 'GHS', flag: '🇬🇭', name: 'Ghanaian Cedi' },
  { code: 'KES', flag: '🇰🇪', name: 'Kenyan Shilling' },
  { code: 'INR', flag: '🇮🇳', name: 'Indian Rupee' },
  { code: 'PKR', flag: '🇵🇰', name: 'Pakistani Rupee' },
  { code: 'ZAR', flag: '🇿🇦', name: 'South African Rand' },
  { code: 'PHP', flag: '🇵🇭', name: 'Philippine Peso' },
];

const QUICK_AMOUNTS: Record<string, number[]> = {
  GBP: [100, 500, 1000, 2000],
  USD: [100, 500, 1000, 2000],
  EUR: [100, 500, 1000, 2000],
};

export default function Compare() {
  const navigate = useNavigate();
  const { sendAmount: storeAmount, sendCurrency: storeSend, receiveCurrency: storeReceive, setParams } =
    useCompareStore();

  const [amount, setAmount]   = useState(storeAmount);
  const [fromCur, setFromCur] = useState(storeSend);
  const [toCur, setToCur]     = useState(storeReceive);

  const quickAmounts = QUICK_AMOUNTS[fromCur] ?? [100, 500, 1000, 2000];
  const fromData     = CURRENCIES.find((c) => c.code === fromCur);
  const toData       = CURRENCIES.find((c) => c.code === toCur);

  const handleSwap = () => {
    setFromCur(toCur);
    setToCur(fromCur);
  };

  const handleCompare = () => {
    setParams({ sendAmount: amount, sendCurrency: fromCur, receiveCurrency: toCur });
    navigate('/compare/results');
  };

  return (
    <main className="flex-grow flex flex-col items-center justify-center py-section-gap">
      <PageWrapper narrow className="w-full">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-stack-lg">
          <p className="text-label-sm text-secondary uppercase tracking-widest mb-stack-sm font-semibold">
            Compare Money Transfers
          </p>
          <h1 className="font-display text-headline-lg text-primary mb-stack-sm">
            Find the best way to send your money.
          </h1>
          <p className="text-body-md text-on-surface-variant">
            Enter your transfer details and compare available providers by exchange rate, fees, recipient amount and delivery time.
          </p>
        </div>

        {/* Form card */}
        <div className="bg-surface-white rounded-2xl shadow-card border border-outline-variant w-full max-w-3xl mx-auto p-stack-lg relative">

          {/* Amount section */}
          <div className="mb-stack-lg">
            <p className="text-label-sm text-on-surface-variant uppercase tracking-wider mb-stack-sm font-semibold">
              Your Transfer
            </p>
            <div className="flex flex-col md:flex-row gap-gutter items-end">
              {/* Amount input */}
              <div className="w-full md:w-2/3">
                <label className="block text-label-sm text-on-surface-variant mb-2">I want to send</label>
                <input
                  type="number"
                  value={amount}
                  min={1}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  aria-label="Amount to send"
                  className="w-full font-display text-display-md text-primary border-0 border-b-2 border-surface-variant focus:border-secondary focus:ring-0 bg-transparent pb-2 outline-none"
                />
              </div>
              {/* From currency */}
              <div className="w-full md:w-1/3">
                <label className="block text-label-sm text-on-surface-variant mb-2">Currency</label>
                <div className="border-b-2 border-surface-variant pb-2">
                  <select
                    value={fromCur}
                    onChange={(e) => setFromCur(e.target.value)}
                    className="w-full bg-transparent outline-none text-body-md font-medium text-primary"
                  >
                    {CURRENCIES.map((c) => (
                      <option key={c.code} value={c.code}>{c.flag} {c.code} — {c.name}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Quick amount pills */}
            <div className="flex gap-2 mt-stack-md flex-wrap">
              {quickAmounts.map((q) => (
                <button
                  key={q}
                  onClick={() => setAmount(q)}
                  className={`px-3 py-1 text-label-sm rounded-full transition-colors ${
                    amount === q
                      ? 'bg-primary-container text-primary font-semibold'
                      : 'bg-surface-container text-primary hover:bg-surface-variant'
                  }`}
                >
                  {fromData?.flag} {q.toLocaleString()}
                </button>
              ))}
            </div>
          </div>

          {/* Divider with down arrow */}
          <div className="relative border-t border-surface-variant my-stack-lg">
            <div className="absolute left-1/2 -top-4 -translate-x-1/2 bg-surface-white border border-surface-variant rounded-full p-1.5">
              <ArrowDown size={16} className="text-secondary" />
            </div>
          </div>

          {/* Destination section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-stack-lg">
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-2">Sending from</label>
              <div className="border border-outline-variant rounded-xl p-3 flex items-center gap-2 bg-surface-container-low">
                <span className="text-xl">{fromData?.flag ?? '🌍'}</span>
                <span className="text-body-md text-primary">{fromData?.name ?? fromCur}</span>
              </div>
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-2">Sending to</label>
              <div className="border border-outline-variant rounded-xl p-3 flex items-center gap-2 bg-surface-container-low">
                <span className="text-xl">{toData?.flag ?? '🌍'}</span>
                <select
                  value={toCur}
                  onChange={(e) => setToCur(e.target.value)}
                  className="flex-1 bg-transparent outline-none text-body-md text-primary"
                >
                  {CURRENCIES.filter((c) => c.code !== fromCur).map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.name}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-2">Recipient receives</label>
              <div className="border border-outline-variant rounded-xl p-3 flex items-center gap-2 bg-surface-container-low">
                <span className="text-body-md text-primary">{toCur} — {toData?.name}</span>
              </div>
            </div>
          </div>

          {/* Swap button */}
          <div className="flex items-center gap-2 mb-stack-lg cursor-pointer text-secondary hover:text-primary transition-colors w-fit" onClick={handleSwap}>
            <ArrowUpDown size={16} />
            <span className="text-label-sm font-medium">Swap currencies</span>
          </div>

          <Button fullWidth size="lg" onClick={handleCompare}>
            Compare Rates
          </Button>
        </div>

        {/* Trust message */}
        <p className="mt-stack-lg text-center text-label-sm text-on-surface-variant opacity-70">
          RemitCompare helps you compare providers. We don't hold or transfer your money.
          Rates may change — always confirm the final quote with the provider before sending.
        </p>
      </PageWrapper>
    </main>
  );
}
