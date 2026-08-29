import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Lock, ShieldCheck, CheckCircle2 } from 'lucide-react';
import { auth } from '@/lib/firebase';
import { updatePassword } from 'firebase/auth';
import { useAuthStore } from '@/store/authStore';

export function SecurityTab() {
  const { user } = useAuthStore();
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const isGoogleUser = user?.firebaseUid?.startsWith('google'); 
  // Wait, our backend doesn't store provider in user right now, 
  // but we can check currentUser providerData from Firebase.
  const currentUser = auth.currentUser;
  const isOAuthUser = currentUser?.providerData.some(p => p.providerId === 'google.com' || p.providerId === 'apple.com');

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setError('');
    setIsSaving(true);
    setSuccess(false);

    try {
      if (currentUser) {
        await updatePassword(currentUser, newPassword);
        setSuccess(true);
        setNewPassword('');
        setConfirmPassword('');
        setTimeout(() => setSuccess(false), 3000);
      } else {
        setError('You must be logged in.');
      }
    } catch (err: any) {
      if (err.code === 'auth/requires-recent-login') {
        setError('For security reasons, you must log out and log back in before changing your password.');
      } else {
        setError(err.message || 'Failed to update password.');
      }
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="mb-8 border-b border-outline-variant pb-6">
        <h1 className="font-display text-headline-lg text-primary">Security</h1>
        <p className="text-body-md text-data-gray mt-2">Manage your password and authentication methods.</p>
      </div>

      <div className="max-w-2xl space-y-8">
        
        {/* Linked Accounts section */}
        <div className="p-6 border border-outline-variant rounded-xl bg-surface-white">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            <div>
              <h2 className="text-body-lg font-semibold text-primary">Linked Accounts</h2>
              <p className="text-body-sm text-on-surface-variant">Manage how you sign in to RemitCompare.</p>
            </div>
          </div>
          
          <div className="space-y-4">
            {currentUser?.providerData.map(provider => (
              <div key={provider.uid} className="flex items-center justify-between p-4 border border-outline-variant rounded-lg bg-surface-container-lowest">
                <div className="flex items-center gap-3">
                  <div className="font-semibold text-body-md text-primary capitalize">
                    {provider.providerId.replace('.com', '')}
                  </div>
                  <span className="text-body-sm text-data-gray">({provider.email})</span>
                </div>
                <span className="text-vibrant-green text-label-sm font-bold uppercase tracking-wider flex items-center gap-1">
                  <CheckCircle2 size={14} /> Connected
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Change Password section */}
        {!isOAuthUser && (
          <div className="p-6 border border-outline-variant rounded-xl bg-surface-white">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 bg-surface-variant text-on-surface-variant rounded-full flex items-center justify-center">
                <Lock size={24} />
              </div>
              <div>
                <h2 className="text-body-lg font-semibold text-primary">Change Password</h2>
                <p className="text-body-sm text-on-surface-variant">Update your password to keep your account secure.</p>
              </div>
            </div>

            <form onSubmit={handlePasswordChange} className="space-y-4">
              <Input
                label="New Password"
                type="password"
                value={newPassword}
                onChange={(e: any) => setNewPassword(e.target.value)}
                required
              />
              <Input
                label="Confirm New Password"
                type="password"
                value={confirmPassword}
                onChange={(e: any) => setConfirmPassword(e.target.value)}
                required
              />

              {error && <p className="text-error text-body-sm">{error}</p>}
              
              <div className="pt-2 flex items-center gap-4">
                <Button type="submit" variant="secondary" loading={isSaving}>
                  Update Password
                </Button>
                {success && (
                  <span className="text-vibrant-green font-medium flex items-center gap-2">
                    <CheckCircle2 size={18} />
                    Password updated!
                  </span>
                )}
              </div>
            </form>
          </div>
        )}

      </div>
    </>
  );
}
