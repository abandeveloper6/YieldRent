import React from 'react';
import { Search, Filter, SlidersHorizontal, RotateCcw, MapPin, Check } from 'lucide-react';

const CATEGORIES = [
  'All',
  'Tractors',
  'Harvesters',
  'Tillage & Ploughs',
  'Sowing & Planting',
  'Sprayers & Protection',
  'Threshers'
];

const LOCATIONS = [
  'All Locations',
  'Pune',
  'Nashik',
  'Kolhapur',
  'Ahmednagar',
  'Nagpur',
  'Chhatrapati Sambhajinagar',
  'Solapur',
  'Satara',
  'Sangli'
];

export default function MachineryFilter({
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  maxPrice,
  setMaxPrice,
  availableOnly,
  setAvailableOnly,
  onReset
}) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-sm p-5 mb-8">
      {/* Top Search Bar & Quick Filters */}
      <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-4">
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search tractors, harvesters, rotavators, brand models..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all"
          />
        </div>

        {/* Location Dropdown */}
        <div className="relative md:w-56">
          <MapPin className="w-4 h-4 text-emerald-600 absolute left-3.5 top-3.5 pointer-events-none" />
          <select
            value={selectedLocation}
            onChange={(e) => setSelectedLocation(e.target.value)}
            className="w-full pl-10 pr-8 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-700 appearance-none focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white transition-all cursor-pointer"
          >
            {LOCATIONS.map((loc) => (
              <option key={loc} value={loc === 'All Locations' ? '' : loc}>
                {loc}
              </option>
            ))}
          </select>
        </div>

        {/* Available Only Toggle */}
        <button
          type="button"
          onClick={() => setAvailableOnly(!availableOnly)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold border transition-all ${
            availableOnly
              ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
              : 'bg-slate-50 border-slate-200 text-slate-600 hover:bg-slate-100'
          }`}
        >
          <div
            className={`w-4 h-4 rounded-md border flex items-center justify-center ${
              availableOnly
                ? 'bg-emerald-600 border-emerald-600 text-white'
                : 'border-slate-300 bg-white'
            }`}
          >
            {availableOnly && <Check className="w-3 h-3 stroke-[3]" />}
          </div>
          <span>Available Now</span>
        </button>

        {/* Reset Filter Button */}
        <button
          onClick={onReset}
          className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
          title="Reset all filters"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Category Pills Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        {CATEGORIES.map((cat) => {
          const isActive = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                isActive
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Max Price Slider (Subtle) */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs text-slate-600">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-400" />
          <span>Max Daily Rent:</span>
          <span className="font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
            ₹{Number(maxPrice).toLocaleString('en-IN')} / day
          </span>
        </div>
        <div className="flex-1 max-w-xs">
          <input
            type="range"
            min="500"
            max="12000"
            step="200"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full accent-emerald-600 cursor-pointer"
          />
        </div>
      </div>
    </div>
  );
}
