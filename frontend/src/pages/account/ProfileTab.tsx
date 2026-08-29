import { useState, useEffect } from 'react';
import { Edit2, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useAuthStore } from '@/store/authStore';
import { userApi } from '@/api/user';
import countries from 'world-countries';

export function ProfileTab() {
  const { user } = useAuthStore();
  const [fullName, setFullName] = useState((user?.firstName ? user.firstName + ' ' + (user.lastName || '') : 'Jane Doe').trim());
  const [country, setCountry] = useState('GB');
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    userApi.getPreferences().then((data) => {
      if (data.countryOfResidence) setCountry(data.countryOfResidence);
      if (data.fullName) setFullName(data.fullName);
    }).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setSaveSuccess(false);
    try {
      await userApi.updatePreferences({
        fullName,
        countryOfResidence: country,
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
        <h1 className="font-display text-headline-lg text-primary">Profile</h1>
        <p className="text-body-md text-data-gray mt-2">Manage your personal information and preferences.</p>
      </div>

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

      <form className="space-y-6 max-w-2xl" onSubmit={handleSave}>
        <Input
          label="Full Name"
          value={fullName}
          onChange={(e: any) => setFullName(e.target.value)}
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
              <option value="" disabled>Select your country</option>
              {countries
                .sort((a, b) => a.name.common.localeCompare(b.name.common))
                .map((c) => (
                <option key={c.cca2} value={c.cca2}>
                  {c.name.common}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="pt-6 flex items-center gap-4">
          <Button type="submit" size="lg" className="w-full md:w-auto bg-vibrant-green text-deep-navy" loading={isSaving}>
            Save Changes
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
