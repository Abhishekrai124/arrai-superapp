import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { AppSection } from '../../types';
import { 
  Eye,
  EyeOff,
  Home, 
  Smartphone,
  MessageSquare, 
  History, 
  Gift, 
  Zap, 
  QrCode, 
  LayoutDashboard, 
  CreditCard, 
  Link2, 
  RotateCcw, 
  Code2, 
  ShieldCheck, 
  PlusCircle,
  Camera,
  Globe,
  Settings,
  ShoppingBag,
  Sparkles,
  Banknote,
  Coins,
  Shield,
  Trophy,
  Phone,
  Share2
} from 'lucide-react';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentTab, onSelectTab }) => {
  const [hideSidebarBalance, setHideSidebarBalance] = React.useState(false);
  const { 
    mode, 
    setMode, 
    activeSection, 
    setActiveSection, 
    consumerTab,
    setConsumerTab,
    merchantTab,
    setMerchantTab,
    walletBalance, 
    merchantBalance, 
    openModal 
  } = useAppStore();

  const mainApps = [
    { id: 'home' as AppSection, label: 'ARRAI Home', icon: Home, badge: 'Super Hub', color: 'text-violet-600' },
    { id: 'pay' as AppSection, label: 'ARRAI Pay', icon: Smartphone, badge: 'UPI 2.0', color: 'text-indigo-600' },
    { id: 'chat' as AppSection, label: 'ARRAI Chat', icon: MessageSquare, badge: 'Chat', color: 'text-emerald-600' },
    { id: 'gram' as AppSection, label: 'ARRAI Gram', icon: Camera, badge: 'Social', color: 'text-pink-600' },
    { id: 'connect' as AppSection, label: 'ARRAI Connect', icon: Globe, badge: 'Community', color: 'text-blue-600' },
    { id: 'merchant' as AppSection, label: 'ARRAI Merchant', icon: LayoutDashboard, badge: 'Gateway', color: 'text-teal-600' },
    { id: 'store' as AppSection, label: 'ARRAI Store', icon: ShoppingBag, badge: 'Apps', color: 'text-purple-600' },
    { id: 'chess' as AppSection, label: 'ARRAI Chess', icon: Trophy, badge: 'Arena', color: 'text-amber-600' },
    { id: 'caller' as AppSection, label: 'ARRAI Caller', icon: Phone, badge: 'VoIP', color: 'text-teal-600' },
    { id: 'settings' as AppSection, label: 'ARRAI Settings', icon: Settings, badge: null, color: 'text-slate-600' },
  ];

  // Sub-items for ARRAI Pay
  const paySubNav = [
    { id: 'home', label: 'Pay Dashboard', icon: Smartphone },
    { id: 'passbook', label: 'Passbook & Ledger', icon: History },
    { id: 'rewards', label: 'Rewards & Scratch', icon: Gift },
    { id: 'bbps', label: 'BBPS Bill Pay', icon: Zap },
    { id: 'myqr', label: 'My UPI QR', icon: QrCode },
  ];

  // Sub-items for ARRAI Merchant (Razorpay Suite)
  const merchantSubNav = [
    { id: 'dashboard', label: 'Merchant Overview', icon: LayoutDashboard },
    { id: 'checkout', label: 'ARRAI Checkout Modal', icon: CreditCard },
    { id: 'links', label: 'Payment Links', icon: Link2 },
    { id: 'transactions', label: 'Instant Refunds', icon: RotateCcw },
    { id: 'developer', label: 'API Keys & Webhooks', icon: Code2 },
    { id: 'settings', label: 'Gateway Settings', icon: Settings },
  ];

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-200 shrink-0 h-[calc(100vh-4rem)] sticky top-16 select-none justify-between p-4 overflow-y-auto">
      <div className="space-y-4">
        
        {/* ARRAI Balance Snapshot */}
        <div className={`p-4 rounded-3xl border transition-all ${
          activeSection === 'merchant'
            ? 'bg-gradient-to-br from-slate-900 to-teal-950 text-white border-slate-800 shadow-md shadow-teal-900/10'
            : 'bg-gradient-to-br from-indigo-950 via-slate-900 to-indigo-900 text-white border-indigo-950 shadow-md shadow-indigo-900/10'
        }`}>
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="font-semibold">{activeSection === 'merchant' ? 'ARRAI Merchant Pool' : 'ARRAI Wallet'}</span>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setHideSidebarBalance(!hideSidebarBalance)}
                className="text-slate-300 hover:text-white transition-colors"
                title={hideSidebarBalance ? "Show balance" : "Hide balance"}
              >
                {hideSidebarBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
              </button>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </div>
          </div>

          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-xl font-black tracking-tight font-mono">
              {hideSidebarBalance ? '₹ • • • • •' : `₹${(activeSection === 'merchant' ? merchantBalance : walletBalance).toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            </span>
          </div>

          <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
            {activeSection === 'merchant' ? (
              <button
                onClick={() => openModal('merchantCheckout')}
                className="text-xs font-semibold text-teal-300 hover:text-white flex items-center gap-1"
              >
                <CreditCard className="w-3.5 h-3.5" />
                Test Checkout
              </button>
            ) : (
              <button
                onClick={() => openModal('addMoney')}
                className="text-xs font-semibold text-indigo-300 hover:text-white flex items-center gap-1"
              >
                <PlusCircle className="w-3.5 h-3.5" />
                + Add Money
              </button>
            )}

            <span className="text-[10px] text-slate-400 font-mono">
              @arrai
            </span>
          </div>
        </div>

        {/* 1. Main ARRAI Super Apps Section */}
        <div className="space-y-1">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            ARRAI Super Apps
          </p>

          {mainApps.map((app) => {
            const Icon = app.icon;
            const isActive = activeSection === app.id;
            return (
              <button
                key={app.id}
                onClick={() => {
                  setActiveSection(app.id);
                  if (app.id === 'merchant') {
                    setMode('merchant');
                    setMerchantTab('dashboard');
                  } else {
                    setMode('consumer');
                    if (app.id === 'pay') setConsumerTab('home');
                  }
                }}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-slate-900 text-white shadow-sm'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : app.color}`} />
                  <span>{app.label}</span>
                </div>

                {app.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-md font-bold ${
                    isActive 
                      ? 'bg-white/20 text-white' 
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {app.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* 2. ARRAI Ecosystem Store & Vault Shortcuts */}
        <div className="space-y-1 pt-2 border-t border-slate-100">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
            Ecosystem Hubs
          </p>
          <button
            onClick={() => setActiveSection('store')}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-violet-700 bg-violet-50/60 hover:bg-violet-100 border border-violet-100 transition-all"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-3.5 h-3.5 text-violet-600" />
              <span>ARRAI Store</span>
            </div>
            <span className="text-[9px] bg-violet-200 text-violet-900 px-1 rounded">Apps</span>
          </button>

          <button
            onClick={() => openModal('digilocker')}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-bold text-emerald-800 bg-emerald-50/60 hover:bg-emerald-100 border border-emerald-100 transition-all"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>DigiLocker Vault</span>
            </div>
            <span className="text-[9px] bg-emerald-200 text-emerald-900 px-1 rounded">Govt</span>
          </button>
        </div>

        {/* 3. Contextual Sub Navigation */}
        {activeSection === 'pay' && (
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Pay Sub-features
            </p>
            {paySubNav.map((sub) => {
              const SubIcon = sub.icon;
              const isSubActive = consumerTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    if (sub.id === 'myqr') openModal('myQr');
                    else setConsumerTab(sub.id);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSubActive
                      ? 'bg-indigo-50 text-indigo-700 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <SubIcon className="w-3.5 h-3.5 text-indigo-500" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>
        )}

        {activeSection === 'merchant' && (
          <div className="space-y-1 pt-2 border-t border-slate-100">
            <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              Merchant Sub-features
            </p>
            {merchantSubNav.map((sub) => {
              const SubIcon = sub.icon;
              const isSubActive = merchantTab === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => {
                    if (sub.id === 'checkout') openModal('merchantCheckout');
                    else setMerchantTab(sub.id);
                  }}
                  className={`w-full flex items-center gap-2.5 px-3.5 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isSubActive
                      ? 'bg-teal-50 text-teal-700 font-bold'
                      : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                  }`}
                >
                  <SubIcon className="w-3.5 h-3.5 text-teal-500" />
                  <span>{sub.label}</span>
                </button>
              );
            })}
          </div>
        )}

      </div>

      {/* Sidebar Footer */}
      <div className="pt-4 border-t border-slate-100 text-[10px] text-slate-400 flex items-center justify-between">
        <span className="flex items-center gap-1 font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
          ARRAI Ecosystem
        </span>
        <span className="font-mono">v3.2.0</span>
      </div>
    </aside>
  );
};
