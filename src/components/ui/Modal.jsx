import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

function Modal({ isOpen, onClose, title, children }) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/45 px-4"
        >
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 12 }}
            className="glass-panel max-h-[85vh] w-full max-w-2xl overflow-y-auto p-6"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <h3 className="text-xl font-bold text-slate-900">{title}</h3>
              <button onClick={onClose} className="rounded-full p-2 text-slate-500 transition hover:bg-earth-100">
                <X className="h-5 w-5" />
              </button>
            </div>
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default Modal;
