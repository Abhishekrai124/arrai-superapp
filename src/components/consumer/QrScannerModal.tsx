import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, 
  Flashlight, 
  Camera, 
  Image as ImageIcon, 
  Sparkles, 
  QrCode, 
  Check, 
  ShieldCheck,
  Upload,
  ArrowRight,
  Store,
  Loader2
} from 'lucide-react';

export const QrScannerModal: React.FC = () => {
  const { activeModal, closeModal, openModal } = useAppStore();
  const [torchOn, setTorchOn] = useState(false);
  const [cameraFacing, setCameraFacing] = useState<'back' | 'front'>('back');
  const [customPayee, setCustomPayee] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isUploading, setIsUploading] = useState(false);

  if (activeModal !== 'qrScanner') return null;

  const mockPresets = [
    {
      name: 'Chai Point Express',
      vpa: 'chaipoint.koramangala@arrai',
      amount: 85,
      note: 'Cutting Chai & Bun Maska'
    },
    {
      name: 'Kiran Kirana Store',
      vpa: 'kirankirana@kotak',
      amount: 340,
      note: 'Daily Groceries & Milk'
    },
    {
      name: 'Priya Patel',
      vpa: 'priya.patel@arrai',
      amount: 500,
      note: 'Cafe Share'
    },
    {
      name: 'Starbucks Coffee',
      vpa: 'starbucks.india@arrai',
      amount: 290,
      note: 'Caramel Macchiato'
    }
  ];

  const handleSimulateScan = (preset: typeof mockPresets[0]) => {
    openModal('upiPin', {
      recipientName: preset.name,
      recipientVpa: preset.vpa,
      amount: preset.amount,
      note: preset.note,
      paymentMethod: 'ARRAI_WALLET'
    });
  };

  const handleCustomScanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = parseFloat(customAmount);
    if (!amt || amt <= 0) return;
    const payee = customPayee.trim() || 'Scanned Merchant';

    openModal('upiPin', {
      recipientName: payee,
      recipientVpa: payee.toLowerCase().replace(/\s+/g, '') + '@arrai',
      amount: amt,
      note: 'QR Payment to ' + payee,
      paymentMethod: 'ARRAI_WALLET'
    });
  };

  const handleUploadGallery = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      openModal('upiPin', {
        recipientName: 'Bengaluru Cafe & Bistro',
        recipientVpa: 'bengalurucafe@arrai',
        amount: 320,
        note: 'Gallery QR Scan: Breakfast & Dosa',
        paymentMethod: 'ARRAI_WALLET'
      });
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div className="w-full max-w-md bg-slate-950 text-white rounded-3xl shadow-2xl border border-slate-800 overflow-hidden flex flex-col max-h-[94vh]">
        
        {/* Top Controls */}
        <div className="p-4 flex items-center justify-between border-b border-slate-900 bg-slate-950/80">
          <div className="flex items-center gap-2">
            <QrCode className="w-5 h-5 text-indigo-400" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-200">
              ARRAI Bharat QR Scanner
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setTorchOn(!torchOn)}
              className={`p-2 rounded-xl border transition-colors ${
                torchOn ? 'bg-amber-500/30 text-amber-300 border-amber-500/50 shadow-md shadow-amber-500/20' : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
              title="Toggle Flashlight"
            >
              <Flashlight className="w-4 h-4" />
            </button>

            <button
              onClick={() => setCameraFacing(cameraFacing === 'back' ? 'front' : 'back')}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
              title="Flip Camera"
            >
              <Camera className="w-4 h-4" />
            </button>

            <button
              onClick={closeModal}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Viewfinder Camera Simulation */}
        <div className="relative flex-1 min-h-[260px] bg-slate-900 flex items-center justify-center overflow-hidden">
          
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/60 to-slate-950" />

          {/* Flashlight beam simulation */}
          {torchOn && (
            <div className="absolute inset-0 bg-amber-100/15 pointer-events-none transition-opacity" />
          )}

          {/* Viewfinder Box */}
          <div className="relative w-60 h-60 border-2 border-indigo-500/80 rounded-3xl overflow-hidden flex items-center justify-center shadow-2xl shadow-indigo-500/20">
            {/* Corner Markers */}
            <div className="absolute top-2 left-2 w-6 h-6 border-t-4 border-l-4 border-indigo-400 rounded-tl-lg" />
            <div className="absolute top-2 right-2 w-6 h-6 border-t-4 border-r-4 border-indigo-400 rounded-tr-lg" />
            <div className="absolute bottom-2 left-2 w-6 h-6 border-b-4 border-l-4 border-indigo-400 rounded-bl-lg" />
            <div className="absolute bottom-2 right-2 w-6 h-6 border-b-4 border-r-4 border-indigo-400 rounded-br-lg" />

            {/* Scanning Laser Line */}
            <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-indigo-400 to-transparent shadow-lg shadow-indigo-500 animate-bounce duration-1000" />

            <div className="text-center p-4">
              <QrCode className="w-14 h-14 mx-auto text-indigo-400/40 stroke-1 mb-2 animate-pulse" />
              <p className="text-xs text-slate-400 font-medium">Align any UPI / Bharat QR code inside the frame</p>
            </div>
          </div>

          {/* Bottom Viewfinder Pill */}
          <div className="absolute bottom-3 inset-x-0 flex justify-center gap-2">
            <button
              onClick={handleUploadGallery}
              disabled={isUploading}
              className="text-[11px] font-bold text-white bg-slate-900/90 hover:bg-slate-800 px-3.5 py-1.5 rounded-full border border-slate-700 flex items-center gap-1.5 shadow-md active:scale-95 transition-all"
            >
              {isUploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ImageIcon className="w-3.5 h-3.5 text-indigo-400" />}
              Upload QR from Gallery
            </button>
          </div>
        </div>

        {/* Quick Simulation & Custom Scan Container */}
        <div className="p-4 bg-slate-950 border-t border-slate-900 space-y-3 overflow-y-auto max-h-[300px]">
          
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              Tap to Test Scan Preset
            </span>
            <button
              onClick={() => openModal('myQr')}
              className="text-xs font-semibold text-indigo-400 hover:text-indigo-300"
            >
              Show My QR
            </button>
          </div>

          {/* Presets Grid */}
          <div className="grid grid-cols-2 gap-2">
            {mockPresets.map((preset, i) => (
              <button
                key={i}
                onClick={() => handleSimulateScan(preset)}
                className="p-2.5 rounded-2xl bg-slate-900 border border-slate-800 hover:border-indigo-500 hover:bg-slate-850 active:scale-95 transition-all text-left group"
              >
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold text-slate-200 block truncate group-hover:text-indigo-400">
                    {preset.name}
                  </span>
                  <span className="text-xs font-mono font-black text-emerald-400">
                    ₹{preset.amount}
                  </span>
                </div>
                <span className="text-[9px] text-slate-500 truncate block mt-0.5">
                  {preset.note}
                </span>
              </button>
            ))}
          </div>

          {/* Custom QR Scan Form */}
          <form onSubmit={handleCustomScanSubmit} className="pt-2 border-t border-slate-900 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block">
              Or Scan Custom Merchant / Amount:
            </span>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Shop / Merchant name (e.g. Cafe)"
                value={customPayee}
                onChange={(e) => setCustomPayee(e.target.value)}
                className="flex-1 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs text-white"
              />
              <input
                type="number"
                placeholder="₹ Amount"
                value={customAmount}
                onChange={(e) => setCustomAmount(e.target.value)}
                className="w-24 px-3 py-1.5 bg-slate-900 border border-slate-800 rounded-xl text-xs font-mono font-bold text-white"
                required
              />
              <button
                type="submit"
                className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-xs font-bold shrink-0"
              >
                Pay
              </button>
            </div>
          </form>

          <div className="pt-1 flex items-center justify-center gap-1.5 text-[10px] text-slate-500">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
            <span>NPCI Interoperable QR Standards Compliant</span>
          </div>
        </div>

      </div>
    </div>
  );
};
