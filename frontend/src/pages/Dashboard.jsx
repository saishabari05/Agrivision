import {
  Activity,
  ArrowUpRight,
  FileText,
  LandPlot,
  Sparkles,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import AppFrame from '../components/AppFrame';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';
import { fetchDashboard } from '../services/api';

function Dashboard() {
  const [dashboard, setDashboard] = useState(null);

  useEffect(() => {
    fetchDashboard()
      .then((response) => setDashboard(response))
      .catch(() => setDashboard(null));
  }, []);

  const chartData = useMemo(() => {
    const source = dashboard?.topDiseases ?? [];
    const counts = source.reduce((acc, item) => {
      const crop = item.crop ?? 'Unknown';
      acc[crop] = (acc[crop] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(counts).map(([crop, value]) => ({ crop, value }));
  }, [dashboard]);

  const latestItem = dashboard?.topDiseases?.[0] ?? null;

  return (
    <AppFrame title="Welcome back, Aarav" subtitle="A live agricultural intelligence workspace across farms, alerts, spread zones, and AI guidance.">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Farms monitored" value={String(dashboard?.farmsMonitored ?? 0)} trend="Live backend data" />
          <MetricCard label="Detections this week" value={String(dashboard?.detections ?? 0)} trend="From analyze endpoint" />
          <MetricCard label="Alerts active" value={String(dashboard?.alertsActive ?? 0)} trend="High severity cases" positive={false} />
          <MetricCard label="Reports generated" value={String(dashboard?.reportsGenerated ?? 0)} trend="Auto-generated reports" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_0.5fr]">
          <Card>
            <div>
              <p className="panel-label">Latest analysis</p>
              <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-text-dark">{latestItem?.locationName ?? 'No analyzed locations yet'}</h2>
              <p className="mt-3 text-sm leading-7 text-text-mid">
                {latestItem
                  ? `${latestItem.disease} detected with ${latestItem.confidence}% confidence at ${latestItem.locationName}. Action: Review report and share with farmer.`
                  : 'Upload a crop image to generate the first analysis. Once analyzed, it will appear here with disease, confidence, and recommendations.'}
              </p>
            </div>
            <div className="mt-6 grid gap-4 md:grid-cols-2">
              <div className="rounded-[1.6rem] bg-moss-pale p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Detected disease</p>
                <p className="mt-3 text-xl font-semibold tracking-[-0.02em] text-text-dark">{latestItem?.disease ?? 'None yet'}</p>
              </div>
              <div className="rounded-[1.6rem] bg-beige p-5">
                <p className="text-xs uppercase tracking-[0.18em] text-text-muted">Confidence</p>
                <p className="mt-3 text-xl font-semibold tracking-[-0.02em] text-text-dark">{latestItem?.confidence ?? 0}%</p>
              </div>
            </div>
          </Card>

          <Card>
            <p className="panel-label">Quick actions</p>
            <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-text-dark">Get started</h3>
            <div className="mt-5 space-y-3">
              <Link to="/upload">
                <Button className="w-full justify-start">
                  <FileText className="h-4 w-4" />
                  Upload image
                </Button>
              </Link>
              <Link to="/farms">
                <Button variant="secondary" className="w-full justify-start">
                  <LandPlot className="h-4 w-4" />
                  Manage farms
                </Button>
              </Link>
              <Link to="/chat">
                <Button variant="ghost" className="w-full justify-start">
                  <Sparkles className="h-4 w-4" />
                  Open assistant
                </Button>
              </Link>
            </div>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="panel-label">Weekly detections</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Crop activity trend</h3>
              </div>
              <div className="rounded-xl bg-moss-pale p-3 text-moss">
                <Activity className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid vertical={false} stroke="#e7e1d7" />
                  <XAxis dataKey="crop" stroke="#8a948b" axisLine={false} tickLine={false} />
                  <YAxis stroke="#8a948b" axisLine={false} tickLine={false} />
                  <Bar dataKey="value" fill="#3d6b45" radius={[10, 10, 0, 0]} animationDuration={900} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>

          <Card>
            <div className="flex items-center justify-between">
              <div>
                <p className="panel-label">Live alerts</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Response queue</h3>
              </div>
              <Link to="/alerts">
                <Button variant="ghost" className="px-3 py-2">
                  <ArrowUpRight className="h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="mt-6 space-y-3">
              {(dashboard?.topDiseases ?? []).slice(0, 3).map((item) => {
                const tone = String(item.severity).toLowerCase() === 'high' || String(item.severity).toLowerCase() === 'severe' ? 'danger' : String(item.severity).toLowerCase() === 'moderate' ? 'warning' : 'success';
                return (
                  <div key={item.id ?? `${item.locationName}-${item.disease}`} className="rounded-2xl border border-[#d9d4c8] bg-white px-4 py-4">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex items-start gap-3 min-w-0">
                        <span className={`mt-1 flex-shrink-0 h-2.5 w-2.5 rounded-full ${tone === 'danger' ? 'bg-rose-500' : tone === 'warning' ? 'bg-amber-500' : 'bg-moss'}`} />
                        <div className="min-w-0">
                          <p className="text-sm font-medium text-text-dark truncate">{item.locationName ?? 'Unknown'}</p>
                          <p className="mt-1 text-sm leading-5 text-text-mid truncate">{item.disease ?? 'Unknown'}</p>
                        </div>
                      </div>
                      <Badge variant={tone} className="flex-shrink-0">{tone}</Badge>
                    </div>
                  </div>
                );
              })}
              {(!dashboard?.topDiseases || dashboard.topDiseases.length === 0) && (
                <div className="rounded-2xl border border-dashed border-earth-200 bg-earth-50 px-4 py-6 text-center">
                  <p className="text-sm text-text-mid">No alerts yet. Upload analysis to generate alerts.</p>
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}

export default Dashboard;
