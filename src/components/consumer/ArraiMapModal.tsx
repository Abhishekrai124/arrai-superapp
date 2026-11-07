import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  MapPin, 
  Navigation, 
  Search, 
  Compass, 
  Layers, 
  X, 
  Send, 
  Store, 
  Building2, 
  Fuel, 
  Zap, 
  CheckCircle2, 
  ArrowRight,
  Phone
} from 'lucide-react';

interface NearbyPlace {
  id: string;
  name: string;
  category: 'merchant' | 'atm' | 'ev' | 'fuel';
  distance: string;
  eta: string;
  rating: string;
  address: string;
  vpa?: string;
  lat: number;
  lng: number;
}

export const ArraiMapModal: React.FC = () => {
  const { activeModal, closeModal, openModal } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'merchant' | 'atm' | 'ev' | 'fuel'>('all');
  const [selectedPlace, setSelectedPlace] = useState<NearbyPlace | null>(null);

  if (activeModal !== 'arraiMap') return null;

  const places: NearbyPlace[] = [
    {
      id: 'p1',
      name: 'ARRAI SuperMart & Bakery',
      category: 'merchant',
      distance: '250 m',
      eta: '3 mins',
      rating: '4.9 ★',
      address: 'Shop 14, Galaxy Market, Sector 18',
      vpa: 'galaxymart@arrai',
      lat: 28.57,
      lng: 77.32
    },
    {
      id: 'p2',
      name: 'HDFC Bank & 24x7 Cash ATM',
      category: 'atm',
      distance: '450 m',
      eta: '6 mins',
      rating: '4.7 ★',
      address: 'Ground Floor, Metro Pillar 42',
      lat: 28.58,
      lng: 77.33
    },
    {
      id: 'p3',
      name: 'Tata Power Fast EV Station',
      category: 'ev',
      distance: '800 m',
      eta: '9 mins',
      rating: '4.8 ★',
      address: 'Near City Mall Parking Lot B',
      vpa: 'tatapower.ev@arrai',
      lat: 28.59,
      lng: 77.34
    },
    {
      id: 'p4',
      name: 'IndianOil Fuel Station & CNG',
      category: 'fuel',
      distance: '1.2 km',
      eta: '12 mins',
      rating: '4.6 ★',
      address: 'Main Express Highway Crossing',
      vpa: 'ioc.express@arrai',
      lat: 28.60,
      lng: 77.35
    },
    {
      id: 'p5',
      name: 'Sharma Sweets & Chaat Cafe',
      category: 'merchant',
      distance: '300 m',
      eta: '4 mins',
      rating: '4.9 ★',
      address: 'Main Bazaar Road, Opp. Temple',
      vpa: 'sharmasweets@arrai',
      lat: 28.575,
      lng: 77.325
    }
  ];

  const filteredPlaces = places.filter(p => {
    const matchesCategory = selectedFilter === 'all' || p.category === selectedFilter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.address.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-3 sm:p-5 animate-in fade-in">
      <div className="bg-white w-full max-w-4xl h-[85vh] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row">
        
        {/* Left Side: Interactive Map Canvas Simulation */}
        <div className="flex-1 bg-slate-900 relative overflow-hidden flex flex-col">
          {/* Simulated Map Visuals with Grid & Markers */}
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:24px_24px]" />
          
          {/* Simulated Roads & Highways */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-30 stroke-slate-500 stroke-2">
            <line x1="10%" y1="20%" x2="90%" y2="80%" />
            <line x1="20%" y1="90%" x2="80%" y2="10%" />
            <line x1="0%" y1="50%" x2="100%" y2="50%" />
            <circle cx="50%" cy="50%" r="120" fill="none" strokeDasharray="4 4" className="stroke-indigo-400" />
          </svg>

          {/* User's Current Location Beacon */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center">
            <span className="w-5 h-5 rounded-full bg-blue-500 ring-4 ring-blue-500/30 animate-pulse flex items-center justify-center">
              <span className="w-2 h-2 rounded-full bg-white" />
            </span>
            <span className="mt-1 px-2 py-0.5 rounded-full bg-slate-950/80 text-[9px] font-bold text-white backdrop-blur-xs border border-white/20">
              You Are Here
            </span>
          </div>

          {/* Interactive Place Markers on Map */}
          {places.map((place, idx) => {
            const isSelected = selectedPlace?.id === place.id;
            // Simulated positions
            const positions = [
              { top: '35%', left: '30%' },
              { top: '25%', left: '70%' },
              { top: '70%', left: '65%' },
              { top: '75%', left: '25%' },
              { top: '45%', left: '55%' }
            ];
            const pos = positions[idx] || { top: '50%', left: '50%' };

            return (
              <button
                key={place.id}
                onClick={() => setSelectedPlace(place)}
                style={{ top: pos.top, left: pos.left }}
                className={`absolute z-20 -translate-x-1/2 -translate-y-1/2 flex items-center gap-1.5 p-1.5 rounded-2xl transition-all shadow-lg active:scale-95 ${
                  isSelected 
                    ? 'bg-emerald-500 text-white ring-4 ring-emerald-400/40 scale-110' 
                    : 'bg-white/95 text-slate-800 hover:scale-105'
                }`}
              >
                <div className={`w-6 h-6 rounded-xl flex items-center justify-center ${isSelected ? 'bg-white text-emerald-600' : 'bg-emerald-100 text-emerald-700'}`}>
                  {place.category === 'merchant' && <Store className="w-3.5 h-3.5" />}
                  {place.category === 'atm' && <Building2 className="w-3.5 h-3.5" />}
                  {place.category === 'ev' && <Zap className="w-3.5 h-3.5" />}
                  {place.category === 'fuel' && <Fuel className="w-3.5 h-3.5" />}
                </div>
                <span className="text-[10px] font-bold px-1 hidden sm:inline max-w-[100px] truncate">
                  {place.name.split(' ')[0]}
                </span>
              </button>
            );
          })}

          {/* Map Controls Floating Header */}
          <div className="relative z-30 p-3 sm:p-4 flex items-center justify-between bg-gradient-to-b from-slate-950/80 to-transparent">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-emerald-500 text-white shadow-md">
                <Compass className="w-4 h-4 animate-spin-slow" />
              </span>
              <div>
                <h3 className="font-bold text-xs sm:text-sm text-white flex items-center gap-1.5">
                  ARRAI Live Maps
                  <span className="text-[9px] bg-emerald-400/20 text-emerald-300 px-1.5 py-0.2 rounded border border-emerald-400/30">GPS Active</span>
                </h3>
                <p className="text-[10px] text-slate-300">Live Traffic & Nearby UPI Merchants</p>
              </div>
            </div>

            <button 
              onClick={closeModal}
              className="md:hidden p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Bottom Map Quick Stats */}
          <div className="mt-auto relative z-30 p-3 sm:p-4 bg-gradient-to-t from-slate-950 to-transparent flex items-center justify-between text-white text-xs">
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 font-mono text-[11px] text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Satellite 3D
              </span>
              <span className="text-slate-400">•</span>
              <span className="text-slate-300 text-[10px]">Speed: 0 km/h</span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">ARRAI GeoEngine v2.4</span>
          </div>
        </div>

        {/* Right Side: Search, Filters & Places List */}
        <div className="w-full md:w-96 flex flex-col bg-white border-t md:border-t-0 md:border-l border-slate-200">
          
          {/* Header & Search */}
          <div className="p-4 border-b border-slate-100 space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="font-bold text-sm text-slate-900">Nearby Services</h4>
              <button 
                onClick={closeModal}
                className="hidden md:block p-1.5 rounded-xl hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search shops, ATMs, petrol pumps..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-emerald-500 outline-none"
              />
            </div>

            {/* Filter Pills */}
            <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
              {[
                { id: 'all', label: 'All' },
                { id: 'merchant', label: 'Shops' },
                { id: 'atm', label: 'ATMs' },
                { id: 'ev', label: 'EV Points' },
                { id: 'fuel', label: 'Petrol' },
              ].map(f => (
                <button
                  key={f.id}
                  onClick={() => setSelectedFilter(f.id as any)}
                  className={`px-3 py-1 rounded-xl font-bold transition-all shrink-0 ${
                    selectedFilter === f.id
                      ? 'bg-slate-900 text-white'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {f.label}
                </button>
              ))}
            </div>
          </div>

          {/* Places List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
            {filteredPlaces.map(p => {
              const isSelected = selectedPlace?.id === p.id;
              return (
                <div
                  key={p.id}
                  onClick={() => setSelectedPlace(p)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer ${
                    isSelected 
                      ? 'border-emerald-500 bg-emerald-50/40 shadow-xs' 
                      : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-start gap-2.5">
                      <div className={`p-2 rounded-xl mt-0.5 shrink-0 ${
                        p.category === 'merchant' ? 'bg-indigo-100 text-indigo-700' :
                        p.category === 'atm' ? 'bg-blue-100 text-blue-700' :
                        p.category === 'ev' ? 'bg-emerald-100 text-emerald-700' :
                        'bg-amber-100 text-amber-700'
                      }`}>
                        {p.category === 'merchant' && <Store className="w-4 h-4" />}
                        {p.category === 'atm' && <Building2 className="w-4 h-4" />}
                        {p.category === 'ev' && <Zap className="w-4 h-4" />}
                        {p.category === 'fuel' && <Fuel className="w-4 h-4" />}
                      </div>

                      <div>
                        <h5 className="font-bold text-xs text-slate-900">{p.name}</h5>
                        <p className="text-[10px] text-slate-500 line-clamp-1">{p.address}</p>
                        <div className="flex items-center gap-2 text-[10px] font-semibold mt-1">
                          <span className="text-emerald-600">{p.distance} away</span>
                          <span>•</span>
                          <span className="text-slate-500">{p.eta}</span>
                          <span>•</span>
                          <span className="text-amber-600">{p.rating}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Actions when selected */}
                  {isSelected && (
                    <div className="mt-3 pt-2.5 border-t border-slate-200/60 flex items-center justify-between gap-2 animate-in fade-in">
                      {p.vpa ? (
                        <button
                          onClick={() => {
                            closeModal();
                            openModal('transfer', { targetType: 'contact', recipientVpa: p.vpa });
                          }}
                          className="flex-1 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                        >
                          <Send className="w-3.5 h-3.5" />
                          <span>Pay UPI</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => alert(`Directions to ${p.name} started`)}
                          className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5"
                        >
                          <Navigation className="w-3.5 h-3.5" />
                          <span>Navigate</span>
                        </button>
                      )}

                      <button
                        onClick={() => alert(`Calling ${p.name}`)}
                        className="p-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl transition-colors"
                        title="Call Location"
                      >
                        <Phone className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>

      </div>
    </div>
  );
};
