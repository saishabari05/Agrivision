import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  Building2,
  FileText,
  LayoutDashboard,
  LogOut,
  Menu,
  ScanSearch,
  UserRound,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import logo from '../../assets/logo.png';
import { useAuth } from '../../context/AuthContext';

const navItems = [
  { to: '/client-overview', label: 'Client', icon: Building2 },
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/upload', label: 'Upload', icon: ScanSearch },
  { to: '/reports', label: 'Reports', icon: FileText },
  { to: '/chatbot', label: 'Chatbot', icon: Bot },
  { to: '/profile', label: 'Profile', icon: UserRound },
];

function AppShell({ children }) {
  const [open, setOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const initials = useMemo(
    () =>
      user.name
        .split(' ')
        .map((part) => part[0]?.toUpperCase())
        .join('')
        .slice(0, 2),
    [user.name],
  );

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const renderLinks = () => (
    <>
      {navItems.map(({ to, label, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          onClick={() => setOpen(false)}
          className={({ isActive }) =>
            `flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition ${
              isActive
                ? 'bg-moss-700 text-white shadow-soft'
                : 'text-slate-600 hover:bg-white hover:text-slate-900'
            }`
          }
        >
          <Icon className="h-4 w-4" />
          {label}
        </NavLink>
      ))}
    </>
  );

  return (
    <div className="page-shell min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-7xl gap-6 px-4 py-4 sm:px-6 lg:px-8">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="glass-panel sticky top-4 flex h-[calc(100vh-2rem)] flex-col p-5">
            <div className="flex items-center gap-3">
              <img src={logo} alt="AgriVision logo" className="h-12 w-12 rounded-2xl" />
              <div>
                <p className="text-lg font-bold text-slate-900">AgriVision</p>
                <p className="text-sm text-slate-500">AI agriculture intelligence</p>
              </div>
            </div>
            <nav className="mt-8 space-y-2">{renderLinks()}</nav>
            <div className="mt-auto rounded-3xl bg-moss-900 p-4 text-white">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.name} className="h-12 w-12 rounded-2xl object-cover" />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-sm font-bold">
                    {initials}
                  </div>
                )}
                <div>
                  <p className="font-semibold">{user.name}</p>
                  <p className="text-sm text-white/70">{user.email}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-white/10 px-4 py-3 text-sm font-semibold transition hover:bg-white/15"
              >
                <LogOut className="h-4 w-4" />
                Log out
              </button>
            </div>
          </div>
        </aside>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="glass-panel mb-6 flex items-center justify-between px-4 py-4 lg:hidden">
            <div className="flex items-center gap-3">
              <img src={logo} alt="AgriVision logo" className="h-10 w-10 rounded-2xl" />
              <div>
                <p className="font-bold text-slate-900">AgriVision</p>
                <p className="text-xs text-slate-500">Field-ready intelligence</p>
              </div>
            </div>
            <button onClick={() => setOpen(true)} className="rounded-2xl p-2 text-slate-600 hover:bg-earth-100">
              <Menu className="h-5 w-5" />
            </button>
          </header>

          <AnimatePresence>
            {open && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-40 bg-slate-950/40 lg:hidden"
              >
                <motion.div
                  initial={{ x: -30, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -20, opacity: 0 }}
                  className="glass-panel m-4 h-[calc(100vh-2rem)] w-[min(21rem,calc(100vw-2rem))] p-5"
                >
                  <div className="mb-6 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img src={logo} alt="AgriVision logo" className="h-11 w-11 rounded-2xl" />
                      <div>
                        <p className="font-bold">AgriVision</p>
                        <p className="text-xs text-slate-500">Navigation</p>
                      </div>
                    </div>
                    <button onClick={() => setOpen(false)} className="rounded-2xl p-2 hover:bg-earth-100">
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                  <nav className="space-y-2">{renderLinks()}</nav>
                  <button
                    onClick={handleLogout}
                    className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-moss-700 px-4 py-3 text-sm font-semibold text-white"
                  >
                    <LogOut className="h-4 w-4" />
                    Log out
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          <main className="flex-1">{children}</main>
        </div>
      </div>
    </div>
  );
}

export default AppShell;
