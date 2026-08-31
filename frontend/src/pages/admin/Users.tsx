import { useState } from 'react';
import { useAdminUsers } from '@/hooks/useAdmin';
import { PageSpinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Search, Users as UsersIcon, Mail, ShieldAlert, Settings, UserCheck, Eye, X } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { downloadCSV } from '@/lib/utils';

export default function Users() {
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const limit = 20;

  const { data, isLoading } = useAdminUsers({ page, limit, search: search || undefined });

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
  };

  const handleExportCSV = () => {
    if (!data?.data) return;
    const exportData = data.data.map((user) => ({
      ID: user.id,
      FullName: user.fullName || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      Email: user.email,
      Role: user.role,
      AlertsCount: user.alertCount || 0,
      ComparisonsCount: user.comparisonCount || 0,
      CreatedAt: new Date(user.createdAt).toISOString(),
    }));
    downloadCSV(exportData, 'users_export');
  };

  return (
    <>
      <header className="h-20 bg-surface-white border-b border-surface-variant px-gutter flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="font-display text-headline-sm md:text-headline-md text-primary">User Management</h1>
          <p className="text-body-sm text-on-surface-variant hidden md:block">
            View registered users, their activity, and manage permissions.
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
                placeholder="Search by name or email..." 
                className="pl-10 bg-surface-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </form>
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportCSV} disabled={!data || data.data.length === 0}>
                <UsersIcon size={16} className="mr-2" />
                Export CSV
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
                    <th className="p-4 font-medium">User Details</th>
                    <th className="p-4 font-medium">Role</th>
                    <th className="p-4 font-medium">Joined Date</th>
                    <th className="p-4 font-medium text-center">Comparisons</th>
                    <th className="p-4 font-medium text-center">Alerts</th>
                    <th className="p-4 font-medium text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-body-sm">
                  {data?.data.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="p-8 text-center text-on-surface-variant">
                        No users found matching your criteria.
                      </td>
                    </tr>
                  ) : (
                    data?.data.map((user) => (
                      <tr key={user.id} className="border-b border-surface-variant/50 last:border-0 hover:bg-surface-container-lowest transition-colors">
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary flex-shrink-0">
                              {user.firstName ? user.firstName[0].toUpperCase() : (user.email[0].toUpperCase())}
                            </div>
                            <div>
                              <p className="font-semibold text-primary">{user.firstName} {user.lastName}</p>
                              <div className="flex items-center text-xs text-on-surface-variant mt-0.5">
                                <Mail size={12} className="mr-1" />
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="p-4">
                          {user.role === 'ADMIN' ? (
                            <Badge variant="default" className="bg-primary/10 text-primary border-primary/20">
                              <ShieldAlert size={12} className="mr-1" /> Admin
                            </Badge>
                          ) : (
                            <Badge variant="outline" className="text-data-gray">User</Badge>
                          )}
                        </td>
                        <td className="p-4 text-on-surface-variant">
                          {new Date(user.createdAt).toLocaleDateString()}
                        </td>
                        <td className="p-4 text-center font-mono">
                          {user.comparisonCount}
                        </td>
                        <td className="p-4 text-center font-mono">
                          {user.alertCount}
                        </td>
                        <td className="p-4">
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary-hover" onClick={() => setSelectedUser(user)}>
                            <Eye size={16} className="mr-1" />
                            View
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

      {/* View User Modal */}
      {selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-surface-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-6 border-b border-surface-variant">
              <h2 className="font-display text-headline-sm text-primary flex items-center gap-2">
                <UserCheck size={20} />
                User Details
              </h2>
              <button onClick={() => setSelectedUser(null)} className="text-on-surface-variant hover:text-primary transition-colors">
                <X size={24} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-4">
              <div>
                <p className="text-label-sm text-data-gray mb-1">ID</p>
                <p className="text-body-md font-mono bg-surface-container-lowest p-2 rounded border border-surface-variant text-sm">
                  {selectedUser.id}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-label-sm text-data-gray mb-1">Full Name</p>
                  <p className="text-body-md font-medium text-primary">{selectedUser.fullName || `${selectedUser.firstName || ''} ${selectedUser.lastName || ''}`.trim()}</p>
                </div>
                <div>
                  <p className="text-label-sm text-data-gray mb-1">Email</p>
                  <p className="text-body-md">{selectedUser.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-2">
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-variant text-center">
                  <p className="text-headline-md font-display text-primary">{selectedUser.alertCount || selectedUser._count?.alerts || 0}</p>
                  <p className="text-label-sm text-data-gray uppercase tracking-wider">Alerts Set</p>
                </div>
                <div className="bg-surface-container-lowest p-3 rounded-lg border border-surface-variant text-center">
                  <p className="text-headline-md font-display text-primary">{selectedUser.comparisonCount || selectedUser._count?.comparisons || 0}</p>
                  <p className="text-label-sm text-data-gray uppercase tracking-wider">Comparisons</p>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-surface-variant">
                <p className="text-label-sm text-data-gray mb-1">Joined Date</p>
                <p className="text-body-md">{new Date(selectedUser.createdAt).toLocaleString()}</p>
              </div>
            </div>

            <div className="p-6 border-t border-surface-variant bg-surface-container-lowest flex justify-end gap-3">
              <Button variant="outline" onClick={() => setSelectedUser(null)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
