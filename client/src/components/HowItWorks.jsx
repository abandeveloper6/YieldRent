import React from 'react';
import {
  Search,
  CloudSun,
  CalendarCheck,
  Tractor,
  Coins,
  ShieldCheck,
  CheckCircle2,
  ArrowRight
} from 'lucide-react';

export default function HowItWorks({ onGetStarted }) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-16">
      {/* Title */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider bg-emerald-100 px-3 py-1 rounded-full">
          Simple, Transparent Agricultural Sharing
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-slate-900 font-['Outfit']">
          How YieldRent Empowers Farmers & Equipment Owners
        </h1>
        <p className="text-sm text-slate-600">
          Small and medium farmers can access high-power farm machinery on demand, while equipment owners earn rental income from idle tractors and harvesters.
        </p>
      </div>

      {/* 2 Column Flow: Farmers vs Owners */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* For Farmers */}
        <div className="bg-white rounded-3xl p-8 border border-emerald-200 shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 bg-emerald-100 text-emerald-800 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-2xl">🌾</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 font-['Outfit'] mb-6">
            For Farmers Needing Machinery
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Check Live Weather & Field Advisory</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  View soil readiness, rainfall probability, and optimal windows for harvesting, spraying, or plowing before booking.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Browse & Select Machinery</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Filter by category, horsepower, location, and transparent hourly/daily rates. Review operating guidelines.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-emerald-700 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Reserve & Coordinate Seamlessly</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Submit reservation dates with instant collision prevention. Coordinate logistics directly with the owner.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* For Owners */}
        <div className="bg-white rounded-3xl p-8 border border-amber-200 shadow-sm relative overflow-hidden">
          <div className="w-12 h-12 bg-amber-100 text-amber-800 rounded-2xl flex items-center justify-center mb-6">
            <span className="text-2xl">🚜</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 font-['Outfit'] mb-6">
            For Machinery Owners
          </h2>

          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                1
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">List Your Farm Equipment</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Add photos, specifications (HP, fuel type), daily/hourly rates, and operating requirements in under 2 minutes.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                2
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Review & Approve Booking Requests</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Receive requests from verified local farmers. Confirm or decline bookings with a single tap.
                </p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-amber-600 text-white font-bold text-xs flex items-center justify-center shrink-0">
                3
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900">Earn Reliable Seasonal Revenue</h4>
                <p className="text-xs text-slate-600 mt-0.5">
                  Turn idle capital investments into recurring revenue during peak farming windows.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits Grid */}
      <div className="bg-slate-900 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
        <h3 className="text-xl font-bold font-['Outfit'] mb-8 text-center text-emerald-400">
          Core Pillars of the YieldRent Platform
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <Coins className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold">Cost Reduction</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Eliminates the financial burden of high capital purchase costs, enabling small farmers to rent modern machinery affordably.
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <CloudSun className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold">Weather-Informed Planning</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Integrated real-time weather analytics prevent equipment downtime and avoid wasted fuel during adverse weather events.
            </p>
          </div>

          <div className="p-5 bg-white/5 rounded-2xl border border-white/10 space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="text-sm font-bold">Safe & Collision-Free</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Automated reservation validation guarantees that no machine can be double-booked for the same calendar dates.
            </p>
          </div>
        </div>

        <div className="mt-10 text-center">
          <button
            onClick={onGetStarted}
            className="px-8 py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-sm rounded-xl shadow-lg transition-all inline-flex items-center gap-2"
          >
            <span>Explore Available Machinery</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
