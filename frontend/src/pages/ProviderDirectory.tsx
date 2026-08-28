import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, PlaneTakeoff, PlaneLanding, Search, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageSpinner } from '@/components/ui/Spinner';
import { useProviders } from '@/hooks/useProviders';

export default function ProviderDirectory() {
  const [search, setSearch] = useState('');
  const [sendCur, setSendCur] = useState('GBP');
  const [recvCur, setRecvCur] = useState('NGN');
  const [queryParams, setQueryParams] = useState<any>({});
  
  const { data: providers, isLoading } = useProviders(queryParams);

  const handleCheckAvailability = () => {
    setQueryParams({ sendCurrency: sendCur, receiveCurrency: recvCur });
  };

  const filteredProviders = providers?.data?.filter(
    (p: any) =>
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.description?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex-grow flex flex-col bg-surface min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="bg-primary-container text-on-primary pt-section-gap pb-12 px-gutter relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 1px)', backgroundSize: '32px 32px' }} />

        <div className="max-w-container-max mx-auto relative z-10 text-center md:text-left flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-2xl">
            <h1 className="font-display text-display-lg mb-stack-md text-white">Money Transfer Providers</h1>
            <p className="text-body-xl text-on-primary-container mb-stack-lg max-w-xl">
              Explore providers, compare their coverage, and find the right option for your transfer with precision.
            </p>
            <Link to="/compare">
              <Button size="lg" className="bg-vibrant-green text-deep-navy hover:brightness-110">
                Compare Rates
              </Button>
            </Link>
          </div>

          {/* Quick Availability Card */}
          <div className="bg-surface-white/90 backdrop-blur rounded-2xl p-6 w-full max-w-md shadow-card border border-white/20 text-on-surface">
            <h3 className="font-display text-headline-sm text-primary mb-4">Check Availability</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Send From</label>
                <div className="relative">
                  <PlaneTakeoff className="absolute left-3 top-1/2 -translate-y-1/2 text-data-gray" size={18} />
                  <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-white text-primary focus-ring">
                    <option value="GBP">United Kingdom (GBP)</option>
                    <option value="USD">United States (USD)</option>
                    <option value="EUR">Germany (EUR)</option>
                    <option value="EUR">France (EUR)</option>
                    <option value="EUR">Spain (EUR)</option>
                    <option value="EUR">Italy (EUR)</option>
                    <option value="CAD">Canada (CAD)</option>
                    <option value="AUD">Australia (AUD)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-label-sm text-on-surface-variant mb-1 uppercase tracking-wider">Send To</label>
                <div className="relative">
                  <PlaneLanding className="absolute left-3 top-1/2 -translate-y-1/2 text-data-gray" size={18} />
                  <select className="w-full pl-10 pr-4 py-3 rounded-lg border border-outline-variant bg-surface-white text-primary focus-ring">
                    <option value="NGN">Nigeria (NGN)</option>
                    <option value="INR">India (INR)</option>
                    <option value="GHS">Ghana (GHS)</option>
                    <option value="KES">Kenya (KES)</option>
                    <option value="PHP">Philippines (PHP)</option>
                    <option value="PKR">Pakistan (PKR)</option>
                    <option value="ZAR">South Africa (ZAR)</option>
                  </select>
                </div>
              </div>
              <Button fullWidth className="text-white">Show Providers</Button>
            </div>
          </div>
        </div>
      </section>

      <PageWrapper className="py-section-gap w-full grid grid-cols-1 gap-stack-lg">
        {/* ── Toolbar ─────────────────────────────────────────────────── */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <h2 className="font-display text-headline-md text-primary">All Providers</h2>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-outline" size={18} />
            <input
              type="text"
              placeholder="Search providers..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full md:w-72 pl-10 pr-4 py-2 bg-surface-white border border-outline-variant rounded-lg focus-ring text-body-md"
            />
          </div>
        </div>

        {/* ── Grid ────────────────────────────────────────────────────── */}
        {isLoading ? (
          <PageSpinner label="Loading providers..." />
        ) : filteredProviders?.length === 0 ? (
          <div className="text-center py-20">
            <h3 className="text-headline-sm font-semibold text-primary mb-2">No providers found</h3>
            <p className="text-body-md text-on-surface-variant">Try a different search term.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProviders?.map((provider: any) => (
              <Link
                key={provider.id}
                to={`/providers/${provider.slug}`}
                className="bg-surface-white rounded-xl p-6 border border-outline-variant shadow-sm hover:shadow-card-hover hover:border-vibrant-green transition-all group flex flex-col"
              >
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-surface-container-low rounded-lg p-2 flex items-center justify-center flex-shrink-0">
                    {provider.logoUrl ? (
                      <img src={provider.logoUrl} alt={provider.name} className="max-w-full max-h-full object-contain" />
                    ) : (
                      <span className="font-display font-bold text-headline-sm text-primary">{provider.name.slice(0, 2)}</span>
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-semibold text-headline-sm text-primary flex items-center gap-1">
                      {provider.name}
                      {provider.isFeatured && <CheckCircle2 size={16} className="text-vibrant-green" />}
                    </h3>
                    <p className="text-label-sm text-on-surface-variant">TrustScore: {provider.rating}/5</p>
                  </div>
                </div>

                <p className="text-body-sm text-on-surface-variant line-clamp-2 mb-6 flex-grow">
                  {provider.description || `${provider.name} offers fast and secure international money transfers.`}
                </p>

                <div className="flex items-center justify-between text-secondary group-hover:text-primary transition-colors">
                  <span className="text-label-sm font-semibold">View details & rates</span>
                  <ArrowRight size={18} className="transform group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        )}
      </PageWrapper>
    </div>
  );
}
