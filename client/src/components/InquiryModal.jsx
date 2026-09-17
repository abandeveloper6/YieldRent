import React, { useState } from 'react';
import api from '../api/client';
import { useAuth } from '../context/AuthContext';
import { X, MessageSquare, Send, CheckCircle2, AlertCircle } from 'lucide-react';

export default function InquiryModal({ machine, isOpen, onClose, openAuthModal }) {
  const { isAuthenticated, user } = useAuth();
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);

  if (!isOpen || !machine) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      openAuthModal('login');
      return;
    }

    if (!message.trim()) {
      setError('Please type your inquiry message before sending.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await api.post('/inquiries', {
        receiver_id: machine.owner_id,
        machinery_id: machine.id,
        message: message.trim()
      });

      if (res.data?.success) {
        setSent(true);
        setTimeout(() => {
          setSent(false);
          setMessage('');
          onClose();
        }, 1500);
      } else {
        setError(res.data?.message || 'Failed to send message.');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to send inquiry to machinery owner.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-950 p-5 text-white relative border-b border-white/10">
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 z-30 bg-white/20 hover:bg-white text-white hover:text-slate-900 p-2 rounded-full backdrop-blur-md border border-white/30 shadow-md transition-all cursor-pointer focus:outline-hidden"
            title="Close dialog"
            aria-label="Close"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-sm">
              <MessageSquare className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <h3 className="text-base font-bold font-['Outfit']">Direct Owner Inquiry</h3>
              <p className="text-xs text-emerald-200 truncate">
                To: {machine.owner_name || 'Machinery Owner'} &bull; {machine.title}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          {sent ? (
            <div className="py-6 text-center space-y-2">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-base font-bold text-slate-800">Inquiry Sent Successfully!</h4>
              <p className="text-xs text-slate-500">
                The machinery owner will be able to view and respond to your inquiry.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-500 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                  Your Message to Equipment Owner
                </label>
                <textarea
                  rows={4}
                  required
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Ask about tractor operator/driver availability, diesel arrangements, delivery to your farm location, or custom timeline discounts..."
                  className="w-full p-3 text-xs border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2">
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
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:bg-slate-300 text-white font-bold rounded-xl text-xs flex items-center gap-1.5 shadow-sm"
                >
                  {loading ? (
                    <span>Sending...</span>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Send Message</span>
                    </>
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
