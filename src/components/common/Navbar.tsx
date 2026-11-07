import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AppSection } from '../../types';
import { 
  Volume2, 
  VolumeX, 
  Bell, 
  Copy, 
  Check, 
  ShieldCheck, 
  Smartphone, 
  Building2, 
  QrCode, 
  X,
  Radio,
  MessageSquare,
  Camera,
  Globe,
  Settings as SettingsIcon,
  Sparkles,
  ShoppingBag,
  Home,
  CheckCircle2,
  Trash2,
  Share2,
  Briefcase,
  Phone,
  Trophy
} from 'lucide-react';

interface NotificationItem {
  id: string;
  title: string;
  subtitle: string;
  timestamp: string;
  type: 'pay' | 'chat' | 'gram' | 'connect';
  isRead: boolean;
  action: () => void;
}

export const Navbar: React.FC = () => {
  const { 
    mode, 
    setMode, 
    activeSection, 
    setActiveSection, 
    isSandbox, 
    setIsSandbox, 
    soundboxEnabled, 
    setSoundboxEnabled, 
    triggerSoundboxTest, 
    soundboxLanguage, 
    setSoundboxLanguage, 
    openModal, 
    userProfile,
    setConsumerTab,
    setMerchantTab
  } = useAppStore();

  const [copiedVpa, setCopiedVpa] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showSoundboxMenu, setShowSoundboxMenu] = useState(false);

  // Dynamic notification list
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: 'notif_1',
      title: 'Priya Patel tipped you ₹50!',
      subtitle: 'On your latest ARRAI Gram Reel',
      timestamp: '3m ago',
      type: 'gram',
      isRead: false,
      action: () => {
        setActiveSection('gram');
        setShowNotifications(false);
      }
    },
    {
      id: 'notif_2',
      title: '₹45 Cashback Credited!',
      subtitle: 'ARRAI Pay Scratch & Win reward added to wallet',
      timestamp: '12m ago',
      type: 'pay',
      isRead: false,
      action: () => {
        setActiveSection('pay');
        setConsumerTab('rewards');
        setShowNotifications(false);
      }
    },
    {
      id: 'notif_3',
      title: 'Goa Villa Split Bill Request',
      subtitle: 'Rahul Sharma requested ₹1,500 share',
      timestamp: '45m ago',
      type: 'connect',
      isRead: false,
      action: () => {
        setActiveSection('connect');
        setShowNotifications(false);
      }
    },
    {
      id: 'notif_4',
      title: 'New ARRAI Chat Message',
      subtitle: 'Vikram: Let\'s catch up at the tech meet',
      timestamp: '2h ago',
      type: 'chat',
      isRead: true,
      action: () => {
        setActiveSection('chat');
        setShowNotifications(false);
      }
    }
  ]);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleClearNotifications = () => {
    setNotifications([]);
  };

  // Dynamic configuration for each active app
  const appBranding: Record<AppSection, {
    appName: string;
    subLabel: string;
    gradient: string;
    shadow: string;
    badgeText: string;
    icon: any;
  }> = {
    home: {
      appName: 'ARRAI',
      subLabel: 'Universal Super-App & Ecosystem Hub',
      gradient: 'from-violet-600 via-indigo-600 to-blue-700',
      shadow: 'shadow-violet-500/20',
      badgeText: 'Super App',
      icon: Sparkles
    },
    pay: {
      appName: 'ARRAI Pay',
      subLabel: 'UPI 2.0 · Wallet · BBPS · Bills & Passbook',
      gradient: 'from-indigo-600 via-indigo-700 to-violet-800',
      shadow: 'shadow-indigo-500/20',
      badgeText: 'UPI 2.0',
      icon: Smartphone
    },
    chat: {
      appName: 'ARRAI Chat',
      subLabel: 'Conversational UPI · Voice Notes · Secure Payments',
      gradient: 'from-emerald-600 via-teal-600 to-emerald-800',
      shadow: 'shadow-emerald-500/20',
      badgeText: 'Encrypted',
      icon: MessageSquare
    },
    gram: {
      appName: 'ARRAI Gram',
      subLabel: 'Reels · Stories · Creator Tips & Social Commerce',
      gradient: 'from-pink-600 via-rose-600 to-purple-700',
      shadow: 'shadow-pink-500/20',
      badgeText: 'Social',
      icon: Camera
    },
    connect: {
      appName: 'ARRAI Connect',
      subLabel: 'Communities · Groups · Split Bills & Events',
      gradient: 'from-blue-600 via-indigo-600 to-cyan-700',
      shadow: 'shadow-blue-500/20',
      badgeText: 'Community',
      icon: Globe
    },
    merchant: {
      appName: 'ARRAI Merchant',
      subLabel: 'Payment Gateway · Webhooks · Developer APIs',
      gradient: 'from-teal-700 via-emerald-700 to-slate-900',
      shadow: 'shadow-teal-500/20',
      badgeText: 'Gateway',
      icon: Building2
    },
    settings: {
      appName: 'ARRAI Settings',
      subLabel: 'Profile · Security · MPIN · Preferences',
      gradient: 'from-slate-800 via-slate-900 to-indigo-950',
      shadow: 'shadow-slate-500/20',
      badgeText: 'Preferences',
      icon: SettingsIcon
    },
    store: {
      appName: 'ARRAI Store',
      subLabel: 'Apps · Plugins · Digital Services & Ecosystem',
      gradient: 'from-purple-700 via-violet-700 to-indigo-800',
      shadow: 'shadow-purple-500/20',
      badgeText: 'App Store',
      icon: ShoppingBag
    },
    pulse: {
      appName: 'ARRAI Pulse',
      subLabel: 'Live Feeds · Trending Posts · Global Voices',
      gradient: 'from-slate-900 via-zinc-800 to-slate-950',
      shadow: 'shadow-slate-500/20',
      badgeText: 'Pulse',
      icon: Share2
    },
    pro: {
      appName: 'ARRAI Pro Network',
      subLabel: 'Career · Jobs · Networking · Endorsements',
      gradient: 'from-blue-700 via-indigo-700 to-cyan-800',
      shadow: 'shadow-blue-500/20',
      badgeText: 'Careers',
      icon: Briefcase
    },
    caller: {
      appName: 'ARRAI Caller & True Shield',
      subLabel: 'VoIP Phone · ARRAI Caller ID · AI Spam Shield',
      gradient: 'from-cyan-600 via-teal-600 to-blue-700',
      shadow: 'shadow-cyan-500/20',
      badgeText: 'VoIP Shield',
      icon: Phone
    },
    chess: {
      appName: 'ARRAI Chess Arena',
      subLabel: 'Live Chess · Stockfish AI · Puzzles & Rapid Clocks',
      gradient: 'from-emerald-700 via-teal-700 to-slate-900',
      shadow: 'shadow-emerald-500/20',
      badgeText: 'Grandmaster',
      icon: Trophy
    }
  };

  const currentBrand = appBranding[activeSection] || appBranding.home;

  // Dynamic Browser Tab Title
  useEffect(() => {
    document.title = `${currentBrand.appName} | ${currentBrand.subLabel}`;
  }, [currentBrand]);

  const handleCopyVpa = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(userProfile.vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  // Suite Navigation items requested: Home -> Pay -> Chat -> Gram -> Connect -> Settings
  const suiteTabs: Array<{ id: AppSection; label: string; icon: any; color: string }> = [
    { id: 'home', label: 'Home', icon: Home, color: 'text-violet-600' },
    { id: 'pay', label: 'Pay', icon: Smartphone, color: 'text-indigo-600' },
    { id: 'chat', label: 'Chat', icon: MessageSquare, color: 'text-emerald-600' },
    { id: 'gram', label: 'Social', icon: Camera, color: 'text-pink-600' },
    { id: 'connect', label: 'Connect', icon: Globe, color: 'text-blue-600' },
    { id: 'store', label: 'Store', icon: ShoppingBag, color: 'text-purple-600' },
    { id: 'settings', label: 'Settings', icon: SettingsIcon, color: 'text-slate-700' },
  ];

  const handleSelectSection = (sec: AppSection) => {
    setActiveSection(sec);
    if (sec === 'merchant') {
      setMode('merchant');
      setMerchantTab('dashboard');
    } else {
      setMode('consumer');
      if (sec === 'pay') setConsumerTab('home');
    }
  };

  const BrandIcon = currentBrand.icon;

  return (
    <>
      <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-white/95 border-b border-slate-200 shadow-xs transition-colors duration-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* Dynamic Brand Logo & Name */}
          <div 
            onClick={() => handleSelectSection('home')}
            className="flex items-center gap-2.5 sm:gap-3 cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-2xl bg-gradient-to-tr ${currentBrand.gradient} flex items-center justify-center font-black text-white shadow-md ${currentBrand.shadow} transition-transform group-hover:scale-105 active:scale-95`}>
              <BrandIcon className="w-5 h-5 text-white animate-in zoom-in duration-200" />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-black text-lg sm:text-xl tracking-tight text-slate-900 transition-all">
                  {currentBrand.appName}
                </span>

                <span className="px-1.5 py-0.2 rounded-md bg-slate-100 border border-slate-200 text-slate-700 text-[10px] font-bold uppercase tracking-wider">
                  {currentBrand.badgeText}
                </span>
              </div>

              <span className="text-[10px] font-medium text-slate-500 hidden sm:block truncate max-w-[240px]">
                {currentBrand.subLabel}
              </span>
            </div>
          </div>

          {/* Center Suite Switcher (Desktop Pills: Home -> Pay -> Chat -> Gram -> Connect -> Settings) */}
          <div className="hidden lg:flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200">
            {suiteTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeSection === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => handleSelectSection(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    isActive
                      ? 'bg-white text-slate-900 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? tab.color : 'text-slate-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2.5">
            
            {/* ARRAI Store Dedicated Page Button */}
            <button
              onClick={() => handleSelectSection('store')}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSection === 'store'
                  ? 'border-purple-500 bg-purple-50 text-purple-700 shadow-xs'
                  : 'border-violet-200 bg-violet-50/70 text-violet-700 hover:bg-violet-100'
              }`}
              title="ARRAI Store Page"
            >
              <ShoppingBag className="w-4 h-4 text-violet-600" />
              <span className="hidden sm:inline">Store</span>
            </button>

            {/* Merchant Gateway Mode Pill */}
            <button
              onClick={() => handleSelectSection(activeSection === 'merchant' ? 'home' : 'merchant')}
              className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSection === 'merchant'
                  ? 'bg-teal-600 text-white border-teal-600 shadow-xs'
                  : 'bg-slate-100 border-slate-200 text-slate-700 hover:bg-slate-200'
              }`}
              title="ARRAI Merchant Mode"
            >
              <Building2 className="w-4 h-4" />
              <span className="hidden md:inline">Merchant</span>
            </button>

            {/* Soundbox Voice Speaker Button */}
            <div className="relative">
              <button
                onClick={() => setShowSoundboxMenu(!showSoundboxMenu)}
                className={`p-2 rounded-xl border transition-all ${
                  soundboxEnabled 
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100' 
                    : 'bg-slate-100 border-slate-200 text-slate-400 hover:bg-slate-200'
                }`}
                title="ARRAI Soundbox Speaker"
              >
                {soundboxEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              </button>

              {/* Soundbox Dropdown */}
              {showSoundboxMenu && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setShowSoundboxMenu(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-72 bg-white rounded-2xl shadow-xl border border-slate-200 p-3 z-50 animate-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-indigo-100 text-indigo-700 rounded-lg">
                          <Radio className="w-4 h-4 animate-pulse" />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800">ARRAI Voice Soundbox</h4>
                          <p className="text-[10px] text-slate-500">Natural Human Speech & Dual-Tone</p>
                        </div>
                      </div>
                      <button 
                        onClick={() => setShowSoundboxMenu(false)}
                        className="text-slate-400 hover:text-slate-600 p-1"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2 text-xs">
                      <label className="flex items-center justify-between cursor-pointer p-1.5 rounded-lg hover:bg-slate-50">
                        <span className="text-slate-700 font-medium">Voice Alerts Enabled</span>
                        <input 
                          type="checkbox" 
                          checked={soundboxEnabled} 
                          onChange={(e) => setSoundboxEnabled(e.target.checked)}
                          className="rounded text-indigo-600 focus:ring-indigo-500"
                        />
                      </label>

                      <div className="pt-1">
                        <span className="text-[11px] font-semibold text-slate-500 block mb-1">Language:</span>
                        <div className="grid grid-cols-2 gap-1.5">
                          <button
                            onClick={() => setSoundboxLanguage('hi')}
                            className={`px-2 py-1.5 rounded-lg text-xs font-medium border ${
                              soundboxLanguage === 'hi'
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-bold'
                                : 'border-slate-200 text-slate-600'
                            }`}
                          >
                            🇮🇳 Hindi
                          </button>
                          <button
                            onClick={() => setSoundboxLanguage('en')}
                            className={`px-2 py-1.5 rounded-lg text-xs font-medium border ${
                              soundboxLanguage === 'en'
                                ? 'bg-indigo-50 border-indigo-400 text-indigo-700 font-bold'
                                : 'border-slate-200 text-slate-600'
                            }`}
                          >
                            English
                          </button>
                        </div>
                      </div>

                      <button
                        onClick={() => triggerSoundboxTest(500)}
                        className="w-full mt-2 py-2 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center justify-center gap-1.5"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>Test Natural Voice ("₹500")</span>
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>

            {/* Notification Bell with Working Drawer & Outside-Click Backdrop */}
            <div className="relative">
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors relative"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 rounded-full bg-rose-500 ring-2 ring-white animate-pulse" />
                )}
              </button>

              {showNotifications && (
                <>
                  <div 
                    className="fixed inset-0 z-40 bg-transparent" 
                    onClick={() => setShowNotifications(false)} 
                  />
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-50 animate-in zoom-in-95">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100">
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-bold text-slate-900">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="px-1.5 py-0.2 bg-rose-100 text-rose-700 text-[10px] font-bold rounded-full">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <button 
                          onClick={handleMarkAllRead} 
                          className="text-[10px] font-bold text-indigo-600 hover:text-indigo-800"
                        >
                          Mark Read
                        </button>
                        <button 
                          onClick={handleClearNotifications} 
                          className="text-[10px] text-slate-400 hover:text-rose-600"
                        >
                          Clear
                        </button>
                      </div>
                    </div>

                    {notifications.length === 0 ? (
                      <div className="py-6 text-center text-xs text-slate-400">
                        No new notifications
                      </div>
                    ) : (
                      <div className="space-y-2 max-h-72 overflow-y-auto">
                        {notifications.map(notif => (
                          <div 
                            key={notif.id}
                            onClick={() => {
                              setNotifications(prev => prev.map(n => n.id === notif.id ? { ...n, isRead: true } : n));
                              setShowNotifications(false);
                              notif.action();
                            }}
                            className={`p-2.5 rounded-2xl border text-xs cursor-pointer transition-all hover:scale-[1.01] ${
                              notif.isRead 
                                ? 'bg-slate-50 border-slate-100 text-slate-600' 
                                : 'bg-indigo-50/70 border-indigo-200 text-slate-900 font-medium shadow-2xs'
                            }`}
                          >
                            <div className="flex items-center justify-between">
                              <span className="font-bold text-xs truncate">{notif.title}</span>
                              <span className="text-[10px] text-slate-400 shrink-0">{notif.timestamp}</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">{notif.subtitle}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>

            {/* User Profile & Settings Switcher */}
            <div 
              onClick={() => handleSelectSection('settings')}
              className={`flex items-center gap-2 p-1.5 sm:px-3 sm:py-1.5 rounded-xl border transition-all cursor-pointer ${
                activeSection === 'settings'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-xs'
                  : 'border-slate-200 hover:bg-slate-50 text-slate-700'
              }`}
              title="Profile & Settings"
            >
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-7 h-7 rounded-lg object-cover ring-1 ring-slate-200"
              />
              
              <div className="hidden lg:flex flex-col text-left">
                <span className="text-xs font-bold text-slate-900 flex items-center gap-1">
                  {userProfile.name}
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                </span>
                <span className="text-[10px] font-mono text-slate-500">{userProfile.vpa}</span>
              </div>

              <SettingsIcon className="w-3.5 h-3.5 text-slate-400" />
            </div>

          </div>
        </div>
      </header>
    </>
  );
};
