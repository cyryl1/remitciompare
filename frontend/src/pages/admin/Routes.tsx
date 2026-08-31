import { useState } from 'react';
import { useAdminRoutes, useAdminUpdateRoute, useAdminCreateRoute, useAdminProviders } from '@/hooks/useAdmin';
import { PageSpinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Search, Route as RouteIcon, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function Routes() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoute, setNewRoute] = useState({ providerId: '', fromCurrency: '', toCurrency: '', fromCountry: '', toCountry: '' });
  const limit = 20;

  const { data, isLoading } = useAdminRoutes({ page, limit, search: search || undefined });
  const { data: providersData } = useAdminProviders({ page: 1, limit: 100 });
  const updateRoute = useAdminUpdateRoute();
  const createRoute = useAdminCreateRoute();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    updateRoute.mutate({ id, isActive: !currentStatus });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createRoute.mutate(
      { ...newRoute, isActive: true },
      {
        onSuccess: () => {
          setShowCreateModal(false);
          setNewRoute({ providerId: '', fromCurrency: '', toCurrency: '', fromCountry: '', toCountry: '' });
        }
      }
    );
  };

  return (
    <>
      <header className="h-20 bg-surface-white border-b border-surface-variant px-gutter flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-display text-headline-sm md:text-headline-md text-primary">Routes Management</h1>
          <p className="text-body-sm text-on-surface-variant hidden md:block">
            Manage provider currency corridors and geographical routes.
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
                placeholder="Search routes by provider or currency..." 
                className="pl-10 bg-surface-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <Button variant="primary" className="text-white" onClick={() => setShowCreateModal(true)}>
              <RouteIcon size={16} className="mr-2" />
              Add Route
            </Button>
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
                    <th className="p-4 font-medium">Corridor (Currencies)</th>
                    <th className="p-4 font-medium">Geography</th>
                    <th className="p-4 font-medium">Provider</th>
                    <th className="p-4 font-medium">Added On</th>
                    <th className="p-4 font-medium text-center">Active Status</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm">
                  {data?.data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                        No routes found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    data?.data.map((route) => (
                      <tr key={route.id} className="border-b border-surface-variant/50 last:border-0 hover:bg-surface-container-lowest transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="font-mono bg-surface-white">{route.fromCurrency}</Badge>
                            <span className="text-data-gray">→</span>
                            <Badge variant="outline" className="font-mono bg-surface-white">{route.toCurrency}</Badge>
                          </div>
                        </td>
                        <td className="p-4 text-on-surface-variant">
                          {route.fromCountry || 'Any'} → {route.toCountry || 'Any'}
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-primary">{route.provider.name}</span>
                            {!route.provider.isActive && (
                              <Badge variant="destructive" className="text-[10px] px-1 py-0 h-4">Disabled</Badge>
                            )}
                          </div>
                        </td>
                        <td className="p-4 text-on-surface-variant">
                          {new Date(route.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center">
                            <Switch 
                              checked={route.isActive}
                              onCheckedChange={() => handleToggleActive(route.id, route.isActive)}
                              disabled={updateRoute.isPending}
                            />
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

      {/* Create Route Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-surface-variant">
              <h2 className="font-display text-headline-sm text-primary flex items-center gap-2">
                <RouteIcon size={20} />
                Add Route
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="flex-1 flex flex-col">
              <div className="p-6 overflow-y-auto flex flex-col gap-4">
                <div>
                  <label className="block text-label-sm font-medium text-data-gray mb-1">Provider</label>
                  <select 
                    required
                    className="w-full bg-surface-white border border-surface-variant rounded-lg p-2 text-body-sm"
                    value={newRoute.providerId}
                    onChange={e => setNewRoute({...newRoute, providerId: e.target.value})}
                  >
                    <option value="">Select a provider...</option>
                    {providersData?.data.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label-sm font-medium text-data-gray mb-1">From Currency</label>
                    <Input 
                      required 
                      placeholder="e.g. GBP" 
                      value={newRoute.fromCurrency} 
                      onChange={e => setNewRoute({...newRoute, fromCurrency: e.target.value.toUpperCase()})} 
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm font-medium text-data-gray mb-1">To Currency</label>
                    <Input 
                      required 
                      placeholder="e.g. NGN" 
                      value={newRoute.toCurrency} 
                      onChange={e => setNewRoute({...newRoute, toCurrency: e.target.value.toUpperCase()})} 
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-label-sm font-medium text-data-gray mb-1">From Country (Optional)</label>
                    <Input 
                      placeholder="e.g. UK" 
                      value={newRoute.fromCountry} 
                      onChange={e => setNewRoute({...newRoute, fromCountry: e.target.value})} 
                    />
                  </div>
                  <div>
                    <label className="block text-label-sm font-medium text-data-gray mb-1">To Country (Optional)</label>
                    <Input 
                      placeholder="e.g. Nigeria" 
                      value={newRoute.toCountry} 
                      onChange={e => setNewRoute({...newRoute, toCountry: e.target.value})} 
                    />
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-surface-variant bg-surface-container-lowest flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="text-white" disabled={createRoute.isPending}>
                  {createRoute.isPending ? 'Saving...' : 'Add Route'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
