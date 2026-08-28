import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  ArrowLeftRight, CheckCircle, Zap, Shield,
  Store, RefreshCw, BadgeCheck, ChevronDown, ArrowUpDown,
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
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

const TRUST_ITEMS = [
  { icon: <Store size={20} />, label: 'Compare Top Providers' },
  { icon: <RefreshCw size={20} />, label: 'Real-time Exchange Rates' },
  { icon: <BadgeCheck size={20} />, label: '0% Hidden Fees' },
  { icon: <Shield size={20} />, label: 'Trustworthy & Secure' },
];

const HOW_STEPS = [
  {
    n: '1',
    title: 'Enter transfer details',
    desc: 'Choose your currencies, enter the amount you want to send, and see estimated receiving amounts instantly.',
  },
  {
    n: '2',
    title: 'Compare providers',
    desc: 'View a transparent, live list of exchange rates, transfer fees, and delivery speeds from trusted providers side-by-side.',
  },
  {
    n: '3',
    title: 'Choose & Send',
    desc: "Select the best deal for your needs and securely complete your transfer directly on the provider's platform.",
  },
];

const PROVIDERS = ['Wise', 'Remitly', 'WorldRemit', 'Western Union', 'Revolut', 'Sendwave', 'LemFi', 'Ria'];

export default function Landing() {
  const navigate = useNavigate();
  const { sendAmount, sendCurrency, receiveCurrency, setParams } = useCompareStore();

  const [amount, setAmount]       = useState(sendAmount);
  const [fromCur, setFromCur]     = useState(sendCurrency);
  const [toCur, setToCur]         = useState(receiveCurrency);

  const handleSwap = () => {
    setFromCur(toCur);
    setToCur(fromCur);
  };

  const handleCompare = () => {
    setParams({ sendAmount: amount, sendCurrency: fromCur, receiveCurrency: toCur });
    navigate('/compare/results');
  };

  const fromCurrencyData = CURRENCIES.find((c) => c.code === fromCur);
  const toCurrencyData   = CURRENCIES.find((c) => c.code === toCur);

  return (
    <div className="min-h-screen flex flex-col">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative pt-20 pb-32 overflow-hidden rounded-b-[40px] bg-primary-container">
        <div className="absolute inset-0 bg-gradient-to-b from-primary-container/80 to-primary-container z-0" />
        <div
          className="absolute inset-0 z-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, #9acee1 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />

        <div className="max-w-container-max mx-auto px-gutter relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-section-gap items-center">
          {/* Copy */}
          <div className="text-on-primary animate-fade-in">
            <h1 className="font-display text-display-lg leading-tight mb-stack-md">
              Find the best way to{' '}
              <span className="text-vibrant-green">send your money.</span>
            </h1>
            <p className="text-body-xl text-primary-fixed-dim mb-stack-lg max-w-xl">
              Compare exchange rates, fees, and delivery times from top providers in seconds. Transparent, fast, and free.
            </p>
            <div className="flex flex-wrap gap-4 mt-8">
              {[
                { icon: <CheckCircle size={18} />, label: 'Top Providers' },
                { icon: <Zap size={18} />, label: 'Real-time Rates' },
                { icon: <Shield size={18} />, label: 'No Hidden Fees' },
              ].map(({ icon, label }) => (
                <div key={label} className="flex items-center gap-2 text-primary-fixed-dim">
                  {icon}
                  <span className="text-label-sm font-medium uppercase tracking-wide">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calculator card */}
          <div className="bg-surface-white rounded-2xl shadow-modal p-stack-lg border border-surface-variant w-full max-w-md mx-auto lg:ml-auto animate-slide-up">
            <h3 className="font-display text-headline-sm text-primary mb-stack-md text-center">
              Compare Rates
            </h3>

            <div className="space-y-stack-md">
              {/* Send */}
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-2">You Send</label>
                <div className="flex items-center border border-outline-variant rounded-xl bg-surface-white focus-within:ring-1 focus-within:ring-secondary overflow-hidden">
                  <div className="px-3 py-3 border-r border-outline-variant bg-surface-container-low">
                    <select
                      value={fromCur}
                      onChange={(e) => setFromCur(e.target.value)}
                      className="bg-transparent outline-none text-label-lg font-medium text-primary"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                      ))}
                    </select>
                  </div>
                  <input
                    type="number"
                    min={1}
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="flex-1 bg-transparent outline-none text-body-md text-right text-primary py-3 pr-4 font-mono"
                  />
                </div>
              </div>

              {/* Swap */}
              <div className="flex justify-center -my-1 relative z-10">
                <button
                  onClick={handleSwap}
                  className="bg-surface-white border border-outline-variant rounded-full p-2 text-secondary hover:bg-surface-container-low shadow-sm active:scale-90 transition-transform"
                >
                  <ArrowUpDown size={18} />
                </button>
              </div>

              {/* Receive */}
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-2">Recipient Gets (est.)</label>
                <div className="flex items-center border border-outline-variant rounded-xl bg-surface-container-low overflow-hidden">
                  <div className="px-3 py-3 border-r border-outline-variant bg-surface-container">
                    <select
                      value={toCur}
                      onChange={(e) => setToCur(e.target.value)}
                      className="bg-transparent outline-none text-label-lg font-medium text-primary"
                    >
                      {CURRENCIES.map((c) => (
                        <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                      ))}
                    </select>
                  </div>
                  <span className="flex-1 text-right pr-4 text-body-md text-data-gray font-mono">—</span>
                </div>
              </div>

              <Button fullWidth size="lg" variant="secondary" onClick={handleCompare}>
                Compare Rates
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trust bar ──────────────────────────────────────────────────── */}
      <section className="py-stack-lg bg-surface-white border-b border-surface-variant">
        <div className="max-w-container-max mx-auto px-gutter flex flex-wrap justify-center gap-8 md:gap-16 text-center">
          {TRUST_ITEMS.map(({ icon, label }) => (
            <div key={label} className="flex flex-col items-center gap-2">
              <div className="w-12 h-12 rounded-full bg-primary-container text-primary-fixed flex items-center justify-center">
                {icon}
              </div>
              <span className="text-body-md font-semibold text-primary">{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────────── */}
      <section className="py-section-gap bg-background">
        <div className="max-w-container-max mx-auto px-gutter">
          <div className="text-center mb-stack-lg">
            <h2 className="font-display text-headline-lg text-primary mb-2">How It Works</h2>
            <p className="text-body-md text-on-surface-variant max-w-2xl mx-auto">
              Three simple steps to ensure your money reaches its destination efficiently and cost-effectively.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {HOW_STEPS.map(({ n, title, desc }) => (
              <div
                key={n}
                className="bg-surface-white p-stack-lg rounded-xl border border-surface-variant shadow-card hover:shadow-card-hover transition-shadow relative overflow-hidden group"
              >
                <div className="absolute top-0 right-0 w-24 h-24 bg-surface-container rounded-bl-full opacity-40 -z-10 group-hover:scale-110 transition-transform" />
                <div className="w-12 h-12 bg-secondary-container text-on-secondary-container rounded-xl flex items-center justify-center text-headline-sm font-bold mb-4">
                  {n}
                </div>
                <h3 className="font-display text-headline-sm text-primary mb-2">{title}</h3>
                <p className="text-body-md text-on-surface-variant">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Provider marquee ───────────────────────────────────────────── */}
      <section className="py-stack-lg bg-background overflow-hidden border-b border-surface-variant">
        <div className="text-center mb-stack-md">
          <span className="text-label-sm text-outline uppercase tracking-wider">
            Trusted comparing rates from global leaders
          </span>
        </div>
        <div className="flex overflow-hidden opacity-60 hover:opacity-100 transition-opacity">
          <div
            className="flex gap-16 items-center py-4 whitespace-nowrap"
            style={{ animation: 'marquee 30s linear infinite', minWidth: '200%' }}
          >
            {[...PROVIDERS, ...PROVIDERS].map((name, i) => (
              <span key={i} className="text-headline-sm font-bold text-data-gray">{name}</span>
            ))}
          </div>
        </div>
        <style>{`@keyframes marquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }`}</style>
      </section>

      {/* ── Data section ───────────────────────────────────────────────── */}
      <section className="py-section-gap bg-surface-white border-y border-surface-variant">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 lg:grid-cols-2 gap-section-gap items-center">
          <div>
            <h2 className="font-display text-headline-lg text-primary mb-stack-md">
              Data-driven decisions for your global finances.
            </h2>
            <p className="text-body-md text-on-surface-variant mb-stack-lg">
              We aggregate thousands of data points daily to ensure you always have access to the most precise exchange rates. Stop guessing and start comparing.
            </p>
            <ul className="space-y-4">
              {[
                'Historical rate tracking to time your transfer perfectly.',
                'Breakdown of transfer fees vs. exchange rate markups.',
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <CheckCircle size={18} className="text-vibrant-green mt-0.5 shrink-0" />
                  <span className="text-body-md text-on-surface">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative rounded-2xl overflow-hidden shadow-card-hover border border-outline-variant bg-surface-container aspect-video flex items-center justify-center">
            <div className="w-full h-full bg-gradient-to-br from-primary-container to-primary flex items-center justify-center">
              <ArrowLeftRight size={64} className="text-vibrant-green opacity-60" />
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────────────── */}
      <section className="py-section-gap bg-primary-container text-on-primary text-center">
        <div className="max-w-3xl mx-auto px-gutter">
          <h2 className="font-display text-display-md mb-stack-md">
            Ready to save on your next transfer?
          </h2>
          <p className="text-body-xl text-primary-fixed-dim mb-stack-lg">
            Join thousands of smart senders who compare before they transfer.
          </p>
          <Link
            to="/compare"
            className="inline-flex items-center gap-2 bg-vibrant-green text-deep-navy font-display font-bold text-headline-sm px-8 py-4 rounded-xl shadow-lg hover:brightness-110 active:scale-95 transition-all"
          >
            Start Comparing Now
          </Link>
        </div>
      </section>
    </div>
  );
}
