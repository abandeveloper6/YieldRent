import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  Tractor,
  CloudSun,
  User,
  LogOut,
  CalendarCheck,
  LayoutDashboard,
  Menu,
  X,
  Sparkles,
  ShieldCheck,
  ChevronDown,
  PhoneCall,
  MapPin,
  CheckCircle2,
  Compass,
  ArrowRight,
  SunMedium
} from 'lucide-react';

export default function Navbar({ activeTab, setActiveTab, openAuthModal }) {
  const { user, isAuthenticated, isOwner, isFarmer, logout, demoLogin } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleDemoSwitch = async (role) => {
    await demoLogin(role);
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200/90 shadow-xs">
      {/* Top Agricultural Notice & Helpline Bar */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-emerald-950 text-slate-300 text-[11px] py-1.5 px-4 sm:px-6 lg:px-8 border-b border-white/5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 font-medium text-emerald-400">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Agri-Telemetric Network Active
            </span>
            <span className="hidden sm:inline text-slate-500">&bull;</span>
            <span className="hidden sm:flex items-center gap-1 text-slate-400">
              <MapPin className="w-3 h-3 text-amber-400" />
              Maharashtra Agro Hubs (Pune, Nashik, Kolhapur, Nagpur)
            </span>
          </div>

          <div className="flex items-center gap-4 text-slate-400">
            <div className="hidden md:flex items-center gap-1.5 hover:text-white transition-colors">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>Agri Helpline: <strong className="text-white">1800-AGRI-RENT</strong></span>
            </div>
            <span className="hidden md:inline text-slate-600">|</span>
            <div className="flex items-center gap-1 text-amber-300 font-semibold">
              <Sparkles className="w-3 h-3" />
              <span>Academic Mini Project</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Brand Logo & Typography */}
          <div
            onClick={() => setActiveTab('browse')}
            className="flex items-center gap-3 cursor-pointer group select-none py-1"
          >
            <div className="relative">
              <div className="w-12 h-12 rounded-2xl p-0.5 bg-gradient-to-br from-emerald-500 via-teal-600 to-amber-500 shadow-md group-hover:shadow-emerald-500/25 transition-all duration-300 group-hover:scale-105">
                <img
                  src="/logo.jpeg"
                  alt="YieldRent Logo"
                  className="w-full h-full rounded-[14px] object-cover bg-white"
                  onError={(e) => {
                    e.target.style.display = 'none';
                  }}
                />
              </div>
              <div className="absolute -bottom-1 -right-1 bg-emerald-700 text-white rounded-full p-1 border-2 border-white shadow-xs">
                <Tractor className="w-2.5 h-2.5" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-black tracking-tight text-slate-900 font-['Outfit']">
                  Yield<span className="text-emerald-700">Rent</span>
                </span>
                <span className="bg-emerald-100 text-emerald-900 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-emerald-300/80 uppercase tracking-wide">
                  Smart Farm
                </span>
              </div>
              <p className="text-[11px] text-slate-500 font-medium hidden sm:block leading-none mt-0.5">
                Machinery Rental &bull; Live Weather Advisory
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center bg-slate-100/80 p-1.5 rounded-2xl border border-slate-200/80 shadow-inner">
            <button
              onClick={() => setActiveTab('browse')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'browse'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Tractor className="w-4 h-4 text-emerald-600" />
              <span>Browse Equipment</span>
            </button>

            <button
              onClick={() => setActiveTab('weather')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'weather'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <div className="relative">
                <CloudSun className="w-4 h-4 text-amber-500" />
                <span className="absolute -top-0.5 -right-0.5 w-1.5 h-1.5 rounded-full bg-amber-500 animate-ping"></span>
              </div>
              <span>Weather Advisory</span>
            </button>

            {isAuthenticated && isFarmer && (
              <button
                onClick={() => setActiveTab('farmer-dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeTab === 'farmer-dashboard'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>My Bookings</span>
              </button>
            )}

            {isAuthenticated && isOwner && (
              <button
                onClick={() => setActiveTab('owner-dashboard')}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                  activeTab === 'owner-dashboard'
                    ? 'bg-white text-emerald-800 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                <span>Owner Portal</span>
              </button>
            )}

            <button
              onClick={() => setActiveTab('how-it-works')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-200 ${
                activeTab === 'how-it-works'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white/50'
              }`}
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>How It Works</span>
            </button>
          </nav>

          {/* Right Action Bar */}
          <div className="hidden sm:flex items-center gap-3">
            {/* Quick 1-Click Role Switcher */}
            <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200/90 shadow-inner">
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-slate-400 px-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" /> Role:
              </span>

              <button
                onClick={() => handleDemoSwitch('farmer')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  user?.role === 'farmer' && user?.email === 'farmer@yieldrent.com'
                    ? 'bg-emerald-700 text-white shadow-xs'
                    : 'text-slate-600 hover:text-emerald-700 hover:bg-white/80'
                }`}
                title="Switch to Demo Farmer account"
              >
                <span>🌾 Farmer</span>
                {user?.role === 'farmer' && user?.email === 'farmer@yieldrent.com' && (
                  <CheckCircle2 className="w-3 h-3 text-emerald-200" />
                )}
              </button>

              <button
                onClick={() => handleDemoSwitch('owner')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                  user?.role === 'owner' && user?.email === 'owner@yieldrent.com'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-amber-800 hover:bg-white/80'
                }`}
                title="Switch to Demo Machinery Owner account"
              >
                <span>🚜 Owner</span>
                {user?.role === 'owner' && user?.email === 'owner@yieldrent.com' && (
                  <CheckCircle2 className="w-3 h-3 text-amber-200" />
                )}
              </button>
            </div>

            {/* Profile or Sign-In Trigger */}
            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-2xl border border-slate-200/90 bg-white hover:border-emerald-400 hover:shadow-sm transition-all focus:outline-hidden"
                >
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=15803d&color=fff`
                    }
                    alt={user.name}
                    className="w-8 h-8 rounded-xl border border-emerald-600 object-cover"
                  />
                  <div className="text-left leading-none hidden xl:block">
                    <p className="text-xs font-bold text-slate-800 line-clamp-1">{user.name}</p>
                    <span className="text-[10px] font-extrabold uppercase text-emerald-700 tracking-wider">
                      {user.role === 'owner' ? 'Machinery Owner' : 'Farmer'}
                    </span>
                  </div>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                          {user.role === 'owner' ? 'Equipment Owner' : 'Registered Farmer'}
                        </span>
                      </div>
                      <p className="text-sm font-bold text-slate-900 truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 truncate">{user.email}</p>
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-400" />
                        {user.location || 'Maharashtra, India'}
                      </p>
                    </div>

                    <div className="py-1.5 px-1">
                      {isFarmer && (
                        <button
                          onClick={() => {
                            setActiveTab('farmer-dashboard');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl flex items-center gap-2.5 transition-colors"
                        >
                          <CalendarCheck className="w-4 h-4 text-emerald-600" />
                          <span>My Bookings & Reservations</span>
                        </button>
                      )}

                      {isOwner && (
                        <button
                          onClick={() => {
                            setActiveTab('owner-dashboard');
                            setProfileDropdownOpen(false);
                          }}
                          className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl flex items-center gap-2.5 transition-colors"
                        >
                          <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                          <span>Owner Management Portal</span>
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setActiveTab('weather');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-slate-700 hover:bg-emerald-50 hover:text-emerald-800 rounded-xl flex items-center gap-2.5 transition-colors"
                      >
                        <SunMedium className="w-4 h-4 text-amber-500" />
                        <span>Live Agro-Weather Center</span>
                      </button>
                    </div>

                    <div className="border-t border-slate-100 pt-1 px-1">
                      <button
                        onClick={() => {
                          logout();
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full text-left px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2.5 transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => openAuthModal('login')}
                  className="px-4 py-2 text-xs font-bold text-slate-700 hover:text-emerald-800 rounded-xl hover:bg-slate-100 transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => openAuthModal('register')}
                  className="px-4 py-2.5 text-xs font-bold text-white bg-gradient-to-r from-emerald-700 via-emerald-800 to-teal-900 hover:from-emerald-600 hover:to-teal-800 rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-1.5"
                >
                  <ShieldCheck className="w-4 h-4" />
                  <span>Join YieldRent</span>
                </button>
              </div>
            )}
          </div>

          {/* Mobile Hamburger Button */}
          <div className="flex items-center lg:hidden gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-slate-700 hover:text-emerald-800 hover:bg-slate-100 border border-slate-200 transition-colors"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Slide-Down Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-4 animate-in slide-in-from-top-3 duration-200">
          <div className="space-y-1">
            <button
              onClick={() => {
                setActiveTab('browse');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                activeTab === 'browse' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'
              }`}
            >
              <Tractor className="w-4 h-4 text-emerald-600" />
              <span>Browse Machinery</span>
            </button>

            <button
              onClick={() => {
                setActiveTab('weather');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                activeTab === 'weather' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'
              }`}
            >
              <CloudSun className="w-4 h-4 text-amber-500" />
              <span>Live Weather Advisory</span>
            </button>

            {isAuthenticated && isFarmer && (
              <button
                onClick={() => {
                  setActiveTab('farmer-dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                  activeTab === 'farmer-dashboard' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'
                }`}
              >
                <CalendarCheck className="w-4 h-4 text-emerald-600" />
                <span>My Bookings</span>
              </button>
            )}

            {isAuthenticated && isOwner && (
              <button
                onClick={() => {
                  setActiveTab('owner-dashboard');
                  setMobileMenuOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                  activeTab === 'owner-dashboard' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                <span>Owner Portal</span>
              </button>
            )}

            <button
              onClick={() => {
                setActiveTab('how-it-works');
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2.5 ${
                activeTab === 'how-it-works' ? 'bg-emerald-50 text-emerald-800' : 'text-slate-600'
              }`}
            >
              <Compass className="w-4 h-4 text-slate-500" />
              <span>How It Works</span>
            </button>
          </div>

          {/* Quick Demo Segment in Mobile */}
          <div className="pt-3 border-t border-slate-100">
            <p className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Demo Role Switcher:
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => handleDemoSwitch('farmer')}
                className="py-2.5 px-3 rounded-xl border border-emerald-300 bg-emerald-50 text-emerald-900 text-xs font-bold text-center hover:bg-emerald-100"
              >
                🌾 Demo Farmer
              </button>
              <button
                onClick={() => handleDemoSwitch('owner')}
                className="py-2.5 px-3 rounded-xl border border-amber-300 bg-amber-50 text-amber-900 text-xs font-bold text-center hover:bg-amber-100"
              >
                🚜 Demo Owner
              </button>
            </div>
          </div>

          {/* Mobile Auth Buttons */}
          <div className="pt-3 border-t border-slate-100">
            {isAuthenticated ? (
              <div className="flex items-center justify-between bg-slate-50 p-3 rounded-2xl border border-slate-200">
                <div className="flex items-center gap-2.5">
                  <img
                    src={
                      user.avatar ||
                      `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=15803d&color=fff`
                    }
                    alt={user.name}
                    className="w-9 h-9 rounded-xl border border-emerald-600 object-cover"
                  />
                  <div>
                    <p className="text-xs font-bold text-slate-900">{user.name}</p>
                    <p className="text-[10px] font-bold text-emerald-700 uppercase">
                      {user.role === 'owner' ? 'Machinery Owner' : 'Farmer'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50 rounded-xl"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => {
                    openAuthModal('login');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-xs font-bold border border-slate-200 rounded-xl text-slate-700 hover:bg-slate-50"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    openAuthModal('register');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full py-2.5 text-xs font-bold text-white bg-emerald-700 rounded-xl shadow-xs"
                >
                  Join Free
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
