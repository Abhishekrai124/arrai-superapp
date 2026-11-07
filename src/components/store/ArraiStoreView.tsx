import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';
import { 
  Headphones,
  Mail,
  ShieldAlert,
  Trophy,
  Radio,
  MapPin,
  Navigation,
  ShoppingBag, 
  Download, 
  Check, 
  Smartphone, 
  MessageSquare, 
  Camera, 
  Globe, 
  Tv, 
  ShieldCheck, 
  Building2, 
  Coins, 
  Sparkles, 
  Search, 
  ExternalLink,
  Star,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ArraiAppItem {
  id: string;
  name: string;
  tagline: string;
  category: 'All-In-One' | 'FinTech' | 'Social' | 'Entertainment' | 'Security' | 'Developer';
  icon: any;
  gradient: string;
  version: string;
  size: string;
  rating: string;
  installed: boolean;
  actionSection?: string;
}

export const ArraiStoreView: React.FC = () => {
  const { setActiveSection, setConsumerTab, openModal } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [apps, setApps] = useState<ArraiAppItem[]>([
    {
      id: 'app_super',
      name: 'ARRAI Super App (All-In-One Flagship)',
      tagline: 'Complete Digital Ecosystem: UPI Pay, Chat, Reels, Music, Mail, Maps & Games in one single app',
      category: 'All-In-One',
      icon: Sparkles,
      gradient: 'from-violet-600 via-fuchsia-600 to-indigo-700',
      version: 'v4.0.0 (Flagship)',
      size: '64 MB',
      rating: '5.0 ★',
      installed: true,
      actionSection: 'home'
    },
    {
      id: 'app_pay',
      name: 'ARRAI Pay',
      tagline: 'Instant UPI 2.0, Multi-Bank Transfers, Passbook & BBPS Bill Payments',
      category: 'FinTech',
      icon: Smartphone,
      gradient: 'from-indigo-600 to-violet-700',
      version: 'v3.2.0',
      size: '24 MB',
      rating: '4.9 ★',
      installed: true,
      actionSection: 'pay'
    },
    {
      id: 'app_chat',
      name: 'ARRAI Chat & Channels',
      tagline: 'Encrypted Messaging, Voice Notes, Channels & In-Chat UPI',
      category: 'Social',
      icon: MessageSquare,
      gradient: 'from-emerald-600 to-teal-700',
      version: 'v2.8.4',
      size: '32 MB',
      rating: '4.9 ★',
      installed: true,
      actionSection: 'chat'
    },
    {
      id: 'app_gram',
      name: 'ARRAI Gram',
      tagline: 'Full-screen Reels, Stories, Photo Sharing & Creator Tips',
      category: 'Social',
      icon: Camera,
      gradient: 'from-pink-600 to-rose-700',
      version: 'v4.1.0',
      size: '48 MB',
      rating: '4.9 ★',
      installed: true,
      actionSection: 'gram'
    },
    {
      id: 'app_pulse',
      name: 'ARRAI Pulse',
      tagline: 'Live Microblogging, Trending News, Polls, Spaces & Public Discussions',
      category: 'Social',
      icon: Radio,
      gradient: 'from-slate-900 via-indigo-950 to-slate-800',
      version: 'v1.5.0',
      size: '22 MB',
      rating: '4.8 ★',
      installed: true,
      actionSection: 'pulse'
    },
    {
      id: 'app_connect',
      name: 'ARRAI Connect & Communities',
      tagline: 'Neighborhood Communities, Groups, Bill Split & Marketplace',
      category: 'Social',
      icon: Globe,
      gradient: 'from-blue-600 to-cyan-700',
      version: 'v3.0.1',
      size: '38 MB',
      rating: '4.7 ★',
      installed: true,
      actionSection: 'connect'
    },
    {
      id: 'app_pro',
      name: 'ARRAI Pro Network',
      tagline: 'Professional Careers, Verified Resumes, Job Search & Corporate Networking',
      category: 'Developer',
      icon: Building2,
      gradient: 'from-sky-700 to-blue-900',
      version: 'v2.1.0',
      size: '28 MB',
      rating: '4.8 ★',
      installed: true,
      actionSection: 'pro'
    },
    {
      id: 'app_tube',
      name: 'ARRAI Tube',
      tagline: '4K Video Streaming, Creator Shorts, Playlists & Channel Subscriptions',
      category: 'Entertainment',
      icon: Tv,
      gradient: 'from-red-600 to-rose-800',
      version: 'v2.0.0',
      size: '42 MB',
      rating: '4.8 ★',
      installed: true
    },
    {
      id: 'app_music',
      name: 'ARRAI Music',
      tagline: 'Hi-Fi Audio Streaming, Millions of Tracks, Curated Playlists & Offline Mode',
      category: 'Entertainment',
      icon: Headphones,
      gradient: 'from-green-600 via-emerald-700 to-teal-900',
      version: 'v3.0.0',
      size: '26 MB',
      rating: '4.9 ★',
      installed: true,
      actionSection: 'chess'
    },
    {
      id: 'app_mail',
      name: 'ARRAI Mail',
      tagline: 'Private Encrypted Inbox, Custom @arrai.in Address, Zero Tracking & AI Smart Drafts',
      category: 'Security',
      icon: Mail,
      gradient: 'from-red-500 via-amber-600 to-orange-700',
      version: 'v1.8.0',
      size: '19 MB',
      rating: '4.8 ★',
      installed: true
    },
    {
      id: 'app_caller',
      name: 'ARRAI Caller & True Shield',
      tagline: 'AI Caller ID, Spam Call Blocker, Fraud Number Detection & Smart Dialer',
      category: 'Security',
      icon: ShieldAlert,
      gradient: 'from-blue-600 to-indigo-800',
      version: 'v2.2.0',
      size: '16 MB',
      rating: '4.9 ★',
      installed: true,
      actionSection: 'caller'
    },
    {
      id: 'app_map',
      name: 'ARRAI Maps & GPS',
      tagline: 'Live GPS Navigation, Nearby UPI Merchants, EV Stations & Cash ATMs',
      category: 'Security',
      icon: Navigation,
      gradient: 'from-emerald-500 via-teal-600 to-cyan-700',
      version: 'v2.4.0',
      size: '34 MB',
      rating: '4.9 ★',
      installed: true,
      actionSection: 'arraiMap'
    },
    {
      id: 'app_chess',
      name: 'ARRAI Chess Arena',
      tagline: 'Live 1v1 Online Chess Matches, Grandmaster Puzzles, Tournaments & AI Bots',
      category: 'Entertainment',
      icon: Trophy,
      gradient: 'from-amber-600 via-orange-600 to-yellow-700',
      version: 'v1.4.0',
      size: '18 MB',
      rating: '4.9 ★',
      installed: true,
      actionSection: 'chess'
    },
    {
      id: 'app_vault',
      name: 'ARRAI Vault / DigiLocker',
      tagline: 'Govt Verified Identity, Aadhaar, PAN, DL, RC & Safe Document Storage',
      category: 'Security',
      icon: ShieldCheck,
      gradient: 'from-emerald-700 to-teal-900',
      version: 'v2.1.0',
      size: '18 MB',
      rating: '5.0 ★',
      installed: true,
      actionSection: 'digilocker'
    },
    {
      id: 'app_merchant',
      name: 'ARRAI Merchant Suite',
      tagline: 'Merchant Payment Gateway, Instant QR, Links & Developer Webhooks',
      category: 'Developer',
      icon: Building2,
      gradient: 'from-teal-700 to-slate-900',
      version: 'v5.4.0',
      size: '28 MB',
      rating: '4.9 ★',
      installed: true,
      actionSection: 'merchant'
    },
    {
      id: 'app_wealth',
      name: 'ARRAI Wealth & Gold',
      tagline: '24K 99.9% Digital Gold, Daily Mutual Fund SIPs & Equity Investing',
      category: 'FinTech',
      icon: Coins,
      gradient: 'from-amber-500 to-yellow-600',
      version: 'v2.0.2',
      size: '20 MB',
      rating: '4.8 ★',
      installed: true,
      actionSection: 'pay'
    }
  ]);

  const handleToggleInstall = (appId: string) => {
    soundEngine.playSuccessChime();
    setApps(prev => prev.map(a => a.id === appId ? { ...a, installed: !a.installed } : a));
  };

  const handleOpenApp = (app: ArraiAppItem) => {
    if (app.id === 'app_map') {
      openModal('arraiMap');
    } else if (app.id === 'app_vault') {
      openModal('digilocker');
    } else if (app.id === 'app_chess') {
      setActiveSection('chess');
    } else if (app.id === 'app_music') {
      alert('ARRAI Music: Now Playing Top Hits 2026 • 320kbps Lossless');
    } else if (app.id === 'app_mail') {
      alert('ARRAI Mail: Inboxing connected to ' + (app.name));
    } else if (app.id === 'app_caller') {
      setActiveSection('caller');
    } else if (app.actionSection) {
      setActiveSection(app.actionSection as any);
    }
  };

  const filteredApps = apps.filter(app => {
    const matchesCategory = selectedCategory === 'All' || app.category === selectedCategory;
    const matchesSearch = app.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          app.tagline.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-24">
      {/* Hero Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-purple-950 via-indigo-950 to-slate-950 text-white p-6 sm:p-8 shadow-2xl border border-purple-900/60">
        <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-purple-600/20 blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-2xl bg-purple-500/20 text-purple-300 border border-purple-400/30 flex items-center justify-center">
                <ShoppingBag className="w-5 h-5" />
              </span>
              <span className="text-xs font-bold uppercase tracking-wider text-purple-300">ARRAI Group Official</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight">ARRAI App Store</h1>
            <p className="text-sm text-purple-200/80 max-w-xl">
              The official marketplace for the ARRAI Super-App Ecosystem. Install, launch, and manage FinTech, Social, Media and Commerce modules in one click.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-2xl font-black text-white block">8</span>
              <span className="text-[10px] text-purple-200 font-semibold uppercase">Official Apps</span>
            </div>
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 text-center">
              <span className="text-2xl font-black text-emerald-400 block">100%</span>
              <span className="text-[10px] text-purple-200 font-semibold uppercase">Verified</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search & Categories */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ARRAI apps (Pay, Chat, Gram, Connect, Wealth)..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 focus:bg-white focus:ring-2 focus:ring-purple-500 outline-none transition-all"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto pb-1 text-xs">
          {['All', 'All-In-One', 'FinTech', 'Social', 'Entertainment', 'Security', 'Developer'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-xl font-bold transition-all shrink-0 ${
                selectedCategory === cat 
                  ? 'bg-purple-600 text-white shadow-xs' 
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Apps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredApps.map(app => {
          const Icon = app.icon;
          return (
            <div 
              key={app.id} 
              className="p-4 sm:p-5 rounded-3xl border border-slate-200 hover:border-purple-300 hover:shadow-md bg-white transition-all flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-4 min-w-0">
                <div className={`w-14 h-14 rounded-2xl bg-gradient-to-tr ${app.gradient} flex items-center justify-center text-white shrink-0 shadow-lg`}>
                  <Icon className="w-7 h-7" />
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-black text-sm text-slate-900 truncate">{app.name}</h3>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-100">
                      {app.category}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 truncate mt-1">{app.tagline}</p>
                  <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1.5 font-mono">
                    <span className="font-bold text-amber-500">{app.rating}</span>
                    <span>•</span>
                    <span>{app.version}</span>
                    <span>•</span>
                    <span>{app.size}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {app.installed ? (
                  <button
                    onClick={() => handleOpenApp(app)}
                    className="px-4 py-2 bg-purple-50 hover:bg-purple-100 text-purple-700 font-bold text-xs rounded-xl border border-purple-200 transition-all flex items-center gap-1.5 active:scale-95"
                  >
                    <span>Launch</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggleInstall(app.id)}
                    className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1.5 active:scale-95"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Install</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
