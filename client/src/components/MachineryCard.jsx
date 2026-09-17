import React from 'react';
import {
  Tractor,
  Zap,
  Fuel,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  MessageSquare,
  ArrowRight
} from 'lucide-react';

export default function MachineryCard({ machine, onSelect, onBook, onInquire }) {
  const isAvailable = Boolean(machine.is_available);

  // Fallback agricultural machinery image
  const fallbackImage = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Image & Badges */}
      <div className="relative h-52 w-full overflow-hidden bg-slate-100">
        <img
          src={machine.image_url || fallbackImage}
          alt={machine.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.src = fallbackImage;
          }}
        />

        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
          <span className="bg-emerald-800/90 backdrop-blur-md text-white text-[11px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-xs">
            {machine.category}
          </span>
        </div>

        <div className="absolute top-3 right-3">
          <span
            className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full backdrop-blur-md shadow-xs ${
              isAvailable
                ? 'bg-emerald-500/95 text-white'
                : 'bg-slate-700/90 text-slate-200'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${isAvailable ? 'bg-white animate-pulse' : 'bg-rose-400'}`}
            ></span>
            {isAvailable ? 'Available Now' : 'Currently Rented'}
          </span>
        </div>

        {/* Rating overlay */}
        <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md text-slate-800 text-xs font-bold px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span>{Number(machine.rating || 4.8).toFixed(1)}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col">
        {/* Title & Brand */}
        <div className="mb-3">
          <p className="text-xs font-bold uppercase text-emerald-700 tracking-wider">
            {machine.brand_model}
          </p>
          <h3
            onClick={() => onSelect(machine)}
            className="text-base font-bold text-slate-900 group-hover:text-emerald-700 transition-colors cursor-pointer line-clamp-1"
            title={machine.title}
          >
            {machine.title}
          </h3>
        </div>

        {/* Specs Pills */}
        <div className="grid grid-cols-2 gap-2 mb-4 py-2 border-y border-slate-100 text-xs text-slate-600">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="font-semibold text-slate-700">{machine.hp_power || '50 HP'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Fuel className="w-3.5 h-3.5 text-blue-600 shrink-0" />
            <span className="truncate">{machine.fuel_type || 'Diesel'}</span>
          </div>
          <div className="flex items-center gap-1.5 col-span-2 text-slate-500">
            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
            <span className="truncate">{machine.location}</span>
          </div>
        </div>

        {/* Pricing Box */}
        <div className="bg-emerald-50/60 rounded-xl p-3 mb-4 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-emerald-800 font-semibold block uppercase">Daily Rent</span>
            <span className="text-lg font-black text-emerald-900">
              ₹{Number(machine.daily_rate).toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] text-slate-500 font-medium"> / day</span>
          </div>
          <div className="text-right border-l border-emerald-200/80 pl-3">
            <span className="text-[10px] text-slate-500 font-semibold block uppercase">Hourly</span>
            <span className="text-sm font-bold text-slate-800">
              ₹{Number(machine.hourly_rate).toLocaleString('en-IN')}
            </span>
            <span className="text-[10px] text-slate-500"> / hr</span>
          </div>
        </div>

        {/* Owner Info & Action Buttons */}
        <div className="mt-auto pt-2 flex items-center justify-between gap-2">
          <button
            onClick={() => onInquire(machine)}
            className="p-2.5 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-xl border border-slate-200 transition-colors"
            title="Send inquiry to machinery owner"
          >
            <MessageSquare className="w-4 h-4" />
          </button>

          <button
            onClick={() => onSelect(machine)}
            className="flex-1 py-2.5 px-3 text-xs font-bold text-slate-700 hover:text-emerald-700 bg-slate-100 hover:bg-slate-200/80 rounded-xl transition-colors text-center"
          >
            Details
          </button>

          <button
            onClick={() => onBook(machine)}
            disabled={!isAvailable}
            className={`py-2.5 px-4 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1 shadow-xs ${
              isAvailable
                ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20 hover:shadow-md'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>{isAvailable ? 'Rent Now' : 'Rented'}</span>
            {isAvailable && <ArrowRight className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>
    </div>
  );
}
