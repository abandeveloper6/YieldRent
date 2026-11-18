import React from 'react';
import {
  X,
  Tractor,
  Zap,
  Fuel,
  MapPin,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  CheckCircle,
  FileText,
  Phone,
  MessageSquare,
  User,
  ArrowRight
} from 'lucide-react';

export default function MachineryDetailModal({
  machine,
  allMachinery = [],
  isOpen,
  onClose,
  onSelect,
  onBook,
  onInquire
}) {
  if (!isOpen || !machine) return null;

  const isAvailable = Boolean(machine.is_available);
  const fallbackImage = 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=800&q=80';

  // Filter for related machinery in the same category (excluding the current machine)
  const relatedMachinery = React.useMemo(() => {
    if (!machine || !allMachinery || allMachinery.length === 0) return [];
    return allMachinery
      .filter((m) => {
        if (m.id === machine.id) return false;
        const catA = (m.category || '').toLowerCase();
        const catB = (machine.category || '').toLowerCase();
        if (catA === catB) return true;
        if (catA.includes('tractor') && catB.includes('tractor')) return true;
        return false;
      })
      .slice(0, 4);
  }, [machine, allMachinery]);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="relative w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-30 bg-white/90 hover:bg-white text-slate-800 hover:text-slate-950 p-2.5 rounded-full shadow-lg border border-slate-200 backdrop-blur-md transition-all cursor-pointer focus:outline-hidden"
          title="Close dialog"
          aria-label="Close"
        >
          <X className="w-5 h-5 stroke-[2.5]" />
        </button>

        {/* Scrollable Content Container */}
        <div id="machinery-detail-scroll" className="overflow-y-auto flex-1">
          {/* Header Image with Overlays */}
          <div className="relative h-72 sm:h-80 w-full bg-slate-900">
            <img
              src={machine.image_url || fallbackImage}
              alt={machine.title}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = fallbackImage;
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

            {/* Bottom Title Content over image */}
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span className="bg-emerald-600 text-white text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  {machine.category}
                </span>
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1.5 ${
                    isAvailable ? 'bg-emerald-500/90 text-white' : 'bg-rose-500/90 text-white'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-white animate-pulse"></span>
                  {isAvailable ? 'Ready for Immediate Booking' : 'Currently Rented'}
                </span>
              </div>

              <h2 className="text-2xl sm:text-3xl font-black font-['Outfit'] leading-tight">
                {machine.title}
              </h2>
              <p className="text-sm text-emerald-300 font-semibold mt-1">
                {machine.brand_model} &bull; {machine.location}
              </p>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Rates & Specifications Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-2xl text-center">
                <span className="text-[11px] text-emerald-800 font-bold block uppercase tracking-wider">
                  Daily Rental
                </span>
                <span className="text-xl font-black text-emerald-950">
                  ₹{Number(machine.daily_rate).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 block">per day (8 hrs)</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">
                  Hourly Rental
                </span>
                <span className="text-xl font-black text-slate-900">
                  ₹{Number(machine.hourly_rate).toLocaleString('en-IN')}
                </span>
                <span className="text-[10px] text-slate-500 block">per running hour</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">
                  Engine Power
                </span>
                <span className="text-lg font-bold text-slate-900 flex items-center justify-center gap-1">
                  <Zap className="w-4 h-4 text-amber-500" />
                  {machine.hp_power || '50 HP'}
                </span>
                <span className="text-[10px] text-slate-500 block">Rated Output</span>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-2xl text-center">
                <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">
                  Fuel Type
                </span>
                <span className="text-lg font-bold text-slate-900 flex items-center justify-center gap-1">
                  <Fuel className="w-4 h-4 text-blue-500" />
                  {machine.fuel_type || 'Diesel'}
                </span>
                <span className="text-[10px] text-slate-500 block">High Efficiency</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                Equipment Description & Features
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {machine.description || 'High quality modern agricultural machinery tested and maintained for heavy duty field operations.'}
              </p>
            </div>

            {/* Operational Guidelines */}
            <div>
              <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                Field Operational Guidelines
              </h4>
              <div className="bg-amber-50/60 border border-amber-200/80 rounded-2xl p-4 text-xs text-amber-950 leading-relaxed space-y-1.5">
                {machine.operational_guidelines ? (
                  <p>{machine.operational_guidelines}</p>
                ) : (
                  <>
                    <p className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Check engine oil, radiator coolant, and tire pressure prior to daily field commencement.
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Ensure suitable soil moisture level; avoid operating in severely waterlogged clay soils.
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                      Diesel fuel cost to be settled as per actual hours worked or mutual agreement with owner.
                    </p>
                  </>
                )}
              </div>
            </div>

            {/* Owner Contact Card */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-base shadow-sm">
                  {machine.owner_name ? machine.owner_name.charAt(0).toUpperCase() : 'O'}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-bold text-slate-900">{machine.owner_name || 'Machinery Owner'}</p>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                      Verified Owner
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {machine.owner_location || machine.location}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    onClose();
                    onInquire(machine);
                  }}
                  className="px-4 py-2.5 bg-white border border-slate-200 text-slate-700 hover:text-emerald-700 hover:border-emerald-300 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-xs"
                >
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  Message Owner
                </button>
              </div>
            </div>

            {/* Related Machinery Section - STRICTLY RENDERED ONLY IF RELATED ITEMS EXIST */}
            {relatedMachinery && relatedMachinery.length > 0 && (
              <div className="pt-6 border-t border-slate-200">
                <div className="flex items-center justify-between mb-3.5">
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                      <Tractor className="w-4 h-4 text-emerald-600" />
                      Related {machine.category} Machinery ({relatedMachinery.length})
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Similar equipment options available in this category
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {relatedMachinery.map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        if (onSelect) onSelect(item);
                        const scrollContainer = document.getElementById('machinery-detail-scroll');
                        if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="p-3 bg-slate-50 hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 rounded-2xl transition-all cursor-pointer flex items-center gap-3 group shadow-xs hover:shadow-md"
                    >
                      <img
                        src={item.image_url || fallbackImage}
                        alt={item.title}
                        className="w-16 h-16 rounded-xl object-cover shrink-0 border border-slate-200 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0">
                        <span className="text-[10px] font-bold text-emerald-700 uppercase tracking-wider block truncate">
                          {item.brand_model}
                        </span>
                        <h5 className="text-xs font-bold text-slate-800 truncate group-hover:text-emerald-800">
                          {item.title}
                        </h5>
                        <div className="flex items-center justify-between mt-1.5 pt-1 border-t border-slate-200/60">
                          <span className="text-xs font-black text-emerald-900">
                            ₹{Number(item.daily_rate).toLocaleString('en-IN')}
                            <span className="text-[10px] text-slate-400 font-normal"> /day</span>
                          </span>
                          <span className="text-[10px] font-bold text-emerald-700 flex items-center gap-1 group-hover:underline">
                            View <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modal Bottom Actions */}
        <div className="p-4 sm:p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 block">Daily Rate</span>
            <span className="text-xl font-black text-emerald-800">
              ₹{Number(machine.daily_rate).toLocaleString('en-IN')}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2.5 text-sm font-semibold text-slate-600 hover:text-slate-800"
            >
              Close
            </button>

            <button
              onClick={() => {
                onClose();
                onBook(machine);
              }}
              disabled={!isAvailable}
              className={`px-6 py-2.5 text-sm font-bold rounded-xl shadow-md transition-all flex items-center gap-2 ${
                isAvailable
                  ? 'bg-emerald-700 hover:bg-emerald-800 text-white shadow-emerald-700/20 hover:shadow-lg'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed'
              }`}
            >
              <span>{isAvailable ? 'Book This Machinery' : 'Unavailable'}</span>
              {isAvailable && <ArrowRight className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
