import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import {
  Navigation,
  MapPin,
  Smartphone,
  MessageSquare,
  Camera,
  Globe,
  ShoppingBag,
  ShieldCheck,
  Building2,
  Coins,
  QrCode,
  ArrowUpRight,
  Wallet,
  CreditCard,
  Zap,
  Search,
  Banknote,
  Gauge,
  Shield,
  ChevronRight,
  Volume2,
  Sparkles,
  TrendingUp,
  Eye,
  EyeOff,
  Gift,
  History,
  LayoutDashboard,
  Settings,
  Radio,
  Star,
  CheckCircle2,
  Flame,
  FileText,
  Landmark,
  Layers,
  Send,
  Plus,
  Trophy,
  Phone
} from 'lucide-react';

import { Contact } from '../../types';

interface SuperAppHomeProps {
  onOpenChat?: (contact: Contact) => void;
}

export const SuperAppHome: React.FC<SuperAppHomeProps> = ({ onOpenChat }) => {
  const {
    userProfile,
    walletBalance,
    linkedBanks,
    transactions,
    contacts,
    chatMessages,
    setActiveSection,
    setMode,
    setConsumerTab,
    setMerchantTab,
    openModal,
    soundboxEnabled,
    triggerSoundboxTest
  } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [hideBalance, setHideBalance] = useState(true);

  const primaryBank = linkedBanks[0];
  const totalLiquidity = walletBalance + (primaryBank?.balance || 0);
  const recentTxns = transactions.slice(0, 4);

  // Recent 4 chat contacts
  const recentChatContacts = contacts.slice(0, 4);

  /* ─── App Ecosystem ─────────────────────────────────────────────────── */
  const apps = [
    {
      id: 'pay', label: 'ARRAI Pay', shortLabel: 'Pay',
      icon: Smartphone,
      gradient: 'from-indigo-600 to-violet-700',
      badgeColor: 'bg-indigo-500',
      dot: null,
      action: () => { setMode('consumer'); setConsumerTab('home'); setActiveSection('pay'); }
    },
    {
      id: 'chat', label: 'ARRAI Chat', shortLabel: 'Chat',
      icon: MessageSquare,
      gradient: 'from-emerald-500 to-teal-700',
      badgeColor: 'bg-emerald-500',
      dot: '3',
      action: () => { setMode('consumer'); setActiveSection('chat'); }
    },
    {
      id: 'gram', label: 'ARRAI Social', shortLabel: 'Social',
      icon: Camera,
      gradient: 'from-pink-500 via-rose-500 to-fuchsia-600',
      badgeColor: 'bg-pink-500',
      dot: null,
      action: () => { setMode('consumer'); setActiveSection('gram'); }
    },
    {
      id: 'connect', label: 'ARRAI Connect', shortLabel: 'Connect',
      icon: Globe,
      gradient: 'from-blue-600 to-cyan-600',
      badgeColor: 'bg-blue-500',
      dot: '7',
      action: () => { setMode('consumer'); setActiveSection('connect'); }
    },
    {
      id: 'merchant', label: 'ARRAI Merchant', shortLabel: 'Merchant',
      icon: LayoutDashboard,
      gradient: 'from-teal-600 to-slate-700',
      badgeColor: 'bg-teal-600',
      dot: null,
      action: () => { setMode('merchant'); setMerchantTab('dashboard'); setActiveSection('merchant'); }
    },
    {
      id: 'chess', label: 'ARRAI Chess', shortLabel: 'Chess',
      icon: Trophy,
      gradient: 'from-amber-600 to-yellow-600',
      badgeColor: 'bg-amber-500',
      dot: 'LIVE',
      action: () => { setMode('consumer'); setActiveSection('chess'); }
    },
    {
      id: 'caller', label: 'ARRAI Caller', shortLabel: 'Phone',
      icon: Phone,
      gradient: 'from-cyan-600 to-teal-700',
      badgeColor: 'bg-cyan-500',
      dot: null,
      action: () => { setMode('consumer'); setActiveSection('caller'); }
    },
    {
      id: 'store', label: 'ARRAI Store', shortLabel: 'Store',
      icon: ShoppingBag,
      gradient: 'from-violet-600 to-purple-700',
      badgeColor: 'bg-violet-500',
      dot: 'ALL',
      action: () => { setMode('consumer'); setActiveSection('store'); }
    },
    {
      id: 'vault', label: 'ARRAI Vault', shortLabel: 'Vault',
      icon: ShieldCheck,
      gradient: 'from-slate-700 to-slate-900',
      badgeColor: 'bg-slate-600',
      dot: null,
      action: () => openModal('digilocker')
    },
    {
      id: 'rewards', label: 'Rewards', shortLabel: 'Rewards',
      icon: Gift,
      gradient: 'from-amber-500 to-orange-600',
      badgeColor: 'bg-amber-500',
      dot: '2',
      action: () => { setMode('consumer'); setConsumerTab('rewards'); setActiveSection('pay'); }
    },
  ];

  /* ─── UPI & Transfer Actions ────────────────────────────────────────── */
  const upiQuickActions = [
    { label: 'Scan QR',      icon: QrCode,       color: 'bg-indigo-600',  action: () => openModal('qrScanner') },
    { label: 'To Mobile',    icon: Send,         color: 'bg-blue-600',    action: () => openModal('transfer', { targetType: 'contact' }) },
    { label: 'To Bank / UPI',icon: Landmark,     color: 'bg-violet-600',  action: () => openModal('transfer', { targetType: 'bank' }) },
    { label: 'Check Balance',icon: Building2,    color: 'bg-slate-700',   action: () => openModal('checkBalance') },
    { label: 'Add Money',    icon: Wallet,       color: 'bg-emerald-600', action: () => openModal('addMoney') },
    { label: 'My QR',        icon: QrCode,       color: 'bg-teal-600',    action: () => openModal('myQr') },
  ];

  /* ─── Recharge, Bills, Loans & FD ─────────────────────────────────────── */
  const rechargeBills = [
    { label: 'Mobile Recharge', sub: 'Prepaid/Postpaid', icon: Smartphone, color: 'text-indigo-600 bg-indigo-50', action: () => { setMode('consumer'); setConsumerTab('bbps'); setActiveSection('pay'); } },
    { label: 'Electricity & Gas', sub: 'Piped & Cylinder', icon: Flame, color: 'text-amber-600 bg-amber-50', action: () => { setMode('consumer'); setConsumerTab('bbps'); setActiveSection('pay'); } },
    { label: 'Instant Loan', sub: 'Up to ₹5 Lakhs', icon: Banknote, color: 'text-emerald-600 bg-emerald-50', action: () => openModal('personalLoan') },
    { label: 'Credit Card Bill', sub: 'Visa & RuPay', icon: CreditCard, color: 'text-rose-600 bg-rose-50', action: () => { setMode('consumer'); setConsumerTab('bbps'); setActiveSection('pay'); } },
    { label: 'FD & 24K Gold', sub: 'High Returns', icon: Coins, color: 'text-yellow-600 bg-yellow-50', action: () => openModal('digitalGold') },
    { label: 'Broadband / DTH', sub: 'Instant Recharge', icon: Zap, color: 'text-blue-600 bg-blue-50', action: () => { setMode('consumer'); setConsumerTab('bbps'); setActiveSection('pay'); } },
    { label: 'Fastag Recharge', sub: 'All Toll Plazas', icon: Layers, color: 'text-purple-600 bg-purple-50', action: () => { setMode('consumer'); setConsumerTab('bbps'); setActiveSection('pay'); } },
    { label: 'Credit Score', sub: '784 CIBIL ✦ Free', icon: Gauge, color: 'text-teal-600 bg-teal-50', action: () => openModal('creditScore') },
  ];

  /* ─── Extras ─────────────────────────────────────────────────────────── */
  const extras = [
    { label: 'ARRAI Chess Arena', sublabel: 'ARRAI Grandmaster Edition', icon: Trophy, color: 'from-amber-600 to-yellow-600', action: () => { setMode('consumer'); setActiveSection('chess'); } },
    { label: 'ARRAI Maps & GPS', sublabel: 'Nearby UPI & ATMs', icon: Navigation, color: 'from-emerald-500 to-teal-700', action: () => openModal('arraiMap') },
    { label: 'ARRAI Postpaid', sublabel: '₹25K @ 0% Fee', icon: CreditCard, color: 'from-blue-600 to-indigo-600', action: () => openModal('bnpl') },
    { label: 'Insurance Cover', sublabel: 'Health & Motor', icon: Shield, color: 'from-emerald-600 to-teal-700', action: () => openModal('insurance') },
    { label: 'DigiLocker Vault', sublabel: 'Aadhaar, PAN, DL', icon: ShieldCheck, color: 'from-slate-700 to-slate-900', action: () => openModal('digilocker') },
    { label: 'ARRAI Merchant', sublabel: 'Payment Gateway', icon: LayoutDashboard, color: 'from-teal-600 to-cyan-800', action: () => { setMode('merchant'); setMerchantTab('dashboard'); setActiveSection('merchant'); } },
  ];

  const getTxnMeta = (type: string) => {
    const isCredit = ['received', 'cashback', 'wallet_topup'].includes(type);
    return { sign: isCredit ? '+' : '−', color: isCredit ? 'text-emerald-600' : 'text-rose-600' };
  };

  return (
    <div className="space-y-5 pb-24">

      {/* ══ HERO BANNER ════════════════════════════════════════════════════════ */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#0f0c29] via-[#1a1250] to-[#201060] text-white px-5 pt-6 pb-7 shadow-2xl border border-indigo-900/60">
        <div className="pointer-events-none absolute -right-20 -top-20 w-80 h-80 rounded-full bg-violet-600/15 blur-3xl" />
        <div className="pointer-events-none absolute left-0 bottom-0 w-56 h-56 rounded-full bg-indigo-500/10 blur-3xl" />

        {/* Profile row */}
        <div className="relative z-10 flex items-center justify-between mb-6">
          <div 
            onClick={() => {
              setMode('consumer');
              setActiveSection('settings');
            }}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative">
              <img
                src={userProfile.avatar}
                alt={userProfile.name}
                className="w-12 h-12 rounded-2xl object-cover ring-2 ring-indigo-400/50 shadow-lg group-hover:scale-105 transition-transform"
              />
              <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-400 ring-2 ring-[#1a1250]" />
            </div>
            <div>
              <p className="text-[11px] text-indigo-300 font-medium tracking-wide">नमस्ते 👋</p>
              <h1 className="text-base font-black tracking-tight leading-snug group-hover:text-indigo-200 transition-colors">{userProfile.name}</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                <p className="text-[10px] text-indigo-300/80 font-mono">{userProfile.vpa}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button onClick={() => openModal('myQr')} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all" title="My QR Code">
              <QrCode className="w-4 h-4 text-indigo-200" />
            </button>
            <button onClick={() => { setMode('consumer'); setActiveSection('settings'); }} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/10 transition-all" title="Settings">
              <Settings className="w-4 h-4 text-indigo-200" />
            </button>
          </div>
        </div>

        {/* Balance */}
        <div className="relative z-10 mb-5">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] text-indigo-400 uppercase tracking-[0.12em] font-semibold">Total Available Balance</span>
            <button onClick={() => setHideBalance(!hideBalance)} className="text-indigo-400 hover:text-white transition-colors">
              {hideBalance ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            </button>
          </div>
          <div className="flex items-baseline gap-2.5">
            <span className="text-[2.4rem] font-black font-mono tracking-tight leading-none">
              {hideBalance ? '₹ •••••' : `₹${totalLiquidity.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`}
            </span>
            <span className="text-[9px] font-bold bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/30">
              LIVE
            </span>
          </div>
          <p className="text-[10px] text-indigo-400/70 mt-1.5 font-mono">
            ARRAI Wallet ₹{walletBalance.toLocaleString('en-IN')} &nbsp;·&nbsp; {primaryBank?.bankName} ₹{primaryBank?.balance.toLocaleString('en-IN')}
          </p>
        </div>

        {/* Universal Search */}
        <div className="relative z-10">
          <Search className="w-3.5 h-3.5 text-indigo-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search ARRAI — people, billers, UPI, apps…"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2.5 rounded-2xl bg-white/8 backdrop-blur-sm border border-white/10 text-xs text-white placeholder-indigo-400/60 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 transition-all"
          />
        </div>
      </div>

      {/* ══ UPI & TRANSFER ACTIONS ══════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-4">
        <div className="flex items-center justify-between mb-3 px-1">
          <h2 className="text-xs font-black uppercase tracking-wider text-slate-400">UPI & Transfers</h2>
          <span className="text-[10px] font-bold text-indigo-600">Zero Fee</span>
        </div>
        <div className="grid grid-cols-6 gap-2">
          {upiQuickActions.map(a => {
            const Icon = a.icon;
            return (
              <button
                key={a.label}
                onClick={a.action}
                className="flex flex-col items-center gap-1.5 group active:scale-90 transition-transform"
              >
                <div className={`w-12 h-12 rounded-2xl ${a.color} flex items-center justify-center shadow-md group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <span className="text-[9px] font-bold text-slate-600 group-hover:text-slate-900 text-center leading-tight">{a.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ RECENT CHATS ROW (ARRAI CHAT) ═══════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-4">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center">
              <MessageSquare className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-xs font-black uppercase tracking-wider text-slate-800">Recent ARRAI Chats</h3>
          </div>
          <button
            onClick={() => {
              setMode('consumer');
              setActiveSection('chat');
            }}
            className="text-xs font-bold text-emerald-600 hover:text-emerald-700 flex items-center gap-0.5"
          >
            Open Chat <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {recentChatContacts.map(contact => (
            <button
              key={contact.id}
              onClick={() => {
                if (onOpenChat) {
                  onOpenChat(contact);
                } else {
                  setActiveSection('chat');
                }
              }}
              className="flex flex-col items-center gap-1.5 p-2 rounded-2xl hover:bg-slate-50 active:scale-95 transition-all group"
            >
              <div className="relative">
                <img
                  src={contact.avatar}
                  alt={contact.name}
                  className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-400/40 group-hover:scale-105 transition-transform"
                />
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
              </div>
              <span className="text-[11px] font-bold text-slate-800 truncate max-w-[70px] text-center leading-tight">
                {contact.name.split(' ')[0]}
              </span>
              <span className="text-[9px] text-emerald-600 font-medium">Chat & Pay</span>
            </button>
          ))}
        </div>
      </div>

      {/* ══ ARRAI ECOSYSTEM APPS ════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-black text-slate-900 tracking-tight">ARRAI Apps Hub</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">सभी डिजिटल सेवाएं एक जगह</p>
          </div>
          <button
            onClick={() => { setMode('consumer'); setActiveSection('store'); }}
            className="flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl border border-indigo-100 transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            ARRAI Store
          </button>
        </div>

        <div className="grid grid-cols-4 gap-y-6 gap-x-2">
          {apps.map(app => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onClick={app.action}
                className="flex flex-col items-center gap-2 group active:scale-90 transition-transform"
              >
                <div className="relative">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${app.gradient} flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:shadow-xl transition-all duration-200`}>
                    <Icon className="w-8 h-8 text-white drop-shadow" />
                  </div>
                  {app.dot && (
                    <span className={`absolute -top-1.5 -right-1.5 min-w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black text-white px-1 ring-2 ring-white ${app.dot === 'ALL' ? 'bg-violet-600' : 'bg-rose-500'}`}>
                      {app.dot}
                    </span>
                  )}
                </div>
                <span className="text-[11px] font-bold text-slate-700 group-hover:text-slate-900 text-center leading-tight">{app.shortLabel}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ RECHARGE & BILL PAYMENTS (BBPS, LOANS, GAS, CARDS, FD) ═════════ */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-4">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Recharge, Bills & Finance</h3>
            <p className="text-[10px] text-slate-400">Loan · Gas · Cards · FD & Gold · BBPS Bills</p>
          </div>
          <button
            onClick={() => { setMode('consumer'); setConsumerTab('bbps'); setActiveSection('pay'); }}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5"
          >
            All Bills <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {rechargeBills.map(item => {
            const Icon = item.icon;
            return (
              <button
                key={item.label}
                onClick={item.action}
                className="p-3 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all text-left flex items-start gap-2.5 active:scale-95 group"
              >
                <div className={`p-2.5 rounded-xl ${item.color} group-hover:scale-110 transition-transform shrink-0`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-700 truncate">{item.label}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 truncate">{item.sub}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ EXTRAS & FINANCIAL EXTENSIONS ══════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-xs overflow-hidden">
        <div className="flex items-center justify-between p-4 pb-3">
          <div>
            <h3 className="text-sm font-black text-slate-900 tracking-tight">ARRAI Extras</h3>
            <p className="text-[10px] text-slate-400">Postpaid · Insurance · DigiLocker · Gateway</p>
          </div>
          <span className="text-[9px] font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-full border border-indigo-200">
            Powered by ARRAI
          </span>
        </div>

        <div className="flex gap-3 overflow-x-auto px-4 pb-4 scrollbar-none">
          {extras.map(s => {
            const Icon = s.icon;
            return (
              <button
                key={s.label}
                onClick={s.action}
                className="shrink-0 w-32 p-3 rounded-2xl border border-slate-100 hover:border-indigo-200 hover:shadow-sm bg-slate-50 hover:bg-white text-left transition-all group active:scale-95"
              >
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-sm mb-2.5 group-hover:scale-105 transition-transform`}>
                  <Icon className="w-5 h-5 text-white" />
                </div>
                <p className="text-xs font-bold text-slate-800 leading-tight group-hover:text-indigo-700">{s.label}</p>
                <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{s.sublabel}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* ══ RECENT TRANSACTIONS ════════════════════════════════════════════ */}
      {recentTxns.length > 0 && (
        <div className="bg-white rounded-3xl border border-slate-100 shadow-xs p-4">
          <div className="flex items-center justify-between mb-3.5">
            <h3 className="text-sm font-black text-slate-900 tracking-tight">Recent Activity</h3>
            <button
              onClick={() => { setMode('consumer'); setConsumerTab('passbook'); setActiveSection('pay'); }}
              className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-0.5 transition-colors"
            >
              Passbook <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {recentTxns.map(txn => {
              const { sign, color } = getTxnMeta(txn.type);
              return (
                <div key={txn.id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${['received','cashback','wallet_topup'].includes(txn.type) ? 'bg-emerald-50 border border-emerald-100' : 'bg-rose-50 border border-rose-100'}`}>
                      {['received','cashback','wallet_topup'].includes(txn.type)
                        ? <TrendingUp className="w-4 h-4 text-emerald-600" />
                        : <ArrowUpRight className="w-4 h-4 text-rose-600" />
                      }
                    </div>
                    <div>
                      <p className="text-xs font-bold text-slate-800 leading-tight">{txn.title}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {new Date(txn.timestamp).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>
                  </div>
                  <span className={`text-sm font-black font-mono ${color}`}>
                    {sign}₹{txn.amount.toLocaleString('en-IN')}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ══ SOUNDBOX BANNER ════════════════════════════════════════════════ */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-950 via-[#1a1250] to-slate-950 text-white p-4 flex items-center justify-between gap-3 shadow-md border border-indigo-900/60">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <Radio className="w-4.5 h-4.5 text-indigo-300 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5 mb-0.5">
              <span className="text-xs font-bold text-white">ARRAI Voice Soundbox</span>
              <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded border ${soundboxEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-slate-500/20 text-slate-400 border-slate-500/30'}`}>
                {soundboxEnabled ? 'Active' : 'Muted'}
              </span>
            </div>
            <p className="text-[10px] text-indigo-300/80">Natural Hindi & English voice confirmations</p>
          </div>
        </div>
        <button
          onClick={() => triggerSoundboxTest(500)}
          className="px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 shrink-0 active:scale-95"
        >
          <Volume2 className="w-3.5 h-3.5" />
          Test
        </button>
      </div>

    </div>
  );
};