import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';
import { CreditCard, X, CheckCircle2, ShieldCheck, Zap, ArrowRight } from 'lucide-react';

export const BnplModal: React.FC = () => {
  const { activeModal, closeModal } = useAppStore();
  const [isActivated, setIsActivated] = useState(true);
  const [usedLimit, setUsedLimit] = useState(3450);
  const totalLimit = 25000;
  const availableLimit = totalLimit - usedLimit;

  if (activeModal !== 'bnpl') return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/20 text-blue-300 border border-blue-400/30 flex items-center justify-center">
              <CreditCard className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">ARRAI Postpaid (BNPL)</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Active
                </span>
              </div>
              <p className="text-xs text-blue-200">Spend Now • Pay Next Month (0% Interest)</p>
            </div>
          </div>
          <button 
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Credit Limit Overview */}
        <div className="p-6 bg-gradient-to-b from-blue-50/50 to-white border-b border-slate-100">
          <div className="flex justify-between items-end mb-2">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Available Limit</span>
              <span className="text-3xl font-black text-slate-900 font-mono">
                ₹{availableLimit.toLocaleString('en-IN')}
              </span>
            </div>
            <span className="text-xs font-bold text-slate-500">
              Total Limit: ₹{totalLimit.toLocaleString('en-IN')}
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden">
            <div 
              className="bg-indigo-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${(availableLimit / totalLimit) * 100}%` }}
            />
          </div>

          <div className="flex justify-between text-[11px] text-slate-500 mt-2">
            <span>Used: ₹{usedLimit.toLocaleString('en-IN')}</span>
            <span>Billing Cycle: 1st of every month</span>
          </div>
        </div>

        {/* Perks & Actions */}
        <div className="p-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Accepted Everywhere</h4>
          
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-slate-800">Use ARRAI Postpaid for:</p>
            <p className="text-[11px]">✓ 1-Click Scan Any QR at 2 Crore+ stores</p>
            <p className="text-[11px]">✓ Mobile, DTH & Electricity bill payments with 0 convenience fee</p>
            <p className="text-[11px]">✓ Zomato, Swiggy, Uber, Flipkart & Amazon checkouts</p>
          </div>

          <button
            onClick={() => {
              soundEngine.playSuccessChime();
              setUsedLimit(0);
            }}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-1.5"
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>Pay Due Bill (₹{usedLimit.toLocaleString('en-IN')})</span>
          </button>
        </div>

      </div>
    </div>
  );
};
