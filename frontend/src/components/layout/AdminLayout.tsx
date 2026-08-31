import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
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
} from 'lucide-react';
import { useAuthStore } from '@/store/authStore';

export function AdminLayout() {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const navGroups = [
    {
      title: 'Overview',
      items: [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin/dashboard' },
        { icon: Activity, label: 'Quote Monitoring', path: '/admin/quotes' },
        { icon: Building2, label: 'Providers', path: '/admin/providers' },
        { icon: Route, label: 'Routes', path: '/admin/routes' },
      ]
    },
    {
      title: 'Administration',
      items: [
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: LinkIcon, label: 'Referral Links', path: '/admin/referrals' },
        { icon: Bell, label: 'Alerts', path: '/admin/alerts' },
        { icon: HeartPulse, label: 'System Health', path: '/admin/health' },
        { icon: History, label: 'Activity Logs', path: '/admin/logs' },
      ]
    }
  ];

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
                {group.items.map((item, idx) => {
                  const isActive = location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={idx}
                      to={item.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg w-full text-left transition-colors ${
                        isActive 
                          ? 'bg-surface-container-low text-primary font-semibold' 
                          : 'text-on-surface-variant hover:bg-surface-container-low hover:text-primary'
                      }`}
                    >
                      <item.icon size={18} />
                      {item.label}
                    </Link>
                  );
                })}
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

      {/* ── Main Content Area ────────────────────────────────────────── */}
      <main className="lg:ml-64 flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
}
