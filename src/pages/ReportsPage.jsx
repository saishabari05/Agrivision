import { motion } from 'framer-motion';
import { Download, Search, Trash2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import Modal from '../components/ui/Modal';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { downloadReportPdf } from '../services/pdfService';
import { formatDate, severityColor } from '../utils/formatters';

function ReportsPage() {
  const { reports, deleteReport } = useAuth();
  const [filters, setFilters] = useState({ query: '', crop: 'All', severity: 'All', sort: 'Newest' });
  const [selectedReport, setSelectedReport] = useState(null);

  const filteredReports = useMemo(() => {
    return reports
      .filter((report) => (filters.crop === 'All' ? true : report.crop === filters.crop))
      .filter((report) => (filters.severity === 'All' ? true : report.severity === filters.severity))
      .filter((report) => {
        const haystack = `${report.crop} ${report.disease} ${report.locationName}`.toLowerCase();
        return haystack.includes(filters.query.toLowerCase());
      })
      .sort((a, b) =>
        filters.sort === 'Newest'
          ? new Date(b.reportDate) - new Date(a.reportDate)
          : new Date(a.reportDate) - new Date(b.reportDate),
      );
  }, [filters, reports]);

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <SectionHeading
        eyebrow="Reports"
        title="Generated crop reports"
        description="Filter by crop, disease severity, or date and open any report to inspect AI recommendations."
      />

      <div className="glass-panel p-5">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-[1.2fr_0.45fr_0.45fr_0.4fr]">
          <label className="relative block">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={filters.query}
              onChange={(event) => setFilters((current) => ({ ...current, query: event.target.value }))}
              className="field pl-11"
              placeholder="Search by crop, disease, or location"
            />
          </label>
          <select
            value={filters.crop}
            onChange={(event) => setFilters((current) => ({ ...current, crop: event.target.value }))}
            className="field"
          >
            {['All', 'Tomato', 'Apple', 'Grape'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <select
            value={filters.severity}
            onChange={(event) => setFilters((current) => ({ ...current, severity: event.target.value }))}
            className="field"
          >
            {['All', 'High', 'Moderate', 'Low'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
          <select
            value={filters.sort}
            onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
            className="field"
          >
            {['Newest', 'Oldest'].map((option) => (
              <option key={option}>{option}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredReports.map((report) => (
          <div key={report.id} className="glass-panel p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-xl font-bold text-slate-900">{report.disease}</h3>
                  <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityColor(report.severity)}`}>
                    {report.severity}
                  </span>
                </div>
                <p className="text-sm text-slate-600">
                  {report.crop} • {report.locationName} • {formatDate(report.reportDate)}
                </p>
                <p className="max-w-3xl text-sm leading-6 text-slate-500">{report.summary}</p>
              </div>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" onClick={() => setSelectedReport(report)}>
                  View details
                </Button>
                <Button variant="secondary" onClick={() => downloadReportPdf(report)}>
                  <Download className="h-4 w-4" />
                  PDF
                </Button>
                <Button variant="ghost" onClick={() => deleteReport(report.id)}>
                  <Trash2 className="h-4 w-4" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={Boolean(selectedReport)} onClose={() => setSelectedReport(null)} title="Report details">
        {selectedReport && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              {[
                ['Report ID', selectedReport.id],
                ['Crop', selectedReport.crop],
                ['Disease', selectedReport.disease],
                ['Confidence', `${selectedReport.confidence}%`],
                ['Severity', selectedReport.severity],
                ['Date', formatDate(selectedReport.reportDate)],
              ].map(([label, value]) => (
                <div key={label} className="rounded-3xl bg-earth-50 p-4">
                  <p className="text-sm text-slate-500">{label}</p>
                  <p className="mt-2 font-semibold text-slate-900">{value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-3xl bg-moss-900 p-5 text-white">
              <p className="text-sm uppercase tracking-[0.16em] text-white/70">Summary</p>
              <p className="mt-3 text-sm leading-7 text-white/85">{selectedReport.summary}</p>
            </div>

            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">AI recommendations</p>
              <div className="mt-3 space-y-3">
                {selectedReport.recommendations.map((item) => (
                  <div key={item} className="rounded-3xl bg-earth-50 px-4 py-3 text-sm text-slate-700">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </Modal>
    </motion.div>
  );
}

export default ReportsPage;
