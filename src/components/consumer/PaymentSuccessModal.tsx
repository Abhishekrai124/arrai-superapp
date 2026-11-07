import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Check, 
  Download, 
  Share2, 
  Sparkles, 
  Copy, 
  ArrowRight, 
  Building2, 
  ShieldCheck,
  CheckCircle2,
  Gift
} from 'lucide-react';

export const PaymentSuccessModal: React.FC = () => {
  const { activeModal, closeModal, lastSuccessTxn, setActiveSection, setConsumerTab } = useAppStore();
  const [copiedUtr, setCopiedUtr] = useState(false);

  if (activeModal !== 'paymentSuccess' || !lastSuccessTxn) return null;

  const handleCopyUtr = () => {
    navigator.clipboard.writeText(lastSuccessTxn.utr);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  const handleShareWhatsApp = () => {
    const text = `Paid ₹${lastSuccessTxn.amount} to ${lastSuccessTxn.title} via ARRAI Pay UPI. Ref ID: ${lastSuccessTxn.id}, UTR: ${lastSuccessTxn.utr}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleGoToRewards = () => {
    closeModal();
    setActiveSection('pay');
    setConsumerTab('rewards');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Animated Green Header */}
        <div className="bg-gradient-to-b from-emerald-600 to-teal-700 text-white p-6 sm:p-7 text-center relative overflow-hidden">
          {/* Circular Rings Background */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20">
            <div className="w-64 h-64 rounded-full border-8 border-white animate-pulse" />
          </div>

          {/* Checkmark Icon */}
          <div className="w-16 h-16 mx-auto rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-900/30 mb-3 animate-in zoom-in duration-300">
            <Check className="w-9 h-9 stroke-[3]" />
          </div>

          <h2 className="text-xl font-black tracking-tight">Payment Successful!</h2>
          <p className="text-xs text-emerald-100 mt-0.5">
            Paid to <span className="font-bold">{lastSuccessTxn.title}</span>
          </p>

          <div className="mt-3 text-3xl sm:text-4xl font-black font-mono tracking-tight text-white">
            ₹{lastSuccessTxn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
          </div>
        </div>

        {/* Receipt Details Body */}
        <div className="p-5 sm:p-6 space-y-4 print:p-0">
          
          {/* Rewards Callout if scratch card won */}
          {lastSuccessTxn.amount >= 100 && (
            <div 
              onClick={handleGoToRewards}
              className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl flex items-center justify-between cursor-pointer hover:shadow-xs transition-shadow"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                  <Gift className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-xs font-bold text-amber-950">You've unlocked a Scratch Card!</span>
                  <p className="text-[10px] text-amber-700">Win up to ₹100 cashback in ARRAI Rewards</p>
                </div>
              </div>
              <span className="text-xs font-bold text-amber-800 flex items-center">
                Scratch <ArrowRight className="w-3.5 h-3.5 ml-1" />
              </span>
            </div>
          )}

          {/* Audit breakdown table */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2.5 text-xs">
            
            <div className="flex items-center justify-between">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono font-bold text-slate-800 text-[11px]">{lastSuccessTxn.id}</span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">UTR / Bank Ref No.</span>
              <div className="flex items-center gap-1">
                <span className="font-mono font-bold text-slate-800">{lastSuccessTxn.utr}</span>
                <button
                  onClick={handleCopyUtr}
                  className="p-1 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Copy UTR"
                >
                  {copiedUtr ? <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Date & Time</span>
              <span className="font-medium text-slate-700">
                {new Date(lastSuccessTxn.timestamp).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric'
                })} at {new Date(lastSuccessTxn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <span className="text-slate-500">Payment Mode</span>
              <span className="font-semibold text-slate-800">
                {lastSuccessTxn.paymentMethod === 'ARRAI_WALLET' ? 'ARRAI Wallet' : 'UPI (State Bank of India)'}
              </span>
            </div>

            {lastSuccessTxn.recipientVpa && (
              <div className="flex items-center justify-between">
                <span className="text-slate-500">Paid to UPI ID</span>
                <span className="font-mono text-indigo-700 font-semibold">{lastSuccessTxn.recipientVpa}</span>
              </div>
            )}

            {lastSuccessTxn.receiptNote && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-[11px]">
                <span className="text-slate-500">Note:</span>
                <span className="italic text-slate-700">{lastSuccessTxn.receiptNote}</span>
              </div>
            )}

          </div>

          {/* Action Buttons: Download receipt & Share to WhatsApp */}
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={handleShareWhatsApp}
              className="py-2.5 px-3 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 text-emerald-800 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Share2 className="w-3.5 h-3.5" />
              WhatsApp Share
            </button>

            <button
              onClick={handlePrintReceipt}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Receipt PDF
            </button>
          </div>

          {/* Done Button */}
          <button
            onClick={closeModal}
            className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-2xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all"
          >
            Done
          </button>

          {/* NPCI Trust Footer */}
          <div className="pt-1 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-500" />
            <span>NPCI UPI 2.0 Realtime Settlement Confirmed</span>
          </div>

        </div>

      </div>
    </div>
  );
};
