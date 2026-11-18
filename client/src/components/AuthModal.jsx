import { useState } from 'react';
import {
  Mail,
  Lock,
  User,
  Phone,
  MapPin,
  Tractor,
  Sprout,
  Eye,
  EyeOff,
  X,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import axios from 'axios';

const AuthModal = ({ isOpen = true, onClose, onAuthSuccess }) => {
  const [activeTab, setActiveTab] = useState('signin');
  const [role, setRole] = useState('farmer');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    district: '',
    password: '',
  });

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    if (error) setError('');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setError('');
    setShowPassword(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint =
        activeTab === 'signin'
          ? 'http://localhost:5000/api/auth/login'
          : 'http://localhost:5000/api/auth/register';

      const payload =
        activeTab === 'signin'
          ? {
            email: formData.email,
            password: formData.password,
          }
          : {
            name: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            district: formData.district,
            role,
            password: formData.password,
          };

      const { data } = await axios.post(endpoint, payload);

      if (data?.token) {
        localStorage.setItem('yieldrent_token', data.token);
      }
      if (onAuthSuccess) {
        onAuthSuccess(data);
      }
      if (onClose) {
        onClose();
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
        'Authentication failed. Please check your credentials and try again.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4">
      <div className="w-full max-w-md overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 shadow-2xl">
        {/* Header */}
        <div className="relative bg-gradient-to-r from-emerald-950 via-emerald-900 to-teal-950 px-6 py-5 border-b border-emerald-800/40">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-emerald-700 shadow-md">
                <Sprout className="h-6 w-6" />
              </div>
              <div>
                <h2 className="text-lg font-bold tracking-tight text-white">
                  {activeTab === 'signin'
                    ? 'Welcome Back to YieldRent'
                    : 'Join YieldRent'}
                </h2>
                <p className="text-xs text-emerald-100/80">
                  {activeTab === 'signin'
                    ? 'Access your farm rentals, equipment listings & live advisories'
                    : 'Rent modern farm machinery or list your fleet for income'}
                </p>
              </div>
            </div>

            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close modal"
                className="flex h-8 w-8 items-center justify-center rounded-full bg-black/25 text-zinc-300 transition hover:bg-black/45 hover:text-white"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-2 border-b border-zinc-800 bg-zinc-900/90">
          <button
            type="button"
            onClick={() => switchTab('signin')}
            className={`py-3.5 text-sm font-semibold transition border-b-2 ${activeTab === 'signin'
                ? 'border-emerald-500 text-white bg-zinc-800/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => switchTab('signup')}
            className={`py-3.5 text-sm font-semibold transition border-b-2 ${activeTab === 'signup'
                ? 'border-emerald-500 text-white bg-zinc-800/40'
                : 'border-transparent text-zinc-400 hover:text-zinc-200'
              }`}
          >
            Create Account
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-start gap-2.5 rounded-xl border border-red-500/30 bg-red-500/10 px-3.5 py-2.5 text-xs text-red-300">
              <AlertCircle className="h-4 w-4 shrink-0 text-red-400 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Sign Up Extra Fields */}
          {activeTab === 'signup' && (
            <>
              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-2">
                  I want to register as a
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setRole('farmer')}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-xs font-semibold transition ${role === 'farmer'
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                        : 'border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                      }`}
                  >
                    <Sprout className="h-4 w-4" />
                    Farmer
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('owner')}
                    className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 px-3 text-xs font-semibold transition ${role === 'owner'
                        ? 'border-emerald-500 bg-emerald-500/15 text-emerald-300'
                        : 'border-zinc-700 bg-zinc-800/60 text-zinc-400 hover:border-zinc-600 hover:text-zinc-200'
                      }`}
                  >
                    <Tractor className="h-4 w-4" />
                    Machinery Owner
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Rajesh Patil"
                    className="w-full rounded-xl border border-zinc-700/80 bg-zinc-800/70 py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="tel"
                      name="phone"
                      required
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      className="w-full rounded-xl border border-zinc-700/80 bg-zinc-800/70 py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-zinc-300 mb-1.5">
                    District / Location
                  </label>
                  <div className="relative">
                    <MapPin className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
                    <input
                      type="text"
                      name="district"
                      required
                      value={formData.district}
                      onChange={handleChange}
                      placeholder="e.g., Nashik, Pune"
                      className="w-full rounded-xl border border-zinc-700/80 bg-zinc-800/70 py-2.5 pl-10 pr-3 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              </div>
            </>
          )}

          {/* Email Address */}
          <div>
            <label className="block text-xs font-medium text-zinc-300 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="farmer@example.com"
                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-800/70 py-2.5 pl-10 pr-3.5 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-medium text-zinc-300">
                Password
              </label>
              {activeTab === 'signin' && (
                <button
                  type="button"
                  onClick={() =>
                    setError('Please contact your administrator to reset your password.')
                  }
                  className="text-xs text-emerald-400 hover:text-emerald-300 transition"
                >
                  Forgot password?
                </button>
              )}
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-500" />
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                required
                minLength={6}
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full rounded-xl border border-zinc-700/80 bg-zinc-800/70 py-2.5 pl-10 pr-10 text-sm text-white placeholder-zinc-500 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-200"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </div>

          {/* Primary Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2.5 px-4 text-sm font-semibold text-white shadow-lg shadow-emerald-950/50 transition hover:bg-emerald-500 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {activeTab === 'signin' ? 'Signing In...' : 'Creating Account...'}
              </>
            ) : (
              <>
                {activeTab === 'signin'
                  ? 'Sign In to YieldRent'
                  : 'Create YieldRent Account'}
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>

          {/* Footer Switch Link */}
          <p className="pt-1 text-center text-xs text-zinc-400">
            {activeTab === 'signin' ? (
              <>
                New to YieldRent?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('signup')}
                  className="font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Create an account
                </button>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => switchTab('signin')}
                  className="font-semibold text-emerald-400 hover:text-emerald-300"
                >
                  Sign in here
                </button>
              </>
            )}
          </p>
        </form>
      </div>
    </div>
  );
};

export default AuthModal;
