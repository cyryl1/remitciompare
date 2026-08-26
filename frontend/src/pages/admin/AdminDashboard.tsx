
import { 
  LayoutDashboard, 
  Activity, 
  Building2, 
  Route, 
  Users, 
  Link as LinkIcon, 
  Bell, 
  HeartPulse,
  History,
  Settings,
  LogOut,
  RefreshCw,

  CheckCircle2,
  XCircle,
  MoreVertical
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { PageSpinner } from '@/components/ui/Spinner';
import { Badge } from '@/components/ui/Badge';
import { useAdminStats } from '@/hooks/useAdmin';
import { formatCurrency } from '@/lib/utils';
import { useAuthStore } from '@/store/authStore';
import { useNavigate } from 'react-router-dom';

export default function AdminDashboard() {
  const { data: stats, isLoading, refetch } = useAdminStats();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', active: true },
        { icon: Activity, label: 'Quote Monitoring' },
        { icon: Building2, label: 'Providers' },
        { icon: Route, label: 'Routes' },
      ]
    },
    {
      title: 'Administration',
      items: [
        { icon: Users, label: 'Users' },
        { icon: LinkIcon, label: 'Referral Links' },
        { icon: Bell, label: 'Alerts' },
        { icon: HeartPulse, label: 'System Health' },
        { icon: History, label: 'Activity Logs' },
      ]
    }
  ];

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center bg-surface"><PageSpinner /></div>;
  }

  return (
    <div className="bg-surface text-on-surface font-body-md min-h-screen flex">
      {/* ── Sidebar ───────────────────────────────────────────────────── */}
      <aside className="w-64 bg-surface-white border-r border-surface-variant flex flex-col justify-between fixed h-full z-10 hidden lg:flex">
        <div>
          <div className="h-20 flex items-center px-gutter border-b border-surface-variant">
            <span className="font-display text-headline-sm font-bold text-primary">RemitCompare</span>
          </div>
          
          <nav className="p-stack-md flex flex-col gap-1 overflow-y-auto">
            {navGroups.map((group, gIdx) => (
              <div key={gIdx} className="mb-4">
                <div className="text-label-sm text-on-surface-variant uppercase mb-2 px-3 font-semibold">
                  {group.title}
                </div>
                {group.items.map((item, idx) => (
                  <button
                    key={idx}
                    className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                      item.active 
                        ? 'bg-surface-container-low text-primary font-semibold' 
                        : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                    }`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </button>
                ))}
              </div>
            ))}
          </nav>
        </div>

        <div className="p-stack-md border-t border-surface-variant bg-surface-white">
          <button className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low hover:text-primary transition-colors w-full text-left mb-4">
            <Settings size={18} />
            Settings
          </button>
          
          <div className="flex items-center justify-between px-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary text-surface-white flex items-center justify-center font-bold text-sm">
                {user?.firstName?.[0]?.toUpperCase() || 'A'}
              </div>
              <div className="flex flex-col">
                <span className="text-label-sm font-semibold text-primary truncate max-w-[100px]">
                  {user?.firstName || 'Admin'}
                </span>
                <span className="text-xs text-on-surface-variant">Administrator</span>
              </div>
            </div>
            <button onClick={handleLogout} className="text-on-surface-variant hover:text-error transition-colors">
              <LogOut size={18} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── Main Content ──────────────────────────────────────────────── */}
      <main className="lg:ml-64 flex-1 flex flex-col min-h-screen">
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
            <Button onClick={() => refetch()} variant="primary" className="bg-primary text-on-primary">
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
                <span className="font-display text-headline-lg text-primary">{stats?.totalComparisons || 1248}</span>
                <span className="text-label-sm text-vibrant-green font-semibold mb-1 bg-vibrant-green/10 px-1.5 py-0.5 rounded">+12%</span>
              </div>
              <span className="text-xs text-data-gray">Top route: GBP → NGN</span>
            </div>

            <div className="bg-surface-white rounded-xl p-5 border border-surface-variant shadow-sm flex flex-col">
              <span className="text-label-sm text-on-surface-variant uppercase mb-2">Active Providers</span>
              <div className="flex items-end gap-3 mb-2">
                <span className="font-display text-headline-lg text-primary">{stats?.activeProviders || 24}</span>
                <span className="text-label-sm text-primary font-semibold mb-1 bg-surface-container px-1.5 py-0.5 rounded">/ 25</span>
              </div>
              <span className="text-xs text-data-gray">1 provider failing health checks</span>
            </div>

            <div className="bg-surface-white rounded-xl p-5 border border-surface-variant shadow-sm flex flex-col">
              <span className="text-label-sm text-on-surface-variant uppercase mb-2">API Success Rate</span>
              <div className="flex items-end gap-3 mb-2">
                <span className="font-display text-headline-lg text-primary">99.8%</span>
              </div>
              <div className="w-full bg-surface-container-low rounded-full h-1.5 mt-1 overflow-hidden">
                <div className="bg-vibrant-green h-1.5 rounded-full" style={{ width: '99.8%' }}></div>
              </div>
            </div>

            <div className="bg-surface-white rounded-xl p-5 border border-surface-variant shadow-sm flex flex-col">
              <span className="text-label-sm text-on-surface-variant uppercase mb-2">Active Alerts</span>
              <div className="flex items-end gap-3 mb-2">
                <span className="font-display text-headline-lg text-primary">{stats?.activeAlerts || 842}</span>
                <span className="text-label-sm text-primary mb-1 bg-surface-container px-1.5 py-0.5 rounded">Triggered: 15</span>
              </div>
              <span className="text-xs text-data-gray">Across 42 users</span>
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
                    {/* Mock data */}
                    {['Wise', 'Remitly', 'Sendwave', 'LemFi', 'Western Union'].map((provider, i) => (
                      <tr key={provider} className="border-b border-surface-variant/50 last:border-0 hover:bg-surface-container-lowest transition-colors">
                        <td className="py-3 font-semibold text-primary">{provider}</td>
                        <td className="py-3">
                          <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] uppercase font-bold ${
                            i === 3 ? 'bg-error/10 text-error' : 'bg-vibrant-green/10 text-vibrant-green-dim'
                          }`}>
                            {i === 3 ? <XCircle size={12} /> : <CheckCircle2 size={12} />}
                            {i === 3 ? 'Degraded' : 'Healthy'}
                          </span>
                        </td>
                        <td className="py-3 font-mono">{i === 3 ? '1.2s' : `${120 + i * 40}ms`}</td>
                        <td className="py-3 text-right text-on-surface-variant">
                          {i === 3 ? '5 mins ago' : '1 min ago'}
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
                  {[1, 2, 3, 4].map((i) => (
                    <li key={i} className="flex gap-3 items-start pb-4 border-b border-surface-variant last:border-0">
                      <div className="w-8 h-8 rounded-full bg-vibrant-green/10 text-vibrant-green-dim flex items-center justify-center flex-shrink-0 mt-0.5">
                        <Bell size={14} />
                      </div>
                      <div>
                        <p className="text-body-sm font-semibold text-primary">Target reached for user{i}@test.com</p>
                        <p className="text-xs text-on-surface-variant mt-1">
                          GBP → NGN target <span className="font-mono">1,890.00</span> met by <strong>Remitly</strong>
                        </p>
                        <span className="text-[10px] text-data-gray block mt-1">{i * 15} mins ago</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
