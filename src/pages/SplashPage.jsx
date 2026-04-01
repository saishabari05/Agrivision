import { motion } from 'framer-motion';
import logo from '../assets/logo.png';

function SplashPage() {
  return (
    <div className="page-shell flex min-h-screen items-center justify-center px-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center"
      >
        <motion.img
          initial={{ rotate: -8, opacity: 0 }}
          animate={{ rotate: 0, opacity: 1 }}
          transition={{ duration: 0.7 }}
          src={logo}
          alt="AgriVision logo"
          className="mx-auto h-28 w-28 rounded-[2rem] shadow-soft"
        />
        <motion.h1
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="mt-8 text-4xl font-extrabold text-slate-900 sm:text-6xl"
        >
          AgriVision
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4 max-w-lg text-sm text-slate-600 sm:text-base"
        >
          AI-guided plant disease intelligence for faster decisions, cleaner reports, and healthier crops.
        </motion.p>
      </motion.div>
    </div>
  );
}

export default SplashPage;
