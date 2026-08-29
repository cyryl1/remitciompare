import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { CheckCircle2 } from 'lucide-react';
import { userApi } from '@/api/user';

export function NotificationsTab() {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [comparisonNotifications, setComparisonNotifications] = useState(false);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    userApi.getPreferences().then((data) => {
      if (data.notificationSettings) {
        setEmailAlerts(data.notificationSettings.emailAlerts);
        setComparisonNotifications(data.notificationSettings.comparisonNotifications);
        setMarketingEmails(data.notificationSettings.marketingEmails);
      }
    }).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await userApi.updatePreferences({
        emailAlerts,
        comparisonNotifications,
        marketingEmails,
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <>
      <div className="mb-8 border-b border-outline-variant pb-6">
        <h1 className="font-display text-headline-lg text-primary">Notifications</h1>
        <p className="text-body-md text-data-gray mt-2">Choose how and when we contact you.</p>
      </div>

      <form className="space-y-6 max-w-2xl" onSubmit={handleSave}>
        
        {/* Toggle 1 */}
        <div className="flex items-center justify-between p-4 border border-outline-variant rounded-xl bg-surface-white">
          <div>
            <h3 className="font-semibold text-body-lg text-primary">Email Rate Alerts</h3>
            <p className="text-body-sm text-on-surface-variant mt-1">Receive emails when your saved routes hit target rates.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={emailAlerts} onChange={(e) => setEmailAlerts(e.target.checked)} />
            <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vibrant-green"></div>
          </label>
        </div>

        {/* Toggle 2 */}
        <div className="flex items-center justify-between p-4 border border-outline-variant rounded-xl bg-surface-white">
          <div>
            <h3 className="font-semibold text-body-lg text-primary">Weekly Comparison</h3>
            <p className="text-body-sm text-on-surface-variant mt-1">Get a weekly summary of the best exchange rates.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={comparisonNotifications} onChange={(e) => setComparisonNotifications(e.target.checked)} />
            <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vibrant-green"></div>
          </label>
        </div>

        {/* Toggle 3 */}
        <div className="flex items-center justify-between p-4 border border-outline-variant rounded-xl bg-surface-white">
          <div>
            <h3 className="font-semibold text-body-lg text-primary">Marketing Emails</h3>
            <p className="text-body-sm text-on-surface-variant mt-1">Receive product updates and promotional offers.</p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" className="sr-only peer" checked={marketingEmails} onChange={(e) => setMarketingEmails(e.target.checked)} />
            <div className="w-11 h-6 bg-outline-variant peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-vibrant-green"></div>
          </label>
        </div>

        <div className="pt-6 flex items-center gap-4">
          <Button type="submit" size="lg" className="w-full md:w-auto bg-vibrant-green text-deep-navy" loading={isSaving}>
            Save Preferences
          </Button>
          {saveSuccess && (
            <span className="text-vibrant-green font-medium flex items-center gap-2">
              <CheckCircle2 size={18} />
              Saved!
            </span>
          )}
        </div>
      </form>
    </>
  );
}
