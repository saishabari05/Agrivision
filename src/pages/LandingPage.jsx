import { motion } from 'framer-motion';
import { ArrowRight, Bot, FileText, MapPinned, ShieldCheck, Upload } from 'lucide-react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import Button from '../components/ui/Button';

const features = [
  {
    title: 'Precision Upload Analysis',
    description: 'Upload field images and route them into AI prediction pipelines with location metadata.',
    icon: Upload,
  },
  {
    title: 'Actionable Reports',
    description: 'Create recommendation-rich PDF reports for agronomists, field teams, and growers.',
    icon: FileText,
  },
  {
    title: 'Severity Mapping',
    description: 'Track crop health geographically with color-coded map overlays and seasonal monitoring.',
    icon: MapPinned,
  },
  {
    title: 'Secure Identity',
    description: 'Authenticate with email or Google OAuth, ready to swap to production auth providers.',
    icon: ShieldCheck,
  },
];

function LandingPage() {
  return (
    <div className="page-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <header className="glass-panel flex items-center justify-between px-5 py-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="AgriVision logo" className="h-12 w-12 rounded-2xl" />
            <div>
              <p className="text-lg font-bold text-slate-900">AgriVision</p>
              <p className="text-sm text-slate-500">AI agriculture platform</p>
            </div>
          </div>
          <Link to="/login">
            <Button>Sign in</Button>
          </Link>
        </header>

        <section className="grid items-center gap-8 py-12 lg:grid-cols-[1.1fr_0.9fr] lg:py-20">
          <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="space-y-7">
            <span className="inline-flex rounded-full border border-moss-200 bg-moss-50 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-moss-700">
              Modern crop intelligence
            </span>
            <div className="space-y-5">
              <h1 className="max-w-3xl text-4xl font-extrabold leading-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Professional plant disease workflows for modern agriculture teams.
              </h1>
              <p className="max-w-2xl text-base leading-7 text-slate-600 sm:text-lg">
                AgriVision combines image-based AI predictions, report generation, map-driven field monitoring, and a
                future-ready agronomy chatbot in one responsive experience.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/login">
                <Button className="pr-4">
                  Launch platform
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="secondary">Explore features</Button>
              </a>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass-panel overflow-hidden p-5"
          >
            <div className="rounded-[2rem] bg-moss-900 p-6 text-white">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-white/70">Live operations snapshot</p>
                  <h2 className="mt-2 text-2xl font-bold">Field health overview</h2>
                </div>
                <div className="rounded-2xl bg-white/10 p-3">
                  <Bot className="h-6 w-6" />
                </div>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {[
                  ['128', 'Scans processed'],
                  ['37', 'Reports generated'],
                  ['9', 'High-risk zones'],
                ].map(([value, label]) => (
                  <div key={label} className="rounded-3xl bg-white/10 p-4">
                    <p className="text-2xl font-bold">{value}</p>
                    <p className="mt-1 text-sm text-white/75">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        </section>

        <section id="features" className="grid gap-4 pb-10 md:grid-cols-2 xl:grid-cols-4">
          {features.map(({ title, description, icon: Icon }) => (
            <motion.div key={title} whileHover={{ y: -4 }} className="glass-panel p-5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-moss-100 text-moss-700">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="mt-5 text-xl font-bold text-slate-900">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-slate-600">{description}</p>
            </motion.div>
          ))}
        </section>
      </div>
    </div>
  );
}

export default LandingPage;
