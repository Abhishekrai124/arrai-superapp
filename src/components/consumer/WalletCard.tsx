import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Wallet, 
  PlusCircle, 
  Copy, 
  Check, 
  CreditCard, 
  Building, 
  Sparkles, 
  ArrowUpRight, 
  TrendingUp, 
  ShieldCheck,
  Eye,
  EyeOff
} from 'lucide-react';

export const WalletCard: React.FC = () => {
  const { walletBalance, primaryBank, openModal, userProfile } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [showBankBalance, setShowBankBalance] = useState(false);
  const [hideWalletBalance, setHideWalletBalance] = useState(true);

  const vpa = userProfile.vpa;

  const handleCopy = () => {
    navigator.clipboard.writeText(vpa);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-700 via-indigo-600 to-violet-800 text-white shadow-xl shadow-indigo-600/20 p-5 sm:p-6 transition-all">
      
      {/* Decorative background shapes */}
      <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
      <div className="absolute left-1/3 -top-10 w-32 h-32 rounded-full bg-indigo-400/20 blur-xl pointer-events-none" />

      {/* Top Row: Wallet Brand & Actions */}
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-white/15 backdrop-blur-md rounded-xl border border-white/20">
            <Wallet className="w-5 h-5 text-indigo-100" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">
                ARRAI Wallet
              </span>
              <span className="bg-emerald-400/20 text-emerald-300 text-[10px] px-1.5 py-0.2 rounded-full font-semibold border border-emerald-400/30">
                Zero Fee
              </span>
            </div>
            <p className="text-[11px] text-indigo-200/80 font-mono">Linked with NPCI UPI 2.0</p>
          </div>
        </div>

        <button
          onClick={() => setHideWalletBalance(!hideWalletBalance)}
          className="p-1.5 text-indigo-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
          title={hideWalletBalance ? "Show balance" : "Hide balance"}
        >
          {hideWalletBalance ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
        </button>
      </div>

      {/* Center: Balance Display & Quick Add */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-end justify-between gap-4 relative z-10">
        <div>
          <span className="text-xs font-medium text-indigo-200">Total Available Balance</span>
          <div className="flex items-baseline gap-2 mt-0.5">
            <span className="text-3xl sm:text-4xl font-black tracking-tight font-mono">
              {hideWalletBalance 
                ? '₹ • • • • • •' 
                : `₹${walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}`
              }
            </span>
          </div>
          <div className="flex items-center gap-2 mt-1 text-[11px] text-indigo-200">
            <TrendingUp className="w-3.5 h-3.5 text-emerald-300" />
            <span>Monthly budget safe • ₹5,000 auto-topup enabled</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => openModal('addMoney')}
            className="flex-1 sm:flex-none px-4 py-2.5 bg-white text-indigo-700 hover:bg-indigo-50 active:scale-95 rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-indigo-600" />
            + Add Money
          </button>

          <button
            onClick={() => openModal('myQr')}
            className="px-3.5 py-2.5 bg-indigo-500/30 hover:bg-indigo-500/40 border border-white/20 active:scale-95 rounded-xl font-semibold text-xs text-white transition-all flex items-center justify-center gap-1.5"
          >
            My QR
          </button>
        </div>
      </div>

      {/* Bottom Bar: VPA and Linked Bank */}
      <div className="mt-5 pt-4 border-t border-white/15 grid grid-cols-1 sm:grid-cols-2 gap-3 relative z-10">
        
        {/* UPI VPA Pill */}
        <div className="flex items-center justify-between bg-black/20 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10">
          <div className="flex flex-col">
            <span className="text-[10px] text-indigo-200 uppercase font-semibold">Your UPI VPA</span>
            <span className="text-xs font-mono font-bold text-white">{vpa}</span>
          </div>
          <button
            onClick={handleCopy}
            className="p-1 text-indigo-200 hover:text-white transition-colors"
            title="Copy UPI ID"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Linked Bank Pill */}
        <div className="flex items-center justify-between bg-black/20 backdrop-blur-xs px-3 py-2 rounded-xl border border-white/10">
          <div className="flex items-center gap-2">
            <Building className="w-4 h-4 text-indigo-200" />
            <div className="flex flex-col">
              <span className="text-[10px] text-indigo-200 uppercase font-semibold">Default Bank A/C</span>
              <span className="text-xs font-medium text-white">{primaryBank.bankName} •••• {primaryBank.accountLast4}</span>
            </div>
          </div>
          
          <button
            onClick={() => setShowBankBalance(!showBankBalance)}
            className="text-[11px] font-bold text-emerald-300 hover:text-emerald-200 transition-colors"
          >
            {showBankBalance ? `₹${primaryBank.balance.toLocaleString('en-IN')}` : 'Check Bal'}
          </button>
        </div>

      </div>

    </div>
  );
};
