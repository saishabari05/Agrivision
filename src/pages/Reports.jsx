import { Download, Search } from 'lucide-react';
import { useEffect, useState } from 'react';
import AppFrame from '../components/AppFrame';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Toast from '../components/Toast';

const reports = [
  { id: 'REP-2041', crop: 'Tomato', date: '2026-03-31', severity: 'Moderate', status: 'Completed' },
  { id: 'REP-2039', crop: 'Apple', date: '2026-03-29', severity: 'High', status: 'Completed' },
  { id: 'REP-2033', crop: 'Grape', date: '2026-03-24', severity: 'Low', status: 'Archived' },
];

function Reports() {
  const [selected, setSelected] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) return undefined;
    const timer = window.setTimeout(() => setShowToast(false), 3000);
    return () => window.clearTimeout(timer);
  }, [showToast]);

  return (
    <AppFrame title="Reports Center" subtitle="Search, sort, inspect, and export disease reports across your operations.">
      <Card>
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.6fr_0.6fr_0.6fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input className="field pl-11" placeholder="Search by report ID, crop, or date" />
          </div>
          <select className="field"><option>All crops</option><option>Tomato</option><option>Apple</option><option>Grape</option></select>
          <select className="field"><option>Date range</option><option>Last 7 days</option><option>Last 30 days</option></select>
          <select className="field"><option>All severity</option><option>High</option><option>Moderate</option><option>Low</option></select>
        </div>
      </Card>

      <div className="mt-6 space-y-4">
        {reports.map((report) => (
          <Card key={report.id}>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.2em] text-text-muted">{report.id}</p>
                <h3 className="mt-3 text-3xl">{report.crop} Disease Report</h3>
                <p className="mt-2 text-sm text-text-mid">{report.date}</p>
              </div>
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={report.severity === 'High' ? 'danger' : report.severity === 'Moderate' ? 'warning' : 'success'}>
                  {report.severity}
                </Badge>
                <Badge variant="info">{report.status}</Badge>
                <Button variant="secondary" onClick={() => setSelected(report)}>View</Button>
                <Button onClick={() => setShowToast(true)}>
                  <Download className="h-4 w-4" />
                  Download
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `${selected.id} details` : 'Report details'}>
        {selected && (
          <div className="space-y-6">
            <div className="grid gap-6 md:grid-cols-[0.8fr_1.2fr]">
              <div className="rounded-3xl bg-beige p-6">
                <div className="flex h-56 items-center justify-center rounded-3xl border border-dashed border-moss/20 bg-white text-text-muted">
                  Detection image placeholder
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                {[
                  ['Disease', 'Early Blight'],
                  ['Confidence', '94%'],
                  ['Affected area', '18%'],
                  ['Severity', selected.severity],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-2xl bg-beige p-4">
                    <p className="text-sm text-text-muted">{label}</p>
                    <p className="mt-2 text-xl text-text-dark">{value}</p>
                  </div>
                ))}
              </div>
            </div>
            <div className="rounded-3xl bg-moss-pale p-6">
              <p className="text-sm uppercase tracking-[0.2em] text-moss">Recommendations</p>
              <ul className="mt-4 space-y-3 text-sm leading-7 text-text-mid">
                <li>Prune infected foliage and improve canopy airflow.</li>
                <li>Apply labeled fungicide rotation based on your crop schedule.</li>
                <li>Review adjacent blocks for disease spread within 72 hours.</li>
              </ul>
            </div>
          </div>
        )}
      </Modal>
      <Toast message="PDF download started." show={showToast} />
    </AppFrame>
  );
}

export default Reports;

