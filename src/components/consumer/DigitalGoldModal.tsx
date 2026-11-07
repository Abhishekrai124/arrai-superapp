import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';
import { Sparkles, X, CheckCircle2, ShieldCheck, TrendingUp, ArrowDownRight, ArrowUpRight } from 'lucide-react';

export const DigitalGoldModal: React.FC = () => {
  const { activeModal, closeModal, walletBalance, executeAddMoney, openModal } = useAppStore();
  const [tab, setTab] = useState<'buy' | 'sell'>('buy');
  const [rupeesInput, setRupeesInput] = useState('500');
  const [goldWeightGrams, setGoldWeightGrams] = useState(0.5); // User's vault holdings
  const [isProcessing, setIsProcessing] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  if (activeModal !== 'digitalGold') return null;

  const liveGoldPricePerGram = 7450.00; // ₹7,450 / gram 24K 99.9% Pure
  const calculatedGrams = (Number(rupeesInput) / liveGoldPricePerGram).toFixed(4);

  const handleBuy = async () => {
    const amount = Number(rupeesInput);
    if (isNaN(amount) || amount < 10) return;

    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setGoldWeightGrams(prev => +(prev + Number(calculatedGrams)).toFixed(4));
      soundEngine.playSuccessChime();
      setSuccessMsg(`Successfully purchased ${calculatedGrams}g of 24K 99.9% Pure Gold! Stored securely in ARRAI Vault.`);
    }, 800);
  };

  const handleSell = async () => {
    const amount = Number(rupeesInput);
    if (isNaN(amount) || amount <= 0) return;

    setIsProcessing(true);
    setTimeout(async () => {
      setIsProcessing(false);
      setGoldWeightGrams(prev => Math.max(0, +(prev - Number(calculatedGrams)).toFixed(4)));
      await executeAddMoney(amount, 'ARRAI 24K Gold Sale Proceeds');
      soundEngine.playSuccessChime();
      setSuccessMsg(`Sold ${calculatedGrams}g of 24K Gold. ₹${amount} credited instantly to your ARRAI Wallet!`);
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-500 via-amber-600 to-yellow-600 text-white p-5 flex items-center justify-between shadow-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-white/20 border border-white/30 flex items-center justify-center text-white">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">ARRAI 24K Digital Gold</h3>
                <span className="bg-white/20 text-white text-[10px] font-bold px-2 py-0.5 rounded-full border border-white/30">
                  99.9% Pure
                </span>
              </div>
              <p className="text-xs text-amber-100">Live MMTC-PAMP / Augmont Insured Vault</p>
            </div>
          </div>
          <button 
            onClick={() => { setSuccessMsg(null); closeModal(); }}
            className="p-1.5 rounded-full hover:bg-white/10 text-white/80 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Gold Price Ticker & Vault Holdings */}
        <div className="p-4 bg-amber-50/70 border-b border-amber-100 flex items-center justify-between text-xs">
          <div>
            <span className="text-slate-500 font-medium block">Live 24K Buy Price:</span>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-base font-black text-amber-900 font-mono">
                ₹{liveGoldPricePerGram.toLocaleString('en-IN')}/gm
              </span>
              <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.2 rounded-md flex items-center">
                <ArrowUpRight className="w-3 h-3" /> +1.4%
              </span>
            </div>
          </div>

          <div className="text-right">
            <span className="text-slate-500 font-medium block">My Gold Locker:</span>
            <span className="text-sm font-black text-slate-800 font-mono mt-0.5 block">
              {goldWeightGrams} g (₹{(goldWeightGrams * liveGoldPricePerGram).toLocaleString('en-IN')})
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          {successMsg ? (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <p className="text-xs font-semibold text-slate-800">{successMsg}</p>
              <button
                onClick={() => setSuccessMsg(null)}
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl transition-all"
              >
                Trade More
              </button>
            </div>
          ) : (
            <>
              {/* Buy / Sell Tabs */}
              <div className="flex p-1 bg-slate-100 rounded-xl">
                <button
                  onClick={() => setTab('buy')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    tab === 'buy' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Buy Gold
                </button>
                <button
                  onClick={() => setTab('sell')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all ${
                    tab === 'sell' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
                  }`}
                >
                  Sell Gold
                </button>
              </div>

              {/* Amount Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Enter Amount in Rupees (Min ₹10)
                </label>
                <div className="relative">
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 font-bold">₹</span>
                  <input
                    type="number"
                    value={rupeesInput}
                    onChange={(e) => setRupeesInput(e.target.value)}
                    className="w-full pl-8 pr-4 py-3 rounded-xl border border-slate-200 text-base font-bold font-mono text-slate-900 bg-slate-50 focus:bg-white focus:ring-2 focus:ring-amber-500"
                    placeholder="500"
                  />
                </div>

                <div className="flex gap-2 mt-2">
                  {['100', '500', '2000', '5000'].map(val => (
                    <button
                      key={val}
                      type="button"
                      onClick={() => setRupeesInput(val)}
                      className="px-2.5 py-1 text-xs rounded-lg border border-slate-200 bg-slate-50 hover:bg-amber-50 text-slate-700 font-medium"
                    >
                      +₹{val}
                    </button>
                  ))}
                </div>
              </div>

              {/* Calculated Grams Preview */}
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                <span className="text-slate-500">Estimated Weight:</span>
                <span className="font-mono font-bold text-slate-900 text-sm">{calculatedGrams} grams (24K 999)</span>
              </div>

              {/* Submit Button */}
              <button
                onClick={tab === 'buy' ? handleBuy : handleSell}
                disabled={isProcessing}
                className="w-full py-3 bg-gradient-to-r from-amber-500 to-yellow-600 hover:from-amber-600 hover:to-yellow-700 text-white rounded-xl text-xs font-bold shadow-md shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-1.5"
              >
                {isProcessing ? (
                  <span>Processing Gold Transaction...</span>
                ) : (
                  <span>{tab === 'buy' ? `Buy ₹${rupeesInput} Gold Instantly` : `Sell ₹${rupeesInput} Gold`}</span>
                )}
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>100% Insured in Brinks Vaults • BIS Hallmarked</span>
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
};
