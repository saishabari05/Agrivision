import { ArrowRight } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import AppFrame from '../components/AppFrame';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';
import { fetchClientOverview } from '../services/api';

function Overview() {
  const { previewProfile } = useAuth();
  const [overview, setOverview] = useState(null);

  useEffect(() => {
    fetchClientOverview()
      .then((response) => setOverview(response))
      .catch(() => setOverview(null));
  }, []);

  return (
    <AppFrame title="Client Overview" subtitle={`A clean introduction to ${previewProfile?.farmName ?? 'your agricultural operation'}`}>
      <div className="mx-auto max-w-4xl">
        <img src={logo} alt="AgriVision logo" className="h-16 w-16 rounded-3xl bg-white p-1.5 object-contain shadow-md" />
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-moss">{overview?.sectionLabel ?? 'About the client'}</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-text-dark">{overview?.companyName ?? previewProfile?.farmName ?? 'AgriVision Farm'}</h2>
        <Card className="mt-8 bg-beige">
          <h3 className="text-3xl font-semibold tracking-[-0.02em] text-text-dark">{overview?.headline ?? 'AI-Assisted Crop Intelligence'}</h3>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {(overview?.stats ?? []).map((item) => (
              <div key={item.label}>
                <p className="text-4xl font-bold tracking-[-0.03em] text-moss">{item.value}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-text-muted">{item.label}</p>
              </div>
            ))}
          </div>
        </Card>
        <p className="mt-8 text-lg leading-9 text-text-mid">
          {overview?.description ?? 'Run image analyses from the Upload page to populate this overview with live backend data.'}
        </p>
        <Link to="/dashboard">
          <Button className="mt-8">
            View Dashboard
            <ArrowRight className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </AppFrame>
  );
}

export default Overview;
