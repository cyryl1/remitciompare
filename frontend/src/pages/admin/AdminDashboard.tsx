import { 
  Bell, 
  RefreshCw,
  CheckCircle2,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { useAdminStats, useAdminProviders } from '@/hooks/useAdmin';
import { formatCurrency } from '@/lib/utils';


export default function AdminDashboard() {
  const { data: stats, isLoading: isStatsLoading, refetch: refetchStats } = useAdminStats();
  const { data: providersData, isLoading: isProvidersLoading, refetch: refetchProviders } = useAdminProviders({ limit: 50 });
  
  const isLoading = isStatsLoading || isProvidersLoading;
  
  const handleRefresh = () => {
    refetchStats();
    refetchProviders();
  };

  if (isLoading) {
    return <div className="flex h-[calc(100vh-80px)] items-center justify-center bg-surface"><PageSpinner /></div>;
  }

  return (
    <>
      {/* Header */}
      <header className="h-20 bg-surface-white border-b border-surface-variant px-gutter flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-display text-headline-sm md:text-headline-md text-primary">Platform Overview</h1>
          <p className="text-body-sm text-on-surface-variant hidden md:block">
            Monitor RemitCompare's providers, quotes, users and system health.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-xs text-data-gray hidden sm:block">Last updated just now</span>
          <Button onClick={handleRefresh} variant="primary" className="bg-primary text-on-primary">
            <RefreshCw size={16} className={`mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh Data
          </Button>
        </div>
      </header>

      <div className="p-gutter flex flex-col gap-gutter">
        {/* Top KPI Cards */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-stack-md">
          <div className="bg-surface-white rounded-xl p-5 border border-surface-variant shadow-sm flex flex-col">
            <span className="text-label-sm text-on-surface-variant uppercase mb-2">Total Comparisons (24h)</span>
            <div className="flex items-end gap-3 mb-2">
              <span className="font-display text-headline-lg text-primary">{stats?.comparisonsToday ?? 0}</span>
              <span className="text-label-sm text-vibrant-green font-semibold mb-1 bg-vibrant-green/10 px-1.5 py-0.5 rounded">Today</span>
            </div>
            <span className="text-xs text-data-gray">Total: {stats?.totalComparisons ?? 0}</span>
          </div>

          <div className="bg-surface-white rounded-xl p-5 border border-surface-variant shadow-sm flex flex-col">
            <span className="text-label-sm text-on-surface-variant uppercase mb-2">Active Providers</span>
            <div className="flex items-end gap-3 mb-2">
              <span className="font-display text-headline-lg text-primary">{stats?.activeProviders ?? 0}</span>
              <span className="text-label-sm text-primary font-semibold mb-1 bg-surface-container px-1.5 py-0.5 rounded">/ {stats?.totalProviders ?? 0}</span>
            </div>
            <span className="text-xs text-data-gray">Total integrated providers</span>
          </div>

          <div className="bg-surface-white rounded-xl p-5 border border-surface-variant shadow-sm flex flex-col">
            <span className="text-label-sm text-on-surface-variant uppercase mb-2">System Health</span>
            <div className="flex items-end gap-3 mb-2">
              <span className="font-display text-headline-lg text-primary">100%</span>
            </div>
            <div className="w-full bg-surface-container-low rounded-full h-1.5 mt-1 overflow-hidden">
              <div className="bg-vibrant-green h-1.5 rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>

          <div className="bg-surface-white rounded-xl p-5 border border-surface-variant shadow-sm flex flex-col">
            <span className="text-label-sm text-on-surface-variant uppercase mb-2">Active Alerts</span>
            <div className="flex items-end gap-3 mb-2">
              <span className="font-display text-headline-lg text-primary">{stats?.activeAlerts ?? 0}</span>
              <span className="text-label-sm text-primary mb-1 bg-surface-container px-1.5 py-0.5 rounded">Total: {stats?.totalAlerts ?? 0}</span>
            </div>
            <span className="text-xs text-data-gray">Monitoring rates</span>
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-gutter">
          {/* System Health / API Status */}
          <section className="lg:col-span-2 bg-surface-white border border-surface-variant rounded-xl shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-surface-variant flex justify-between items-center bg-surface-container-lowest">
              <h2 className="font-display text-headline-sm text-primary">API Health Status</h2>
              <Badge variant="success">All Systems Operational</Badge>
            </div>
            <div className="p-4 overflow-y-auto flex-1">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-label-sm text-data-gray uppercase border-b border-surface-variant">
                    <th className="pb-3 font-medium">Provider</th>
                    <th className="pb-3 font-medium">Status</th>
                    <th className="pb-3 font-medium">Latency</th>
                    <th className="pb-3 font-medium text-right">Last Sync</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm">
                  {providersData?.data.map((provider) => (
                    <tr key={provider.id} className="border-b border-surface-variant/50 last:border-0 hover:bg-surface-container-lowest transition-colors">
                      <td className="py-3 font-semibold text-primary">{provider.name}</td>
                      <td className="py-3">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                          provider.isActive ? 'bg-vibrant-green/10 text-vibrant-green-dim' : 'bg-error/10 text-error'
                        }`}>
                          {provider.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                          {provider.isActive ? 'Healthy' : 'Inactive'}
                        </span>
                      </td>
                      <td className="py-3 font-mono">--</td>
                      <td className="py-3 text-right text-on-surface-variant">
                        {provider.lastRateUpdate ? new Date(provider.lastRateUpdate).toLocaleTimeString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Recent Alerts Activity */}
          <section className="lg:col-span-1 bg-surface-white border border-surface-variant rounded-xl shadow-sm overflow-hidden flex flex-col h-[500px]">
            <div className="p-4 border-b border-surface-variant bg-surface-container-lowest flex justify-between items-center">
              <h2 className="font-display text-headline-sm text-primary">Recent Alert Triggers</h2>
              <button className="text-primary hover:bg-surface-container p-1 rounded transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              <ul className="space-y-4">
                {stats?.recentAlerts?.length === 0 ? (
                  <li className="text-sm text-on-surface-variant">No recent alerts triggered.</li>
                ) : null}
                {stats?.recentAlerts?.map((alert) => (
                  <li key={alert.id} className="flex gap-3 items-start pb-4 border-b border-surface-variant last:border-0">
                    <div className="w-8 h-8 rounded-full bg-vibrant-green/10 text-vibrant-green-dim flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bell size={14} />
                    </div>
                    <div>
                      <p className="text-body-sm font-semibold text-primary">Target reached for {alert.user.email}</p>
                      <p className="text-xs text-on-surface-variant mt-1">
                        {alert.fromCurrency} → {alert.toCurrency} target <span className="font-mono">{formatCurrency(alert.targetRecipientAmount, alert.toCurrency)}</span> met by <strong>{alert.triggeredProvider || 'Unknown'}</strong>
                      </p>
                      <span className="text-[10px] text-data-gray block mt-1">
                        {alert.lastTriggeredAt ? new Date(alert.lastTriggeredAt).toLocaleString() : ''}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        </div>
      </div>
    </>
  );
}
