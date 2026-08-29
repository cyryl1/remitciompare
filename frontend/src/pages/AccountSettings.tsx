import { useState } from 'react';
import { User, Bell, Bookmark, Lock, Shield, LogOut } from 'lucide-react';
import { PageWrapper } from '@/components/layout/PageWrapper';
import { useAuthStore } from '@/store/authStore';
import { ProfileTab } from './account/ProfileTab';
import { NotificationsTab } from './account/NotificationsTab';
import { SavedRoutesTab } from './account/SavedRoutesTab';
import { SecurityTab } from './account/SecurityTab';
import { PrivacyTab } from './account/PrivacyTab';

export default function AccountSettings() {
  const { logout } = useAuthStore();
  const [activeTab, setActiveTab] = useState('Profile');



  const navItems = [
    { icon: User, label: 'Profile' },
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
                  onClick={() => setActiveTab(item.label)}
                  className={`flex items-center space-x-3 px-4 py-3 rounded-lg text-body-md transition-colors w-full text-left ${
                    activeTab === item.label
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
          
          {activeTab === 'Profile' && <ProfileTab />}
          {activeTab === 'Notifications' && <NotificationsTab />}
          {activeTab === 'Saved Routes' && <SavedRoutesTab />}
          {activeTab === 'Security' && <SecurityTab />}
          {activeTab === 'Privacy' && <PrivacyTab />}
          
        </div>
      </section>
    </PageWrapper>
  );
}
