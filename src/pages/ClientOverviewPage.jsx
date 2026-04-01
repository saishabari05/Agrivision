import { motion } from 'framer-motion';
import { AlertCircle, Building2, RefreshCcw } from 'lucide-react';
import { useEffect, useState } from 'react';
import Button from '../components/ui/Button';
import { fetchClientOverview } from '../services/api';

const fallbackOverview = {
  sectionLabel: 'About the Client',
  companyName: 'Mist Agri Corps Ltd',
  headline: "India's Premier Agro-Farming Enterprise",
  stats: [
    { id: 'acres', value: '3,000+', label: 'Acres under management' },
    { id: 'varieties', value: '3', label: 'Crop varieties cultivated in big scale' },
    { id: 'operations', value: 'Multi', label: 'State operations across India' },
    { id: 'transformation', value: 'AI-First', label: 'Digital transformation in progress' },
  ],
  description:
    'Crops include tomato, apple and grape. We are going to stick to these crops in the next 5 years. Increasing scale has made crop disease detection a major operational challenge, impacting yield, cost, and long-term sustainability.',
};

function ClientOverviewPage() {
  const [overview, setOverview] = useState(fallbackOverview);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadOverview = async () => {
    setLoading(true);
    setError('');

    try {
      const response = await fetchClientOverview();
      setOverview({
        sectionLabel: response.sectionLabel ?? fallbackOverview.sectionLabel,
        companyName: response.companyName ?? fallbackOverview.companyName,
        headline: response.headline ?? fallbackOverview.headline,
        stats: Array.isArray(response.stats) && response.stats.length ? response.stats : fallbackOverview.stats,
        description: response.description ?? fallbackOverview.description,
      });
    } catch (fetchError) {
      setError('Backend client overview data is not available yet. Showing fallback values for now.');
      setOverview(fallbackOverview);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, []);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <section className="glass-panel overflow-hidden p-6 sm:p-8 lg:p-10">
        <div className="max-w-5xl">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-moss-700">
                {overview.sectionLabel}
              </p>
              <h1 className="mt-4 text-3xl font-extrabold text-slate-900 sm:text-4xl">
                {overview.companyName}
              </h1>
            </div>

            <Button variant="secondary" onClick={loadOverview} loading={loading} className="sm:self-start">
              <RefreshCcw className="h-4 w-4" />
              Refresh data
            </Button>
          </div>

          {error && (
            <div className="mt-6 flex items-start gap-3 rounded-3xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="mt-8 rounded-[2rem] border border-moss-200 bg-white p-6 shadow-soft sm:p-8">
            <div className="absolute hidden" />
            <div className="border-l-4 border-moss-500 pl-5">
              <h2 className="text-2xl font-bold text-slate-900 sm:text-3xl">{overview.headline}</h2>
            </div>

            <div className="mt-10 grid gap-8 sm:grid-cols-2">
              {overview.stats.map((stat) => (
                <div key={stat.id} className="space-y-2">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-moss-100 text-moss-700">
                      <Building2 className="h-5 w-5" />
                    </div>
                    <p className="text-4xl font-extrabold leading-none text-moss-600 sm:text-5xl">{stat.value}</p>
                  </div>
                  <p className="max-w-xs text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <p className="mt-8 max-w-5xl text-lg leading-9 text-slate-700">{overview.description}</p>
        </div>
      </section>
    </motion.div>
  );
}

export default ClientOverviewPage;
