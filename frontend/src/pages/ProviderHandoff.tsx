import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { ArrowRight, ArrowLeft, ExternalLink, ShieldCheck, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageWrapper } from '@/components/layout/PageWrapper';
import type { RateResult } from '@/api/rates';
import { formatCurrency, formatRate } from '@/lib/utils';

export default function ProviderHandoff() {
  const location = useLocation();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5);
  
  const result = location.state?.result as RateResult | undefined;

  useEffect(() => {
    if (!result) return;
    
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      // Actually redirect here in a real app, e.g. window.location.href = result.providerLink
      console.log('Redirecting to:', result.providerName);
    }
  }, [countdown, result]);

  if (!result) {
    return (
      <PageWrapper className="py-20 text-center">
        <h2 className="text-headline-md text-primary mb-4">No transfer details found</h2>
        <Button onClick={() => navigate('/compare')}>Return to Compare</Button>
      </PageWrapper>
    );
  }

  // hardcoded for demo, we'd normally pass the actual currencies through state
  const sendCur = 'GBP'; 
  const recCur = 'NGN';
  // we don't have sendAmount in RateResult, let's derive it or hardcode for demo
  const sendAmount = 1000; 

  return (
    <PageWrapper className="py-stack-lg min-h-screen flex flex-col items-center w-full">
      <div className="w-full max-w-3xl flex flex-col gap-stack-lg">
        {/* ── Header ────────────────────────────────────────────────────── */}
        <div className="flex flex-col gap-stack-sm w-full">
          <div className="flex items-center gap-2 text-label-sm text-on-surface-variant">
            <Link to="/compare/results" className="hover:text-primary transition-colors">Comparison Results</Link>
            <ChevronRight size={14} />
            <span className="font-semibold text-primary">{result.providerName}</span>
          </div>
          <h1 className="font-display text-headline-lg text-primary">Review your transfer</h1>
          <p className="text-body-md text-on-surface-variant">Check the details below before continuing to {result.providerName}.</p>
        </div>

        {/* ── Provider Card ─────────────────────────────────────────────── */}
        <div className="bg-surface-white rounded-2xl shadow-sm border border-outline-variant p-stack-lg flex items-center justify-between">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-xl border border-outline-variant bg-surface-container flex items-center justify-center overflow-hidden flex-shrink-0">
              {result.providerLogo ? (
                <img src={result.providerLogo} alt={result.providerName} className="object-contain p-2" />
              ) : (
                <span className="font-display font-bold text-headline-sm">{result.providerName.slice(0, 2)}</span>
              )}
            </div>
            <div className="flex flex-col">
              <h2 className="font-display text-headline-sm text-primary">{result.providerName}</h2>
              <span className="text-label-sm text-data-gray uppercase tracking-wider">Verified Provider</span>
            </div>
          </div>
        </div>

        {/* ── Summary Card ──────────────────────────────────────────────── */}
        <div className="bg-surface-white rounded-2xl shadow-card border border-outline-variant p-stack-lg relative overflow-hidden flex flex-col gap-stack-lg">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary-container to-vibrant-green" />
          <h3 className="font-display text-headline-sm text-primary border-b border-surface-variant pb-4">
            Your transfer
          </h3>

          <div className="flex flex-col md:flex-row items-stretch justify-between gap-6">
            <div className="flex-1 flex flex-col gap-2 p-4 bg-surface rounded-xl border border-surface-variant relative">
              <span className="text-label-sm text-data-gray uppercase">You Send ({sendCur})</span>
              <span className="font-mono text-headline-sm text-primary font-bold">
                {formatCurrency(sendAmount, sendCur)}
              </span>
            </div>
            <div className="flex items-center justify-center text-primary-container opacity-50 my-auto">
              <ArrowRight size={32} className="hidden md:block" />
              <ArrowRight size={32} className="md:hidden rotate-90" />
            </div>
            <div className="flex-1 flex flex-col gap-2 p-4 bg-primary-container rounded-xl border border-primary relative shadow-inner">
              <span className="text-label-sm text-primary-fixed uppercase">Recipient Gets ({recCur})</span>
              <span className="font-mono text-headline-md text-surface-white font-bold">
                {result.receiveAmount.toLocaleString('en-GB', { minimumFractionDigits: 0 })}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-surface-variant">
            <div className="flex flex-col gap-1">
              <span className="text-label-sm text-data-gray uppercase">Exchange Rate</span>
              <span className="font-mono text-body-md text-on-surface font-semibold">
                1 {sendCur} = {formatRate(result.exchangeRate)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-label-sm text-data-gray uppercase">Transfer Fee</span>
              <span className="font-mono text-body-md text-on-surface font-semibold">
                {formatCurrency(result.fee, sendCur)}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-label-sm text-data-gray uppercase">Delivery Time</span>
              <span className="text-body-md text-on-surface font-semibold">{result.deliveryTime}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-label-sm text-data-gray uppercase">TrustScore</span>
              <span className="text-body-md text-on-surface font-semibold flex items-center gap-1">
                <ShieldCheck size={16} className="text-vibrant-green" />
                9.5/10
              </span>
            </div>
          </div>
        </div>

        {/* ── Redirect Card ─────────────────────────────────────────────── */}
        <div className="bg-primary-container rounded-2xl p-stack-lg text-center flex flex-col items-center">
          <div className="w-16 h-16 rounded-full bg-surface-white flex items-center justify-center shadow-md mb-4 text-primary font-display text-headline-md font-bold">
            {countdown}
          </div>
          <h3 className="font-display text-headline-sm text-on-primary mb-2">
            Taking you to {result.providerName}
          </h3>
          <p className="text-body-md text-primary-fixed-dim mb-6 max-w-md">
            You are being securely redirected to complete your transfer on the provider's official platform.
          </p>
          <div className="flex gap-4">
            <Button variant="secondary" className="bg-surface-white text-primary hover:bg-surface-container" onClick={() => setCountdown(0)}>
              Go now <ExternalLink size={16} className="ml-2" />
            </Button>
            <Button variant="outline" className="text-surface-white border-white/20 hover:bg-white/10" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} className="mr-2" /> Cancel
            </Button>
          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
