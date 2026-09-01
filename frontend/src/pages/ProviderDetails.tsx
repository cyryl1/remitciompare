import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  MapPin, 
  Banknote, 
  Clock, 
  LogIn, 
  LogOut, 
  Search, 
  Wallet, 
  Globe2,
  Building2,
  AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageSpinner } from '@/components/ui/Spinner';
import { useProvider } from '@/hooks/useProviders';
import { ratesApi } from '@/api/rates';

export default function ProviderDetails() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { data: provider, isLoading, isError } = useProvider(slug ?? '');

  const [showForm, setShowForm] = useState(false);
  const [isQuoting, setIsQuoting] = useState(false);
  const [sendAmount, setSendAmount] = useState('500');
  const [sendCur, setSendCur] = useState('GBP');
  const [recCur, setRecCur] = useState('NGN');
  const [quoteError, setQuoteError] = useState('');

  const handleGetQuote = async () => {
    if (!provider) return;
    setIsQuoting(true);
    setQuoteError('');
    try {
      const results = await ratesApi.compare({
        sendAmount: parseFloat(sendAmount) || 500,
        sendCurrency: sendCur,
        receiveCurrency: recCur,
        providerSlug: provider.slug,
      });

      if (results && results.length > 0) {
        const quote = results[0];
        navigate(`/providers/${provider.slug}/send`, {
          state: { result: quote }
        });
      } else {
        setQuoteError('Could not get a quote right now. Please try again later.');
      }
    } catch (err) {
      setQuoteError('An error occurred while fetching the quote.');
    } finally {
      setIsQuoting(false);
    }
  };

  if (isLoading) return <PageSpinner label="Loading provider details..." />;

  if (isError || !provider) {
    return (
      <PageWrapper className="py-20 text-center flex flex-col items-center">
        <AlertCircle size={48} className="text-error mb-4" />
        <h2 className="text-headline-md text-primary mb-2">Provider not found</h2>
        <p className="text-body-md text-on-surface-variant mb-6">
          The provider you are looking for does not exist or has been removed.
        </p>
        <Button onClick={() => navigate('/providers')}>Back to Providers</Button>
      </PageWrapper>
    );
  }

  return (
    <PageWrapper className="py-stack-lg min-h-screen grid grid-cols-1 gap-section-gap w-full">
      {/* ── Breadcrumb ────────────────────────────────────────────────── */}
      <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-label-sm text-on-surface-variant opacity-80">
        <Link to="/providers" className="hover:text-primary transition-colors">Providers</Link>
        <ChevronRight size={14} />
        <span className="text-primary font-semibold">{provider.name}</span>
      </nav>

      {/* ── Hero Card ─────────────────────────────────────────────────── */}
      <section className="bg-surface-white rounded-2xl shadow-card border border-surface-variant p-gutter md:p-section-gap flex flex-col md:flex-row gap-stack-lg items-start md:items-center relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-fixed rounded-full blur-3xl opacity-20 -mr-20 -mt-20" />
        
        <div className="flex-shrink-0 bg-surface-container-low p-6 rounded-xl border border-surface-variant shadow-sm w-32 h-32 flex items-center justify-center z-10">
          {provider.logoUrl ? (
            <img src={provider.logoUrl} alt={provider.name} className="max-w-full max-h-full object-contain" />
          ) : (
            <Building2 size={48} className="text-primary" />
          )}
        </div>

        <div className="flex-grow z-10">
          <div className="flex items-center gap-3 mb-stack-sm">
            <h1 className="font-display text-display-md text-primary">{provider.name}</h1>
            <span className="bg-primary-container text-on-primary-container text-label-sm px-3 py-1 rounded-full font-semibold">
              Transfer Provider
            </span>
          </div>
          <p className="text-body-xl text-on-surface-variant mb-stack-md max-w-2xl">
            {provider.description || `${provider.name} offers fast and secure international money transfers.`}
          </p>

          <div className="flex flex-col sm:flex-row gap-stack-md sm:gap-gutter mb-stack-lg text-body-md text-data-gray">
            <div className="flex items-center gap-2">
              <Globe2 className="text-primary" size={18} />
              <span>Supported destinations: {provider.countries?.length || 0} countries</span>
            </div>
            <div className="flex items-center gap-2">
              <Banknote className="text-primary" size={18} />
              <span>TrustScore: {provider.rating}/5</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="text-primary" size={18} />
              <span>Availability: Route dependent</span>
            </div>
          </div>

          <div className="mt-stack-md">
            {showForm ? (
              <div className="bg-surface-container-low p-6 rounded-xl border border-surface-variant flex flex-col gap-4">
                <h3 className="font-display font-semibold text-primary">Get a live quote</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Input 
                    type="number"
                    label="Amount"
                    value={sendAmount}
                    onChange={e => setSendAmount(e.target.value)}
                    min="1"
                  />
                  <Select 
                    label="Send"
                    value={sendCur}
                    onChange={e => setSendCur(e.target.value)}
                    options={[
                      { value: 'GBP', label: 'GBP - British Pound' },
                      { value: 'USD', label: 'USD - US Dollar' },
                      { value: 'EUR', label: 'EUR - Euro' },
                    ]}
                  />
                  <Select 
                    label="Receive"
                    value={recCur}
                    onChange={e => setRecCur(e.target.value)}
                    options={[
                      { value: 'NGN', label: 'NGN - Nigerian Naira' },
                      { value: 'GHS', label: 'GHS - Ghanaian Cedi' },
                      { value: 'KES', label: 'KES - Kenyan Shilling' },
                    ]}
                  />
                </div>
                {quoteError && <p className="text-error text-sm">{quoteError}</p>}
                <div className="flex gap-4 mt-2">
                  <Button 
                    onClick={handleGetQuote} 
                    disabled={isQuoting}
                    className="flex-1 bg-vibrant-green text-deep-navy hover:brightness-110"
                  >
                    {isQuoting ? 'Getting Quote...' : 'View Transfer Details'}
                  </Button>
                  <Button variant="outline" onClick={() => setShowForm(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg" 
                  className="bg-vibrant-green text-deep-navy hover:brightness-110" 
                  onClick={() => setShowForm(true)}
                >
                  Send with {provider.name}
                </Button>
                <Button variant="outline" size="lg" onClick={() => navigate('/compare')}>
                  Compare All Rates
                </Button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ── Details Grid ──────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Main Content */}
        <div className="lg:col-span-8 flex flex-col gap-gutter">
          <section className="bg-surface-white rounded-2xl shadow-card border border-surface-variant p-gutter">
            <h2 className="font-display text-headline-md text-primary mb-stack-sm">About {provider.name}</h2>
            <p className="text-body-md text-on-surface-variant leading-relaxed">
              {provider.description || `${provider.name} is a global money transfer provider allowing users to send money internationally safely and securely.`}
            </p>
          </section>

          <section className="bg-surface-white rounded-2xl shadow-card border border-surface-variant p-gutter">
            <h2 className="font-display text-headline-md text-primary mb-stack-md">Key Information</h2>
            <dl className="grid grid-cols-1 sm:grid-cols-2 gap-stack-lg">
              <div className="flex flex-col gap-1">
                <dt className="text-label-sm text-data-gray uppercase tracking-wider flex items-center gap-2">
                  <MapPin size={16} /> Supported Countries
                </dt>
                <dd className="text-body-md font-semibold text-primary">
                  {provider.countries?.length > 0 ? provider.countries.join(', ') : 'Global coverage'}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-label-sm text-data-gray uppercase tracking-wider flex items-center gap-2">
                  <Banknote size={16} /> Supported Currencies
                </dt>
                <dd className="text-body-md font-semibold text-primary">
                  {provider.supportedCurrencies.length > 0 ? provider.supportedCurrencies.join(', ') : 'Multiple currencies'}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-label-sm text-data-gray uppercase tracking-wider flex items-center gap-2">
                  <LogIn size={16} /> Pay-in Methods
                </dt>
                <dd className="text-body-md font-semibold text-primary">
                  {provider.features?.join(', ') || 'Various methods'}
                </dd>
              </div>
              <div className="flex flex-col gap-1">
                <dt className="text-label-sm text-data-gray uppercase tracking-wider flex items-center gap-2">
                  <LogOut size={16} /> Pay-out Methods
                </dt>
                <dd className="text-body-md font-semibold text-primary">
                  {provider.deliveryMethods?.join(', ') || 'Various methods'}
                </dd>
              </div>
            </dl>
          </section>

          <section className="bg-surface-white rounded-2xl shadow-card border border-surface-variant p-gutter">
            <h2 className="font-display text-headline-md text-primary mb-stack-md">Why Consider {provider.name}?</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-stack-md">
              <div className="bg-surface-container-low p-stack-md rounded-xl border border-surface-variant">
                <div className="bg-primary-container w-10 h-10 rounded-full flex items-center justify-center text-primary-fixed mb-3">
                  <Search size={20} />
                </div>
                <h3 className="text-body-md font-semibold text-primary mb-1">Transparent Pricing</h3>
                <p className="text-body-sm text-on-surface-variant">See exactly what you pay.</p>
              </div>
              <div className="bg-surface-container-low p-stack-md rounded-xl border border-surface-variant">
                <div className="bg-primary-container w-10 h-10 rounded-full flex items-center justify-center text-primary-fixed mb-3">
                  <Wallet size={20} />
                </div>
                <h3 className="text-body-md font-semibold text-primary mb-1">Secure Transfers</h3>
                <p className="text-body-sm text-on-surface-variant">Bank-level security.</p>
              </div>
              <div className="bg-surface-container-low p-stack-md rounded-xl border border-surface-variant">
                <div className="bg-primary-container w-10 h-10 rounded-full flex items-center justify-center text-primary-fixed mb-3">
                  <Globe2 size={20} />
                </div>
                <h3 className="text-body-md font-semibold text-primary mb-1">Global Coverage</h3>
                <p className="text-body-sm text-on-surface-variant">Send to {provider.countries?.length || 100}+ countries.</p>
              </div>
            </div>
          </section>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-4 flex flex-col gap-gutter">
          <div className="bg-primary-container rounded-2xl p-gutter text-on-primary">
            <h3 className="font-display text-headline-sm mb-4">Ready to transfer?</h3>
            <p className="text-body-md text-primary-fixed-dim mb-6">
              Compare {provider.name}'s real-time exchange rates against other top providers.
            </p>
            <Button fullWidth onClick={() => navigate('/compare')} className="bg-surface-white text-primary hover:bg-surface-container">
              Check Live Rates
            </Button>
          </div>
        </aside>
      </div>
    </PageWrapper>
  );
}
