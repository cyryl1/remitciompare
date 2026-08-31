import { useState } from 'react';
import { useAdminReferrals, useAdminUpdateReferral, useAdminCreateReferral, useAdminProviders } from '@/hooks/useAdmin';
import { PageSpinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Switch } from '@/components/ui/Switch';
import { Search, Link as LinkIcon, ExternalLink, Edit2, Copy, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';

export default function Referrals() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ providerId: '', url: '', utmSource: '', utmCampaign: '', utmMedium: '' });
  const limit = 20;

  const { data, isLoading } = useAdminReferrals({ page, limit, search: search || undefined });
  const { data: providersData } = useAdminProviders({ page: 1, limit: 100 });
  const updateReferral = useAdminUpdateReferral();
  const createReferral = useAdminCreateReferral();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleToggleActive = (id: string, currentStatus: boolean) => {
    updateReferral.mutate({ id, isActive: !currentStatus });
  };

  const handleOpenEdit = (link: any) => {
    setEditingId(link.id);
    setFormData({
      providerId: link.providerId,
      url: link.url,
      utmSource: link.utmSource || '',
      utmCampaign: link.utmCampaign || '',
      utmMedium: link.utmMedium || '',
    });
    setShowModal(true);
  };

  const handleOpenCreate = () => {
    setEditingId(null);
    setFormData({ providerId: '', url: '', utmSource: '', utmCampaign: '', utmMedium: '' });
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingId) {
      updateReferral.mutate(
        { id: editingId, ...formData },
        { onSuccess: () => setShowModal(false) }
      );
    } else {
      createReferral.mutate(
        { ...formData, isActive: true },
        { onSuccess: () => setShowModal(false) }
      );
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    // Ideally add a toast here
  };

  return (
    <>
      <header className="h-20 bg-surface-white border-b border-surface-variant px-gutter flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-display text-headline-sm md:text-headline-md text-primary">Referral Links</h1>
          <p className="text-body-sm text-on-surface-variant hidden md:block">
            Manage provider affiliate links and track referral clicks.
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
                placeholder="Search referral links..." 
                className="pl-10 bg-surface-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <Button variant="primary" className="text-white" onClick={handleOpenCreate}>
              <LinkIcon size={16} className="mr-2" />
              Add Link
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
                    <th className="p-4 font-medium">Provider</th>
                    <th className="p-4 font-medium">Destination URL</th>
                    <th className="p-4 font-medium text-center">Clicks</th>
                    <th className="p-4 font-medium text-center">Status</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm">
                  {data?.data.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-on-surface-variant">
                        No referral links found.
                      </td>
                    </tr>
                  ) : (
                    data?.data.map((link) => (
                      <tr key={link.id} className="border-b border-surface-variant/50 last:border-0 hover:bg-surface-container-lowest transition-colors">
                        <td className="p-4">
                          <span className="font-semibold text-primary capitalize">{link.provider}</span>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2 max-w-md">
                            <span className="truncate text-on-surface-variant" title={link.url}>
                              {link.url}
                            </span>
                            <button 
                              onClick={() => copyToClipboard(link.url)}
                              className="text-primary hover:text-primary-hover p-1"
                              title="Copy to clipboard"
                            >
                              <Copy size={14} />
                            </button>
                            <a 
                              href={link.url} 
                              target="_blank" 
                              rel="noreferrer"
                              className="text-primary hover:text-primary-hover p-1"
                              title="Open in new tab"
                            >
                              <ExternalLink size={14} />
                            </a>
                          </div>
                          {(link.utmSource || link.utmCampaign) && (
                            <div className="flex gap-2 mt-1">
                              {link.utmSource && <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-surface-variant text-on-surface-variant">src: {link.utmSource}</Badge>}
                              {link.utmCampaign && <Badge variant="outline" className="text-[10px] h-4 px-1 py-0 border-surface-variant text-on-surface-variant">cmp: {link.utmCampaign}</Badge>}
                            </div>
                          )}
                        </td>
                        <td className="p-4 text-center font-mono">
                          {link.clickCount}
                        </td>
                        <td className="p-4">
                          <div className="flex justify-center">
                            <Switch 
                              checked={link.isActive}
                              onCheckedChange={() => handleToggleActive(link.id, link.isActive)}
                              disabled={updateReferral.isPending}
                            />
                          </div>
                        </td>
                        <td className="p-4 text-right">
                          <Button variant="ghost" size="sm" className="text-on-surface-variant hover:text-primary" onClick={() => handleOpenEdit(link)}>
                            <Edit2 size={16} />
                          </Button>
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

      {/* Add/Edit Link Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-surface-variant">
              <h2 className="font-display text-headline-sm text-primary flex items-center gap-2">
                <LinkIcon size={20} />
                {editingId ? 'Edit Referral Link' : 'Add Referral Link'}
              </h2>
              <button onClick={() => setShowModal(false)} className="text-on-surface-variant hover:text-primary transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
              <div className="p-6 overflow-y-auto flex flex-col gap-4">
                <div>
                  <label className="block text-label-sm font-medium text-data-gray mb-1">Provider</label>
                  <select 
                    required
                    className="w-full bg-surface-white border border-surface-variant rounded-lg p-2 text-body-sm disabled:bg-surface-container"
                    value={formData.providerId}
                    onChange={e => setFormData({...formData, providerId: e.target.value})}
                    disabled={!!editingId} // Don't allow changing provider once created
                  >
                    <option value="">Select a provider...</option>
                    {providersData?.data.map(p => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-label-sm font-medium text-data-gray mb-1">Destination URL</label>
                  <Input 
                    required 
                    type="url"
                    placeholder="https://..." 
                    value={formData.url} 
                    onChange={e => setFormData({...formData, url: e.target.value})} 
                  />
                </div>
                <div className="pt-4 border-t border-surface-variant">
                  <p className="text-label-sm font-medium text-primary mb-3">UTM Parameters (Optional)</p>
                  <div className="flex flex-col gap-3">
                    <div>
                      <Input 
                        placeholder="utm_source" 
                        value={formData.utmSource} 
                        onChange={e => setFormData({...formData, utmSource: e.target.value})} 
                      />
                    </div>
                    <div>
                      <Input 
                        placeholder="utm_campaign" 
                        value={formData.utmCampaign} 
                        onChange={e => setFormData({...formData, utmCampaign: e.target.value})} 
                      />
                    </div>
                    <div>
                      <Input 
                        placeholder="utm_medium" 
                        value={formData.utmMedium} 
                        onChange={e => setFormData({...formData, utmMedium: e.target.value})} 
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 border-t border-surface-variant bg-surface-container-lowest flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  variant="primary" 
                  className="text-white" 
                  disabled={createReferral.isPending || updateReferral.isPending}
                >
                  {createReferral.isPending || updateReferral.isPending ? 'Saving...' : 'Save Link'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
