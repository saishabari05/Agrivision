import { motion } from 'framer-motion';

const variants = {
  primary: 'bg-moss text-white shadow-md hover:bg-moss-light',
  secondary: 'bg-moss-pale text-moss hover:bg-white shadow-sm',
  ghost: 'bg-transparent text-text-mid hover:bg-moss-pale/60',
};

function Button({ children, className = '', variant = 'primary', type = 'button', ...props }) {
  return (
    <motion.button
      type={type}
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      className={`inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </motion.button>
  );
}

export default Button;
