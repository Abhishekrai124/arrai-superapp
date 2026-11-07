import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';
import { Banknote, X, CheckCircle2, ShieldCheck, Zap, Percent, Clock, ChevronRight } from 'lucide-react';

export const PersonalLoanModal: React.FC = () => {
  const { activeModal, closeModal, executeAddMoney, triggerSoundboxTest } = useAppStore();
  const [loanAmount, setLoanAmount] = useState(150000);
  const [tenureMonths, setTenureMonths] = useState(12);
  const [purpose, setPurpose] = useState('Business Expansion');
  const [isApplying, setIsApplying] = useState(false);
  const [isDisbursed, setIsDisbursed] = useState(false);

  if (activeModal !== 'personalLoan') return null;

  const annualInterestRate = 10.5; // 10.5% p.a.
  const monthlyRate = annualInterestRate / 12 / 100;
  const emi = Math.round(
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, tenureMonths)) /
    (Math.pow(1 + monthlyRate, tenureMonths) - 1)
  );
  const totalPayable = emi * tenureMonths;
  const totalInterest = totalPayable - loanAmount;

  const handleDisburseLoan = async () => {
    setIsApplying(true);
    setTimeout(async () => {
      await executeAddMoney(loanAmount, 'ARRAI Pre-Approved Personal Loan');
      setIsApplying(false);
      setIsDisbursed(true);
      soundEngine.playSuccessChime();
      triggerSoundboxTest(loanAmount);
    }, 1200);
  };

  const handleClose = () => {
    setIsDisbursed(false);
    closeModal();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center text-indigo-300">
              <Banknote className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">ARRAI Instant Personal Loan</h3>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Pre-Approved
                </span>
              </div>
              <p className="text-xs text-indigo-200">0 Paperwork • Instant Disbursal to ARRAI Wallet / Bank</p>
            </div>
          </div>
          <button 
            onClick={handleClose}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isDisbursed ? (
          <div className="p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>

            <div>
              <h4 className="text-xl font-black text-slate-900">Loan Disbursed Successfully!</h4>
              <p className="text-xs text-slate-500 mt-1">
                ₹{loanAmount.toLocaleString('en-IN')} has been instantly credited to your ARRAI Wallet.
              </p>
            </div>

            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 text-xs text-slate-700 space-y-2 text-left">
              <div className="flex justify-between">
                <span className="text-slate-500">Loan Account No:</span>
                <span className="font-mono font-bold text-slate-900">ARRAI-LN-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Monthly EMI:</span>
                <span className="font-bold text-indigo-600">₹{emi.toLocaleString('en-IN')} / mo</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">First EMI Date:</span>
                <span className="font-medium text-slate-800">5th of next month (Auto-Debit)</span>
              </div>
            </div>

            <button
              onClick={handleClose}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition-all shadow-md"
            >
              Back to ARRAI Pay
            </button>
          </div>
        ) : (
          <div className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
            
            {/* Amount Slider */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-xs font-bold text-slate-700">Choose Loan Amount</label>
                <span className="text-lg font-black text-indigo-600 font-mono">
                  ₹{loanAmount.toLocaleString('en-IN')}
                </span>
              </div>
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full accent-indigo-600 cursor-pointer"
              />
              <div className="flex justify-between text-[10px] text-slate-400 mt-1 font-mono">
                <span>Min: ₹10,000</span>
                <span>Max: ₹5,00,000</span>
              </div>
            </div>

            {/* Tenure Selector */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-2">Select Repayment Tenure</label>
              <div className="grid grid-cols-4 gap-2">
                {[6, 12, 18, 24].map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setTenureMonths(m)}
                    className={`py-2 px-3 rounded-xl border text-xs font-bold transition-all ${
                      tenureMonths === m
                        ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                    }`}
                  >
                    {m} Months
                  </button>
                ))}
              </div>
            </div>

            {/* Purpose */}
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Loan Purpose</label>
              <select
                value={purpose}
                onChange={(e) => setPurpose(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs font-medium bg-slate-50 text-slate-800"
              >
                <option>Business Expansion / Working Capital</option>
                <option>Gadgets & Electronics Purchase</option>
                <option>Home Renovation</option>
                <option>Medical & Family Emergency</option>
                <option>Travel & Education</option>
              </select>
            </div>

            {/* EMI Breakdown Card */}
            <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-100 space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-slate-600 font-medium">Monthly EMI:</span>
                <span className="text-base font-black text-indigo-700 font-mono">₹{emi.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-[11px]">
                <span>Interest Rate:</span>
                <span className="font-semibold text-slate-700">{annualInterestRate}% p.a. Reducing</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-[11px]">
                <span>Processing Fee:</span>
                <span className="font-semibold text-emerald-600">₹0 (Zero Fee Offer)</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 text-[11px]">
                <span>Total Interest Payable:</span>
                <span className="font-mono text-slate-700">₹{totalInterest.toLocaleString('en-IN')}</span>
              </div>
            </div>

            {/* Disburse Button */}
            <button
              onClick={handleDisburseLoan}
              disabled={isApplying}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 active:scale-98 text-white rounded-2xl font-bold text-sm shadow-lg shadow-indigo-500/25 transition-all flex items-center justify-center gap-2"
            >
              {isApplying ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying KYC & Disbursing Funds...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4 fill-current" />
                  <span>Get Instant ₹{loanAmount.toLocaleString('en-IN')} in Wallet</span>
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
              <span>RBI Regulated NBFC Partner • 256-bit Encrypted</span>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
