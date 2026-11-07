import React from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Gauge, X, ShieldCheck, CheckCircle2, TrendingUp, AlertTriangle } from 'lucide-react';

export const CreditScoreModal: React.FC = () => {
  const { activeModal, closeModal, userProfile } = useAppStore();

  if (activeModal !== 'creditScore') return null;

  const score = 784; // Excellent CIBIL Score

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Gauge className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">ARRAI Credit Health</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  CIBIL Certified
                </span>
              </div>
              <p className="text-xs text-slate-400">Monthly Auto-Refresh • 100% Free</p>
            </div>
          </div>
          <button 
            onClick={closeModal}
            className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score Dial Display */}
        <div className="p-6 text-center border-b border-slate-100 bg-gradient-to-b from-emerald-50/50 to-white">
          <div className="inline-block p-4 rounded-full bg-emerald-50 border-4 border-emerald-500/20 shadow-inner">
            <span className="text-4xl font-black text-emerald-600 font-mono tracking-tight">{score}</span>
          </div>

          <div className="mt-2">
            <span className="inline-block px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs uppercase tracking-wider">
              Excellent Score
            </span>
            <p className="text-xs text-slate-500 mt-1">
              Top 8% in India! You qualify for pre-approved personal loans at 10.5% p.a.
            </p>
          </div>
        </div>

        {/* Factors Breakdown */}
        <div className="p-5 space-y-3">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">Key Impact Factors</h4>

          <div className="space-y-2">
            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">On-Time Repayments</span>
                <span className="text-[11px] text-slate-500">100% spotless track record</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px]">High Impact</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Credit Card Utilization</span>
                <span className="text-[11px] text-slate-500">14% of available limits (Optimal &lt; 30%)</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-bold text-[10px]">Optimal</span>
            </div>

            <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-800 block">Credit Age</span>
                <span className="text-[11px] text-slate-500">4 Years, 2 Months</span>
              </div>
              <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-bold text-[10px]">Good</span>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="w-full mt-4 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-md"
          >
            Close Report
          </button>
        </div>

      </div>
    </div>
  );
};
