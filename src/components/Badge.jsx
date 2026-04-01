const variants = {
  success: 'bg-moss-pale text-moss',
  warning: 'bg-amber-100 text-amber-700',
  danger: 'bg-rose-100 text-rose-700',
  info: 'bg-brown-pale text-brown',
};

function Badge({ children, variant = 'info', className = '' }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

export default Badge;

