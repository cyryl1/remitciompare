import { useState } from 'react';
import { User, Bell, Bookmark, Lock, Shield, LogOut, Edit2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useAuthStore } from '@/store/authStore';

export default function AccountSettings() {
  const { user, logout } = useAuthStore();
  const [fullName, setFullName] = useState((user?.firstName ? user.firstName + ' ' + user.lastName : 'Jane Doe'));
  const [country, setCountry] = useState('UK');
  const [defaultRoute, setDefaultRoute] = useState('GBP-NGN');

  const navItems = [
    { icon: User, label: 'Profile', active: true },
    { icon: Bell, label: 'Notifications' },
    { icon: Bookmark, label: 'Saved Routes' },
    { icon: Lock, label: 'Security' },
    { icon: Shield, label: 'Privacy' },
  ];

  return (
    <PageWrapper className="py-section-gap flex flex-col md:flex-row gap-gutter min-h-screen">
      {/* ── Sidebar Navigation ────────────────────────────────────────── */}
      <aside className="w-full md:w-64 flex-shrink-0 mb-8 md:mb-0">
        <div className="bg-surface-white rounded-xl shadow-sm border border-outline-variant p-4 sticky top-24">
          <div className="mb-6 px-4">
            <p className="text-label-sm text-data-gray uppercase tracking-wider">Account / Settings</p>
          </div>
          <nav className="flex flex-col space-y-2">
            {navItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <button
                  key={idx}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-body-md transition-colors w-full text-left ${
                    item.active
                      ? 'bg-primary-container text-on-primary-container font-semibold'
                      : 'text-on-surface-variant hover:bg-surface-container-low'
                  }`}
                >
                  <Icon size={20} />
                  <span>{item.label}</span>
                </button>
              );
            })}
            
            <div className="border-t border-outline-variant my-4" />
            
            <button
              onClick={() => logout()}
              className="flex items-center space-x-3 px-4 py-3 rounded-lg text-error hover:bg-error/10 hover:text-error transition-colors text-body-md w-full text-left font-medium"
            >
              <LogOut size={20} />
              <span>Log out</span>
            </button>
          </nav>
        </div>
      </aside>

      {/* ── Main Content Panel ────────────────────────────────────────── */}
      <section className="flex-grow">
        <div className="bg-surface-white rounded-xl shadow-sm border border-outline-variant p-6 md:p-8">
          
          {/* Profile Header */}
          <div className="mb-8 border-b border-outline-variant pb-6">
            <h1 className="font-display text-headline-lg text-primary">Profile</h1>
            <p className="text-body-md text-data-gray mt-2">Manage your personal information and preferences.</p>
          </div>

          {/* Avatar Section */}
          <div className="flex items-center space-x-6 mb-10">
            <div className="w-24 h-24 rounded-full bg-primary-container text-on-primary-container flex items-center justify-center font-display text-headline-lg font-bold">
              {fullName.split(' ').map((n: string) => n[0]).join('').substring(0, 2).toUpperCase()}
            </div>
            <div>
              <button className="text-body-md text-secondary hover:text-secondary-fixed transition-colors flex items-center space-x-2 font-medium">
                <Edit2 size={18} />
                <span>Edit photo</span>
              </button>
            </div>
          </div>

          {/* Form Section */}
          <form className="space-y-6 max-w-2xl" onSubmit={(e) => e.preventDefault()}>
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />

            <div>
              <label className="block text-label-sm text-on-surface-variant mb-2">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  value={user?.email || 'user@example.com'}
                  readOnly
                  className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-4 py-3 text-body-md text-on-surface focus-ring pr-24"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 bg-surface-variant text-on-surface-variant px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wide flex items-center space-x-1">
                  <CheckCircle2 size={14} className="text-vibrant-green" />
                  <span>Verified</span>
                </span>
              </div>
            </div>

            <div>
              <label className="block text-label-sm text-on-surface-variant mb-2">Country of Residence</label>
              <div className="relative">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface focus-ring pr-10"
                >
                  <option value="UK">United Kingdom</option>
                  <option value="US">United States</option>
                  <option value="CA">Canada</option>
                  <option value="AU">Australia</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-label-sm text-on-surface-variant mb-2">Default Comparison Route</label>
              <div className="relative">
                <select
                  value={defaultRoute}
                  onChange={(e) => setDefaultRoute(e.target.value)}
                  className="w-full appearance-none rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface focus-ring pr-10"
                >
                  <option value="GBP-NGN">GBP to NGN</option>
                  <option value="USD-INR">USD to INR</option>
                  <option value="EUR-MXN">EUR to MXN</option>
                  <option value="GBP-EUR">GBP to EUR</option>
                </select>
              </div>
              <p className="text-label-sm text-data-gray mt-2">
                This route will be pre-filled when you open the comparison calculator.
              </p>
            </div>

            <div className="pt-6">
              <Button type="submit" size="lg" className="w-full md:w-auto bg-vibrant-green text-deep-navy">
                Save Changes
              </Button>
            </div>
          </form>
          
        </div>
      </section>
    </PageWrapper>
  );
}
