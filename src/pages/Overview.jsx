import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import AppFrame from '../components/AppFrame';
import Button from '../components/Button';
import Card from '../components/Card';
import { useAuth } from '../context/AuthContext';

function Overview() {
  const { previewProfile } = useAuth();

  return (
    <AppFrame title="Client Overview" subtitle={`A clean introduction to ${previewProfile?.farmName ?? 'your agricultural operation'}`}>
      <div className="mx-auto max-w-4xl">
        <img src={logo} alt="AgriVision logo" className="h-16 w-16 rounded-3xl bg-white p-1.5 object-contain shadow-md" />
        <p className="text-sm font-semibold uppercase tracking-[0.24em] text-moss">About the client</p>
        <h2 className="mt-4 text-4xl font-semibold tracking-[-0.03em] text-text-dark">Mist Agri Corps Ltd</h2>
        <Card className="mt-8 bg-beige">
          <h3 className="text-3xl font-semibold tracking-[-0.02em] text-text-dark">India&apos;s Premier Agro-Farming Enterprise</h3>
          <div className="mt-10 grid gap-8 sm:grid-cols-2">
            {[
              ['3,000+', 'Acres under management'],
              ['3', 'Crop varieties cultivated in big scale'],
              ['Multi', 'State operations across India'],
              ['AI-First', 'Digital transformation in progress'],
            ].map(([value, label]) => (
              <div key={label}>
                <p className="text-4xl font-bold tracking-[-0.03em] text-moss">{value}</p>
                <p className="mt-2 text-sm uppercase tracking-[0.18em] text-text-muted">{label}</p>
              </div>
            ))}
          </div>
        </Card>
        <p className="mt-8 text-lg leading-9 text-text-mid">
          Crops include tomato, apple and grape. We are going to stick to these crops in the next 5 years. Increasing
          scale has made crop disease detection a major operational challenge impacting yield, cost, and long-term
          sustainability.
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
