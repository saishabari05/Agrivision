import { CalendarRange, Filter, MapPinned, Radar, TriangleAlert } from 'lucide-react';
import AppFrame from '../components/AppFrame';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';

function Heatmap() {
  return (
    <AppFrame title="Neighbourhood Spread Heatmap" subtitle="Track nearby farm risk spread, outbreak clusters, and region-level disease intensity.">
      <div className="space-y-6">
        <Card>
          <div className="grid gap-4 xl:grid-cols-[1.2fr_0.7fr_0.7fr_0.7fr]">
            <select className="field">
              <option>All regions</option>
              <option>Nashik cluster</option>
              <option>Shimla cluster</option>
              <option>Pune cluster</option>
            </select>
            <select className="field">
              <option>All crops</option>
              <option>Tomato</option>
              <option>Apple</option>
              <option>Grape</option>
            </select>
            <select className="field">
              <option>Last 7 days</option>
              <option>Last 14 days</option>
              <option>Last 30 days</option>
            </select>
            <Button variant="secondary">
              <Filter className="h-4 w-4" />
              Apply filters
            </Button>
          </div>
        </Card>

        <div className="grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
          <Card className="overflow-hidden">
            <div className="flex items-center justify-between">
              <div>
                <p className="panel-label">Spread visualization</p>
                <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-text-dark">Neighbourhood disease intensity map</h2>
              </div>
              <div className="rounded-2xl bg-moss-pale p-3 text-moss">
                <MapPinned className="h-5 w-5" />
              </div>
            </div>

            <div className="mt-5 grid h-[420px] grid-cols-6 gap-3 rounded-[1.8rem] bg-beige p-4">
              <div className="col-span-2 rounded-[1.25rem] bg-moss/20" />
              <div className="rounded-[1.25rem] bg-amber-200" />
              <div className="col-span-2 rounded-[1.25rem] bg-rose-200" />
              <div className="rounded-[1.25rem] bg-moss/15" />
              <div className="col-span-3 rounded-[1.25rem] bg-rose-300" />
              <div className="rounded-[1.25rem] bg-amber-100" />
              <div className="col-span-2 rounded-[1.25rem] bg-moss/10" />
              <div className="col-span-2 rounded-[1.25rem] bg-amber-200" />
              <div className="rounded-[1.25rem] bg-rose-200" />
              <div className="col-span-3 rounded-[1.25rem] bg-moss/15" />
              <div className="col-span-2 rounded-[1.25rem] bg-amber-200" />
              <div className="rounded-[1.25rem] bg-moss/20" />
            </div>

            <div className="mt-5 flex flex-wrap gap-4 text-sm text-text-mid">
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-moss/60" /> Low spread</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-amber-400" /> Medium spread</span>
              <span className="inline-flex items-center gap-2"><span className="h-3 w-3 rounded-full bg-rose-400" /> High spread</span>
            </div>
          </Card>

          <div className="space-y-5">
            <Card>
              <p className="panel-label">Selected cluster</p>
              <h3 className="mt-2 text-2xl font-semibold tracking-[-0.02em] text-text-dark">Shimla Orchard Belt</h3>
              <div className="mt-5 grid gap-3">
                {[
                  ['Neighbouring farms', '14'],
                  ['High-risk farms', '5'],
                  ['Dominant disease', 'Apple Scab'],
                  ['Spread direction', 'North-East'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-beige px-4 py-4">
                    <p className="text-sm text-text-muted">{label}</p>
                    <p className="mt-2 font-medium text-text-dark">{value}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card>
              <div className="flex items-center justify-between">
                <div>
                  <p className="panel-label">Spread intelligence</p>
                  <h3 className="mt-2 text-xl font-semibold tracking-[-0.02em] text-text-dark">Outbreak summary</h3>
                </div>
                <Radar className="h-5 w-5 text-moss" />
              </div>
              <div className="mt-4 space-y-3">
                <div className="rounded-2xl bg-rose-50 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-text-dark">High concentration around orchard rows 3 to 7</p>
                    <Badge variant="danger">Critical</Badge>
                  </div>
                </div>
                <div className="rounded-2xl bg-amber-50 px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-text-dark">Weather pattern may increase spread within 48 hours</p>
                    <Badge variant="warning">Forecast</Badge>
                  </div>
                </div>
                <div className="rounded-2xl bg-moss-pale px-4 py-4">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-sm text-text-dark">Follow-up scan advised for all neighbouring farms</p>
                    <Badge variant="success">Action</Badge>
                  </div>
                </div>
              </div>
            </Card>

            <Card>
              <div className="flex items-center gap-3">
                <CalendarRange className="h-5 w-5 text-moss" />
                <div>
                  <p className="panel-label">Observation window</p>
                  <p className="mt-1 text-sm text-text-dark">Updated with the last 7-day disease movement data</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </AppFrame>
  );
}

export default Heatmap;

