import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ArrowLeftRight, Menu, X, User, LogOut, ChevronDown, Bell } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { authApi } from '@/api/auth';
import { cn } from '@/lib/utils';

const NAV_LINKS = [
  { to: '/compare',     label: 'Compare'      },
  { to: '/how-it-works', label: 'How It Works' },
  { to: '/providers',  label: 'Providers'     },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try { await authApi.logout(); } catch { /* ignore */ }
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-surface-white border-b border-outline-variant shadow-sm">
      <div className="flex items-center justify-between px-gutter max-w-container-max mx-auto h-20">

        {/* Brand */}
        <Link
          to="/"
          className="flex items-center gap-2 font-display font-bold text-headline-sm text-primary"
        >
          <ArrowLeftRight size={24} className="text-vibrant-green" />
          RemitCompare
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {NAV_LINKS.map(({ to, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                cn(
                  'text-body-md font-medium py-2 transition-colors duration-150',
                  isActive
                    ? 'text-secondary border-b-2 border-secondary font-semibold'
                    : 'text-on-surface-variant hover:text-primary',
                )
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated && user ? (
            <>
              {/* Alerts bell */}
              <Link
                to="/alerts"
                className="p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
              >
                <Bell size={20} />
              </Link>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen((v) => !v)}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl border border-outline-variant hover:bg-surface-container-low transition-colors"
                >
                  <div className="w-7 h-7 rounded-full bg-primary flex items-center justify-center text-on-primary text-label-sm font-semibold">
                    {user.firstName[0]}{user.lastName[0]}
                  </div>
                  <span className="text-label-lg text-on-surface">{user.firstName}</span>
                  <ChevronDown size={14} className="text-on-surface-variant" />
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-surface-white border border-outline-variant rounded-xl shadow-modal py-1 animate-fade-in">
                    <Link
                      to="/account"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-body-sm hover:bg-surface-container-low transition-colors"
                    >
                      <User size={16} />
                      Account Settings
                    </Link>
                    <Link
                      to="/history"
                      onClick={() => setUserMenuOpen(false)}
                      className="flex items-center gap-2 px-4 py-2.5 text-body-sm hover:bg-surface-container-low transition-colors"
                    >
                      <ArrowLeftRight size={16} />
                      Compare History
                    </Link>
                    {user.role === 'admin' && (
                      <Link
                        to="/admin"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-2 px-4 py-2.5 text-body-sm hover:bg-surface-container-low transition-colors"
                      >
                        Admin Dashboard
                      </Link>
                    )}
                    <hr className="my-1 border-outline-variant" />
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2 px-4 py-2.5 text-body-sm text-error hover:bg-error-container transition-colors"
                    >
                      <LogOut size={16} />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="px-4 py-2 text-label-lg text-on-surface-variant hover:text-primary hover:bg-surface-container-low rounded-lg transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="px-5 py-2.5 bg-vibrant-green text-deep-navy font-semibold text-label-lg rounded-lg shadow-sm hover:brightness-110 active:scale-95 transition-all"
              >
                Start Comparing
              </Link>
            </>
          )}
        </div>

        {/* Mobile hamburger */}
        <button
          className="md:hidden p-2 rounded-lg text-on-surface-variant hover:bg-surface-container-low transition-colors"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="md:hidden border-t border-outline-variant bg-surface-white animate-slide-up">
          <div className="px-gutter py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ to, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'px-4 py-3 rounded-xl text-body-md transition-colors',
                    isActive
                      ? 'bg-primary-fixed text-primary font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-low',
                  )
                }
              >
                {label}
              </NavLink>
            ))}
            <hr className="my-2 border-outline-variant" />
            {isAuthenticated ? (
              <>
                <Link to="/account" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-body-md hover:bg-surface-container-low">Account</Link>
                <Link to="/history" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-body-md hover:bg-surface-container-low">History</Link>
                <Link to="/alerts" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-body-md hover:bg-surface-container-low">Alerts</Link>
                <button onClick={handleLogout} className="px-4 py-3 rounded-xl text-body-md text-error text-left hover:bg-error-container">Sign Out</button>
              </>
            ) : (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl text-body-md hover:bg-surface-container-low">Login</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="px-4 py-3 rounded-xl bg-vibrant-green text-deep-navy font-semibold text-center">Start Comparing</Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
