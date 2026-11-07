import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, 
  Wallet, 
  CreditCard, 
  Building, 
  ShieldCheck, 
  Loader2, 
  AlertCircle 
} from 'lucide-react';

export const AddMoneyModal: React.FC = () => {
  const { activeModal, closeModal, executeAddMoney, isProcessing, errorMessage, walletBalance } = useAppStore();
  const [amount, setAmount] = useState<string>('1000');
  const [selectedSource, setSelectedSource] = useState<string>('SBI NetBanking (•••• 4829)');

  if (activeModal !== 'addMoney') return null;

  const quickPills = [500, 1000, 2000, 5000];

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;
    await executeAddMoney(val, selectedSource);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-700 to-indigo-800 text-white">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-white/20 rounded-xl">
              <Wallet className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Add Money to ARRAI Wallet</h3>
              <p className="text-[11px] text-indigo-100">
                Current: ₹{walletBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </div>

          <button
            onClick={closeModal}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleAdd} className="p-5 sm:p-6 space-y-4">
          
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Amount Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
              Enter Top-up Amount
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-2xl font-black text-slate-400">
                ₹
              </span>
              <input
                type="number"
                min="1"
                max="100000"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="500"
                className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-2xl font-mono font-black text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all"
                required
              />
            </div>
          </div>

          {/* Quick Pill Buttons */}
          <div className="grid grid-cols-4 gap-2">
            {quickPills.map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => setAmount(val.toString())}
                className={`py-2 text-xs font-bold rounded-xl border transition-all ${
                  amount === val.toString()
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700 shadow-xs'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                +₹{val}
              </button>
            ))}
          </div>

          {/* Payment Source Options */}
          <div className="pt-2">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Payment Source
            </span>
            <div className="space-y-2">
              <label 
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedSource.includes('SBI')
                    ? 'border-indigo-500 bg-indigo-50/40 text-indigo-950 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-blue-700 text-white flex items-center justify-center font-bold text-xs">
                    SBI
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block">State Bank of India</span>
                    <span className="text-[10px] text-slate-500 font-mono">NetBanking •••• 4829</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="source"
                  checked={selectedSource.includes('SBI')}
                  onChange={() => setSelectedSource('SBI NetBanking (•••• 4829)')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
              </label>

              <label 
                className={`flex items-center justify-between p-3 rounded-2xl border cursor-pointer transition-all ${
                  selectedSource.includes('HDFC')
                    ? 'border-indigo-500 bg-indigo-50/40 text-indigo-950 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-indigo-900 text-white flex items-center justify-center font-bold text-xs">
                    HDFC
                  </div>
                  <div className="text-left">
                    <span className="text-xs font-bold block">HDFC Bank Debit Card</span>
                    <span className="text-[10px] text-slate-500 font-mono">Card ending 9104</span>
                  </div>
                </div>
                <input
                  type="radio"
                  name="source"
                  checked={selectedSource.includes('HDFC')}
                  onChange={() => setSelectedSource('HDFC Debit Card (•••• 9104)')}
                  className="text-indigo-600 focus:ring-indigo-500"
                />
              </label>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isProcessing || !amount || parseFloat(amount) <= 0}
            className="w-full mt-2 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-2xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isProcessing ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Processing simulated top-up...
              </>
            ) : (
              `Proceed to Add ₹${parseFloat(amount || '0').toLocaleString('en-IN')}`
            )}
          </button>

          <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>100% Safe • RBI & NPCI Regulated ARRAI PPI Wallet</span>
          </div>
        </form>

      </div>
    </div>
  );
};
