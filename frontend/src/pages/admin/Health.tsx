import { useState } from 'react';
import { useAdminHealth } from '@/hooks/useAdmin';
import { PageSpinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Search, Activity, AlertTriangle, RefreshCw } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function Health() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading, refetch, isFetching } = useAdminHealth({ page, limit, search: search || undefined });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const getErrorBadge = (errorType: string) => {
    switch (errorType) {
      case 'TIMEOUT':
        return <Badge variant="warning">Timeout</Badge>;
      case 'SERVICE_UNAVAILABLE':
        return <Badge variant="error">Unavailable</Badge>;
      case 'RATE_LIMIT':
        return <Badge variant="warning">Rate Limited</Badge>;
      case 'INVALID_AUTH':
        return <Badge variant="error">Auth Error</Badge>;
      default:
        return <Badge variant="default">{errorType}</Badge>;
    }
  };

  return (
    <>
      <header className="h-20 bg-surface-white border-b border-surface-variant px-gutter flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-display text-headline-sm md:text-headline-md text-primary">System Health</h1>
          <p className="text-body-sm text-on-surface-variant hidden md:block">
            Monitor API integration stability and view error logs.
          </p>
        </div>
        <div>
          <Button 
            variant="outline" 
            onClick={() => refetch()} 
            disabled={isFetching}
          >
            <RefreshCw size={16} className={`mr-2 ${isFetching ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </header>

      <div className="p-gutter flex flex-col gap-gutter flex-1 h-full overflow-hidden">
        {/* Top Status Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-gutter shrink-0">
          <div className="bg-surface-white p-5 rounded-xl border border-surface-variant shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-vibrant-green/10 flex items-center justify-center text-vibrant-green">
              <Activity size={24} />
            </div>
            <div>
              <p className="text-body-sm text-on-surface-variant">Overall System Status</p>
              <h3 className="font-display text-headline-sm text-primary">Operational</h3>
            </div>
          </div>
          <div className="bg-surface-white p-5 rounded-xl border border-surface-variant shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 rounded-full bg-error-container/50 flex items-center justify-center text-error">
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-body-sm text-on-surface-variant">Errors (Last 24h)</p>
              <h3 className="font-display text-headline-sm text-primary">{data?.total || 0}</h3>
            </div>
          </div>
        </div>

        <div className="bg-surface-white rounded-xl border border-surface-variant shadow-sm flex flex-col flex-1 h-full overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-surface-variant bg-surface-container-lowest flex items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
              <Input 
                type="text" 
                placeholder="Search logs by provider or error type..." 
                className="pl-10 bg-surface-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
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
                    <th className="p-4 font-medium">Timestamp</th>
                    <th className="p-4 font-medium">Provider</th>
                    <th className="p-4 font-medium">Route / Corridor</th>
                    <th className="p-4 font-medium">Error Type</th>
                    <th className="p-4 font-medium">Details</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm">
                  {data?.data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                        No error logs found. The system is healthy!
                      </td>
                    </tr>
                  ) : (
                    data?.data.map((log) => (
                      <tr key={log.id} className="border-b border-surface-variant/50 last:border-0 hover:bg-surface-container-lowest transition-colors">
                        <td className="p-4 text-on-surface-variant whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <span className="font-semibold text-primary capitalize">{log.provider}</span>
                        </td>
                        <td className="p-4">
                          <Badge variant="outline" className="font-mono bg-surface-white border-surface-variant">{log.route}</Badge>
                        </td>
                        <td className="p-4">
                          {getErrorBadge(log.errorType)}
                        </td>
                        <td className="p-4 text-on-surface-variant text-xs max-w-xs truncate" title={log.errorDetail || ''}>
                          {log.errorDetail || 'No additional details provided.'}
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
