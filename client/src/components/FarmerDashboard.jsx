import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import {
  CalendarCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Tractor,
  Phone,
  MapPin,
  RefreshCw,
  MessageSquare,
  Ban
} from 'lucide-react';

export default function FarmerDashboard({ onBrowseClick }) {
  const { user } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [activeSubTab, setActiveSubTab] = useState('bookings'); // 'bookings' or 'messages'
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await api.get('/bookings/farmer');
      if (res.data?.success) {
        setBookings(res.data.bookings || []);
      }
    } catch (err) {
      console.error('Error fetching farmer bookings:', err);
    }
  };

  const fetchInquiries = async () => {
    try {
      const res = await api.get('/inquiries');
      if (res.data?.success) {
        setInquiries(res.data.inquiries || []);
      }
    } catch (err) {
      console.error('Error fetching inquiries:', err);
    }
  };

  const loadData = async () => {
    setLoading(true);
    await Promise.all([fetchBookings(), fetchInquiries()]);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking request?')) return;
    setCancellingId(bookingId);
    try {
      const res = await api.patch(`/bookings/${bookingId}/status`, { status: 'cancelled' });
      if (res.data?.success) {
        await fetchBookings();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings = bookings.filter((b) => {
    if (statusFilter === 'all') return true;
    return b.status?.toLowerCase() === statusFilter;
  });

  const getStatusBadge = (status) => {
    switch (status?.toLowerCase()) {
      case 'confirmed':
        return {
          bg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
          text: 'Confirmed by Owner',
          icon: CheckCircle2
        };
      case 'pending':
        return {
          bg: 'bg-amber-100 text-amber-800 border-amber-300',
          text: 'Pending Approval',
          icon: Clock
        };
      case 'rejected':
        return {
          bg: 'bg-rose-100 text-rose-800 border-rose-300',
          text: 'Declined by Owner',
          icon: XCircle
        };
      case 'completed':
        return {
          bg: 'bg-blue-100 text-blue-800 border-blue-300',
          text: 'Completed',
          icon: CheckCircle2
        };
      case 'cancelled':
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          text: 'Cancelled',
          icon: Ban
        };
      default:
        return {
          bg: 'bg-slate-100 text-slate-700 border-slate-300',
          text: status,
          icon: AlertCircle
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Profile Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user?.name || 'Farmer')}&background=15803d&color=fff`}
            alt={user?.name}
            className="w-16 h-16 rounded-2xl border-2 border-emerald-600 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 font-['Outfit']">
                {user?.name}
              </h1>
              <span className="bg-emerald-100 text-emerald-800 text-[10px] font-bold px-2.5 py-0.5 rounded-full border border-emerald-200">
                Farmer Account
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5 flex items-center gap-3">
              <span>{user?.email}</span>
              <span>&bull;</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-slate-400" />
                {user?.location || 'Maharashtra, India'}
              </span>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadData}
            className="p-2.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-colors"
            title="Refresh dashboard data"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
          <button
            onClick={onBrowseClick}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5"
          >
            <Tractor className="w-4 h-4" />
            Rent More Equipment
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200">
        <button
          onClick={() => setActiveSubTab('bookings')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'bookings'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>My Machinery Bookings ({bookings.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('messages')}
          className={`pb-3 px-4 text-sm font-bold border-b-2 transition-all flex items-center gap-2 ${
            activeSubTab === 'messages'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-slate-500 hover:text-slate-700'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Direct Inquiries ({inquiries.length})</span>
        </button>
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-2">
          <RefreshCw className="w-8 h-8 text-emerald-600 animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Loading your farm bookings and records...</p>
        </div>
      ) : activeSubTab === 'bookings' ? (
        <div className="space-y-6">
          {/* Status Filter Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs font-semibold">
            {['all', 'pending', 'confirmed', 'completed', 'rejected', 'cancelled'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-xl capitalize transition-all ${
                  statusFilter === status
                    ? 'bg-emerald-800 text-white font-bold shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {filteredBookings.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <Tractor className="w-12 h-12 text-slate-300 mx-auto" />
              <h3 className="text-base font-bold text-slate-700">No Bookings Found</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                {statusFilter === 'all'
                  ? "You haven't reserved any farming machinery yet. Browse available tractors and harvesters to get started!"
                  : `No bookings found matching "${statusFilter}" status.`}
              </p>
              <button
                onClick={onBrowseClick}
                className="mt-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs"
              >
                Browse Machinery Marketplace
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredBookings.map((b) => {
                const statusInfo = getStatusBadge(b.status);
                const StatusIcon = statusInfo.icon;
                return (
                  <div
                    key={b.id}
                    className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      {/* Top Info */}
                      <div className="flex items-start justify-between gap-3 mb-3">
                        <div className="flex items-center gap-3">
                          <img
                            src={b.image_url || 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=400&q=80'}
                            alt={b.machinery_title}
                            className="w-16 h-16 rounded-xl object-cover border border-slate-100 shrink-0"
                          />
                          <div>
                            <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block">
                              {b.category}
                            </span>
                            <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                              {b.machinery_title}
                            </h4>
                            <p className="text-xs text-slate-500">
                              Booking Ref: #{b.id}
                            </p>
                          </div>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full border ${statusInfo.bg} shrink-0`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          <span>{statusInfo.text}</span>
                        </span>
                      </div>

                      {/* Dates & Rent Grid */}
                      <div className="grid grid-cols-2 gap-2 bg-slate-50 p-3 rounded-xl text-xs text-slate-700 mb-3">
                        <div>
                          <span className="text-[10px] text-slate-400 block font-medium">Rental Period</span>
                          <span className="font-semibold">
                            {b.start_date} to {b.end_date}
                          </span>
                          <span className="text-[10px] text-slate-500 block">
                            ({b.duration} {b.rental_type === 'daily' ? 'Days' : 'Hours'})
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] text-slate-400 block font-medium">Total Amount</span>
                          <span className="text-base font-black text-emerald-900">
                            ₹{Number(b.total_amount).toLocaleString('en-IN')}
                          </span>
                        </div>
                      </div>

                      {/* Owner Details */}
                      <div className="p-2.5 bg-emerald-50/50 rounded-xl border border-emerald-100 text-xs text-emerald-950 flex items-center justify-between">
                        <div>
                          <p className="font-bold">{b.owner_name}</p>
                          <p className="text-[11px] text-slate-500 flex items-center gap-1">
                            <Phone className="w-3 h-3 text-slate-400" />
                            {b.owner_phone || 'Contact provided on confirmation'}
                          </p>
                        </div>
                        <span className="text-[10px] font-semibold text-slate-500">
                          {b.machinery_location}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    {b.status === 'pending' && (
                      <div className="mt-4 pt-3 border-t border-slate-100 flex justify-end">
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          disabled={cancellingId === b.id}
                          className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-lg transition-colors flex items-center gap-1"
                        >
                          <Ban className="w-3.5 h-3.5" />
                          {cancellingId === b.id ? 'Cancelling...' : 'Cancel Reservation'}
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      ) : (
        /* Messages Tab */
        <div className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm space-y-4">
          <h3 className="text-base font-bold text-slate-900">Communication History</h3>
          {inquiries.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No inquiry messages sent yet.</p>
          ) : (
            <div className="space-y-3">
              {inquiries.map((inq) => (
                <div key={inq.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-emerald-800">
                      To: {inq.receiver_name} &bull; {inq.machinery_title || 'General Machinery Inquiry'}
                    </span>
                    <span className="text-slate-400">{new Date(inq.created_at).toLocaleDateString()}</span>
                  </div>
                  <p className="text-xs text-slate-700 leading-relaxed bg-white p-3 rounded-lg border border-slate-100">
                    "{inq.message}"
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
