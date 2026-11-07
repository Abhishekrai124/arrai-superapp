import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { WalletCard } from './WalletCard';
import { QuickTransferBar } from './QuickTransferBar';
import { RecentContactsRow } from './RecentContactsRow';
import { BbpsBillPayGrid } from './BbpsBillPayGrid';
import { Contact } from '../../types';
import { 
  ShieldCheck, 
  Sparkles, 
  Volume2, 
  Banknote, 
  Coins, 
  Gauge, 
  CreditCard, 
  Shield, 
  ShoppingBag, 
  ChevronRight,
  Zap,
  History,
  Gift
} from 'lucide-react';

interface ConsumerHomeProps {
  onSelectTab: (tab: string) => void;
  onOpenChat: (contact: Contact) => void;
}

export const ConsumerHome: React.FC<ConsumerHomeProps> = ({ onSelectTab, onOpenChat }) => {
  const { soundboxEnabled, triggerSoundboxTest, openModal, setConsumerTab } = useAppStore();

  const financialServices = [
    {
      id: 'loan',
      title: 'Personal Loan',
      subtitle: 'Up to ₹5,00,000 instant',
      badge: 'Pre-Approved',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      icon: Banknote,
      color: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      action: () => openModal('personalLoan')
    },
    {
      id: 'postpaid',
      title: 'ARRAI Postpaid',
      subtitle: '₹25,000 limit @ 0% interest',
      badge: 'BNPL',
      badgeColor: 'bg-blue-100 text-blue-800',
      icon: CreditCard,
      color: 'bg-blue-50 text-blue-700 border-blue-200',
      action: () => openModal('bnpl')
    },
    {
      id: 'gold',
      title: '24K Digital Gold',
      subtitle: 'Live ₹7,450/gm • Start @ ₹10',
      badge: '99.9% Pure',
      badgeColor: 'bg-amber-100 text-amber-800',
      icon: Coins,
      color: 'bg-amber-50 text-amber-700 border-amber-200',
      action: () => openModal('digitalGold')
    },
    {
      id: 'cibil',
      title: 'Free Credit Score',
      subtitle: '784 CIBIL (Excellent)',
      badge: 'Free Report',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      icon: Gauge,
      color: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      action: () => openModal('creditScore')
    },
    {
      id: 'insurance',
      title: 'Insurance Hub',
      subtitle: 'Bike, Car, Health & Cyber',
      badge: 'IRDAI Approved',
      badgeColor: 'bg-teal-100 text-teal-800',
      icon: Shield,
      color: 'bg-teal-50 text-teal-700 border-teal-200',
      action: () => openModal('insurance')
    },
    {
      id: 'vault',
      title: 'DigiLocker Vault',
      subtitle: 'Govt Aadhaar, PAN, DL, RC',
      badge: 'Encrypted',
      badgeColor: 'bg-slate-100 text-slate-800',
      icon: ShieldCheck,
      color: 'bg-slate-100 text-slate-700 border-slate-200',
      action: () => openModal('digilocker')
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-5">
      
      {/* 1. ARRAI Wallet Balance Card */}
      <WalletCard />

      {/* Quick Access Hub (Passbook & Rewards) */}
      <div className="grid grid-cols-2 gap-3">
        <button
          onClick={() => setConsumerTab('passbook')}
          className="flex items-center justify-between p-3.5 bg-white hover:bg-indigo-50/50 rounded-2xl border border-slate-200 hover:border-indigo-300 transition-all shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 group-hover:scale-105 transition-transform">
              <History className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-800 block group-hover:text-indigo-600">Passbook & History</span>
              <span className="text-[10px] text-slate-400">All UPI & wallet entries</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </button>

        <button
          onClick={() => setConsumerTab('rewards')}
          className="flex items-center justify-between p-3.5 bg-white hover:bg-amber-50/50 rounded-2xl border border-slate-200 hover:border-amber-300 transition-all shadow-xs group"
        >
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 group-hover:scale-105 transition-transform">
              <Gift className="w-4 h-4" />
            </div>
            <div className="text-left">
              <span className="text-xs font-bold text-slate-800 block group-hover:text-amber-600">Rewards & Cashback</span>
              <span className="text-[10px] text-slate-400">Scratch cards & wins</span>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition-colors" />
        </button>
      </div>

      {/* 2. ARRAI Quick Transfer Bar */}
      <QuickTransferBar onSelectTab={onSelectTab} />

      {/* 3. Financial Services, Loans & Extensions (ARRAI Lending & Wealth) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 sm:p-5 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 tracking-tight">Financial Services & Extensions</h3>
            <p className="text-[11px] text-slate-500">Loans, BNPL Credit, 24K Gold, Insurance & DigiLocker</p>
          </div>

          <button
            onClick={() => openModal('arraiStore')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <span>ARRAI Store</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          {financialServices.map(service => {
            const Icon = service.icon;
            return (
              <button
                key={service.id}
                onClick={service.action}
                className="p-3 rounded-2xl border border-slate-200 bg-slate-50 hover:bg-white hover:border-indigo-300 hover:shadow-xs text-left transition-all group cursor-pointer flex flex-col justify-between"
              >
                <div>
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border mb-2 group-hover:scale-105 transition-transform ${service.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-xs text-slate-900 block truncate group-hover:text-indigo-600">
                    {service.title}
                  </span>
                  <span className="text-[10px] text-slate-500 block truncate mt-0.5">
                    {service.subtitle}
                  </span>
                </div>
                <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded-md mt-2 self-start border border-slate-200 ${service.badgeColor}`}>
                  {service.badge}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. ARRAI Chat & Contacts Bar */}
      <RecentContactsRow onOpenChat={onOpenChat} />

      {/* 5. ARRAI Bharat BillPay (BBPS) Grid */}
      <BbpsBillPayGrid />

      {/* 6. ARRAI Soundbox & UPI 2.0 Security Banner */}
      <div className="p-4 rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-md border border-indigo-900">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 text-indigo-300 flex items-center justify-center shrink-0 border border-indigo-500/30">
            <Volume2 className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-xs text-white">ARRAI Voice Soundbox</span>
              <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                {soundboxEnabled ? 'Active' : 'Muted'}
              </span>
            </div>
            <p className="text-[11px] text-indigo-200">
              Natural Hindi & English voice payment confirmations when money is credited.
            </p>
          </div>
        </div>

        <button
          onClick={() => triggerSoundboxTest(500)}
          className="self-start sm:self-auto px-3.5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>Test Natural Voice ("₹500")</span>
        </button>
      </div>

    </div>
  );
};
