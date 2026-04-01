import { motion } from 'framer-motion';
import { ArrowLeft, Eye, EyeOff, Leaf, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Button from '../components/ui/Button';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';

function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState('');
  const { login, forgotPassword, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = () => {
    const nextErrors = {};

    if (!validateEmail(form.email)) nextErrors.email = 'Enter a valid email address.';
    if (!validatePassword(form.password)) nextErrors.password = 'Password must be at least 6 characters.';

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validateForm()) return;

    const result = await login(form.email, form.password);

    if (!result.success) {
      setMessage(result.message);
      return;
    }

    navigate(location.state?.from ?? '/client-overview');
  };

  const handleForgotPassword = async () => {
    try {
      await forgotPassword(form.email);
      setMessage('Password reset link prepared. Connect your provider to send live emails.');
    } catch (error) {
      setMessage(error.message);
    }
  };

  return (
    <div className="page-shell min-h-screen px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-6xl items-center gap-8 lg:grid-cols-2">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="hidden lg:block">
          <div className="glass-panel overflow-hidden p-8">
            <div className="rounded-[2rem] bg-moss-900 p-8 text-white">
              <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em]">
                Secure access
              </span>
              <h1 className="mt-5 text-5xl font-extrabold leading-tight">Sign in to monitor crops with confidence.</h1>
              <p className="mt-4 max-w-lg text-sm leading-7 text-white/75">
                From AI predictions to downloadable treatment reports, AgriVision gives your team one place to manage
                crop health operations.
              </p>
              <div className="mt-8 grid gap-4 sm:grid-cols-2">
                {['Google OAuth ready', 'Email/password flow', 'Backend API integration hooks', 'Responsive mobile UX'].map(
                  (item) => (
                    <div key={item} className="rounded-3xl bg-white/10 p-4 text-sm font-medium">
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-panel p-6 sm:p-8">
          <Link to="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-900">
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </Link>
          <div className="mt-6">
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-3xl bg-moss-100 text-moss-700">
              <Leaf className="h-7 w-7" />
            </div>
            <h2 className="mt-5 text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">Use your AgriVision account to continue.</p>
          </div>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Mail className="h-4 w-4" />
                Email
              </span>
              <input
                type="email"
                value={form.email}
                onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                className="field"
                placeholder="farmer@domain.com"
              />
              {errors.email && <p className="mt-2 text-sm text-rose-600">{errors.email}</p>}
            </label>

            <label className="block">
              <span className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                <Lock className="h-4 w-4" />
                Password
              </span>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                  className="field pr-12"
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-sm text-rose-600">{errors.password}</p>}
            </label>

            <div className="flex justify-end">
              <button
                type="button"
                onClick={handleForgotPassword}
                className="text-sm font-semibold text-moss-700 transition hover:text-moss-800"
              >
                Forgot password?
              </button>
            </div>

            {message && <p className="rounded-2xl bg-earth-100 px-4 py-3 text-sm text-slate-700">{message}</p>}

            <Button type="submit" loading={loading} className="w-full">
              Sign in
            </Button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}

export default LoginPage;
