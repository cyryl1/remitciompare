import { useState } from 'react';
import { useAdminQuotes } from '@/hooks/useAdmin';
import { PageSpinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { formatCurrency } from '@/lib/utils';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';

export default function QuoteMonitoring() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const limit = 20;

  const { data, isLoading } = useAdminQuotes({ page, limit, search: search || undefined });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  return (
    <>
      <header className="h-20 bg-surface-white border-b border-surface-variant px-gutter flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-display text-headline-sm md:text-headline-md text-primary">Quote Monitoring</h1>
          <p className="text-body-sm text-on-surface-variant hidden md:block">
            Monitor real-time user comparison queries and generated quotes.
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
                placeholder="Search by currency, country..." 
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
                    <th className="p-4 font-medium">User</th>
                    <th className="p-4 font-medium">Corridor</th>
                    <th className="p-4 font-medium">Amount</th>
                    <th className="p-4 font-medium">Best Quote</th>
                    <th className="p-4 font-medium">Top Providers</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm">
                  {data?.data.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                        No quotes found matching your search.
                      </td>
                    </tr>
                  ) : (
                    data?.data.map((quote) => {
                      const bestQuote = quote.quotes[0];
                      return (
                        <tr key={quote.id} className="border-b border-surface-variant/50 last:border-0 hover:bg-surface-container-lowest transition-colors">
                          <td className="p-4 text-on-surface-variant whitespace-nowrap">
                            {new Date(quote.createdAt).toLocaleString()}
                          </td>
                          <td className="p-4">
                            <span className="font-semibold text-primary">{quote.user?.fullName || 'Anonymous'}</span>
                            {quote.user?.email && <span className="block text-xs text-on-surface-variant">{quote.user.email}</span>}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className="font-mono">{quote.fromCurrency}</Badge>
                              <span className="text-data-gray">→</span>
                              <Badge variant="outline" className="font-mono">{quote.toCurrency}</Badge>
                            </div>
                            <span className="block mt-1 text-xs text-on-surface-variant">{quote.fromCountry} to {quote.toCountry}</span>
                          </td>
                          <td className="p-4 font-semibold text-primary">
                            {formatCurrency(quote.sendAmount, quote.fromCurrency)}
                          </td>
                          <td className="p-4">
                            {bestQuote ? (
                              <div>
                                <span className="font-semibold text-vibrant-green-dim">{formatCurrency(bestQuote.recipientAmount, quote.toCurrency)}</span>
                                <span className="block text-xs text-data-gray">via {bestQuote.provider}</span>
                              </div>
                            ) : (
                              <span className="text-xs italic text-on-surface-variant">No quotes returned</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-wrap gap-1">
                              {quote.quotes.map((q, i) => (
                                <Badge key={i} variant={q.status === 'SUCCESS' ? 'default' : 'destructive'} className="text-[10px]">
                                  {q.provider}
                                </Badge>
                              ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })
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
