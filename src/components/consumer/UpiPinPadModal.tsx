import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, 
  Delete, 
  Check, 
  ShieldCheck, 
  Lock, 
  Building2, 
  AlertCircle,
  Loader2,
  Wallet
} from 'lucide-react';
import { soundEngine } from '../../utils/audio';

export const UpiPinPadModal: React.FC = () => {
  const { 
    activeModal, 
    closeModal, 
    draftPayment, 
    primaryBank,
    executeSendMoney,
    executeBillPayment,
    isProcessing,
    errorMessage 
  } = useAppStore();

  const [pin, setPin] = useState('');
  const maxPinLength = 4; // Standard 4-digit UPI PIN (or 6)

  if (activeModal !== 'upiPin' || !draftPayment) return null;

  const handleKeyPress = (num: string) => {
    if (pin.length < maxPinLength && !isProcessing) {
      soundEngine.playKeypadClick();
      setPin(prev => prev + num);
    }
  };

  const handleBackspace = () => {
    if (pin.length > 0 && !isProcessing) {
      soundEngine.playKeypadClick();
      setPin(prev => prev.slice(0, -1));
    }
  };

  const handleSubmit = async () => {
    if (pin.length !== maxPinLength) return;

    if (draftPayment.category && draftPayment.billDetails) {
      await executeBillPayment(pin);
    } else {
      await executeSendMoney(pin);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-md bg-slate-900 text-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-800 overflow-hidden animate-in slide-in-from-bottom duration-200">
        
        {/* Top Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">
              <Lock className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                ENTER UPI PIN
              </h3>
              <p className="text-[10px] text-slate-500">NPCI Unified Payments Interface</p>
            </div>
          </div>

          <button
            onClick={closeModal}
            disabled={isProcessing}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Payment Summary Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-b from-slate-900 to-slate-950 text-center space-y-2 border-b border-slate-800/60">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Paying to {draftPayment.recipientName}
          </span>
          
          <div className="text-3xl font-black font-mono tracking-tight text-white">
            ₹{draftPayment.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>

          {/* Payment Source */}
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800/80 border border-slate-700 text-xs text-slate-300">
            {draftPayment.paymentMethod === 'ARRAI_WALLET' ? (
              <>
                <Wallet className="w-3.5 h-3.5 text-indigo-400" />
                <span>ARRAI Wallet</span>
              </>
            ) : (
              <>
                <Building2 className="w-3.5 h-3.5 text-indigo-400" />
                <span>{primaryBank.bankName} •••• {primaryBank.accountLast4}</span>
              </>
            )}
          </div>
        </div>

        {/* Error notification if any */}
        {errorMessage && (
          <div className="mx-4 mt-3 p-2.5 rounded-xl bg-rose-950/80 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* PIN Dots Area */}
        <div className="py-6 flex flex-col items-center justify-center space-y-3">
          <div className="flex items-center gap-4">
            {Array.from({ length: maxPinLength }).map((_, index) => {
              const isFilled = index < pin.length;
              return (
                <div
                  key={index}
                  className={`w-4 h-4 rounded-full transition-all duration-150 ${
                    isFilled 
                      ? 'bg-indigo-400 scale-125 shadow-md shadow-indigo-500/50' 
                      : 'border-2 border-slate-600 bg-transparent'
                  }`}
                />
              );
            })}
          </div>

          <span className="text-[11px] text-slate-400">
            {pin.length === maxPinLength ? 'Press submit to complete payment' : 'Enter your 4-digit UPI MPIN'}
          </span>
        </div>

        {/* Keypad Grid (Realistic tactile layout) */}
        <div className="grid grid-cols-3 gap-1 p-3 bg-slate-950/80 border-t border-slate-800/80 select-none">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
            <button
              key={num}
              onClick={() => handleKeyPress(num.toString())}
              disabled={isProcessing}
              className="py-3.5 rounded-2xl text-xl font-bold font-mono text-slate-200 hover:bg-slate-800/90 active:bg-indigo-600 active:text-white transition-all disabled:opacity-50"
            >
              {num}
            </button>
          ))}

          {/* Backspace Button */}
          <button
            onClick={handleBackspace}
            disabled={isProcessing || pin.length === 0}
            className="py-3.5 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-800/90 active:bg-slate-700 transition-all disabled:opacity-30"
          >
            <Delete className="w-6 h-6" />
          </button>

          {/* Digit 0 */}
          <button
            onClick={() => handleKeyPress('0')}
            disabled={isProcessing}
            className="py-3.5 rounded-2xl text-xl font-bold font-mono text-slate-200 hover:bg-slate-800/90 active:bg-indigo-600 active:text-white transition-all disabled:opacity-50"
          >
            0
          </button>

          {/* Submit Action */}
          <button
            onClick={handleSubmit}
            disabled={isProcessing || pin.length !== maxPinLength}
            className={`py-3.5 rounded-2xl flex items-center justify-center font-bold text-white transition-all ${
              pin.length === maxPinLength && !isProcessing
                ? 'bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/40 active:scale-95'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            {isProcessing ? (
              <Loader2 className="w-6 h-6 animate-spin text-white" />
            ) : (
              <Check className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Bottom NPCI Security Notice */}
        <div className="p-2.5 bg-slate-950 text-center border-t border-slate-900 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Secured by NPCI 256-bit Bank Grade Encryption</span>
        </div>

      </div>
    </div>
  );
};
