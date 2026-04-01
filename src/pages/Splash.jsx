import { motion } from 'framer-motion';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';

function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = window.setTimeout(() => navigate('/'), 2500);
    return () => window.clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-6">
      <div className="text-center">
        <motion.img
          initial={{ opacity: 0, scale: 0.88, rotate: -6 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
          src={logo}
          alt="AgriVision logo"
          className="mx-auto h-28 w-28 rounded-[2rem] bg-white p-2 object-contain shadow-xl"
        />
        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="mt-8 text-6xl text-text-dark"
        >
          AgriVision
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1 }}
          className="mt-4 text-lg text-text-mid"
        >
          AI-powered crop intelligence for the modern farmer
        </motion.p>
      </div>
    </div>
  );
}

export default Splash;
