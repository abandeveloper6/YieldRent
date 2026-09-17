import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  X,
  Calendar,
  Clock,
  AlertCircle,
  CheckCircle2,
  Tractor,
  CloudSun,
  CreditCard,
  Sparkles,
  Info
} from 'lucide-react';

export default function BookingModal({
  machine,
  isOpen,
  onClose,
  onBookingCreated,
  openAuthModal
}) {
  const { isAuthenticated, isFarmer, user } = useAuth();

  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

  const [rentalType, setRentalType] = useState('daily'); // 'daily' or 'hourly'
  const [startDate, setStartDate] = useState(today);
  const [endDate, setEndDate] = useState(tomorrow);
  const [hourlyHours, setHourlyHours] = useState(4);
  const [farmerNotes, setFarmerNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  // Calculate duration in days
  const calculateDays = () => {
    if (!startDate || !endDate) return 1;
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // inclusive
    return Math.max(1, isNaN(diffDays) ? 1 : diffDays);
  };

  const duration = rentalType === 'daily' ? calculateDays() : Number(hourlyHours);

  const calculateTotal = () => {
    if (!machine) return 0;
    if (rentalType === 'daily') {
      return duration * Number(machine.daily_rate);
    } else {
      return duration * Number(machine.hourly_rate);
    }
  };

  const totalAmount = calculateTotal();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (!isFarmer) {
      setError('Only Farmer accounts can create rental bookings. Please switch to a Farmer account.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/bookings', {
        machinery_id: machine.id,
        start_date: startDate,
        end_date: rentalType === 'daily' ? endDate : startDate,
        rental_type: rentalType,
        duration: duration,
        farmer_notes: farmerNotes,
        weather_condition: 'Favorable Farming Weather'
      });

      if (res.data?.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onBookingCreated) onBookingCreated();
          setSuccess(false);
          onClose();
        }, 1800);
      } else {
        setError(res.data?.message || 'Failed to complete booking request.');
      }
    } catch (err) {
      if (err.response?.status === 409) {
        setError('Date Conflict: This machinery is already booked for these dates. Please choose another date range.');
      } else {
        setError(err.response?.data?.message || 'Failed to submit reservation. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !machine) return null;

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4">
      <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Header - Sticky with Prominent Close Button */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 px-6 py-4.5 text-white relative shrink-0 border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-30 bg-white/20 hover:bg-white text-white hover:text-slate-900 p-2 rounded-full backdrop-blur-md border border-white/30 shadow-md transition-all cursor-pointer focus:outline-hidden"
            title="Close dialog"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div className="flex items-center gap-3 pr-10">
            <div className="p-2.5 bg-white/10 rounded-2xl backdrop-blur-sm border border-white/20 shrink-0">
              <Tractor className="w-6 h-6 text-emerald-300" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold text-emerald-300 uppercase tracking-wider block">
                Machinery Reservation
              </span>
              <h3 className="text-base sm:text-lg font-black font-['Outfit'] line-clamp-1">{machine.title}</h3>
              <p className="text-[11px] text-emerald-200 font-medium">
                {machine.brand_model} &bull; {machine.location}
              </p>
            </div>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {success ? (
            <div className="py-8 text-center space-y-3">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto animate-bounce">
                <CheckCircle2 className="w-10 h-10" />
              </div>
              <h4 className="text-xl font-black text-slate-800">Booking Request Submitted!</h4>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                The machinery owner has been notified. You can track this booking status in your Farmer Dashboard.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <span>{error}</span>
                </div>
              )}

              {/* Rental Type Selection */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wider">
                  Select Rental Duration Type
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setRentalType('daily')}
                    className={`py-3 px-4 rounded-xl border text-center font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      rentalType === 'daily'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    <span>Daily Rate (₹{Number(machine.daily_rate)}/day)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setRentalType('hourly')}
                    className={`py-3 px-4 rounded-xl border text-center font-bold text-xs transition-all flex items-center justify-center gap-2 ${
                      rentalType === 'hourly'
                        ? 'border-emerald-600 bg-emerald-50/80 text-emerald-900 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 text-slate-600'
                    }`}
                  >
                    <Clock className="w-4 h-4 text-emerald-600" />
                    <span>Hourly Rate (₹{Number(machine.hourly_rate)}/hr)</span>
                  </button>
                </div>
              </div>

              {/* Date pickers */}
              {rentalType === 'daily' ? (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Start Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={startDate}
                      onChange={(e) => {
                        setStartDate(e.target.value);
                        if (e.target.value > endDate) setEndDate(e.target.value);
                      }}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      End Date
                    </label>
                    <input
                      type="date"
                      min={startDate}
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Operation Date
                    </label>
                    <input
                      type="date"
                      min={today}
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-600 mb-1">
                      Hours Required
                    </label>
                    <select
                      value={hourlyHours}
                      onChange={(e) => setHourlyHours(Number(e.target.value))}
                      className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500 bg-white"
                    >
                      {[1, 2, 3, 4, 5, 6, 7, 8, 10, 12].map((hr) => (
                        <option key={hr} value={hr}>
                          {hr} {hr === 1 ? 'Hour' : 'Hours'}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              )}

              {/* Farmer Notes */}
              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1">
                  Field Notes / Special Requirements (Optional)
                </label>
                <textarea
                  rows={2}
                  value={farmerNotes}
                  onChange={(e) => setFarmerNotes(e.target.value)}
                  placeholder="e.g. Need driver assistance; 5-acre sugarcane field near village boundary..."
                  className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Dynamic Price Calculation Summary */}
              <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl space-y-2">
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Rental Basis:</span>
                  <span className="font-semibold text-slate-800 capitalize">
                    {rentalType === 'daily'
                      ? `${duration} Days (₹${machine.daily_rate} / day)`
                      : `${duration} Hours (₹${machine.hourly_rate} / hr)`}
                  </span>
                </div>
                <div className="flex justify-between text-xs text-slate-600">
                  <span>Owner Contact:</span>
                  <span className="font-semibold text-slate-800">{machine.owner_name || 'Verified Owner'}</span>
                </div>
                <div className="pt-2 border-t border-emerald-200 flex justify-between items-baseline">
                  <span className="text-sm font-bold text-slate-800">Total Estimated Rent:</span>
                  <span className="text-2xl font-black text-emerald-900">
                    ₹{totalAmount.toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {!isAuthenticated && (
                <div className="p-3.5 bg-amber-50 border border-amber-300 rounded-2xl text-amber-900 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 shadow-xs">
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>You need to sign in or use 1-click Demo Farmer to confirm this rental.</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => openAuthModal('login')}
                    className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl text-xs shrink-0 transition-colors shadow-xs"
                  >
                    Sign In Now
                  </button>
                </div>
              )}

              <div className="pt-2 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md hover:shadow-lg transition-all text-xs flex items-center gap-2"
                >
                  {loading ? (
                    <span>Submitting Reservation...</span>
                  ) : !isAuthenticated ? (
                    <span>Sign In & Confirm (₹{totalAmount.toLocaleString('en-IN')})</span>
                  ) : (
                    <span>Confirm Booking (₹{totalAmount.toLocaleString('en-IN')})</span>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
