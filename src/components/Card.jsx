import { motion } from 'framer-motion';

function Card({ children, className = '' }) {
  return (
    <motion.div
      whileHover={{
        y: -4,
        boxShadow: '0 28px 60px -32px rgba(49, 82, 55, 0.22)',
        transition: { duration: 0.3, ease: 'easeOut' },
      }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className={`surface p-5 sm:p-6 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default Card;
