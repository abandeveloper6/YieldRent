import React from 'react';
import { Tractor, Heart, MapPin, Mail, Phone, ExternalLink } from 'lucide-react';

export default function Footer({ setActiveTab }) {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Col */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <img
                src="/logo.jpeg"
                alt="YieldRent Logo"
                className="w-10 h-10 rounded-xl object-cover border-2 border-emerald-500"
                onError={(e) => { e.target.style.display = 'none'; }}
              />
              <span className="text-2xl font-black text-white font-['Outfit']">
                Yield<span className="text-amber-500">Rent</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Smart Farmer Machinery Rental & Live Weather Monitoring System. Bridging the gap between idle farm equipment and smallholder farmers to maximize agricultural yield.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Academic Project &bull; SDLC Model
            </div>
          </div>

          {/* Platform Navigation */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Explore Platform
            </h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button
                  onClick={() => { setActiveTab('browse'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Machinery Catalog
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('weather'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Live Weather & Advisory
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('how-it-works'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  How Renting Works
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setActiveTab('browse'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-white transition-colors"
                >
                  Available Equipment Hubs
                </button>
              </li>
            </ul>
          </div>

          {/* Machinery Categories */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Equipment Categories
            </h4>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li>High-Power Tractors (45-75 HP)</li>
              <li>Multi-Crop Combine Harvesters</li>
              <li>Heavy Rotavators & Ploughs</li>
              <li>Automated Seed & Fertilizer Drills</li>
              <li>Tractor-Mounted Boom Sprayers</li>
              <li>Post-Harvest Threshers</li>
            </ul>
          </div>

          {/* Academic & Contact Info */}
          <div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Academic Submission
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Maharashtra Agricultural Hubs</span>
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>support@yieldrent.agri</span>
              </p>
              <p className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Toll-Free Agri Helpline: 1800-AGRI-RENT</span>
              </p>
              <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-400">
                Technology: Node.js, Express, React, MySQL / SQLite, OpenWeather API.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-800 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} YieldRent. All rights reserved. Academic Mini Project.</p>
          <p className="flex items-center gap-1">
            Engineered for modern agricultural sustainability & farmer prosperity
          </p>
        </div>
      </div>
    </footer>
  );
}
