import {
  Activity,
  AlertTriangle,
  ArrowUpRight,
  BellRing,
  BrainCircuit,
  FileText,
  LandPlot,
  Sparkles,
} from 'lucide-react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from 'recharts';
import { Link } from 'react-router-dom';
import AppFrame from '../components/AppFrame';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import MetricCard from '../components/MetricCard';

const chartData = [
  { crop: 'Tomato', value: 28 },
  { crop: 'Apple', value: 18 },
  { crop: 'Grape', value: 12 },
  { crop: 'Mixed', value: 22 },
];

function Dashboard() {
  return (
    <AppFrame title="Welcome back, Aarav" subtitle="A live agricultural intelligence workspace across farms, alerts, spread zones, and AI guidance.">
      <div className="space-y-6">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Farms monitored" value="14" trend="+2 new sites" />
          <MetricCard label="Detections this week" value="43" trend="+8 new cases" />
          <MetricCard label="Alerts active" value="09" trend="3 critical alerts" positive={false} />
          <MetricCard label="Reports generated" value="37" trend="+6 this week" />
        </div>

        <div className="grid gap-5 xl:grid-cols-[1.18fr_0.82fr]">
          <Card className="overflow-hidden">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div>
                <p className="panel-label">AI recommendations</p>
                <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Cross-farm attention summary</h3>
                <p className="mt-3 max-w-xl text-sm leading-7 text-text-mid">
                  AgriVision is prioritizing disease spread, neighbouring cluster risk, and contact coordination.
                </p>
              </div>
              <div className="rounded-2xl bg-moss-pale px-4 py-3">
                <div className="flex items-center gap-2">
                  <span className="ai-dot" />
                  <span className="text-sm font-semibold text-moss">LLM and detection models active</span>
                </div>
              </div>
            </div>
            <div className="mt-6 grid gap-4 lg:grid-cols-[1.02fr_0.98fr]">
              <div className="rounded-[1.6rem] bg-text-dark p-5 text-white">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="panel-label !text-white/50">Priority spread cluster</p>
                    <h4 className="mt-2 text-xl font-semibold tracking-[-0.02em]">Shimla neighbourhood risk increasing</h4>
                  </div>
                  <div className="rounded-xl bg-white/10 p-3">
                    <AlertTriangle className="h-5 w-5 text-[#ffcf8a]" />
                  </div>
                </div>
                <div className="mt-6 grid gap-3 sm:grid-cols-2">
                  {[
                    ['Neighbouring farms', '14'],
                    ['High-risk farms', '5'],
                    ['Dominant disease', 'Apple Scab'],
                    ['Action', 'Contact growers today'],
                  ].map(([label, value]) => (
                    <div key={label} className="rounded-2xl bg-white/8 p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-white/48">{label}</p>
                      <p className="mt-2 text-sm font-medium text-white">{value}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4">
                {[
                  [BrainCircuit, 'Model summary', 'Spread pattern matches humidity-driven orchard escalation across neighbouring farms.'],
                  [Sparkles, 'Suggested response', 'Notify Priya Sharma and trigger follow-up scans for adjacent blocks within 24 hours.'],
                ].map(([Icon, title, body], index) => (
                  <div key={title} className={`rounded-[1.6rem] p-5 ${index === 0 ? 'bg-beige' : 'bg-moss-pale'}`}>
                    <div className="flex items-start gap-4">
                      <div className="rounded-xl bg-white p-3 text-moss shadow-sm">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <p className="text-lg font-semibold tracking-[-0.02em] text-text-dark">{title}</p>
                        <p className="mt-2 text-sm leading-7 text-text-mid">{body}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
              {[
                ['Shimla Orchard Belt', 'Rapid apple scab spread detected', 'danger'],
                ['Nashik North Estate', 'Follow-up treatment review required', 'warning'],
                ['Pune Vineyard Cluster', 'Localized low-severity stress', 'success'],
              ].map(([farm, label, tone]) => (
                <div key={farm} className="rounded-2xl border border-[#d9d4c8] bg-white px-4 py-4">
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <span className={`mt-1 h-2.5 w-2.5 rounded-full ${tone === 'danger' ? 'bg-rose-500' : tone === 'warning' ? 'bg-amber-500' : 'bg-moss'}`} />
                      <div>
                        <p className="text-sm font-medium text-text-dark">{farm}</p>
                        <p className="mt-1 text-sm leading-6 text-text-mid">{label}</p>
                      </div>
                    </div>
                    <Badge variant={tone}>{tone}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>

        <div className="grid gap-5 xl:grid-cols-[1fr_0.58fr]">
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
            <p className="panel-label">Quick actions</p>
            <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Control panel</h3>
            <div className="mt-5 grid gap-3">
              <Link to="/upload"><Button className="w-full justify-start"><FileText className="h-4 w-4" />Upload image</Button></Link>
              <Link to="/farms"><Button variant="secondary" className="w-full justify-start"><LandPlot className="h-4 w-4" />Manage farms</Button></Link>
              <Link to="/alerts"><Button variant="ghost" className="w-full justify-start"><BellRing className="h-4 w-4" />Review alerts</Button></Link>
            </div>
            <div className="mt-6 space-y-3">
              {[
                [Sparkles, 'LLM assistant can summarize spread patterns across farms'],
                [BellRing, '3 growers need contact follow-up today'],
              ].map(([Icon, text]) => (
                <div key={text} className="rounded-2xl bg-beige px-4 py-4">
                  <div className="flex items-start gap-3">
                    <div className="rounded-xl bg-white p-2.5 text-moss shadow-sm">
                      <Icon className="h-4 w-4" />
                    </div>
                    <p className="text-sm leading-6 text-text-dark">{text}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </AppFrame>
  );
}

export default Dashboard;
