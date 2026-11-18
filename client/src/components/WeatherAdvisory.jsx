import React, { useState, useEffect } from 'react';
import api from '../api/client';
import {
  CloudSun,
  Droplets,
  Wind,
  Compass,
  Thermometer,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Tractor,
  Wheat,
  ShieldAlert,
  Sprout,
  ArrowRight,
  Sun,
  MapPin,
  RefreshCw
} from 'lucide-react';

const CITIES = [
  { id: 'pune', name: 'Pune, Maharashtra' },
  { id: 'nashik', name: 'Nashik, Maharashtra' },
  { id: 'kolhapur', name: 'Kolhapur, Maharashtra' },
  { id: 'ahmednagar', name: 'Ahmednagar, Maharashtra' },
  { id: 'nagpur', name: 'Nagpur, Maharashtra' },
  { id: 'aurangabad', name: 'Chhatrapati Sambhajinagar, MH' },
  { id: 'solapur', name: 'Solapur, Maharashtra' },
  { id: 'satara', name: 'Satara, Maharashtra' }
];

export default function WeatherAdvisory({ onSelectMachineryCategory }) {
  const [selectedCity, setSelectedCity] = useState('pune');
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchWeather = async (city) => {
    setLoading(true);
    setError('');
    try {
      const res = await api.get(`/weather?city=${encodeURIComponent(city)}`);
      if (res.data?.success) {
        const payload = res.data.data || res.data;
        if (payload && payload.current) {
          setWeatherData({
            location: payload.location || `${payload.current.city}, ${payload.current.state || 'Maharashtra'}`,
            current: payload.current,
            advisory: payload.advisory || {},
            forecast: payload.forecast || [],
            source: payload.source || 'Agri-Meteorological Live Engine'
          });
        } else {
          setError('Weather telemetry data format not recognized.');
        }
      } else {
        setError('Unable to fetch weather data.');
      }
    } catch (err) {
      console.error('Weather fetch error:', err);
      setError('Weather API currently unavailable. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedCity) {
      fetchWeather(selectedCity);
    }
  }, [selectedCity]);


  const getAdvisoryColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'optimal':
      case 'ideal':
      case 'good':
      case 'recommended':
        return {
          bg: 'bg-emerald-50',
          border: 'border-emerald-300',
          badge: 'bg-emerald-100 text-emerald-800',
          iconColor: 'text-emerald-600',
          icon: CheckCircle2
        };
      case 'caution':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-300',
          badge: 'bg-amber-100 text-amber-800',
          iconColor: 'text-amber-600',
          icon: AlertTriangle
        };
      default:
        return {
          bg: 'bg-rose-50',
          border: 'border-rose-300',
          badge: 'bg-rose-100 text-rose-800',
          iconColor: 'text-rose-600',
          icon: ShieldAlert
        };
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Banner / Location Selector */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-900 to-teal-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md rounded-full text-emerald-300 text-xs font-bold border border-white/15">
              <CloudSun className="w-3.5 h-3.5 text-amber-400" />
              <span>Real-Time Agricultural Weather Monitoring</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-black font-['Outfit']">
              Live Weather & Field Advisory
            </h1>
            <p className="text-xs sm:text-sm text-emerald-200 max-w-xl">
              Plan machine deployments, fertilizer spraying, and combine harvesting based on hyper-local weather conditions and AI-supported farming advisories.
            </p>
          </div>

          {/* District Selector */}
          <div className="bg-white/10 backdrop-blur-md p-2 rounded-2xl border border-white/20 sm:w-72">
            <label className="text-[11px] font-bold text-emerald-200 px-2 block mb-1">
              Select Farming Region:
            </label>
            <div className="relative">
              <MapPin className="w-4 h-4 text-amber-400 absolute left-3 top-3 pointer-events-none" />
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-emerald-950/80 text-white text-xs font-bold rounded-xl border border-emerald-600/40 focus:outline-hidden focus:ring-2 focus:ring-amber-400 cursor-pointer"
              >
                {CITIES.map((c) => (
                  <option key={c.id} value={c.id} className="bg-slate-900 text-white">
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Quick District Selector Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
        <span className="text-xs font-bold text-slate-500 shrink-0">Switch District:</span>
        {CITIES.map((c) => (
          <button
            key={c.id}
            onClick={() => setSelectedCity(c.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1.5 ${
              selectedCity === c.id
                ? 'bg-emerald-700 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MapPin className={`w-3 h-3 ${selectedCity === c.id ? 'text-white' : 'text-emerald-600'}`} />
            <span>{c.name.split(',')[0]}</span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
          <p className="text-sm font-bold text-slate-600">
            Fetching latest satellite weather and agronomy telemetry...
          </p>
        </div>
      ) : error ? (
        <div className="p-6 bg-rose-50 border border-rose-200 rounded-2xl text-rose-700 text-center">
          <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-rose-500" />
          <p className="text-sm font-bold">{error}</p>
          <button
            onClick={() => fetchWeather(selectedCity)}
            className="mt-3 px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl"
          >
            Retry Connection
          </button>
        </div>
      ) : weatherData && (
        <>
          {/* Main Weather Metrics Card */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Current Conditions */}
            <div className="lg:col-span-1 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider block">
                      Current Temperature
                    </span>
                    <p className="text-xs text-slate-500">{weatherData.location}</p>
                  </div>
                  <span className="text-xs text-slate-400 font-medium">Updated Just Now</span>
                </div>

                <div className="flex items-center gap-4 my-4">
                  <div className="p-4 bg-amber-50 rounded-2xl border border-amber-100">
                    <Sun className="w-12 h-12 text-amber-500 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-5xl font-black text-slate-900 font-['Outfit']">
                      {Math.round(weatherData.current.temp)}°C
                    </div>
                    <p className="text-sm font-bold text-slate-700 mt-1 capitalize">
                      {weatherData.current.condition}
                    </p>
                    <p className="text-xs text-slate-400">
                      Feels like {Math.round(weatherData.current.feelsLike || weatherData.current.temp)}°C
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick Metrics */}
              <div className="grid grid-cols-2 gap-2 pt-4 border-t border-slate-100 text-xs">
                <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2">
                  <Droplets className="w-4 h-4 text-blue-500 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Relative Humidity</span>
                    <span className="font-bold text-slate-800">{weatherData.current.humidity}%</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50 rounded-xl flex items-center gap-2">
                  <Wind className="w-4 h-4 text-teal-600 shrink-0" />
                  <div>
                    <span className="text-[10px] text-slate-400 block font-medium">Wind Velocity</span>
                    <span className="font-bold text-slate-800">{weatherData.current.windSpeed} km/h</span>
                  </div>
                </div>
              </div>
            </div>

            {/* 5-Day Agro Forecast */}
            <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-slate-200 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-emerald-600" />
                    5-Day Agricultural Weather Outlook
                  </h3>
                  <span className="text-xs text-slate-400 font-medium">Daily Min / Max</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  {weatherData.forecast && weatherData.forecast.map((day, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-2xl border text-center transition-all ${
                        idx === 0
                          ? 'bg-emerald-50/70 border-emerald-300 shadow-xs'
                          : 'bg-slate-50 border-slate-200/80 hover:bg-slate-100'
                      }`}
                    >
                      <p className="text-xs font-bold text-slate-700 mb-1">{day.date || day.day || `Day ${idx + 1}`}</p>
                      <div className="my-2 flex justify-center">
                        <CloudSun className="w-7 h-7 text-amber-500" />
                      </div>
                      <p className="text-sm font-black text-slate-900">
                        {Math.round(day.tempMax)}° <span className="text-slate-400 text-xs font-normal">{Math.round(day.tempMin)}°</span>
                      </p>
                      <p className="text-[10px] font-semibold text-emerald-800 mt-1 line-clamp-1">
                        {day.condition}
                      </p>
                      <p className="text-[10px] text-blue-600 font-bold mt-1">
                        💧 {day.rainChance}% Rain
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Forecast telemetry synced with OpenWeather Agri Engine.</span>
                <span className="font-semibold text-emerald-700">High Confidence Level</span>
              </div>
            </div>
          </div>

          {/* Smart Agricultural Operations Advisory Cards */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900 font-['Outfit']">
                  Farming Operations & Machine Readiness Advisory
                </h2>
                <p className="text-xs text-slate-500">
                  Calculated using live humidity, temperature, and wind thresholds for {weatherData.location}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* 1. Harvesting */}
              {(() => {
                const config = getAdvisoryColor(weatherData.advisory?.harvesting?.status);
                const IconComponent = config.icon;
                return (
                  <div className={`p-5 rounded-2xl border ${config.border} ${config.bg} flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Wheat className="w-5 h-5 text-amber-600" />
                          <span className="text-xs font-bold text-slate-900">Combine Harvesting</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
                          {weatherData.advisory?.harvesting?.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {weatherData.advisory?.harvesting?.text}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600">Combine Harvester</span>
                      <button
                        onClick={() => onSelectMachineryCategory('Harvesters')}
                        className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                      >
                        Rent <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* 2. Spraying */}
              {(() => {
                const config = getAdvisoryColor(weatherData.advisory?.spraying?.status);
                const IconComponent = config.icon;
                return (
                  <div className={`p-5 rounded-2xl border ${config.border} ${config.bg} flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Droplets className="w-5 h-5 text-blue-600" />
                          <span className="text-xs font-bold text-slate-900">Foliar Spraying</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
                          {weatherData.advisory?.spraying?.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {weatherData.advisory?.spraying?.text}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600">Boom Sprayer</span>
                      <button
                        onClick={() => onSelectMachineryCategory('Sprayers & Protection')}
                        className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                      >
                        Rent <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* 3. Plowing */}
              {(() => {
                const config = getAdvisoryColor(weatherData.advisory?.plowing?.status);
                const IconComponent = config.icon;
                return (
                  <div className={`p-5 rounded-2xl border ${config.border} ${config.bg} flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Tractor className="w-5 h-5 text-emerald-700" />
                          <span className="text-xs font-bold text-slate-900">Plowing & Tillage</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
                          {weatherData.advisory?.plowing?.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {weatherData.advisory?.plowing?.text}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600">Tractor & Rotavator</span>
                      <button
                        onClick={() => onSelectMachineryCategory('Tillage & Ploughs')}
                        className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                      >
                        Rent <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })()}

              {/* 4. Sowing */}
              {(() => {
                const config = getAdvisoryColor(weatherData.advisory?.sowing?.status);
                const IconComponent = config.icon;
                return (
                  <div className={`p-5 rounded-2xl border ${config.border} ${config.bg} flex flex-col justify-between`}>
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Sprout className="w-5 h-5 text-teal-600" />
                          <span className="text-xs font-bold text-slate-900">Sowing & Seeding</span>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${config.badge}`}>
                          {weatherData.advisory?.sowing?.status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-700 leading-relaxed">
                        {weatherData.advisory?.sowing?.text}
                      </p>
                    </div>
                    <div className="mt-4 pt-3 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[11px] font-bold text-slate-600">Seed Drill</span>
                      <button
                        onClick={() => onSelectMachineryCategory('Sowing & Planting')}
                        className="text-xs font-bold text-emerald-800 hover:underline flex items-center gap-1"
                      >
                        Rent <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
