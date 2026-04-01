import { AnimatePresence, motion } from 'framer-motion';
import { ArrowRight, BrainCircuit, Leaf, ShieldCheck, Sparkles, Upload, X } from 'lucide-react';
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
    title: 'Clear AI output',
    description: 'See the disease, confidence, and severity in a format that is easy to scan.',
  },
  {
    icon: Upload,
    title: 'Simple upload flow',
    description: 'Upload a leaf image once, then review the analysis without extra steps.',
  },
  {
    icon: ShieldCheck,
    title: 'Action-ready guidance',
    description: 'Get concise recommendations you can act on right away.',
  },
];

const steps = [
  ['01', 'Upload a crop image', 'Add one clear field image with an optional location.'],
  ['02', 'Review weather-aware analysis', 'The backend resolves location, checks weather, and prepares the context.'],
  ['03', 'Use the recommendation', 'Open the report and chat for follow-up guidance.'],
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
                  How it Works
                </a>
                <a href="#start" onClick={() => setOpen(false)} className="block rounded-2xl bg-white px-4 py-3">
                  Get Started
                </a>
                <Link to="/login" className="block">
                  <Button className="mt-2 w-full">Get Started</Button>
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="page-wrap space-y-20 py-10 sm:py-14 lg:py-16">
        <section id="start" className="grid items-center gap-10 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6 lg:pr-4">
            <span className="inline-flex items-center gap-2 rounded-full bg-moss-pale px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-moss">
              <Sparkles className="h-3.5 w-3.5" />
              Crop intelligence start page
            </span>
            <h1 className="max-w-2xl text-4xl font-semibold leading-[1.05] tracking-[-0.04em] text-text-dark sm:text-5xl lg:text-6xl">
              One clear place to upload, review, and act on crop analysis.
            </h1>
            <p className="max-w-xl text-base leading-8 text-text-mid sm:text-lg">
              Upload a field image, let the backend resolve location and weather context, then read a concise AI
              recommendation without hunting through extra screens.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link to="/login">
                <Button>
                  Start with AgriVision
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <a href="#workflow">
                <Button variant="secondary">See the flow</Button>
              </a>
            </div>
            <div className="grid max-w-2xl gap-3 pt-2 sm:grid-cols-3">
              {[
                ['1 image', 'One upload starts the analysis'],
                ['Weather', 'Location-aware context'],
                ['LLM output', 'Short, practical guidance'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-2xl border border-[#d9d4c8] bg-white/80 px-4 py-4">
                  <p className="text-xl font-display text-text-dark">{value}</p>
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
              <div className="grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-[1.6rem] bg-text-dark p-5 text-white">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="panel-label !text-white/55">What the user sees</p>
                      <h2 className="mt-2 text-2xl font-semibold tracking-[-0.02em]">A calmer analysis screen</h2>
                    </div>
                    <span className="ai-dot" />
                  </div>
                  <div className="mt-6 grid gap-3 sm:grid-cols-2">
                    {[
                      ['Upload', 'Image + location'],
                      ['Weather', 'Resolved automatically'],
                      ['LLM', 'Practical recommendation'],
                      ['Chat', 'Follow-up context'],
                    ].map(([title, subtitle]) => (
                      <div key={title} className="rounded-2xl bg-white/8 p-4">
                        <p className="text-sm font-medium text-white">{title}</p>
                        <p className="mt-2 text-sm text-white/65">{subtitle}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4">
                  <div className="rounded-[1.6rem] bg-beige p-5">
                    <p className="panel-label">Response style</p>
                    <div className="mt-4 flex items-end justify-between">
                      <p className="text-4xl font-bold tracking-[-0.03em] text-text-dark">Short</p>
                      <span className="rounded-full bg-moss-pale px-3 py-1 text-xs font-semibold text-moss">Clear</span>
                    </div>
                    <div className="mt-6 rounded-2xl bg-white px-4 py-4 text-sm leading-7 text-text-mid">
                      The home page should explain the product, not the workflow in detail. The workflow belongs after the user enters the platform.
                    </div>
                  </div>
                  <div className="rounded-[1.6rem] bg-moss-pale p-5">
                    <p className="panel-label">What happens next</p>
                    <p className="mt-4 text-lg font-medium leading-8 text-text-dark">
                      After login, users go to Upload, review the result, then open reports or chat for follow-up.
                    </p>
                    <div className="mt-5 flex flex-wrap gap-2">
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-text-mid">Upload</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-text-mid">Review</span>
                      <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-text-mid">Act</span>
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
          <div className="grid gap-6 md:grid-cols-3">
            {[
              ['Upload first', 'Start with one image and optional location.'],
              ['Then review', 'See the disease result and weather-aware advice.'],
              ['Then act', 'Open reports or chat for the next step.'],
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl bg-white/8 px-4 py-4">
                <p className="text-2xl font-display">{value}</p>
                <p className="mt-2 text-sm text-white/72">{label}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="features" className="grid gap-6 xl:grid-cols-[0.78fr_1.22fr]">
          <div className="space-y-4">
            <p className="panel-label text-moss">What it does</p>
            <h2 className="text-3xl font-semibold tracking-[-0.03em] text-text-dark sm:text-4xl">A focused home page for a focused product.</h2>
            <p className="max-w-md text-base leading-8 text-text-mid">
              Keep the home page short. The actual work starts after sign-in, where users upload and review analysis.
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
          {steps.map(([step, title, description]) => (
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

        <section className="rounded-[2rem] bg-beige px-8 py-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-3">
              <p className="panel-label text-moss">Ready to begin</p>
              <h2 className="text-3xl font-semibold tracking-[-0.03em] text-text-dark">Log in, upload one image, and get a clear result.</h2>
              <p className="text-base leading-8 text-text-mid">
                The start page now stays simple. The analysis workflow lives inside the app after login.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link to="/login">
                <Button>Get Started</Button>
              </Link>
              <a href="#start">
                <Button variant="secondary">Back to top</Button>
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
