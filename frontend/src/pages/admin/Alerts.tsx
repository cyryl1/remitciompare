import { useState } from 'react';
import { useAdminAlerts, useAdminCheckAlerts } from '@/hooks/useAdmin';
import { PageSpinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Search, BellRing, User, Clock } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function Alerts() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useAdminAlerts({ page, limit, search: search || undefined });
  const checkAlerts = useAdminCheckAlerts();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge variant="outline" className="text-vibrant-green border-vibrant-green bg-vibrant-green/10">Active</Badge>;
      case 'TRIGGERED':
        return <Badge variant="outline" className="text-primary border-primary bg-primary/10">Triggered</Badge>;
      case 'PAUSED':
        return <Badge variant="outline" className="text-on-surface-variant border-surface-variant">Paused</Badge>;
      case 'EXPIRED':
        return <Badge variant="outline" className="text-error border-error bg-error/10">Expired</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <>
      <header className="h-20 bg-surface-white border-b border-surface-variant px-gutter flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-display text-headline-sm md:text-headline-md text-primary">Alerts Monitoring</h1>
          <p className="text-body-sm text-on-surface-variant hidden md:block">
            Monitor active user rate alerts and trigger history.
          </p>
        </div>
      </header>

      <div className="p-gutter flex flex-col gap-gutter flex-1 h-full overflow-hidden">
        <div className="bg-surface-white rounded-xl border border-surface-variant shadow-sm flex flex-col flex-1 h-full overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-surface-variant bg-surface-container-lowest flex items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
              <Input 
                type="text" 
                placeholder="Search by user email or name..." 
                className="pl-10 bg-surface-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                onClick={() => checkAlerts.mutate()}
                disabled={checkAlerts.isPending}
              >
                <BellRing size={16} className={`mr-2 ${checkAlerts.isPending ? 'animate-bounce' : ''}`} />
                {checkAlerts.isPending ? 'Checking...' : 'Force Check Now'}
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="flex-1 overflow-auto">
            {isLoading ? (
              <div className="flex justify-center items-center h-40">
                <PageSpinner />
              </div>
            ) : (
              <table className="w-full text-left">
                <thead className="sticky top-0 bg-surface-container-lowest z-10 shadow-sm">
                  <tr className="text-label-sm text-data-gray uppercase border-b border-surface-variant">
                    <th className="p-4 font-medium">User</th>
                    <th className="p-4 font-medium">Corridor</th>
                    <th className="p-4 font-medium">Target</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Last Checked</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm">
                  {data?.data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                        No alerts found.
                      </td>
                    </tr>
                  ) : (
                    data?.data.map((alert) => (
                      <tr key={alert.id} className="border-b border-surface-variant/50 last:border-0 hover:bg-surface-container-lowest transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <User size={14} className="text-on-surface-variant" />
                            <span className="font-medium text-primary">
                              {alert.user.fullName || alert.user.email}
                            </span>
                          </div>
                          {alert.user.fullName && (
                            <div className="text-xs text-on-surface-variant ml-6">
                              {alert.user.email}
                            </div>
                          )}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono bg-surface-white text-[10px] py-0">{alert.fromCurrency}</Badge>
                            <span className="text-data-gray text-xs">→</span>
                            <Badge variant="outline" className="font-mono bg-surface-white text-[10px] py-0">{alert.toCurrency}</Badge>
                          </div>
                        </td>
                        <td className="p-4">
                          <div className="font-semibold text-primary">
                            Target: {alert.targetRecipientAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} {alert.toCurrency}
                          </div>
                          <div className="text-xs text-on-surface-variant mt-1">
                            Sending: {alert.sendAmount} {alert.fromCurrency}
                          </div>
                        </td>
                        <td className="p-4">
                          {getStatusBadge(alert.status)}
                        </td>
                        <td className="p-4">
                          <div className="flex flex-col gap-1 text-xs text-on-surface-variant">
                            {alert.lastCheckedAt ? (
                              <div className="flex items-center gap-1">
                                <Clock size={12} />
                                Checked: {new Date(alert.lastCheckedAt).toLocaleString()}
                              </div>
                            ) : (
                              <span className="italic">Never checked</span>
                            )}
                            {alert.lastTriggeredAt && (
                              <div className="flex items-center gap-1 text-primary">
                                <BellRing size={12} />
                                Triggered: {new Date(alert.lastTriggeredAt).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            )}
          </div>

          {/* Pagination */}
          {data && data.total > limit && (
            <div className="p-4 border-t border-surface-variant bg-surface-container-lowest flex items-center justify-between">
              <span className="text-sm text-on-surface-variant">
                Showing {((page - 1) * limit) + 1} to {Math.min(page * limit, data.total)} of {data.total}
              </span>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  Previous
                </Button>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setPage(p => p + 1)}
                  disabled={page * limit >= data.total}
                >
                  Next
                </Button>
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}
