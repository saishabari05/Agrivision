import { AnimatePresence, motion } from 'framer-motion';
import {
  BellRing,
  Bell,
  Bot,
  FileText,
  LandPlot,
  LayoutDashboard,
  LogOut,
  MapPinned,
  ScanSearch,
  UserCircle2,
  Users,
  X,
} from 'lucide-react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/logo.png';

const items = [
  { to: '/overview', label: 'Overview', icon: Users },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/farms', label: 'Farms', icon: LandPlot },
  { to: '/heatmap', label: 'Heatmap', icon: MapPinned },
  { to: '/alerts', label: 'Alerts', icon: BellRing },
  { to: '/upload', label: 'Upload', icon: ScanSearch },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/profile', label: 'Profile', icon: UserCircle2 },
  { to: '/chat', label: 'Chat', icon: Bot },
];

function SidebarContent({ onClose }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="flex h-full flex-col">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="AgriVision logo" className="h-12 w-12 rounded-2xl bg-white p-1 object-contain shadow-md" />
          <div>
            <p className="text-[1.8rem] font-semibold leading-none tracking-[-0.02em] text-text-dark">AgriVision</p>
            <p className="text-[11px] uppercase tracking-[0.22em] text-text-muted">Crop Intelligence OS</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="rounded-full bg-moss-pale p-2 text-moss lg:hidden">
            <X className="h-5 w-5" />
          </button>
        )}
      </div>

      <div className="mb-5 rounded-3xl bg-beige/80 p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="panel-label">AI status</p>
            <p className="mt-2 text-sm font-medium text-text-dark">Models synced and monitoring</p>
          </div>
          <span className="ai-dot" />
        </div>
      </div>

      <nav className="space-y-2 overflow-hidden">
        {items.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={onClose}
            className={({ isActive }) =>
              `flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium ${
                isActive
                  ? 'bg-moss-pale text-moss shadow-sm ring-1 ring-moss/10'
                  : 'text-text-mid hover:bg-white hover:text-text-dark'
              }`
            }
          >
            <Icon className="h-4 w-4" />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto rounded-3xl bg-text-dark p-4 text-white">
        <button
          onClick={async () => {
            await logout();
            navigate('/login');
          }}
          className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-white/10 px-4 py-3 text-sm font-semibold"
        >
          <LogOut className="h-4 w-4" />
          Log out
        </button>
      </div>
    </div>
  );
}

function Sidebar({ open, onClose }) {
  return (
    <>
      <aside className="hidden h-[calc(100vh-2rem)] w-60 shrink-0 lg:block">
        <div className="glass sticky top-4 h-full p-5">
          <SidebarContent />
        </div>
      </aside>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-text-dark/30 lg:hidden"
          >
            <motion.div
              initial={{ x: -100 }}
              animate={{ x: 0 }}
              exit={{ x: -100 }}
              className="glass m-4 h-[calc(100vh-2rem)] w-[min(22rem,calc(100vw-2rem))] p-5"
            >
              <SidebarContent onClose={onClose} />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

export function DashboardTopbar({ title, subtitle, onOpenMenu }) {
  return (
    <div className="glass mb-6 flex items-center justify-between px-5 py-4">
      <div className="flex items-center gap-3">
        <button onClick={onOpenMenu} className="rounded-full bg-moss-pale p-3 text-moss lg:hidden">
          <LayoutDashboard className="h-4 w-4" />
        </button>
        <img src={logo} alt="AgriVision logo" className="hidden h-12 w-12 rounded-2xl bg-white p-1 object-contain shadow-sm sm:block" />
        <div>
          <p className="panel-label">Operations workspace</p>
          <h1 className="mt-1 text-[2rem] leading-none text-text-dark">{title}</h1>
          <p className="mt-2 text-sm text-text-muted">{subtitle}</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        <div className="hidden text-right sm:block">
          <p className="text-sm font-medium text-text-dark">
            {new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
          <p className="text-xs text-text-muted">Live field snapshot</p>
        </div>
        <button className="relative rounded-full bg-moss-pale p-3 text-moss">
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-clay" />
          <Bell className="h-4 w-4" />
        </button>
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-moss text-sm font-semibold text-white">
          AV
        </div>
      </div>
    </div>
  );
}

export default Sidebar;
