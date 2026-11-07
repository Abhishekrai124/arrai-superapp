import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';
import { Building2, X, Lock, CheckCircle2, ShieldCheck, Eye, EyeOff, AlertCircle } from 'lucide-react';

export const CheckBalanceModal: React.FC = () => {
  const { activeModal, closeModal, linkedBanks, userProfile } = useAppStore();
  const [selectedBankId, setSelectedBankId] = useState(linkedBanks[0]?.id || 'sbi_01');
  const [pin, setPin] = useState('');
  const [revealed, setRevealed] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  if (activeModal !== 'checkBalance') return null;

  const currentBank = linkedBanks.find(b => b.id === selectedBankId) || linkedBanks[0];

  const handleKeyPress = (num: string) => {
    soundEngine.playKeypadClick();
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      setError(null);
      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    soundEngine.playKeypadClick();
    setPin(prev => prev.slice(0, -1));
    setError(null);
  };

  const verifyPin = (pinToVerify: string) => {
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      if (pinToVerify === userProfile.mpin || pinToVerify === '1234') {
        soundEngine.playSuccessChime();
        setRevealed(true);
      } else {
        setError('Incorrect UPI PIN. Default demo PIN is 1234.');
        setPin('');
      }
    }, 600);
  };

  const handleReset = () => {
    setRevealed(false);
    setPin('');
    setError(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-sm rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-400" />
            <div>
              <h3 className="font-bold text-sm">Check Bank Balance</h3>
              <p className="text-[10px] text-slate-400">NPCI UPI 2.0 Secure Inquiry</p>
            </div>
          </div>
          <button 
            onClick={() => { handleReset(); closeModal(); }}
            className="p-1 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bank Selection Tabs */}
        <div className="p-4 border-b border-slate-100 bg-slate-50 flex gap-2">
          {linkedBanks.map(bank => (
            <button
              key={bank.id}
              onClick={() => { setSelectedBankId(bank.id); handleReset(); }}
              className={`flex-1 p-2.5 rounded-xl text-left border transition-all text-xs ${
                selectedBankId === bank.id
                  ? 'bg-white border-indigo-600 shadow-xs'
                  : 'border-slate-200 hover:bg-white/80'
              }`}
            >
              <span className="font-bold text-slate-900 block truncate">{bank.bankName}</span>
              <span className="text-[10px] text-slate-500 font-mono">{bank.accountNumberMasked}</span>
            </button>
          ))}
        </div>

        {/* Main Content */}
        <div className="p-5">
          {revealed ? (
            <div className="text-center py-4 space-y-4 animate-in zoom-in-95">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
                <CheckCircle2 className="w-9 h-9" />
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">Available Balance</span>
                <span className="text-3xl font-black text-slate-900 font-mono mt-1 block">
                  ₹{currentBank.balance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </span>
                <p className="text-[11px] text-slate-500 mt-1">
                  {currentBank.bankName} • {currentBank.accountNumberMasked}
                </p>
              </div>

              <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-left text-xs text-slate-600 space-y-1">
                <div className="flex justify-between">
                  <span className="text-slate-400">Account Type:</span>
                  <span className="font-semibold text-slate-700">Savings A/C</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">IFSC Code:</span>
                  <span className="font-mono text-slate-700">{currentBank.ifsc}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">UPI Status:</span>
                  <span className="text-emerald-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" /> Active & Verified
                  </span>
                </div>
              </div>

              <button
                onClick={handleReset}
                className="w-full py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
              >
                Done
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="text-center">
                <p className="text-xs font-bold text-slate-800">
                  Enter 4-Digit UPI PIN for {currentBank.bankName}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">Demo default PIN is 1234</p>
              </div>

              {/* PIN Dots */}
              <div className="flex justify-center gap-3 my-2">
                {[0, 1, 2, 3].map(i => (
                  <div
                    key={i}
                    className={`w-3.5 h-3.5 rounded-full border-2 transition-all ${
                      i < pin.length 
                        ? 'bg-indigo-600 border-indigo-600 scale-110' 
                        : 'border-slate-300'
                    }`}
                  />
                ))}
              </div>

              {error && (
                <div className="p-2 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-xl flex items-center gap-1.5 justify-center">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {/* Tactile Keypad */}
              <div className="grid grid-cols-3 gap-2 pt-2">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map(num => (
                  <button
                    key={num}
                    onClick={() => handleKeyPress(num)}
                    disabled={isVerifying}
                    className="py-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 text-slate-800 rounded-xl font-bold text-base transition-all border border-slate-200"
                  >
                    {num}
                  </button>
                ))}
                <button
                  onClick={() => setPin('')}
                  className="py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-500 rounded-xl text-xs font-bold transition-all"
                >
                  Clear
                </button>
                <button
                  onClick={() => handleKeyPress('0')}
                  disabled={isVerifying}
                  className="py-3 bg-slate-50 hover:bg-indigo-50 hover:text-indigo-600 active:scale-95 text-slate-800 rounded-xl font-bold text-base transition-all border border-slate-200"
                >
                  0
                </button>
                <button
                  onClick={handleDelete}
                  className="py-3 bg-slate-100 hover:bg-slate-200 active:scale-95 text-slate-700 rounded-xl text-xs font-bold transition-all"
                >
                  ⌫
                </button>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
