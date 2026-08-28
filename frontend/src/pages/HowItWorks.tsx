import { Link } from 'react-router-dom';
import { Search, ListFilter, ArrowRight, MousePointerClick, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function HowItWorks() {
  return (
    <div className="flex-grow flex flex-col bg-surface min-h-screen">
      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="py-section-gap px-gutter text-center bg-surface-white border-b border-surface-variant overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-stack-md relative z-10">
          <span className="inline-block px-3 py-1 bg-surface-container-low text-primary font-label-sm rounded-full tracking-widest uppercase">
            How RemitCompare Works
          </span>
          <h1 className="font-display text-display-lg text-primary">
            Compare before you send.
          </h1>
          <p className="text-body-xl text-on-surface-variant max-w-2xl mx-auto">
            See exchange rates, fees, delivery times and how much your recipient will actually receive — all in one place.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-stack-md pt-stack-sm">
            <Link to="/compare">
              <Button size="lg" className="bg-vibrant-green text-deep-navy hover:brightness-110">
                Compare Rates
              </Button>
            </Link>
            <Link to="/providers">
              <Button variant="outline" size="lg">
                View Providers
              </Button>
            </Link>
          </div>
        </div>

        {/* Conceptual Diagram */}
        <div className="max-w-5xl mx-auto mt-section-gap relative">
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-surface-white z-10 pointer-events-none" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter bg-surface-container-low p-gutter rounded-2xl border border-surface-variant relative z-0">
            {/* Source */}
            <div className="flex flex-col items-center justify-center space-y-4 relative">
              <div className="w-16 h-16 rounded-full bg-surface-white shadow-sm flex items-center justify-center border border-surface-variant z-10">
                <span className="font-mono text-headline-md text-primary">£</span>
              </div>
              <span className="text-label-sm text-on-surface-variant uppercase">You Send (GBP)</span>
              <div className="hidden md:block absolute top-8 left-1/2 w-full h-[2px] bg-outline-variant -z-10" />
            </div>
            {/* Comparison */}
            <div className="bg-surface-white p-6 rounded-xl shadow-sm border border-surface-variant space-y-4 relative z-10">
              <div className="flex items-center justify-between border-b border-surface-variant pb-2">
                <span className="text-label-sm text-data-gray">Provider A</span>
                <span className="font-mono text-body-md text-primary font-bold">₦ 1,450.00</span>
              </div>
              <div className="flex items-center justify-between border-b border-surface-variant pb-2">
                <span className="text-label-sm text-data-gray">Provider B</span>
                <span className="font-mono text-body-md text-primary font-bold">₦ 1,480.00</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-label-sm text-vibrant-green font-semibold">Remitly (Best)</span>
                <span className="font-mono text-body-md text-vibrant-green font-bold">₦ 1,510.00</span>
              </div>
            </div>
            {/* Destination */}
            <div className="flex flex-col items-center justify-center space-y-4 relative">
              <div className="w-16 h-16 rounded-full bg-primary-container shadow-sm flex items-center justify-center border border-primary z-10">
                <span className="font-mono text-headline-md text-primary-fixed">₦</span>
              </div>
              <span className="text-label-sm text-on-surface-variant uppercase">They Receive (NGN)</span>
              <div className="hidden md:block absolute top-8 right-1/2 w-full h-[2px] bg-outline-variant -z-10" />
            </div>
          </div>
        </div>
      </section>

      {/* ── Steps ─────────────────────────────────────────────────────── */}
      <section className="py-section-gap px-gutter max-w-4xl mx-auto w-full">
        <h2 className="font-display text-headline-lg text-primary text-center mb-section-gap">
          Three steps to a smarter transfer
        </h2>

        <div className="space-y-stack-lg relative">
          {/* Timeline Line */}
          <div className="hidden md:block absolute top-0 bottom-0 left-12 w-0.5 bg-surface-variant" />

          {/* Step 1 */}
          <div className="flex flex-col md:flex-row gap-stack-lg relative">
            <div className="w-24 h-24 rounded-full bg-primary-container border-4 border-surface text-primary-fixed flex items-center justify-center flex-shrink-0 z-10 mx-auto md:mx-0 shadow-sm">
              <Search size={32} />
            </div>
            <div className="flex-grow text-center md:text-left bg-surface-white p-stack-lg rounded-2xl border border-surface-variant shadow-sm">
              <span className="text-label-sm text-secondary uppercase tracking-widest font-bold block mb-2">Step 1</span>
              <h3 className="font-display text-headline-md text-primary mb-3">Tell us your route</h3>
              <p className="text-body-md text-on-surface-variant">
                Select your sending country, receiving country, and the amount you want to transfer. We don't ask for any personal information to run a basic comparison.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex flex-col md:flex-row gap-stack-lg relative">
            <div className="w-24 h-24 rounded-full bg-primary-container border-4 border-surface text-primary-fixed flex items-center justify-center flex-shrink-0 z-10 mx-auto md:mx-0 shadow-sm">
              <ListFilter size={32} />
            </div>
            <div className="flex-grow text-center md:text-left bg-surface-white p-stack-lg rounded-2xl border border-surface-variant shadow-sm">
              <span className="text-label-sm text-secondary uppercase tracking-widest font-bold block mb-2">Step 2</span>
              <h3 className="font-display text-headline-md text-primary mb-3">Compare your options</h3>
              <p className="text-body-md text-on-surface-variant">
                We instantly query real-time data from top verified global money transfer providers. We show you the actual exchange rates, transfer fees, and the exact amount your recipient will receive.
              </p>
              <ul className="mt-4 space-y-2 text-body-sm text-on-surface text-left max-w-sm mx-auto md:mx-0">
                <li className="flex items-center gap-2"><ArrowRight size={16} className="text-vibrant-green" /> Sort by best value</li>
                <li className="flex items-center gap-2"><ArrowRight size={16} className="text-vibrant-green" /> Sort by fastest delivery time</li>
                <li className="flex items-center gap-2"><ArrowRight size={16} className="text-vibrant-green" /> Filter by payment method (card, bank transfer, etc.)</li>
              </ul>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex flex-col md:flex-row gap-stack-lg relative">
            <div className="w-24 h-24 rounded-full bg-primary-container border-4 border-surface text-primary-fixed flex items-center justify-center flex-shrink-0 z-10 mx-auto md:mx-0 shadow-sm">
              <MousePointerClick size={32} />
            </div>
            <div className="flex-grow text-center md:text-left bg-surface-white p-stack-lg rounded-2xl border border-surface-variant shadow-sm">
              <span className="text-label-sm text-secondary uppercase tracking-widest font-bold block mb-2">Step 3</span>
              <h3 className="font-display text-headline-md text-primary mb-3">Click and transfer</h3>
              <p className="text-body-md text-on-surface-variant">
                Once you find the best deal, click the button to be securely redirected to the provider's official website. You'll complete your transaction directly with them — we simply point you in the right direction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ or Trust Section ──────────────────────────────────────── */}
      <section className="py-section-gap bg-surface-white border-t border-surface-variant">
        <div className="max-w-container-max mx-auto px-gutter grid grid-cols-1 md:grid-cols-2 gap-stack-lg items-center">
          <div>
            <h2 className="font-display text-headline-lg text-primary mb-4">Independent and Free</h2>
            <p className="text-body-md text-on-surface-variant mb-6">
              RemitCompare is completely free to use. We make money by receiving a small commission from the providers if you choose to use their service through our links. This never affects the rate you receive or how we rank the providers — we always show you the best deal first.
            </p>
            <div className="flex items-center gap-4 text-primary font-semibold">
              <ShieldCheck className="text-vibrant-green" size={24} />
              100% Data Security & Privacy
            </div>
          </div>
          <div className="bg-surface-container rounded-2xl p-stack-lg border border-outline-variant text-center">
             <h3 className="font-display text-headline-sm text-primary mb-4">Start saving on your next transfer</h3>
             <Link to="/compare">
               <Button size="lg" fullWidth className="text-white">Compare Rates Now</Button>
             </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
