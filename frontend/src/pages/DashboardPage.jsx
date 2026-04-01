import { motion } from 'framer-motion';
import { Bot, FileText, MapPinned, ScanSearch, Sprout } from 'lucide-react';
import { Link } from 'react-router-dom';
import CropMap from '../components/CropMap';
import Button from '../components/ui/Button';
import SectionHeading from '../components/ui/SectionHeading';
import StatCard from '../components/ui/StatCard';
import { useAuth } from '../context/AuthContext';
import { formatDate, severityColor } from '../utils/formatters';

function DashboardPage() {
  const { uploads, reports } = useAuth();

  const highRiskCount = uploads.filter((upload) => upload.severity === 'High').length;

  return (
    <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <SectionHeading
        eyebrow="Overview"
        title="Crop intelligence dashboard"
        description="Track uploads, monitor field severity, and jump into the next workflow without losing context."
        actions={
          <>
            <Link to="/upload">
              <Button>Upload scan</Button>
            </Link>
            <Link to="/reports">
              <Button variant="secondary">View reports</Button>
            </Link>
          </>
        }
      />

      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          title="Total crops uploaded"
          value={uploads.length}
          detail="Across all monitored plots"
          icon={Sprout}
        />
        <StatCard title="Reports generated" value={reports.length} detail="Ready for PDF export" icon={FileText} />
        <StatCard title="Mapped locations" value={uploads.length} detail="Active field markers" icon={MapPinned} />
        <StatCard title="High-risk zones" value={highRiskCount} detail="Immediate follow-up needed" icon={ScanSearch} />
      </section>

      <section className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Field severity map</h2>
          <CropMap points={uploads} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-bold text-slate-900">Quick access</h2>
          <div className="grid gap-4 sm:grid-cols-3 xl:grid-cols-1">
            {[
              {
                title: 'New upload',
                description: 'Capture a crop image and trigger the disease prediction pipeline.',
                to: '/upload',
                icon: ScanSearch,
              },
              {
                title: 'Reports center',
                description: 'Sort, review, and export AI-generated field health reports.',
                to: '/reports',
                icon: FileText,
              },
              {
                title: 'Open assistant',
                description: 'Use the assistant for recommendations and report explanations.',
                to: '/chat',
                icon: Bot,
              },
            ].map(({ title, description, to, icon: Icon }) => (
              <Link key={title} to={to} className="glass-panel block p-5 transition hover:-translate-y-1">
                <div className="flex items-start gap-4">
                  <div className="rounded-2xl bg-moss-100 p-3 text-moss-700">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">Latest detections</h2>
        <div className="grid gap-4 lg:grid-cols-3">
          {uploads.slice(0, 3).map((item) => (
            <div key={item.id} className="glass-panel p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-slate-500">{item.crop}</p>
                  <h3 className="mt-1 text-xl font-bold text-slate-900">{item.disease}</h3>
                </div>
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${severityColor(item.severity)}`}>
                  {item.severity}
                </span>
              </div>
              <p className="mt-4 text-sm text-slate-600">{item.locationName}</p>
              <div className="mt-5 flex items-center justify-between text-sm text-slate-500">
                <span>{item.confidence}% confidence</span>
                <span>{formatDate(item.uploadedAt)}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}

export default DashboardPage;

