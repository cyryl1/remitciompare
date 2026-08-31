import { useState } from 'react';
import { useAdminLogs } from '@/hooks/useAdmin';
import { PageSpinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Search, Activity, Filter, Download } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { downloadCSV } from '@/lib/utils';

export default function ActivityLogs() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useAdminLogs({ page, limit, search: search || undefined });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleExportCSV = () => {
    if (!data?.data) return;
    const exportData = data.data.map((log) => ({
      ID: log.id,
      Timestamp: new Date(log.createdAt).toISOString(),
      Action: log.action,
      Entity: log.entity || '',
      EntityID: log.entityId || '',
      IPAddress: log.ipAddress || '',
      UserID: log.userId || '',
    }));
    downloadCSV(exportData, 'activity_logs_export');
  };

  const formatAction = (action: string) => {
    return action.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
  };

  return (
    <>
      <header className="h-20 bg-surface-white border-b border-surface-variant px-gutter flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-display text-headline-sm md:text-headline-md text-primary">Activity Logs</h1>
          <p className="text-body-sm text-on-surface-variant hidden md:block">
            System audit trail for monitoring usage and security events.
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportCSV} disabled={!data || data.data.length === 0}>
            <Download size={16} className="mr-2" />
            Export
          </Button>
        </div>
      </header>

      <div className="p-gutter flex flex-col gap-gutter flex-1 h-full overflow-hidden">
        <div className="bg-surface-white rounded-xl border border-surface-variant shadow-sm flex flex-col flex-1 h-full overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-surface-variant bg-surface-container-lowest flex items-center justify-between gap-4">
            <form onSubmit={handleSearch} className="relative flex-1 max-w-md flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
                <Input 
                  type="text" 
                  placeholder="Search by action, entity, or IP..." 
                  className="pl-10 bg-surface-white w-full"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
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
                    <th className="p-4 font-medium">Action</th>
                    <th className="p-4 font-medium">Entity</th>
                    <th className="p-4 font-medium">IP Address</th>
                    <th className="p-4 font-medium">User ID</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm">
                  {data?.data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                        No activity logs found.
                      </td>
                    </tr>
                  ) : (
                    data?.data.map((log) => (
                      <tr key={log.id} className="border-b border-surface-variant/50 last:border-0 hover:bg-surface-container-lowest transition-colors">
                        <td className="p-4 text-on-surface-variant whitespace-nowrap">
                          {new Date(log.createdAt).toLocaleString()}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Activity size={14} className="text-primary" />
                            <span className="font-medium text-primary">
                              {formatAction(log.action)}
                            </span>
                          </div>
                        </td>
                        <td className="p-4">
                          {log.entity ? (
                            <Badge variant="outline" className="font-mono bg-surface-white border-surface-variant">
                              {log.entity} {log.entityId ? `(${log.entityId.substring(0, 8)}...)` : ''}
                            </Badge>
                          ) : (
                            <span className="text-data-gray">-</span>
                          )}
                        </td>
                        <td className="p-4 text-on-surface-variant font-mono text-xs">
                          {log.ipAddress || 'Unknown'}
                        </td>
                        <td className="p-4 text-on-surface-variant font-mono text-xs">
                          {log.userId ? log.userId.substring(0, 8) + '...' : 'Anonymous'}
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
