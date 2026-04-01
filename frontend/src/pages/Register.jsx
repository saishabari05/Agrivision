import { motion } from 'framer-motion';
import { Eye, EyeOff, Leaf, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import Button from '../components/Button';
import { useAuth } from '../context/AuthContext';
import { validateEmail, validatePassword } from '../utils/validation';

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0 },
};

function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const { register, loading } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();

    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = 'Name is required.';
    if (!validateEmail(form.email)) nextErrors.email = 'Enter a valid email.';
    if (!validatePassword(form.password)) nextErrors.password = 'Minimum 6 characters required.';
    if (form.password !== form.confirmPassword) nextErrors.confirmPassword = 'Passwords do not match.';

    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;

    const result = await register(form.name.trim(), form.email, form.password);
    if (!result.success) {
      setMessage(result.message);
      return;
    }

    navigate('/overview');
  };

  return (
    <div className="min-h-screen bg-cream p-4 sm:p-6">
      <div className="mx-auto grid min-h-[calc(100vh-2rem)] max-w-7xl overflow-hidden rounded-[2rem] shadow-xl lg:grid-cols-[1.2fr_1fr]">
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-moss via-moss-light to-olive p-12 text-white lg:block">
          <div className="relative z-10">
            <div className="flex items-center gap-4">
              <img src={logo} alt="AgriVision logo" className="h-14 w-14 rounded-3xl bg-white/95 p-1 object-contain shadow-xl ring-1 ring-white/20" />
              <p className="text-sm uppercase tracking-[0.24em] text-white/75">AgriVision</p>
            </div>
            <h1 className="mt-6 max-w-2xl text-5xl font-semibold leading-[1.05] tracking-[-0.03em]">Create your workspace and monitor crops with confidence.</h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-white/80">
              Use JWT-based authentication for secure access to analysis, reporting, and advisory tools.
            </p>
          </div>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity }} className="absolute right-16 top-20 rounded-full bg-white/10 p-6">
            <Leaf className="h-10 w-10" />
          </motion.div>
          <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 4.5, repeat: Infinity }} className="absolute bottom-24 left-14 rounded-full bg-white/10 p-8">
            <Leaf className="h-12 w-12" />
          </motion.div>
        </div>

        <div className="bg-white px-6 py-10 sm:px-10 lg:px-14">
          <motion.div initial="hidden" animate="show" variants={{ show: { transition: { staggerChildren: 0.1 } } }} className="mx-auto max-w-md">
            <motion.div variants={itemVariants}>
              <Link to="/login" className="text-sm font-medium text-text-muted">
                Back to login
              </Link>
              <img src={logo} alt="AgriVision logo" className="mt-6 h-14 w-14 rounded-3xl bg-white p-1 object-contain shadow-md" />
              <h2 className="mt-6 text-4xl font-semibold tracking-[-0.03em]">Create account</h2>
              <p className="mt-3 text-text-mid">Set up your AgriVision account with email and password.</p>
            </motion.div>

            <form onSubmit={handleSubmit} className="mt-10 space-y-4">
              <motion.label variants={itemVariants} className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-text-mid">
                  <User className="h-4 w-4" />
                  Full name
                </span>
                <input
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  className="field"
                  placeholder="Your name"
                />
                {errors.name && <p className="mt-2 text-sm text-rose-700">{errors.name}</p>}
              </motion.label>

              <motion.label variants={itemVariants} className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-text-mid">
                  <Mail className="h-4 w-4" />
                  Email
                </span>
                <input
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                  className="field"
                  placeholder="you@agrivision.ai"
                />
                {errors.email && <p className="mt-2 text-sm text-rose-700">{errors.email}</p>}
              </motion.label>

              <motion.label variants={itemVariants} className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-text-mid">
                  <Lock className="h-4 w-4" />
                  Password
                </span>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
                    className="field pr-12"
                    placeholder="Create a password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.password && <p className="mt-2 text-sm text-rose-700">{errors.password}</p>}
              </motion.label>

              <motion.label variants={itemVariants} className="block">
                <span className="mb-2 flex items-center gap-2 text-sm font-medium text-text-mid">
                  <Lock className="h-4 w-4" />
                  Confirm password
                </span>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={form.confirmPassword}
                    onChange={(event) => setForm((current) => ({ ...current, confirmPassword: event.target.value }))}
                    className="field pr-12"
                    placeholder="Re-enter password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword((value) => !value)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text-muted"
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.confirmPassword && <p className="mt-2 text-sm text-rose-700">{errors.confirmPassword}</p>}
              </motion.label>

              {message && <motion.p variants={itemVariants} className="rounded-2xl bg-beige px-4 py-3 text-sm text-text-mid">{message}</motion.p>}

              <motion.div variants={itemVariants}>
                <Button type="submit" className="w-full" disabled={loading}>
                  Create account
                </Button>
              </motion.div>

              <motion.p variants={itemVariants} className="text-center text-sm text-text-muted">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-moss">
                  Sign in
                </Link>
              </motion.p>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

export default Register;
