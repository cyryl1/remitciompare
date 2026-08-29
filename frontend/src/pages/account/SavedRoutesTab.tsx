import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Trash2, ArrowRight } from 'lucide-react';
import { userApi } from '@/api/user';
import { useNavigate } from 'react-router-dom';
import countries from 'world-countries';

export function SavedRoutesTab() {
  const [routes, setRoutes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [fromCurrency, setFromCurrency] = useState('GBP');
  const [toCurrency, setToCurrency] = useState('NGN');
  const [fromCountry, setFromCountry] = useState('GB');
  const [toCountry, setToCountry] = useState('NG');
  const [label, setLabel] = useState('');
  
  const [isSaving, setIsSaving] = useState(false);
  
  const navigate = useNavigate();

  const fetchRoutes = () => {
    setLoading(true);
    userApi.getSavedRoutes().then((data) => {
      setRoutes(data);
      setLoading(false);
    }).catch(console.error);
  };

  useEffect(() => {
    fetchRoutes();
  }, []);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await userApi.addSavedRoute({
        fromCurrency,
        toCurrency,
        fromCountry,
        toCountry,
        label,
      });
      fetchRoutes();
      setLabel('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await userApi.removeSavedRoute(id);
      setRoutes(routes.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleNavigate = (route: any) => {
    // Navigate to homepage with query params or state to prefill
    navigate(`/?from=${route.fromCurrency}&to=${route.toCurrency}&sendAmount=1000`);
  };

  return (
    <>
      <div className="mb-8 border-b border-outline-variant pb-6">
        <h1 className="font-display text-headline-lg text-primary">Saved Routes</h1>
        <p className="text-body-md text-data-gray mt-2">Quickly jump to your most frequent transfers.</p>
      </div>

      <div className="mb-10 max-w-2xl">
        <h2 className="text-body-lg font-semibold text-primary mb-4">Add a new route</h2>
        <form className="flex flex-col gap-4 bg-surface-container-lowest p-5 rounded-xl border border-outline-variant" onSubmit={handleAdd}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-2">From Country</label>
              <select
                value={fromCountry}
                onChange={(e) => setFromCountry(e.target.value)}
                className="w-full appearance-none rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface focus-ring pr-10"
              >
                {countries.sort((a, b) => a.name.common.localeCompare(b.name.common)).map((c) => (
                  <option key={c.cca2} value={c.cca2}>{c.name.common}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-2">From Currency</label>
              <Input value={fromCurrency} onChange={(e: any) => setFromCurrency(e.target.value.toUpperCase())} placeholder="GBP" maxLength={3} required />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-2">To Country</label>
              <select
                value={toCountry}
                onChange={(e) => setToCountry(e.target.value)}
                className="w-full appearance-none rounded-lg border border-outline-variant bg-surface px-4 py-3 text-body-md text-on-surface focus-ring pr-10"
              >
                {countries.sort((a, b) => a.name.common.localeCompare(b.name.common)).map((c) => (
                  <option key={c.cca2} value={c.cca2}>{c.name.common}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-label-sm text-on-surface-variant mb-2">To Currency</label>
              <Input value={toCurrency} onChange={(e: any) => setToCurrency(e.target.value.toUpperCase())} placeholder="NGN" maxLength={3} required />
            </div>
          </div>

          <div>
             <Input label="Label (Optional)" value={label} onChange={(e: any) => setLabel(e.target.value)} placeholder="e.g. Money to Family" />
          </div>

          <Button type="submit" loading={isSaving} variant="secondary">
            Save Route
          </Button>
        </form>
      </div>

      <div className="max-w-2xl space-y-4">
        {loading ? (
          <p className="text-data-gray">Loading routes...</p>
        ) : routes.length === 0 ? (
          <p className="text-data-gray text-center py-8 border border-dashed border-outline rounded-xl">No saved routes yet. Add one above!</p>
        ) : (
          routes.map(route => (
            <div 
              key={route.id} 
              onClick={() => handleNavigate(route)}
              className="group flex items-center justify-between p-5 border border-outline-variant rounded-xl bg-surface-white hover:bg-surface-container-low transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-primary-container flex items-center justify-center text-on-primary-container font-bold shadow-sm">
                  {route.fromCurrency[0]}{route.toCurrency[0]}
                </div>
                <div>
                  <h3 className="font-semibold text-body-lg text-primary flex items-center gap-2">
                    {route.fromCurrency} <ArrowRight size={16} className="text-data-gray"/> {route.toCurrency}
                  </h3>
                  <p className="text-body-sm text-on-surface-variant mt-1">
                    {route.label || `${route.fromCountry} to ${route.toCountry}`}
                  </p>
                </div>
              </div>
              
              <button 
                onClick={(e) => handleDelete(route.id, e)}
                className="p-2 text-data-gray hover:text-error hover:bg-error/10 rounded-full transition-colors opacity-0 group-hover:opacity-100"
                title="Remove route"
              >
                <Trash2 size={20} />
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
