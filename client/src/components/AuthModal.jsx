import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { X, Tractor, Sprout, Lock, Mail, User, Phone, MapPin, AlertCircle, Sparkles } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, initialMode = 'login', onSuccess }) {
  const { login, register, demoLogin } = useAuth();
  const [mode, setMode] = useState(initialMode); // 'login' or 'register'
  const [role, setRole] = useState('farmer'); // 'farmer' or 'owner'

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    location: 'Pune, Maharashtra'
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'login') {
        const res = await login(formData.email, formData.password);
        if (res.success) {
          if (onSuccess) onSuccess(res.user);
          onClose();
        } else {
          setError(res.message || 'Login failed. Please check your credentials.');
        }
      } else {
        const res = await register({
          name: formData.name,
          email: formData.email,
          password: formData.password,
          role,
          phone: formData.phone,
          location: formData.location
        });
        if (res.success) {
          if (onSuccess) onSuccess(res.user);
          onClose();
        } else {
          setError(res.message || 'Registration failed. Please verify your details.');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDemo = async (demoRole) => {
    setError('');
    setLoading(true);
    try {
      const res = await demoLogin(demoRole);
      if (res.success) {
        if (onSuccess) onSuccess(res.user);
        onClose();
      } else {
        setError(res.message || 'Demo login failed.');
      }
    } catch (err) {
      setError('Failed to initiate demo login.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[70] overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Modal Header - Compact & Sticky with High-Contrast Close Button */}
        <div className="relative bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 px-6 py-4 text-white shrink-0 border-b border-white/10">
          {/* Prominent High-Contrast Close Button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-30 bg-white/20 hover:bg-white text-white hover:text-slate-900 p-2 rounded-full backdrop-blur-md border border-white/30 shadow-md transition-all cursor-pointer focus:outline-hidden"
            title="Close Dialog"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="flex items-center gap-3 pr-10">
            <div className="w-11 h-11 bg-white rounded-xl p-0.5 shadow-md shrink-0 border border-white/30">
              <img src="/logo.jpeg" alt="Logo" className="w-full h-full object-cover rounded-lg" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black font-['Outfit'] leading-snug">
                {mode === 'login' ? 'Welcome Back to YieldRent' : 'Create Free YieldRent Account'}
              </h3>
              <p className="text-[11px] text-emerald-200 font-medium leading-none mt-0.5">
                {mode === 'login'
                  ? 'Access your farm rentals, equipment listings & live advisories'
                  : 'Join Maharashtra agricultural sharing network as a Farmer or Owner'}
              </p>
            </div>
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-50 shrink-0">
          <button
            type="button"
            onClick={() => { setMode('login'); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              mode === 'login'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setMode('register'); setError(''); }}
            className={`flex-1 py-2.5 text-xs font-bold border-b-2 transition-all cursor-pointer ${
              mode === 'register'
                ? 'border-emerald-600 text-emerald-800 bg-white shadow-xs'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            Create Account
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'register' && (
              <>
                {/* Role Picker */}
                <div>
                  <label className="block text-[11px] font-extrabold text-slate-700 mb-1.5 uppercase tracking-wider">
                    Select Account Type:
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRole('farmer')}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        role === 'farmer'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Sprout className={`w-5 h-5 shrink-0 ${role === 'farmer' ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <div>
                        <p className="text-xs font-bold">Farmer</p>
                        <p className="text-[10px] text-slate-500 leading-none">Rent equipment</p>
                      </div>
                    </button>

                    <button
                      type="button"
                      onClick={() => setRole('owner')}
                      className={`p-2.5 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                        role === 'owner'
                          ? 'border-emerald-600 bg-emerald-50 text-emerald-900 font-bold shadow-xs'
                          : 'border-slate-200 hover:border-slate-300 text-slate-600'
                      }`}
                    >
                      <Tractor className={`w-5 h-5 shrink-0 ${role === 'owner' ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <div>
                        <p className="text-xs font-bold">Owner</p>
                        <p className="text-[10px] text-slate-500 leading-none">List machinery</p>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Name & Phone in 2 Columns */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Full Name</label>
                    <div className="relative">
                      <User className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="text"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Rajesh Patil"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-600 mb-1">Phone Number</label>
                    <div className="relative">
                      <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+91 9876543210"
                        className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </>
            )}

            {/* Email & Location in 2 Columns (or 1 column in login) */}
            <div className={`grid ${mode === 'register' ? 'grid-cols-1 sm:grid-cols-2' : 'grid-cols-1'} gap-2.5`}>
              <div>
                <label className="block text-[11px] font-semibold text-slate-600 mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="farmer@example.com"
                    className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              {mode === 'register' && (
                <div>
                  <label className="block text-[11px] font-semibold text-slate-600 mb-1">District / Location</label>
                  <div className="relative">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleChange}
                      placeholder="Pune, Maharashtra"
                      className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-600 mb-1">Password</label>
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-3" />
                <input
                  type="password"
                  name="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className="w-full pl-8 pr-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center justify-center gap-2 cursor-pointer"
            >
              {loading ? (
                <span>Processing...</span>
              ) : mode === 'login' ? (
                <span>Sign In to YieldRent</span>
              ) : (
                <span>Complete Registration</span>
              )}
            </button>
          </form>

          {/* Quick Demo Logins Section */}
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <p className="text-center text-[10px] font-extrabold text-slate-400 mb-2 uppercase tracking-wider flex items-center justify-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Instant Demo Access (No Password Needed)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => handleDemo('farmer')}
                disabled={loading}
                className="py-2 px-3 border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>🌾</span> Demo Farmer
              </button>
              <button
                type="button"
                onClick={() => handleDemo('owner')}
                disabled={loading}
                className="py-2 px-3 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-900 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <span>🚜</span> Demo Owner
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
