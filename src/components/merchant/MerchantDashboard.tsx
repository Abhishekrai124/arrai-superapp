import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  TrendingUp, 
  CreditCard, 
  ArrowUpRight, 
  RotateCcw, 
  ShieldCheck, 
  Building2, 
  PlusCircle, 
  Link2, 
  CheckCircle2, 
  Code2, 
  ChevronRight,
  Sparkles
} from 'lucide-react';

interface MerchantDashboardProps {
  onSelectTab: (tab: string) => void;
}

export const MerchantDashboard: React.FC<MerchantDashboardProps> = ({ onSelectTab }) => {
  const { merchantBalance, merchantPayments, paymentLinks, openModal, isSandbox } = useAppStore();
  const [timeRange, setTimeRange] = useState<'today' | '7d' | '30d'>('7d');

  const totalCaptured = merchantPayments
    .filter(p => p.status === 'captured')
    .reduce((sum, p) => sum + p.amount, 0);

  const totalRefunded = merchantPayments
    .filter(p => p.status === 'refunded')
    .reduce((sum, p) => sum + p.amount, 0);

  // Chart data simulation
  const chartBars = [
    { label: 'Mon', height: 45, volume: '₹14,500' },
    { label: 'Tue', height: 65, volume: '₹22,100' },
    { label: 'Wed', height: 35, volume: '₹11,800' },
    { label: 'Thu', height: 85, volume: '₹34,200' },
    { label: 'Fri', height: 95, volume: '₹42,000' },
    { label: 'Sat', height: 70, volume: '₹28,500' },
    { label: 'Sun', height: 60, volume: '₹21,200' },
  ];

  return (
    <div className="space-y-5">
      
      {/* Top Merchant Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 text-white rounded-3xl p-6 sm:p-7 shadow-lg border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg sm:text-xl font-black tracking-tight">ARRAI Merchant Suite</h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  ARRAI Gateway Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Merchant Account: <span className="font-mono text-emerald-300">acc_arrai_merchant_01</span> (HDFC Settlement)
              </p>
            </div>
          </div>

          <div className="mt-5 flex items-baseline gap-3">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
                Settled Balance Available for Payout
              </span>
              <span className="text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
                ₹{merchantBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Action Buttons */}
        <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
          <button
            onClick={() => openModal('merchantCheckout')}
            className="flex-1 sm:flex-none px-4 py-3 bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95 font-black text-xs rounded-2xl shadow-lg shadow-emerald-500/20 transition-all flex items-center justify-center gap-2"
          >
            <CreditCard className="w-4 h-4" />
            Test ARRAI Checkout
          </button>

          <button
            onClick={() => onSelectTab('links')}
            className="flex-1 sm:flex-none px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs rounded-2xl transition-all flex items-center justify-center gap-2"
          >
            <Link2 className="w-4 h-4" />
            Create Payment Link
          </button>
        </div>
      </div>

      {/* 4 Analytics KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* KPI 1: Gross Volume */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Gross Volume</span>
            <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">
            ₹{(merchantBalance + totalCaptured).toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-emerald-600">
            <ArrowUpRight className="w-3.5 h-3.5" />
            <span>+18.4% from last week</span>
          </div>
        </div>

        {/* KPI 2: Successful Transactions */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Payment Success Rate</span>
            <div className="p-1.5 rounded-lg bg-blue-50 text-blue-600">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">
            99.4%
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <span>NPCI UPI 2.0 & Cards High Availability</span>
          </div>
        </div>

        {/* KPI 3: Active Payment Links */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Active Payment Links</span>
            <div className="p-1.5 rounded-lg bg-purple-50 text-purple-600">
              <Link2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">
            {paymentLinks.length} Links
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-purple-600">
            <span>{paymentLinks.filter(l => l.status === 'Paid').length} paid • instant webhooks</span>
          </div>
        </div>

        {/* KPI 4: Pending / Processed Refunds */}
        <div className="p-5 rounded-3xl bg-white border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500">
            <span>Total Refunds Issued</span>
            <div className="p-1.5 rounded-lg bg-teal-50 text-teal-600">
              <RotateCcw className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black font-mono text-slate-900">
            ₹{totalRefunded.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
          <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
            <span>Instant API reversal support</span>
          </div>
        </div>

      </div>

      {/* Revenue & Settlement Chart Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Revenue & Volume Analytics</h3>
            <p className="text-[11px] text-slate-500">Real-time captured UPI & Card transactions</p>
          </div>

          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 self-start sm:self-auto">
            <button
              onClick={() => setTimeRange('today')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                timeRange === 'today' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Today
            </button>
            <button
              onClick={() => setTimeRange('7d')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                timeRange === '7d' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              Last 7 Days
            </button>
            <button
              onClick={() => setTimeRange('30d')}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-colors ${
                timeRange === '30d' ? 'bg-white text-emerald-700 shadow-xs font-bold' : 'text-slate-600'
              }`}
            >
              30 Days
            </button>
          </div>
        </div>

        {/* Interactive SVG / Bar Chart Representation */}
        <div className="pt-4">
          <div className="h-56 flex items-end justify-between gap-2 sm:gap-6 px-2 sm:px-6 border-b border-slate-100">
            {chartBars.map((bar, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 group relative">
                
                {/* Tooltip on Hover */}
                <div className="absolute -top-10 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 text-white text-[10px] font-mono font-bold py-1 px-2 rounded-md shadow-md pointer-events-none whitespace-nowrap">
                  {bar.volume}
                </div>

                <div 
                  className="w-full max-w-[42px] bg-gradient-to-t from-emerald-600 to-teal-400 group-hover:from-emerald-500 group-hover:to-teal-300 rounded-t-xl transition-all duration-300 shadow-xs"
                  style={{ height: `${bar.height}%` }}
                />
                <span className="text-[11px] font-bold text-slate-500">{bar.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-slate-500 gap-2">
            <span className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              Settlement Schedule: T+1 day auto-deposit to HDFC Bank (•••• 9104)
            </span>
            <span className="font-semibold text-emerald-600">
              Next Payout: Today at 5:00 PM IST
            </span>
          </div>
        </div>

      </div>

      {/* Quick Launch Developer & Webhook Banner */}
      <div className="p-4 sm:p-5 rounded-3xl bg-slate-900 text-white border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl border border-emerald-500/30">
            <Code2 className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold">Integrate ARRAI Pay with your Website or App</h4>
            <p className="text-[11px] text-slate-400">
              Use native ARRAI PG SDKs with drop-in ARRAI API Keys and Webhook Listeners.
            </p>
          </div>
        </div>

        <button
          onClick={() => onSelectTab('developer')}
          className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl transition-colors flex items-center justify-center gap-1.5 shrink-0"
        >
          View API Keys & Webhooks <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
};
