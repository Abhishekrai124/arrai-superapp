import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, 
  Copy, 
  Check, 
  Download, 
  Share2, 
  Sparkles, 
  ShieldCheck, 
  QrCode as QrIcon 
} from 'lucide-react';

export const MyQrModal: React.FC = () => {
  const { activeModal, closeModal, userProfile } = useAppStore();
  const [copied, setCopied] = useState(false);
  const [customAmount, setCustomAmount] = useState('');
  const [showAmountInput, setShowAmountInput] = useState(false);

  if (activeModal !== 'myQr') return null;

  const vpa = userProfile.vpa;
  const name = userProfile.name;

  const upiUrl = `upi://pay?pa=${vpa}&pn=${encodeURIComponent(name)}${customAmount ? `&am=${customAmount}` : ''}&cu=INR`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(upiUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'Pay me on ARRAI Pay',
        text: `Scan my UPI QR or pay directly to ${vpa}`,
        url: upiUrl
      }).catch(() => {});
    } else {
      handleCopyLink();
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-sm bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
        
        {/* Top Header */}
        <div className="p-4 bg-gradient-to-r from-indigo-700 to-indigo-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <QrIcon className="w-4 h-4 text-white" />
            </div>
            <h3 className="text-xs font-bold uppercase tracking-wider">My ARRAI UPI QR</h3>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* QR Card Body */}
        <div className="p-6 text-center space-y-4">
          
          {/* User ID & Photo */}
          <div className="flex flex-col items-center">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white font-black text-xl flex items-center justify-center shadow-md mb-2">
              AR
            </div>
            <h2 className="text-base font-bold text-slate-900">{name}</h2>
            <div className="inline-flex items-center gap-1 mt-0.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-xs font-mono font-semibold text-slate-700">
              <span>{vpa}</span>
            </div>
          </div>

          {/* Realistic Rendered QR Code */}
          <div className="relative mx-auto w-52 h-52 p-3 bg-white border-2 border-dashed border-indigo-300 rounded-3xl shadow-md flex items-center justify-center">
            {/* SVG QR Code Pattern */}
            <svg viewBox="0 0 100 100" className="w-full h-full text-slate-900 fill-current">
              {/* Corner position markers */}
              <rect x="5" y="5" width="25" height="25" rx="4" fill="#1e1b4b" />
              <rect x="9" y="9" width="17" height="17" rx="2" fill="white" />
              <rect x="13" y="13" width="9" height="9" rx="1" fill="#4338ca" />

              <rect x="70" y="5" width="25" height="25" rx="4" fill="#1e1b4b" />
              <rect x="74" y="9" width="17" height="17" rx="2" fill="white" />
              <rect x="78" y="13" width="9" height="9" rx="1" fill="#4338ca" />

              <rect x="5" y="70" width="25" height="25" rx="4" fill="#1e1b4b" />
              <rect x="9" y="74" width="17" height="17" rx="2" fill="white" />
              <rect x="13" y="78" width="9" height="9" rx="1" fill="#4338ca" />

              {/* Data modules */}
              <rect x="35" y="10" width="5" height="5" />
              <rect x="45" y="10" width="5" height="5" />
              <rect x="55" y="10" width="5" height="5" />
              <rect x="35" y="20" width="5" height="5" />
              <rect x="50" y="25" width="5" height="5" />
              <rect x="60" y="20" width="5" height="5" />

              <rect x="10" y="35" width="5" height="5" />
              <rect x="20" y="45" width="5" height="5" />
              <rect x="25" y="55" width="5" height="5" />
              <rect x="15" y="50" width="5" height="5" />

              <rect x="70" y="35" width="5" height="5" />
              <rect x="80" y="45" width="5" height="5" />
              <rect x="85" y="55" width="5" height="5" />
              <rect x="75" y="50" width="5" height="5" />

              <rect x="35" y="75" width="5" height="5" />
              <rect x="45" y="80" width="5" height="5" />
              <rect x="55" y="70" width="5" height="5" />
              <rect x="60" y="85" width="5" height="5" />

              {/* Center Logo badge */}
              <rect x="40" y="40" width="20" height="20" rx="4" fill="#4338ca" />
              <text x="50" y="54" fontSize="11" fontWeight="bold" fill="white" textAnchor="middle">AP</text>
            </svg>

            {customAmount && (
              <div className="absolute -bottom-3 bg-emerald-600 text-white text-xs font-mono font-bold px-3 py-1 rounded-full shadow-md">
                Requesting: ₹{customAmount}
              </div>
            )}
          </div>

          {/* Set Fixed Amount Toggle */}
          <div className="pt-1">
            {!showAmountInput ? (
              <button
                type="button"
                onClick={() => setShowAmountInput(true)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800"
              >
                + Set amount to request
              </button>
            ) : (
              <div className="flex items-center gap-2">
                <input
                  type="number"
                  placeholder="Enter amount (e.g. 500)"
                  value={customAmount}
                  onChange={(e) => setCustomAmount(e.target.value)}
                  className="flex-1 px-3 py-1.5 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-800"
                />
                <button
                  onClick={() => setShowAmountInput(false)}
                  className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-xs font-semibold rounded-xl text-slate-600"
                >
                  Clear
                </button>
              </div>
            )}
          </div>

          {/* Action buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2">
            <button
              onClick={handleCopyLink}
              className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copied VPA' : 'Copy UPI Link'}
            </button>

            <button
              onClick={handleShare}
              className="py-2.5 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-xs"
            >
              <Share2 className="w-4 h-4" />
              Share QR
            </button>
          </div>

          <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-slate-400">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Accepts ARRAI Pay, BHIM & All UPI Banks</span>
          </div>

        </div>

      </div>
    </div>
  );
};
