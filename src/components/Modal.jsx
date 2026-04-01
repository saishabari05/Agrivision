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
          className="fixed inset-0 z-50 flex items-center justify-center bg-text-dark/35 p-4 backdrop-blur-sm"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.97 }}
            className="surface max-h-[88vh] w-full max-w-3xl overflow-y-auto p-6 sm:p-8"
          >
            <div className="mb-6 flex items-center justify-between gap-4">
              <h3 className="text-3xl text-text-dark">{title}</h3>
              <button onClick={onClose} className="rounded-full bg-moss-pale p-2 text-moss">
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

