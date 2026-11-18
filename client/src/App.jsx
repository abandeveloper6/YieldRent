import React, { useState, useEffect } from 'react';
import api from './api/client';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AuthModal from './components/AuthModal';
import MachineryCard from './components/MachineryCard';
import MachineryFilter from './components/MachineryFilter';
import MachineryDetailModal from './components/MachineryDetailModal';
import BookingModal from './components/BookingModal';
import InquiryModal from './components/InquiryModal';
import WeatherAdvisory from './components/WeatherAdvisory';
import FarmerDashboard from './components/FarmerDashboard';
import OwnerDashboard from './components/OwnerDashboard';
import HowItWorks from './components/HowItWorks';
import StatsBanner from './components/StatsBanner';

import {
  Tractor,
  CloudSun,
  Search,
  Sparkles,
  ShieldCheck,
  TrendingUp,
  MapPin,
  RefreshCw,
  SlidersHorizontal,
  ChevronRight,
  ArrowRight,
  Droplets,
  Wind,
  CheckCircle2
} from 'lucide-react';

export default function App() {
  const { isAuthenticated, isFarmer, isOwner, user } = useAuth();

  // Navigation State
  const [activeTab, setActiveTab] = useState('browse'); // 'browse' | 'weather' | 'farmer-dashboard' | 'owner-dashboard' | 'how-it-works'

  // Machinery State
  const [machinery, setMachinery] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filter States
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [maxPrice, setMaxPrice] = useState(10000);
  const [availableOnly, setAvailableOnly] = useState(false);

  // Modals
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('login');
  const [selectedMachineForDetail, setSelectedMachineForDetail] = useState(null);
  const [selectedMachineForBooking, setSelectedMachineForBooking] = useState(null);
  const [selectedMachineForInquiry, setSelectedMachineForInquiry] = useState(null);

  // Quick Weather Teaser
  const [teaserWeather, setTeaserWeather] = useState(null);

  // Fetch Machinery from API
  const fetchMachinery = async () => {
    setLoading(true);
    setError('');
    try {
      let queryParams = [];
      if (selectedCategory && selectedCategory !== 'All') {
        queryParams.push(`category=${encodeURIComponent(selectedCategory)}`);
      }
      if (searchQuery.trim()) {
        queryParams.push(`search=${encodeURIComponent(searchQuery.trim())}`);
      }
      if (selectedLocation) {
        queryParams.push(`location=${encodeURIComponent(selectedLocation)}`);
      }
      if (maxPrice) {
        queryParams.push(`maxPrice=${maxPrice}`);
      }
      if (availableOnly) {
        queryParams.push('availableOnly=true');
      }

      const queryString = queryParams.length > 0 ? `?${queryParams.join('&')}` : '';
      const res = await api.get(`/machinery${queryString}`);

      if (res.data?.success) {
        setMachinery(res.data.machinery || []);
      } else {
        setError('Failed to fetch machinery listings.');
      }
    } catch (err) {
      console.error('Fetch machinery error:', err);
      setError('Unable to connect to YieldRent server. Please check your backend.');
    } finally {
      setLoading(false);
    }
  };

  // Fetch quick weather teaser
  useEffect(() => {
    const fetchTeaser = async () => {
      try {
        const res = await api.get('/weather?city=pune');
        if (res.data?.success) {
          setTeaserWeather(res.data.data || res.data);
        }
      } catch {
        // Fallback silently
      }
    };
    fetchTeaser();
  }, []);

  // Debounced search / filter update
  useEffect(() => {
    const timer = setTimeout(() => {
      fetchMachinery();
    }, 250);
    return () => clearTimeout(timer);
  }, [searchQuery, selectedCategory, selectedLocation, maxPrice, availableOnly]);

  const handleResetFilters = () => {
    setSearchQuery('');
    setSelectedCategory('All');
    setSelectedLocation('');
    setMaxPrice(10000);
    setAvailableOnly(false);
  };

  const handleOpenAuth = (mode = 'login') => {
    setAuthModalMode(mode);
    setAuthModalOpen(true);
  };

  const handleCategoryFromWeather = (categoryName) => {
    setSelectedCategory(categoryName);
    setActiveTab('browse');
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-['Plus_Jakarta_Sans']">
      {/* Top Navigation */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        openAuthModal={handleOpenAuth}
      />

      {/* Main View Area */}
      <main className="flex-1">
        {activeTab === 'browse' && (
          <div>
            {/* Hero Section */}
            <section className="relative bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-900 text-white overflow-hidden py-16 sm:py-24">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:24px_24px] pointer-events-none"></div>

              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center max-w-3xl mx-auto space-y-4">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-emerald-500/20 backdrop-blur-md rounded-full text-emerald-300 text-xs font-bold border border-emerald-400/30 shadow-xs">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                    <span>Smart Farm Machinery Rental & Live Weather Platform</span>
                  </div>

                  <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-['Outfit'] tracking-tight leading-tight">
                    Empowering Farmers with Modern Machinery & Weather Insights
                  </h1>

                  <p className="text-sm sm:text-base text-emerald-100/90 max-w-2xl mx-auto leading-relaxed">
                    Rent tractors, harvesters, rotavators, and sprayers at transparent hourly or daily rates. Coordinate field operations aligned with live localized weather advisories.
                  </p>

                  {/* Hero Quick Search / Action Bar */}
                  <div className="pt-4 max-w-2xl mx-auto">
                    <div className="bg-white/95 backdrop-blur-md p-2 rounded-2xl shadow-2xl flex items-center gap-2 border border-white/20">
                      <div className="relative flex-1">
                        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
                        <input
                          type="text"
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          placeholder="Search tractors, brands, harvesters, implements..."
                          className="w-full pl-10 pr-3 py-2 text-sm text-slate-800 placeholder-slate-400 focus:outline-hidden bg-transparent"
                        />
                      </div>
                      <button
                        onClick={() => {
                          const el = document.getElementById('catalog');
                          if (el) el.scrollIntoView({ behavior: 'smooth' });
                        }}
                        className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition-all shrink-0 flex items-center gap-1.5"
                      >
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Quick Category Chips */}
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-4 text-xs font-semibold text-emerald-200">
                      <span>Popular:</span>
                      {['Tractors', 'Harvesters', 'Tillage & Ploughs', 'Sprayers & Protection'].map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            const el = document.getElementById('catalog');
                            if (el) el.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 hover:bg-white/20 border border-white/10 transition-colors"
                        >
                          {cat}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Platform Stats Banner */}
            <StatsBanner />

            {/* Live Weather Teaser Alert */}
            {teaserWeather && (
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
                <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-amber-50 border border-emerald-200/80 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
                  <div className="flex items-center gap-3.5">
                    <div className="p-3 bg-white rounded-xl shadow-xs border border-emerald-100 shrink-0">
                      <CloudSun className="w-6 h-6 text-amber-500" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800">
                          Live Agro-Weather: {teaserWeather.location}
                        </span>
                        <span className="bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                          {Math.round(teaserWeather.current.temp)}°C &bull; {teaserWeather.current.condition}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-0.5">
                        <span className="font-semibold text-slate-800">Advisory: </span>
                        {teaserWeather.advisory?.harvesting?.status === 'Optimal'
                          ? 'Optimal conditions for combine harvesting and tillage operations.'
                          : 'Check real-time spraying and harvesting advisory before booking.'}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      setActiveTab('weather');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="px-4 py-2 bg-white hover:bg-emerald-50 text-emerald-800 border border-emerald-300 font-bold text-xs rounded-xl shadow-xs transition-all flex items-center justify-center gap-1.5 shrink-0"
                  >
                    <span>Full Weather Center</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            )}

            {/* Marketplace Catalog Section */}
            <section id="catalog" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
              <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-2">
                <div>
                  <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">
                    Available Machinery Marketplace
                  </span>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 font-['Outfit']">
                    Browse Farm Equipment & Implements
                  </h2>
                </div>
                <div className="text-xs text-slate-500 font-semibold">
                  Showing <span className="text-slate-900 font-bold">{machinery.length}</span> verified machines
                </div>
              </div>

              {/* Filtering Controls */}
              <MachineryFilter
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                maxPrice={maxPrice}
                setMaxPrice={setMaxPrice}
                availableOnly={availableOnly}
                setAvailableOnly={setAvailableOnly}
                onReset={handleResetFilters}
              />

              {/* Loading State */}
              {loading ? (
                <div className="py-24 text-center space-y-3">
                  <RefreshCw className="w-10 h-10 text-emerald-600 animate-spin mx-auto" />
                  <p className="text-sm font-bold text-slate-600">
                    Loading verified agricultural equipment...
                  </p>
                </div>
              ) : error ? (
                <div className="p-8 bg-rose-50 border border-rose-200 rounded-3xl text-center space-y-3">
                  <p className="text-sm font-bold text-rose-700">{error}</p>
                  <button
                    onClick={fetchMachinery}
                    className="px-4 py-2 bg-rose-600 text-white text-xs font-bold rounded-xl"
                  >
                    Retry Loading
                  </button>
                </div>
              ) : machinery.length === 0 ? (
                <div className="bg-white rounded-3xl border border-slate-200 p-12 text-center space-y-3">
                  <Tractor className="w-14 h-14 text-slate-300 mx-auto" />
                  <h3 className="text-lg font-bold text-slate-800">No Farm Equipment Matches Your Filter</h3>
                  <p className="text-xs text-slate-500 max-w-sm mx-auto">
                    Try broadening your search keyword, adjusting the price slider, or resetting category filters.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    className="mt-2 px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs"
                  >
                    Reset All Filters
                  </button>
                </div>
              ) : (
                /* Machinery Grid */
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {machinery.map((item) => (
                    <MachineryCard
                      key={item.id}
                      machine={item}
                      onSelect={(m) => setSelectedMachineForDetail(m)}
                      onBook={(m) => setSelectedMachineForBooking(m)}
                      onInquire={(m) => setSelectedMachineForInquiry(m)}
                    />
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {/* Weather Advisory View */}
        {activeTab === 'weather' && (
          <WeatherAdvisory onSelectMachineryCategory={handleCategoryFromWeather} />
        )}

        {/* Farmer Dashboard View */}
        {activeTab === 'farmer-dashboard' && (
          <FarmerDashboard
            onBrowseClick={() => {
              setActiveTab('browse');
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
          />
        )}

        {/* Machinery Owner Dashboard View */}
        {activeTab === 'owner-dashboard' && <OwnerDashboard />}

        {/* How It Works View */}
        {activeTab === 'how-it-works' && (
          <HowItWorks
            onGetStarted={() => {
              setActiveTab('browse');
              window.scrollTo({ top: 400, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      {/* Global Modals */}
      <MachineryDetailModal
        machine={selectedMachineForDetail}
        allMachinery={machinery}
        isOpen={!!selectedMachineForDetail}
        onClose={() => setSelectedMachineForDetail(null)}
        onSelect={(m) => setSelectedMachineForDetail(m)}
        onBook={(m) => setSelectedMachineForBooking(m)}
        onInquire={(m) => setSelectedMachineForInquiry(m)}
      />

      <BookingModal
        machine={selectedMachineForBooking}
        isOpen={!!selectedMachineForBooking}
        onClose={() => setSelectedMachineForBooking(null)}
        onBookingCreated={() => {
          fetchMachinery();
          if (isFarmer) {
            setActiveTab('farmer-dashboard');
          }
        }}
        openAuthModal={handleOpenAuth}
      />

      <InquiryModal
        machine={selectedMachineForInquiry}
        isOpen={!!selectedMachineForInquiry}
        onClose={() => setSelectedMachineForInquiry(null)}
        openAuthModal={handleOpenAuth}
      />

      {/* AuthModal rendered last with z-[70] so it appears on top of any modal */}
      <AuthModal
        isOpen={authModalOpen}
        initialMode={authModalMode}
        onClose={() => setAuthModalOpen(false)}
        onSuccess={() => {
          fetchMachinery();
        }}
      />

      {/* Global Footer */}
      <Footer setActiveTab={setActiveTab} />
    </div>
  );
}
