import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Shield, AlertTriangle } from 'lucide-react';
import { userApi } from '@/api/user';
import { useAuthStore } from '@/store/authStore';

export function PrivacyTab() {
  const { logout } = useAuthStore();
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const [requestStatus, setRequestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [confirmText, setConfirmText] = useState('');

  const handleDelete = async () => {
    if (confirmText !== 'DELETE') return;
    
    setIsDeleting(true);
    try {
      await userApi.deleteAccount();
      logout();
    } catch (err) {
      console.error(err);
      setIsDeleting(false);
    }
  };

  const handleDataRequest = async () => {
    setIsRequesting(true);
    setRequestStatus('idle');
    try {
      await userApi.requestDataArchive();
      setRequestStatus('success');
      setTimeout(() => setRequestStatus('idle'), 5000); // Clear after 5 seconds
    } catch (err) {
      console.error(err);
      setRequestStatus('error');
    } finally {
      setIsRequesting(false);
    }
  };

  return (
    <>
      <div className="mb-8 border-b border-outline-variant pb-6">
        <h1 className="font-display text-headline-lg text-primary">Privacy & Data</h1>
        <p className="text-body-md text-data-gray mt-2">Manage your data and account deletion.</p>
      </div>

      <div className="max-w-2xl space-y-6">
        <div className="p-6 border border-outline-variant rounded-xl bg-surface-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-primary-container text-on-primary-container rounded-full flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h2 className="text-body-lg font-semibold text-primary">Download My Data</h2>
              <p className="text-body-sm text-on-surface-variant">Request a copy of your personal data and transfer history.</p>
            </div>
          </div>
          
          {requestStatus === 'success' && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-body-sm flex items-center gap-2">
              <Shield size={16} />
              Success! Your data archive has been securely emailed to you.
            </div>
          )}

          {requestStatus === 'error' && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-body-sm flex items-center gap-2">
              <AlertTriangle size={16} />
              Failed to request data archive. Please try again later.
            </div>
          )}

          <Button 
            variant="secondary" 
            onClick={handleDataRequest} 
            loading={isRequesting}
            disabled={requestStatus === 'success'}
          >
            {requestStatus === 'success' ? 'Request Sent' : 'Request Data Archive'}
          </Button>
        </div>

        <div className="p-6 border border-error/20 bg-error/5 rounded-xl">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-error/20 text-error rounded-full flex items-center justify-center">
              <AlertTriangle size={24} />
            </div>
            <div>
              <h2 className="text-body-lg font-semibold text-error">Delete Account</h2>
              <p className="text-body-sm text-error/80">Permanently delete your account and all associated data.</p>
            </div>
          </div>
          
          <div className="mt-4 p-4 bg-surface-white border border-error/20 rounded-lg">
            <p className="text-body-sm text-on-surface mb-3 font-medium">
              To verify, type <span className="font-bold text-error">DELETE</span> below:
            </p>
            <input 
              type="text" 
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              className="w-full rounded-lg border border-outline-variant bg-surface px-4 py-2 text-body-md focus-ring mb-4"
              placeholder="DELETE"
            />
            <Button 
              className="bg-error text-white hover:bg-error/90 w-full md:w-auto"
              disabled={confirmText !== 'DELETE'}
              loading={isDeleting}
              onClick={handleDelete}
            >
              Permanently Delete Account
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
