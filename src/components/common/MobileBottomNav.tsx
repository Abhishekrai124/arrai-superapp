import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AppSection } from '../../types';
import {
  Home,
  Smartphone,
  MessageSquare,
  QrCode,
  MoreHorizontal,
  Camera,
  Globe,
  Gift,
  LayoutDashboard,
  Settings,
  ShoppingBag,
  ShieldCheck,
  Zap,
  X,
  Trophy
} from 'lucide-react';

export const MobileBottomNav: React.FC = () => {
  const { activeSection, setActiveSection, setMode, setConsumerTab, setMerchantTab, openModal } = useAppStore();
  const [showExtras, setShowExtras] = useState(false);

  const navigate = (sec: AppSection, consumerT?: string, merchantT?: string) => {
    setActiveSection(sec);
    if (sec === 'merchant') {
      setMode('merchant');
      if (merchantT) setMerchantTab(merchantT);
    } else {
      setMode('consumer');
      if (consumerT) setConsumerTab(consumerT);
    }
    setShowExtras(false);
  };

  /* Extra drawer items */
  const extras = [
    { label: 'ARRAI Chess',   icon: Trophy,        action: () => navigate('chess') },
    { label: 'ARRAI Pay',     icon: Smartphone,    action: () => navigate('pay', 'home') },
    { label: 'ARRAI Store',   icon: ShoppingBag,   action: () => navigate('store') },
    { label: 'ARRAI Connect', icon: Globe,         action: () => navigate('connect') },
    { label: 'Merchant',      icon: LayoutDashboard, action: () => navigate('merchant', undefined, 'dashboard') },
    { label: 'Rewards',       icon: Gift,          action: () => { navigate('pay', 'rewards'); } },
    { label: 'Pay Bills',     icon: Zap,           action: () => navigate('pay', 'bbps') },
    { label: 'Vault Docs',    icon: ShieldCheck,   action: () => { openModal('digilocker'); setShowExtras(false); } },
    { label: 'Settings',      icon: Settings,      action: () => navigate('settings') },
  ];

  /* Primary 5 tabs: Home -> Chat -> Center Scan FAB -> Social (Gram) -> More (Store/Extras) */
  const tabs: Array<{
    id: string;
    label: string;
    icon: any;
    color: string;
    activeBg: string;
    action: () => void;
  }> = [
    {
      id: 'home', label: 'Home', icon: Home,
      color: 'text-violet-600', activeBg: 'bg-violet-50',
      action: () => navigate('home')
    },
    {
      id: 'chat', label: 'Chat', icon: MessageSquare,
      color: 'text-emerald-600', activeBg: 'bg-emerald-50',
      action: () => navigate('chat')
    },
    {
      id: 'scan', label: 'Scan', icon: QrCode,
      color: 'text-white', activeBg: '',
      action: () => openModal('qrScanner')   // center FAB
    },
    {
      id: 'gram', label: 'Social', icon: Camera,
      color: 'text-pink-600', activeBg: 'bg-pink-50',
      action: () => navigate('gram')
    },
    {
      id: 'more', label: 'Apps', icon: MoreHorizontal,
      color: 'text-slate-600', activeBg: 'bg-slate-100',
      action: () => setShowExtras(prev => !prev)
    },
  ];

  return (
    <>
      {/* ── Extras Drawer (Slide-up sheet) ── */}
      {showExtras && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowExtras(false)}
          />

          {/* Sheet */}
          <div className="fixed bottom-[70px] left-0 right-0 z-50 mx-3 mb-1 bg-white rounded-3xl shadow-2xl border border-slate-100 p-4 animate-in slide-in-from-bottom-4 duration-200">
            <div className="flex items-center justify-between mb-3">
              <div>
                <h3 className="text-sm font-black text-slate-900">ARRAI Apps</h3>
                <p className="text-[10px] text-slate-400">सारे ऐप्स</p>
              </div>
              <button
                onClick={() => setShowExtras(false)}
                className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-4 gap-3">
              {extras.map(e => {
                const Icon = e.icon;
                return (
                  <button
                    key={e.label}
                    onClick={e.action}
                    className="flex flex-col items-center gap-1.5 p-2.5 rounded-2xl hover:bg-slate-50 active:scale-90 transition-all group"
                  >
                    <div className="w-12 h-12 rounded-2xl bg-slate-100 group-hover:bg-indigo-100 flex items-center justify-center transition-colors">
                      <Icon className="w-5 h-5 text-slate-600 group-hover:text-indigo-600" />
                    </div>
                    <span className="text-[10px] font-semibold text-slate-600 group-hover:text-slate-900 text-center leading-tight">{e.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </>
      )}

      {/* ── Bottom Nav Bar ── */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200/80 shadow-lg">
        <div className="flex items-end justify-around px-2 py-2 max-w-lg mx-auto">
          {tabs.map(tab => {
            const Icon = tab.icon;
            const isActive = (activeSection as string) === tab.id && tab.id !== 'scan' && tab.id !== 'more';
            const isMore = tab.id === 'more';
            const isScan = tab.id === 'scan';

            /* ─── Center FAB (Scan) ─── */
            if (isScan) {
              return (
                <div key="scan" className="flex flex-col items-center -mt-5">
                  <button
                    onClick={tab.action}
                    className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-600 to-violet-700 text-white flex items-center justify-center shadow-xl shadow-indigo-400/40 ring-4 ring-white active:scale-90 transition-transform"
                    title="Scan Any QR"
                  >
                    <QrCode className="w-6 h-6" />
                  </button>
                  <span className="text-[9px] font-bold text-indigo-600 mt-1">Scan</span>
                </div>
              );
            }

            return (
              <button
                key={tab.id}
                onClick={tab.action}
                className={`flex-1 flex flex-col items-center justify-center py-1 gap-0.5 rounded-xl transition-all active:scale-90 ${isActive ? tab.activeBg : ''}`}
              >
                <div className="relative">
                  <Icon className={`w-5 h-5 transition-colors ${isActive ? tab.color : isMore && showExtras ? 'text-slate-800' : 'text-slate-400'}`} />
                  {/* Chat unread dot */}
                  {tab.id === 'chat' && (
                    <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-emerald-500 ring-1 ring-white" />
                  )}
                </div>
                <span className={`text-[9px] font-bold transition-colors ${isActive ? tab.color : isMore && showExtras ? 'text-slate-800' : 'text-slate-400'}`}>
                  {tab.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
};
