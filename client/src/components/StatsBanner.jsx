import React, { useState, useEffect } from 'react';
import api from '../api/client';
import { Tractor, Users, CalendarCheck, MapPin } from 'lucide-react';

export default function StatsBanner() {
  const [stats, setStats] = useState({
    totalMachinery: 12,
    totalFarmers: 48,
    totalBookings: 35,
    coverageLocations: 8
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get('/stats');
        if (res.data?.success && res.data?.stats) {
          setStats(res.data.stats);
        }
      } catch {
        // Use default seeded stats
      }
    };
    fetchStats();
  }, []);

  return (
    <div className="bg-white border-y border-slate-200/80 py-6">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-emerald-700">
              <Tractor className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-black font-['Outfit']">
                {stats.totalMachinery}+
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Farm Machines Listed
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-amber-600">
              <Users className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-black font-['Outfit']">
                {stats.totalFarmers || 50}+
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Registered Farmers
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-teal-700">
              <CalendarCheck className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-black font-['Outfit']">
                {stats.totalBookings || 30}+
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Rentals Coordinated
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center justify-center gap-1 text-blue-600">
              <MapPin className="w-5 h-5" />
              <span className="text-2xl sm:text-3xl font-black font-['Outfit']">
                {stats.coverageLocations || 8}
              </span>
            </div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Farming Districts Covered
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
