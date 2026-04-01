import { motion } from 'framer-motion';
import { Download, PencilLine, Save, Trash2 } from 'lucide-react';
import { useState } from 'react';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import { useAuth } from '../context/AuthContext';
import { downloadReportPdf } from '../services/pdfService';
import { formatDate } from '../utils/formatters';

function ProfilePage() {
  const { user, uploads, reports, updateProfile, deleteReport } = useAuth();
  const [form, setForm] = useState({
    name: user.name,
    email: user.email,
    location: user.location ?? '',
    farmName: user.farmName ?? '',
  });

  const handleSave = async (event) => {
    event.preventDefault();
    await updateProfile(form);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <SectionHeading
        eyebrow="Profile"
        title="Your AgriVision account"
        description="Review account details, uploaded scans, and previously generated reports in one place."
      />

      <div className="grid gap-6 xl:grid-cols-[0.88fr_1.12fr]">
        <div className="glass-panel p-6">
          <div className="flex items-center gap-4">
            <img src={user.avatar} alt={user.name} className="h-20 w-20 rounded-3xl object-cover" />
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{user.name}</h2>
              <p className="text-sm text-slate-500">{user.email}</p>
              <p className="mt-2 text-sm text-moss-700">{user.farmName}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Name</span>
              <input
                value={form.name}
                onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                className="field"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Email</span>
              <input
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="field"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Farm name</span>
              <input
                value={form.farmName}
                onChange={(event) => setForm((current) => ({ ...current, farmName: event.target.value }))}
                className="field"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm font-semibold text-slate-700">Location</span>
              <input
                value={form.location}
                onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                className="field"
              />
            </label>
            <Button type="submit" className="w-full">
              <Save className="h-4 w-4" />
              Save profile
            </Button>
          </form>
        </div>

        <div className="space-y-6">
          <div className="glass-panel p-5">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-earth-100 p-3 text-earth-700">
                <PencilLine className="h-5 w-5" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900">Uploaded images</h3>
                <p className="text-sm text-slate-500">{uploads.length} field scans stored for this account</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {uploads.map((item) => (
                <div key={item.id} className="rounded-3xl bg-earth-50 px-4 py-3">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {item.crop} • {item.disease}
                      </p>
                      <p className="text-sm text-slate-500">
                        {item.locationName} • {formatDate(item.uploadedAt)}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-moss-700">{item.confidence}%</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="glass-panel p-5">
            <h3 className="text-xl font-bold text-slate-900">Generated reports</h3>
            <div className="mt-5 space-y-3">
              {reports.map((report) => (
                <div key={report.id} className="rounded-3xl bg-earth-50 p-4">
                  <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="font-semibold text-slate-900">
                        {report.crop} • {report.disease}
                      </p>
                      <p className="text-sm text-slate-500">{formatDate(report.reportDate)}</p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="secondary" className="px-4 py-2" onClick={() => downloadReportPdf(report)}>
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" className="px-4 py-2" onClick={() => deleteReport(report.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export default ProfilePage;

