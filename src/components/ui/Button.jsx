import { Loader2 } from 'lucide-react';

function Button({
  children,
  className = '',
  variant = 'primary',
  loading = false,
  type = 'button',
  ...props
}) {
  const variants = {
    primary: 'bg-moss-700 text-white hover:bg-moss-800',
    secondary: 'bg-white text-slate-900 border border-earth-200 hover:bg-earth-50',
    ghost: 'bg-transparent text-slate-700 hover:bg-white/70',
  };

  return (
    <button
      type={type}
      className={`inline-flex items-center justify-center gap-2 rounded-2xl px-5 py-3 text-sm font-semibold transition duration-200 hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60 ${variants[variant]} ${className}`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </button>
  );
}

export default Button;

