import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  Tractor,
  PlusCircle,
  Clock,
  CheckCircle2,
  XCircle,
  IndianRupee,
  RefreshCw,
  ToggleLeft,
  ToggleRight,
  Trash2,
  AlertCircle,
  MapPin,
  Calendar,
  X,
  Upload
} from 'lucide-react';

const CATEGORIES = [
  'Tractors',
  'Harvesters',
  'Tillage & Ploughs',
  'Sowing & Planting',
  'Sprayers & Protection',
  'Threshers'
];

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [ownerBookings, setOwnerBookings] = useState([]);
  const [myMachinery, setMyMachinery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  // Add Machinery Form State
  const [newMachine, setNewMachine] = useState({
    title: '',
    category: 'Tractors',
    brand_model: '',
    hp_power: '55 HP',
    fuel_type: 'Diesel',
    hourly_rate: 650,
    daily_rate: 4000,
    location: user?.location || 'Pune, Maharashtra',
    image_url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
    description: '',
    operational_guidelines: 'Inspect radiator, oil levels, and diesel prior to continuous field operation.'
  });

  const [formError, setFormError] = useState('');
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [bookingsRes, machineryRes] = await Promise.all([
        api.get('/bookings/owner'),
        api.get(`/machinery?ownerId=${user?.id}`)
      ]);

      if (bookingsRes.data?.success) {
        setOwnerBookings(bookingsRes.data.bookings || []);
      }
      if (machineryRes.data?.success) {
        setMyMachinery(machineryRes.data.machinery || []);
      }
    } catch (err) {
      console.error('Error fetching owner data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  const handleStatusUpdate = async (bookingId, newStatus) => {
    setActionLoadingId(bookingId);
    try {
      const res = await api.patch(`/bookings/${bookingId}/status`, { status: newStatus });
      if (res.data?.success) {
        await fetchDashboardData();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update booking status.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleToggleAvailability = async (machineId) => {
    try {
      const res = await api.patch(`/machinery/${machineId}/toggle-availability`);
      if (res.data?.success) {
        setMyMachinery((prev) =>
          prev.map((m) =>
            m.id === machineId ? { ...m, is_available: res.data.is_available ? 1 : 0 } : m
          )
        );
      }
    } catch (err) {
      alert('Failed to toggle availability.');
    }
  };

  const handleDeleteMachinery = async (machineId) => {
    if (!window.confirm('Are you sure you want to remove this machinery listing?')) return;
    try {
      const res = await api.delete(`/machinery/${machineId}`);
      if (res.data?.success) {
        setMyMachinery((prev) => prev.filter((m) => m.id !== machineId));
      }
    } catch (err) {
      alert('Failed to delete machinery listing.');
    }
  };

  const handleCreateMachinery = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSubmitting(true);

    try {
      const res = await api.post('/machinery', newMachine);
      if (res.data?.success) {
        setShowAddModal(false);
        setNewMachine({
          title: '',
          category: 'Tractors',
          brand_model: '',
          hp_power: '55 HP',
          fuel_type: 'Diesel',
          hourly_rate: 650,
          daily_rate: 4000,
          location: user?.location || 'Pune, Maharashtra',
          image_url: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80',
          description: '',
          operational_guidelines: 'Inspect radiator, oil levels, and diesel prior to continuous field operation.'
        });
        await fetchDashboardData();
      } else {
        setFormError(res.data?.message || 'Failed to create listing.');
      }
    } catch (err) {
      setFormError(err.response?.data?.message || 'Error saving machinery listing.');
    } finally {
      setFormSubmitting(false);
    }
  };

  // Metrics
  const pendingRequests = ownerBookings.filter((b) => b.status === 'pending');
  const confirmedBookings = ownerBookings.filter((b) => b.status === 'confirmed');
  const totalEarnings = ownerBookings
    .filter((b) => b.status === 'confirmed' || b.status === 'completed')
    .reduce((sum, b) => sum + Number(b.total_amount || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
            Machinery Fleet & Rental Management
          </span>
          <h1 className="text-2xl sm:text-3xl font-black font-['Outfit'] mt-1">
            Owner Command Portal
          </h1>
          <p className="text-xs sm:text-sm text-slate-300 mt-1">
            Welcome back, {user?.name}. Monitor rental bookings, approve reservations, and maximize idle machinery earnings.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-3 bg-white/10 hover:bg-white/20 text-white rounded-xl backdrop-blur-sm border border-white/20 transition-colors"
            title="Refresh Data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-5 py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2"
          >
            <PlusCircle className="w-4 h-4" />
            Add New Machinery
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Fleet Inventory</span>
            <p className="text-3xl font-black text-slate-900 font-['Outfit'] mt-1">
              {myMachinery.length}
            </p>
            <span className="text-[11px] text-emerald-600 font-medium">Active Machinery Listings</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
            <Tractor className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Pending Requests</span>
            <p className="text-3xl font-black text-amber-600 font-['Outfit'] mt-1">
              {pendingRequests.length}
            </p>
            <span className="text-[11px] text-amber-700 font-medium">Action Required</span>
          </div>
          <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
            <Clock className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs flex items-center justify-between">
          <div>
            <span className="text-xs font-bold text-slate-400 uppercase">Confirmed Rental Revenue</span>
            <p className="text-3xl font-black text-emerald-900 font-['Outfit'] mt-1">
              ₹{totalEarnings.toLocaleString('en-IN')}
            </p>
            <span className="text-[11px] text-emerald-700 font-medium">From {confirmedBookings.length} bookings</span>
          </div>
          <div className="p-3 bg-emerald-50 text-emerald-700 rounded-2xl">
            <IndianRupee className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Pending Reservations Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Clock className="w-5 h-5 text-amber-600" />
              Incoming Farmer Booking Requests ({ownerBookings.length})
            </h2>
            <p className="text-xs text-slate-500">
              Review and confirm farm reservation requests from local farmers
            </p>
          </div>
        </div>

        {ownerBookings.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-xs">
            No booking requests received yet.
          </div>
        ) : (
          <div className="space-y-3">
            {ownerBookings.map((b) => (
              <div
                key={b.id}
                className="p-4 sm:p-5 rounded-2xl border border-slate-200/90 bg-slate-50/50 hover:bg-slate-50 transition-all flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      Ref #{b.id}
                    </span>
                    <h4 className="text-sm font-bold text-slate-900">{b.machinery_title}</h4>
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full capitalize ${
                        b.status === 'confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : b.status === 'pending'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600">
                    <span className="font-semibold">Farmer:</span> {b.farmer_name} ({b.farmer_phone || 'Phone pending'}) &bull;{' '}
                    <span className="font-semibold">Dates:</span> {b.start_date} to {b.end_date} ({b.duration}{' '}
                    {b.rental_type === 'daily' ? 'Days' : 'Hours'})
                  </p>

                  {b.farmer_notes && (
                    <p className="text-xs text-slate-500 italic bg-white p-2 rounded-lg border border-slate-100">
                      Farmer note: "{b.farmer_notes}"
                    </p>
                  )}
                </div>

                <div className="flex items-center justify-between md:justify-end gap-4 shrink-0">
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block font-medium">Rental Total</span>
                    <span className="text-lg font-black text-emerald-900">
                      ₹{Number(b.total_amount).toLocaleString('en-IN')}
                    </span>
                  </div>

                  {b.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleStatusUpdate(b.id, 'rejected')}
                        disabled={actionLoadingId === b.id}
                        className="px-3 py-2 text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors"
                      >
                        Decline
                      </button>
                      <button
                        onClick={() => handleStatusUpdate(b.id, 'confirmed')}
                        disabled={actionLoadingId === b.id}
                        className="px-4 py-2 text-xs font-bold text-white bg-emerald-700 hover:bg-emerald-800 rounded-xl shadow-xs transition-all"
                      >
                        Approve Booking
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Machinery Fleet Management Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 font-['Outfit'] flex items-center gap-2">
              <Tractor className="w-5 h-5 text-emerald-700" />
              My Equipment Listings ({myMachinery.length})
            </h2>
            <p className="text-xs text-slate-500">
              Control live rental status, view operational rates, or add new farm equipment
            </p>
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" /> Add Machine
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {myMachinery.map((m) => (
            <div
              key={m.id}
              className="p-4 rounded-2xl border border-slate-200 bg-white shadow-xs flex flex-col justify-between"
            >
              <div>
                <div className="relative h-40 rounded-xl overflow-hidden mb-3 bg-slate-100">
                  <img
                    src={m.image_url || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80'}
                    alt={m.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute top-2 left-2 text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-900/80 text-white">
                    {m.category}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">{m.title}</h4>
                <p className="text-xs text-slate-500">{m.brand_model} &bull; {m.hp_power}</p>

                <div className="mt-3 py-2 border-y border-slate-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block">Daily</span>
                    <span className="font-black text-emerald-900">₹{Number(m.daily_rate)}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-400 block">Hourly</span>
                    <span className="font-bold text-slate-800">₹{Number(m.hourly_rate)}</span>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2 flex items-center justify-between">
                <button
                  onClick={() => handleToggleAvailability(m.id)}
                  className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-xl border transition-all ${
                    m.is_available
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-800'
                      : 'border-slate-300 bg-slate-100 text-slate-600'
                  }`}
                >
                  {m.is_available ? <ToggleRight className="w-4 h-4 text-emerald-600" /> : <ToggleLeft className="w-4 h-4 text-slate-400" />}
                  <span>{m.is_available ? 'Available' : 'Unavailable'}</span>
                </button>

                <button
                  onClick={() => handleDeleteMachinery(m.id)}
                  className="p-2 text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                  title="Delete Listing"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Machinery Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            <div className="bg-gradient-to-r from-emerald-800 to-teal-900 p-6 text-white relative">
              <button
                onClick={() => setShowAddModal(false)}
                className="absolute top-4 right-4 text-emerald-200 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>
              <h3 className="text-xl font-bold font-['Outfit']">List New Farm Machinery</h3>
              <p className="text-xs text-emerald-200">Add equipment specifications, rental rates, and location</p>
            </div>

            <form onSubmit={handleCreateMachinery} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Equipment Title</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mahindra 575 DI 4WD Tractor"
                    value={newMachine.title}
                    onChange={(e) => setNewMachine({ ...newMachine, title: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Category</label>
                  <select
                    value={newMachine.category}
                    onChange={(e) => setNewMachine({ ...newMachine, category: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden bg-white"
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Brand & Model</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. John Deere 5310"
                    value={newMachine.brand_model}
                    onChange={(e) => setNewMachine({ ...newMachine, brand_model: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Horsepower / Rating</label>
                  <input
                    type="text"
                    placeholder="e.g. 55 HP"
                    value={newMachine.hp_power}
                    onChange={(e) => setNewMachine({ ...newMachine, hp_power: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Fuel Type</label>
                  <input
                    type="text"
                    value={newMachine.fuel_type}
                    onChange={(e) => setNewMachine({ ...newMachine, fuel_type: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Daily Rent (₹/day)</label>
                  <input
                    type="number"
                    required
                    value={newMachine.daily_rate}
                    onChange={(e) => setNewMachine({ ...newMachine, daily_rate: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Hourly Rent (₹/hr)</label>
                  <input
                    type="number"
                    required
                    value={newMachine.hourly_rate}
                    onChange={(e) => setNewMachine({ ...newMachine, hourly_rate: Number(e.target.value) })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">District / Location</label>
                  <input
                    type="text"
                    required
                    value={newMachine.location}
                    onChange={(e) => setNewMachine({ ...newMachine, location: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Machinery Image URL</label>
                  <input
                    type="url"
                    value={newMachine.image_url}
                    onChange={(e) => setNewMachine({ ...newMachine, image_url: e.target.value })}
                    placeholder="https://..."
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Operational Guidelines</label>
                  <textarea
                    rows={2}
                    value={newMachine.operational_guidelines}
                    onChange={(e) => setNewMachine({ ...newMachine, operational_guidelines: e.target.value })}
                    className="w-full px-3 py-2 text-xs border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formSubmitting}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold text-xs rounded-xl shadow-xs"
                >
                  {formSubmitting ? 'Publishing...' : 'Publish Machinery Listing'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
