import { AnimatePresence, motion } from 'framer-motion';

function Toast({ message, show }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 16 }}
          className="fixed bottom-5 left-5 z-50 rounded-2xl bg-text-dark px-4 py-3 text-sm font-medium text-white shadow-xl"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Toast;

