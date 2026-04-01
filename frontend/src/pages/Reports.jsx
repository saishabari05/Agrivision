import { Download, Search } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import AppFrame from '../components/AppFrame';
import Badge from '../components/Badge';
import Button from '../components/Button';
import Card from '../components/Card';
import Modal from '../components/Modal';
import Toast from '../components/Toast';
import { useAuth } from '../context/AuthContext';
import { downloadReportPdf } from '../services/pdfService';
import { formatDate } from '../utils/formatters';

function Reports() {
  const { reports, farms } = useAuth();
  const [filters, setFilters] = useState({ query: '', crop: 'All', severity: 'All' });
  const [selected, setSelected] = useState(null);
  const [showToast, setShowToast] = useState(false);

  useEffect(() => {
    if (!showToast) return undefined;
    const timer = window.setTimeout(() => setShowToast(false), 3000);
    return () => window.clearTimeout(timer);
  }, [showToast]);

  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => (filters.crop === 'All' ? true : report.crop === filters.crop))
      .filter((report) => (filters.severity === 'All' ? true : report.severity === filters.severity))
      .filter((report) => {
        const haystack = `${report.id} ${report.crop} ${report.disease} ${report.locationName} ${report.reportDate}`.toLowerCase();
        return haystack.includes(filters.query.toLowerCase());
      });
  }, [filters, reports]);

  const getFarmForReport = (report) => {
    return farms.find((farm) =>
      String(farm.location ?? '').toLowerCase().includes(String(report.locationName ?? '').toLowerCase()) ||
      String(report.locationName ?? '').toLowerCase().includes(String(farm.location ?? '').toLowerCase()),
    );
  };

  const matchedFarm = selected ? getFarmForReport(selected) : null;

  const handleDownload = (report) => {
    downloadReportPdf(report);
    setShowToast(true);
  };

  return (
    <AppFrame title="Reports Center" subtitle="Search, inspect, export, and share crop disease reports across your farms.">
      <Card>
        <div className="grid gap-4 xl:grid-cols-[1.2fr_0.6fr_0.6fr]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-text-muted" />
            <input
              value={filters.query}
              onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
              className="field pl-11"
              placeholder="Search by report ID, crop, disease, or location"
            />
          </div>
          <select value={filters.crop} onChange={(event) => setFilters((current) => ({ ...current, crop: event.target.value }))} className="field">
            {['All', 'Tomato', 'Apple', 'Grape'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <select value={filters.severity} onChange={(event) => setFilters((current) => ({ ...current, severity: event.target.value }))} className="field">
            {['All', 'High', 'Moderate', 'Low'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </Card>

      <div className="mt-6 space-y-4">
        {filteredReports.map((report) => {
          const farmForReport = getFarmForReport(report);
          return (
            <Card key={report.id}>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-text-muted">{report.id}</p>
                  <h3 className="mt-3 text-3xl">{report.crop} Disease Report</h3>
                  <p className="mt-2 text-sm text-text-mid">{formatDate(report.reportDate)} • {report.locationName ?? 'Unknown location'}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={report.severity === 'High' ? 'danger' : report.severity === 'Moderate' ? 'warning' : 'success'}>
                    {report.severity}
                  </Badge>
                  <Badge variant="info">{report.status ?? 'Completed'}</Badge>
                  {farmForReport?.email && (
                    <a href={`mailto:${farmForReport.email}?subject=${encodeURIComponent(`${report.crop} disease report`)}&body=${encodeURIComponent(report.summary ?? '')}`}>
                      <Button variant="secondary">Send email</Button>
                    </a>
                  )}
                  {farmForReport?.phone && (
                    <a href={`https://wa.me/${farmForReport.phone.replace(/\D/g, '')}?text=${encodeURIComponent(report.summary ?? '')}`} target="_blank" rel="noreferrer">
                      <Button variant="secondary">WhatsApp</Button>
                    </a>
                  )}
                  <Button variant="secondary" onClick={() => setSelected(report)}>View</Button>
                  <Button onClick={() => handleDownload(report)}>
                    <Download className="h-4 w-4" />
                    Download
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}

        {!filteredReports.length && (
          <Card>
            <p className="text-sm text-text-mid">No reports match the current filters.</p>
          </Card>
        )}
      </div>

      <Modal isOpen={Boolean(selected)} onClose={() => setSelected(null)} title={selected ? `${selected.id} - ${selected.crop} Report` : 'Report details'}>
        {selected && (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-beige p-4">
                <p className="text-xs uppercase tracking-wide text-text-muted">Disease</p>
                <p className="mt-2 text-lg font-semibold text-text-dark">{selected.disease ?? 'Unknown'}</p>
              </div>
              <div className="rounded-2xl bg-moss-pale p-4">
                <p className="text-xs uppercase tracking-wide text-text-muted">Confidence</p>
                <p className="mt-2 text-lg font-semibold text-moss">{selected.confidence ?? 0}%</p>
              </div>
              <div className="rounded-2xl bg-earth-50 p-4">
                <p className="text-xs uppercase tracking-wide text-text-muted">Severity</p>
                <p className="mt-2 text-lg font-semibold text-text-dark">{selected.severity ?? 'Unknown'}</p>
              </div>
              <div className="rounded-2xl bg-white border border-[#e8e1d7] p-4">
                <p className="text-xs uppercase tracking-wide text-text-muted">Location</p>
                <p className="mt-2 text-sm font-semibold text-text-dark truncate">{selected.locationName ?? 'Unknown'}</p>
              </div>
            </div>

            {/* Report Info */}
            <div className="rounded-2xl bg-gray-50 p-4 space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-sm text-text-muted">Report ID</p>
                <p className="font-mono text-sm font-medium">{selected.id}</p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <p className="text-sm text-text-muted">Date</p>
                <p className="text-sm font-medium">{formatDate(selected.reportDate)}</p>
              </div>
              <div className="flex items-center justify-between border-t border-gray-200 pt-3">
                <p className="text-sm text-text-muted">Crop</p>
                <p className="text-sm font-medium">{selected.crop}</p>
              </div>
            </div>

            {/* Summary & Recommendation */}
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-text-muted mb-3">Analysis & Recommendation</p>
              <div className="rounded-2xl bg-moss-pale p-4 text-sm leading-relaxed text-text-dark">
                {selected.summary ?? selected.recommendation ?? 'No analysis available.'}
              </div>
            </div>

            {/* Download Button */}
            <div className="flex gap-3">
              <Button onClick={() => handleDownload(selected)} className="flex-1">
                <Download className="h-4 w-4" />
                Download PDF Report
              </Button>
              <Button variant="secondary" onClick={() => setSelected(null)}>
                Close
              </Button>
            </div>
          </div>
        )}
      </Modal>
      <Toast message="PDF download started." show={showToast} />
    </AppFrame>
  );
}

export default Reports;
