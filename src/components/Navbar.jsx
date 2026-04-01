import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Button from './Button';
import logo from '../assets/logo.png';

function Navbar({ onOpenMenu }) {
  return (
    <div className="sticky top-4 z-30 page-wrap">
      <motion.header
        initial={{ opacity: 0, y: -18 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass flex items-center justify-between px-5 py-4"
      >
        <Link to="/" className="flex items-center gap-3">
          <img src={logo} alt="AgriVision logo" className="h-11 w-11 rounded-2xl bg-white p-1 object-contain shadow-md" />
          <div>
            <p className="text-2xl font-semibold tracking-[-0.02em] text-text-dark">AgriVision</p>
            <p className="text-xs uppercase tracking-[0.22em] text-text-muted">AI Agriculture</p>
          </div>
        </Link>
        <nav className="hidden items-center gap-8 text-sm font-medium text-text-mid lg:flex">
          <a href="#features">Features</a>
          <a href="#workflow">How it Works</a>
          <a href="#stories">Stories</a>
        </nav>
        <div className="flex items-center gap-3">
          <Link to="/login" className="hidden sm:block">
            <Button variant="secondary">Login</Button>
          </Link>
          <Link to="/login" className="hidden lg:block">
            <Button>Get Started</Button>
          </Link>
          <button onClick={onOpenMenu} className="rounded-full bg-moss-pale p-3 text-moss lg:hidden">
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.header>
    </div>
  );
}

export default Navbar;
