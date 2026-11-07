import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';
import { 
  Headphones,
  Mail,
  ShieldAlert,
  Trophy,
  Radio,
  Navigation,
  ShoppingBag, 
  X, 
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
  ExternalLink
} from 'lucide-react';

interface ArraiApp {
  id: string;
  name: string;
  tagline: string;
  category: 'All-In-One' | 'FinTech' | 'Social' | 'Entertainment' | 'Security' | 'Developer';
  icon: any;
  gradient: string;
  version: string;
  size: string;
  installed: boolean;
  actionSection?: string;
}

export const ArraiStoreModal: React.FC = () => {
  const { activeModal, closeModal, setActiveSection, setConsumerTab, openModal } = useAppStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
    const [apps, setApps] = useState<ArraiApp[]>([
    {
      id: 'app_super',
      name: 'ARRAI Super App (All-In-One Flagship)',
      tagline: 'Complete Digital Ecosystem: UPI Pay, Chat, Reels, Music, Mail, Maps & Games in one single app',
      category: 'All-In-One',
      icon: Sparkles,
      gradient: 'from-violet-600 via-fuchsia-600 to-indigo-700',
      version: 'v4.0.0 (Flagship)',
      size: '64 MB',
      
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
      
      installed: true,
      actionSection: 'connect'
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
      
      installed: true,
      actionSection: 'connect'
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
      
      installed: true
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
      
      installed: true
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
      
      installed: true,
      actionSection: 'pay'
    }
  ]);

  if (activeModal !== 'arraiStore') return null;

  const handleToggleInstall = (appId: string) => {
    soundEngine.playSuccessChime();
    setApps(prev => prev.map(a => {
      if (a.id === appId) {
        return { ...a, installed: !a.installed };
      }
      return a;
    }));
  };

  const handleOpenApp = (app: ArraiApp) => {
    closeModal();
    if (app.id === 'app_map') {
      openModal('arraiMap');
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/20 text-violet-300 border border-violet-400/30 flex items-center justify-center">
              <ShoppingBag className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">ARRAI App Store</h3>
                <span className="bg-violet-500/30 text-violet-200 text-[10px] font-bold px-2 py-0.5 rounded-full border border-violet-400/40">
                  ARRAI Group Official
                </span>
              </div>
              <p className="text-xs text-indigo-200">The Super-App Engine for FinTech, Social & Media</p>
            </div>
          </div>
          <button 
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search apps in ARRAI Group ecosystem (Pay, Chat, Gram, Tube)..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-900 focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <div className="flex gap-1.5 overflow-x-auto pb-1 text-xs">
            {['All', 'All-In-One', 'FinTech', 'Social', 'Entertainment', 'Security', 'Developer'].map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-bold transition-all shrink-0 ${
                  selectedCategory === cat 
                    ? 'bg-indigo-600 text-white shadow-xs' 
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Apps List */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-3 flex-1">
          {filteredApps.map(app => {
            const Icon = app.icon;
            return (
              <div 
                key={app.id} 
                className="p-3.5 sm:p-4 rounded-2xl border border-slate-200 hover:border-indigo-300 hover:shadow-sm bg-white transition-all flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${app.gradient} flex items-center justify-center text-white shrink-0 shadow-md`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{app.name}</h4>
                      <span className="text-[10px] font-semibold px-2 py-0.2 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                        {app.category}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{app.tagline}</p>
                    <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-1 font-mono">
                      <span>{app.version}</span>
                      <span>•</span>
                      <span>{app.size}</span>
                      <span>•</span>
                      <span className="text-emerald-600 font-semibold flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3" /> ARRAI Verified
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {app.installed ? (
                    <button
                      onClick={() => handleOpenApp(app)}
                      className="px-3.5 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl border border-indigo-200 transition-all flex items-center gap-1"
                    >
                      <span>Open</span>
                      <ExternalLink className="w-3 h-3" />
                    </button>
                  ) : (
                    <button
                      onClick={() => handleToggleInstall(app.id)}
                      className="px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center gap-1"
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
    </div>
  );
};
