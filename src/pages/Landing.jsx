import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight,
  BrainCircuit,
  ChartNoAxesColumn,
  ShieldCheck,
  Sparkles,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo.png';
import Button from '../components/Button';
import Card from '../components/Card';
import Navbar from '../components/Navbar';

const ambient = {
  duration: 5,
  repeat: Infinity,
  ease: 'easeInOut',
};

const features = [
  {
    icon: BrainCircuit,
    title: 'AI disease intelligence',
    description: 'Turn crop imagery into confidence-led disease signals, severity flags, and decision-ready summaries.',
  },
  {
    icon: ChartNoAxesColumn,
    title: 'Operational reporting',
    description: 'Track detections, weekly shifts, and multi-farm activity with report workflows built for real teams.',
  },
  {
    icon: ShieldCheck,
    title: 'Enterprise-ready control',
    description: 'Support secure access, profile visibility, structured histories, and scalable rollout across operations.',
  },
];

function Landing() {
  const [open, setOpen] = useState(false);

  return (
    <div className="pb-10">
      <Navbar onOpenMenu={() => setOpen(true)} />
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-text-dark/30 lg:hidden"
          >
            <motion.div initial={{ x: -100 }} animate={{ x: 0 }} exit={{ x: -100 }} className="glass m-4 p-6">
              <div className="mb-6 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <img src={logo} alt="AgriVision logo" className="h-11 w-11 rounded-2xl bg-white p-1 object-contain shadow-md" />
                  <p className="font-display text-3xl">AgriVision</p>
                </div>
                <button onClick={() => setOpen(false)} className="rounded-full bg-moss-pale p-2 text-moss">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="space-y-3 text-text-mid">
                <a href="#features" onClick={() => setOpen(false)} className="block rounded-2xl bg-white px-4 py-3">
                  Features
                </a>
                <a href="#workflow" onClick={() => setOpen(false)} className="block rounded-2xl bg-white px-4 py-3">
                  Workflow
                </a>
                <a href="#trust" onClick={() => setOpen(false)} className="block rounded-2xl bg-white px-4 py-3">
                  Trust
                </a>
                <Link to="/login" className="block">
                  <Button className="mt-2 w-full">Get Started</Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="page-wrap space-y-16 pt-10 sm:pt-14">
        <section className="grid items-start gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6 pt-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-moss-pale px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-moss">
              <Sparkles className="h-3.5 w-3.5" />
              AI operations studio
            </span>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.08] tracking-[-0.03em] text-text-dark sm:text-5xl">
              Joyful, intelligent crop monitoring for serious agricultural teams.
            </h1>
            <p className="max-w-xl text-base leading-8 text-text-mid sm:text-lg">
              AgriVision combines disease detection, operational reporting, field visibility, and AI guidance in a
              product experience designed to feel premium, structured, and ready for real daily use.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/login">
                <Button>
                  Enter Platform
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#features">
                <Button variant="secondary">See Capability Map</Button>
              </a>
            </div>
            <div className="grid max-w-2xl gap-3 pt-2 sm:grid-cols-3">
              {[
                ['18', 'Active AI insights'],
                ['94%', 'Average confidence'],
                ['12', 'Multi-state operations'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-[#d9d4c8] bg-white/80 px-4 py-4">
                  <p className="text-2xl font-display text-text-dark">{value}</p>
                  <p className="mt-1 text-sm text-text-muted">{label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="relative">
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={ambient}
              className="surface overflow-hidden p-4 sm:p-5"
            >
              <div className="grid gap-4 lg:grid-cols-[1.05fr_0.85fr]">
                <div className="rounded-[1.6rem] bg-text-dark p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="panel-label !text-white/55">Live intelligence</p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">Detection Command</h2>
                    </div>
                    <span className="ai-dot" />
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      ['Tomato / Nashik', 'Early blight', '94%'],
                      ['Apple / Shimla', 'Scab risk', '91%'],
                      ['Grape / Pune', 'Low severity', '88%'],
                      ['Reports', '12 ready', 'Today'],
                    ].map(([title, subtitle, tag]) => (
                      <div key={title} className="rounded-2xl bg-white/8 p-4">
                        <p className="text-sm font-medium text-white">{title}</p>
                        <p className="mt-2 text-sm text-white/65">{subtitle}</p>
                        <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#d8e7d9]">{tag}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[1.6rem] bg-beige p-5">
                    <p className="panel-label">Model activity</p>
                    <div className="mt-4 flex items-end justify-between">
                      <p className="text-4xl font-bold tracking-[-0.03em] text-text-dark">24/7</p>
                      <span className="rounded-full bg-moss-pale px-3 py-1 text-xs font-semibold text-moss">Online</span>
                    </div>
                    <div className="mt-6 space-y-3">
                      <div className="h-2 rounded-full bg-white">
                        <div className="h-2 w-[82%] rounded-full bg-moss" />
                      </div>
                      <div className="flex items-center justify-between text-sm text-text-mid">
                        <span>Inference throughput</span>
                        <span>82%</span>
                      </div>
                    </div>
                  </div>
                  <div className="rounded-[1.6rem] bg-moss-pale p-5">
                    <p className="panel-label">Recommendation engine</p>
                    <p className="mt-4 text-xl font-medium text-text-dark">
                      Next-best-action suggestions are generated per crop, severity, and region.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-text-mid">Disease risk</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-text-mid">Severity</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-text-mid">Treatment guidance</span>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              animate={{ y: [0, -8, 0] }}
              transition={{ ...ambient, delay: 0.5 }}
              className="absolute -right-2 top-10 hidden rounded-full bg-white px-4 py-3 shadow-md md:block"
            >
              <p className="text-xs font-semibold uppercase tracking-[0.22em] text-text-muted">AI synced</p>
              <p className="mt-1 text-sm font-medium text-moss">18 live signals</p>
            </motion.div>
          </div>
        </section>

        <section className="rounded-[2rem] bg-moss px-6 py-8 text-white sm:px-8">
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {[
              ['3,000+', 'Acres under intelligence'],
              ['43', 'Weekly detections reviewed'],
              ['12', 'Operational regions'],
              ['37', 'Reports delivered this cycle'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-white/8 px-4 py-4">
                <p className="text-4xl font-display">{value}</p>
                <p className="mt-2 text-sm text-white/72">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-4">
            <p className="panel-label text-moss">Capability map</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-text-dark sm:text-4xl">Built like a real operating system for crop intelligence.</h2>
            <p className="max-w-md text-base leading-8 text-text-mid">
              The product experience is designed around actual workflows: scanning, reviewing, triaging, reporting, and
              taking action.
            </p>
          </div>
          <div className="grid gap-5 md:grid-cols-3">
            {features.map(({ icon: Icon, title, description }, index) => (
              <Card key={title} className={index === 1 ? 'bg-beige' : ''}>
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${index === 0 ? 'bg-moss-pale text-moss' : index === 1 ? 'bg-brown-pale text-brown' : 'bg-olive-pale text-olive'}`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-text-dark">{title}</h3>
                <p className="mt-3 text-sm leading-7 text-text-mid">{description}</p>
              </Card>
            ))}
          </div>
        </section>

        <section id="workflow" className="grid gap-5 lg:grid-cols-3">
          {[
            ['01', 'Capture field evidence', 'Upload crop images with location and contextual metadata.'],
            ['02', 'Interpret AI output', 'Review disease confidence, severity, and recommended next actions.'],
            ['03', 'Coordinate response', 'Share reports, track risks, and move operational teams faster.'],
          ].map(([step, title, description]) => (
            <Card key={step}>
              <div className="flex items-center justify-between">
                <span className="rounded-full bg-moss px-3 py-1 text-xs font-semibold text-white">{step}</span>
                <span className="ai-dot" />
              </div>
              <h3 className="mt-5 text-xl font-semibold tracking-[-0.02em] text-text-dark">{title}</h3>
              <p className="mt-3 text-sm leading-7 text-text-mid">{description}</p>
            </Card>
          ))}
        </section>

        <section id="trust" className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="rounded-[2rem] bg-text-dark px-8 py-10 text-white">
            <p className="panel-label !text-white/50">Why teams stay</p>
            <p className="mt-4 max-w-2xl text-2xl font-semibold leading-relaxed tracking-[-0.02em]">
              "AgriVision turns detection into a dependable daily workflow, not just an impressive demo."
            </p>
            <p className="mt-6 text-sm uppercase tracking-[0.22em] text-white/65">Operations Lead, Mist Agri Corps Ltd</p>
          </div>
          <div className="rounded-[2rem] bg-beige px-8 py-10">
            <p className="panel-label text-moss">Ready to launch</p>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-text-dark">Bring a more intelligent, more joyful operating layer to agriculture.</h2>
            <p className="mt-4 text-base leading-8 text-text-mid">
              AgriVision is designed to feel modern and alive while staying credible for serious operational use.
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link to="/login">
                <Button>Start with AgriVision</Button>
              </Link>
              <a href="#features">
                <Button variant="secondary">Explore architecture</Button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <footer className="mt-20 bg-text-dark py-10 text-white">
        <div className="page-wrap flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <img src={logo} alt="AgriVision logo" className="h-12 w-12 rounded-2xl bg-white p-1 object-contain shadow-md" />
            <div>
              <p className="font-display text-3xl">AgriVision</p>
              <p className="text-sm text-white/65">AI operations studio for modern agriculture</p>
            </div>
          </div>
          <div className="flex gap-6 text-sm text-white/75">
            <span>Platform</span>
            <span>Intelligence</span>
            <span>Security</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Landing;
