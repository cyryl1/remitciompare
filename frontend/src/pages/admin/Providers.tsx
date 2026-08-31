import { useState } from 'react';
import { useAdminProviders, useAdminUpdateProvider, useAdminCreateProvider } from '@/hooks/useAdmin';
import { PageSpinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Search, Building2, CheckCircle2, XCircle, Star, StarOff, Plus, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function Providers() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newProvider, setNewProvider] = useState({ name: '', slug: '', websiteUrl: '' });
  const limit = 20;

  const { data, isLoading } = useAdminProviders({ page, limit });
  const updateProvider = useAdminUpdateProvider();
  const createProvider = useAdminCreateProvider();

  // Simple client-side search filtering
  const filteredProviders = data?.data.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    updateProvider.mutate({ id, isActive: !currentStatus });
  };

  const handleToggleFeatured = (id: string, currentStatus: boolean) => {
    updateProvider.mutate({ id, isFeatured: !currentStatus });
  };

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    createProvider.mutate(
      { ...newProvider, isActive: true, isFeatured: false },
      {
        onSuccess: () => {
          setShowCreateModal(false);
          setNewProvider({ name: '', slug: '', websiteUrl: '' });
        }
      }
    );
  };

  return (
    <>
      <header className="h-20 bg-surface-white border-b border-surface-variant px-gutter flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-display text-headline-sm md:text-headline-md text-primary">Provider Management</h1>
          <p className="text-body-sm text-on-surface-variant hidden md:block">
            Enable, disable, and feature remittance providers on the platform.
          </p>
        </div>
      </header>

      <div className="p-gutter flex flex-col gap-gutter flex-1 h-full overflow-hidden">
        <div className="bg-surface-white rounded-xl border border-surface-variant shadow-sm flex flex-col flex-1 h-full overflow-hidden">
          
          {/* Toolbar */}
          <div className="p-4 border-b border-surface-variant bg-surface-container-lowest flex items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant" size={18} />
              <Input 
                type="text" 
                placeholder="Search providers..." 
                className="pl-10 bg-surface-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="primary" onClick={() => setShowCreateModal(true)}>
              <Plus size={16} className="mr-2" />
              Add Provider
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
                    <th className="p-4 font-medium">Provider Info</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium">Last Sync</th>
                    <th className="p-4 font-medium text-center">Featured</th>
                    <th className="p-4 font-medium text-center">Active</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm">
                  {filteredProviders?.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                        No providers found.
                      </td>
                    </tr>
                  ) : (
                    filteredProviders?.map((provider) => (
                      <tr key={provider.id} className="border-b border-surface-variant/50 last:border-0 hover:bg-surface-container-lowest transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded bg-surface-container flex items-center justify-center font-bold text-primary">
                              {provider.name[0]}
                            </div>
                            <div>
                              <p className="font-semibold text-primary">{provider.name}</p>
                              <p className="text-xs text-on-surface-variant font-mono">{provider.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                            provider.isActive ? 'bg-vibrant-green/10 text-vibrant-green-dim' : 'bg-error/10 text-error'
                          }`}>
                            {provider.isActive ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                            {provider.isActive ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="p-4 text-on-surface-variant">
                          {provider.lastRateUpdate ? new Date(provider.lastRateUpdate).toLocaleString() : 'Never'}
                        </td>
                        <td className="p-4 text-center">
                          <button 
                            onClick={() => handleToggleFeatured(provider.id, provider.isFeatured)}
                            disabled={updateProvider.isPending}
                            className={`p-2 rounded-full transition-colors ${
                              provider.isFeatured 
                                ? 'text-vibrant-orange bg-vibrant-orange/10 hover:bg-vibrant-orange/20' 
                                : 'text-data-gray hover:bg-surface-container'
                            }`}
                            title={provider.isFeatured ? "Unfeature provider" : "Feature provider"}
                          >
                            {provider.isFeatured ? <Star size={18} className="fill-current" /> : <StarOff size={18} />}
                          </button>
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center">
                            <Switch 
                              checked={provider.isActive}
                              onCheckedChange={() => handleToggleActive(provider.id, provider.isActive)}
                              disabled={updateProvider.isPending}
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

      {/* Create Provider Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-surface-variant">
              <h2 className="font-display text-headline-sm text-primary flex items-center gap-2">
                <Building2 size={20} />
                Add Provider
              </h2>
              <button onClick={() => setShowCreateModal(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleCreate} className="flex-1 flex flex-col">
              <div className="p-6 overflow-y-auto flex flex-col gap-4">
                <div>
                  <label className="block text-label-sm font-medium text-data-gray mb-1">Provider Name</label>
                  <Input 
                    required 
                    placeholder="e.g. Wise" 
                    value={newProvider.name} 
                    onChange={e => setNewProvider({...newProvider, name: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-')})} 
                  />
                </div>
                <div>
                  <label className="block text-label-sm font-medium text-data-gray mb-1">Slug</label>
                  <Input 
                    required 
                    placeholder="e.g. wise" 
                    value={newProvider.slug} 
                    onChange={e => setNewProvider({...newProvider, slug: e.target.value})} 
                  />
                </div>
                <div>
                  <label className="block text-label-sm font-medium text-data-gray mb-1">Website URL</label>
                  <Input 
                    type="url"
                    placeholder="e.g. https://wise.com" 
                    value={newProvider.websiteUrl} 
                    onChange={e => setNewProvider({...newProvider, websiteUrl: e.target.value})} 
                  />
                </div>
              </div>

              <div className="p-6 border-t border-surface-variant bg-surface-container-lowest flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowCreateModal(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" className="text-white" disabled={createProvider.isPending}>
                  {createProvider.isPending ? 'Saving...' : 'Add Provider'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
