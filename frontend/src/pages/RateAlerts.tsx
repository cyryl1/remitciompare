import { useState } from 'react';
import { Bell, ArrowRight, Clock, PauseCircle, Edit2, Trash2, CheckCircle2, ChevronDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { PageSpinner } from '@/components/ui/Spinner';
import { useAlerts, useCreateAlert, useDeleteAlert, useToggleAlert } from '@/hooks/useAlerts';
import { formatCurrency } from '@/lib/utils';
import type { CreateAlertDto } from '@/api/alerts';

export default function RateAlerts() {
  const { data: alerts, isLoading } = useAlerts();
  const createAlert = useCreateAlert();
  const toggleAlert = useToggleAlert();
  const deleteAlert = useDeleteAlert();

  const [formData, setFormData] = useState<CreateAlertDto>({
    sendCurrency: 'GBP',
    receiveCurrency: 'NGN',
    sendAmount: 1000,
    targetRate: 0,
    targetReceiveAmount: 0,
  });

  const activeCount = alerts?.filter(a => a.status === 'active').length || 0;
  const triggeredCount = alerts?.filter(a => a.status === 'triggered').length || 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createAlert.mutate(formData, {
      onSuccess: () => {
        setFormData({ ...formData, targetRate: 0, targetReceiveAmount: 0 });
      }
    });
  };

  return (
    <PageWrapper className="py-stack-lg min-h-screen flex flex-col gap-section-gap w-full">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-stack-lg border-b border-surface-variant pb-stack-lg">
        <div className="max-w-2xl">
          <span className="text-label-sm text-secondary uppercase tracking-wider mb-stack-sm block font-bold">
            RATE MONITORING
          </span>
          <h1 className="font-display text-headline-lg text-primary mb-stack-sm">Never miss a better rate.</h1>
          <p className="text-body-md text-on-surface-variant">
            Set target exchange rates for your preferred routes. We monitor top providers 24/7 and alert you instantly when your target is reached.
          </p>
        </div>
        
        <div className="flex flex-col gap-stack-sm min-w-[200px]">

          <div className="flex items-center justify-between bg-surface-white rounded-lg p-3 border border-outline-variant shadow-sm">
            <div className="flex flex-col items-center">
              <span className="font-mono font-bold text-primary">{activeCount}</span>
              <span className="text-[10px] uppercase text-data-gray">Active</span>
            </div>
            <div className="w-px h-8 bg-outline-variant" />
            <div className="flex flex-col items-center">
              <span className="font-mono font-bold text-vibrant-green">{triggeredCount}</span>
              <span className="text-[10px] uppercase text-data-gray">Triggered</span>
            </div>
            <div className="w-px h-8 bg-outline-variant" />
            <div className="flex flex-col items-center">
              <span className="font-mono font-bold text-primary">{alerts?.length || 0}</span>
              <span className="text-[10px] uppercase text-data-gray">Total</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Main Two Column Layout ────────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
        {/* Left Column: Active Alerts */}
        <div className="lg:col-span-7 flex flex-col gap-stack-lg">
          <h2 className="font-display text-headline-sm text-primary border-b border-surface-variant pb-2">
            Your Rate Alerts
          </h2>

          {isLoading ? (
            <PageSpinner />
          ) : alerts?.length === 0 ? (
            <div className="bg-surface-white rounded-xl p-8 border border-outline-variant text-center">
              <Bell size={48} className="mx-auto text-secondary opacity-20 mb-4" />
              <h3 className="font-display text-headline-sm text-primary mb-2">No active alerts</h3>
              <p className="text-body-md text-on-surface-variant">Create an alert on the right to start monitoring rates.</p>
            </div>
          ) : (
            alerts?.map((alert) => (
              <article
                key={alert.id}
                className={`bg-surface-white rounded-xl border p-stack-lg flex flex-col gap-stack-md relative overflow-hidden transition-all ${
                  alert.status === 'triggered'
                    ? 'border-vibrant-green border-2 shadow-sm'
                    : 'border-outline-variant hover:shadow-card-hover'
                }`}
              >
                {alert.status === 'triggered' && (
                  <div className="absolute inset-0 bg-vibrant-green opacity-[0.03] pointer-events-none" />
                )}

                {/* Status Badge */}
                <div className={`absolute top-4 right-4 text-[10px] font-bold uppercase tracking-wide px-2 py-1 rounded flex items-center gap-1 ${
                  alert.status === 'triggered' ? 'bg-vibrant-green text-deep-navy' :
                  alert.status === 'active' ? 'bg-primary-container text-primary-fixed' :
                  'bg-surface-variant text-on-surface-variant'
                }`}>
                  {alert.status === 'triggered' && <CheckCircle2 size={12} />}
                  {alert.status === 'triggered' ? 'Target Reached' : 
                   alert.status === 'active' ? 'Active Monitoring' : 'Paused'}
                </div>

                {/* Route Header */}
                <div className="flex items-center gap-3 mb-2 mt-2">
                  <div className="font-mono text-primary font-semibold">
                    {formatCurrency(alert.sendAmount, alert.sendCurrency)} to {alert.receiveCurrency}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface-container-lowest p-4 rounded-lg border border-surface-variant">
                  <div>
                    <div className="text-label-sm text-data-gray uppercase mb-1">Target Amount</div>
                    <div className="font-mono text-headline-sm font-bold text-secondary">
                      {formatCurrency(alert.targetReceiveAmount, alert.receiveCurrency)}
                    </div>
                  </div>
                  <div>
                    <div className="text-label-sm text-data-gray uppercase mb-1">Current Best</div>
                    <div className="font-mono text-headline-sm font-bold text-primary">
                      {/* Would normally pull current live rate, mocked here */}
                      {formatCurrency(alert.targetReceiveAmount * 0.98, alert.receiveCurrency)}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-between items-center mt-2 pt-4 border-t border-surface-variant">
                  <div className="flex items-center gap-1 text-[12px] text-data-gray">
                    <Clock size={14} />
                    Last checked 5 min ago
                  </div>
                  <div className="flex gap-4">
                    <button
                      onClick={() => toggleAlert.mutate(alert.id)}
                      className="text-data-gray hover:text-primary transition-colors flex items-center gap-1 text-[12px] font-medium"
                    >
                      <PauseCircle size={16} /> {alert.status === 'active' ? 'Pause' : 'Resume'}
                    </button>
                    <button
                      onClick={() => deleteAlert.mutate(alert.id)}
                      className="text-data-gray hover:text-error transition-colors flex items-center gap-1 text-[12px] font-medium"
                    >
                      <Trash2 size={16} /> Delete
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        {/* Right Column: Create Alert Form */}
        <aside className="lg:col-span-5">
          <div className="bg-surface-white rounded-2xl shadow-card border border-outline-variant p-6 sticky top-24">
            <h2 className="font-display text-headline-sm text-primary mb-6 flex items-center gap-2">
              <Plus size={20} className="text-vibrant-green" />
              New Alert
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1">You send</label>
                  <div className="border border-outline-variant rounded-lg p-2 bg-surface-container-low flex items-center gap-2">
                    <select
                      value={formData.sendCurrency}
                      onChange={(e) => setFormData({ ...formData, sendCurrency: e.target.value })}
                      className="bg-transparent font-semibold text-primary outline-none"
                    >
                      <option value="GBP">GBP</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-label-sm text-on-surface-variant mb-1">Recipient gets</label>
                  <div className="border border-outline-variant rounded-lg p-2 bg-surface-container-low flex items-center gap-2">
                    <select
                      value={formData.receiveCurrency}
                      onChange={(e) => setFormData({ ...formData, receiveCurrency: e.target.value })}
                      className="bg-transparent font-semibold text-primary outline-none"
                    >
                      <option value="NGN">NGN</option>
                      <option value="INR">INR</option>
                      <option value="PHP">PHP</option>
                    </select>
                  </div>
                </div>
              </div>

              <Input
                label="Send Amount"
                type="number"
                required
                value={formData.sendAmount}
                onChange={(e) => setFormData({ ...formData, sendAmount: Number(e.target.value) })}
              />

              <Input
                label={`Target Receive Amount (${formData.receiveCurrency})`}
                type="number"
                required
                value={formData.targetReceiveAmount || ''}
                onChange={(e) => setFormData({ ...formData, targetReceiveAmount: Number(e.target.value) })}
                hint="We'll email you when any provider offers this amount or more."
              />

              <Button type="submit" fullWidth loading={createAlert.isPending} className="text-white">
                Set Alert
              </Button>
            </form>
          </div>
        </aside>
      </div>
    </PageWrapper>
  );
}
