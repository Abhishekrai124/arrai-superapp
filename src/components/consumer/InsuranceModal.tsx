import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';
import { Shield, X, CheckCircle2, ShieldCheck, Bike, Car, HeartPulse, Lock } from 'lucide-react';

export const InsuranceModal: React.FC = () => {
  const { activeModal, closeModal } = useAppStore();
  const [selectedPlan, setSelectedPlan] = useState<'bike' | 'car' | 'health' | 'cyber'>('bike');
  const [vehicleNumber, setVehicleNumber] = useState('KA-05-AB-1234');
  const [isPurchased, setIsPurchased] = useState(false);

  if (activeModal !== 'insurance') return null;

  const plans = [
    {
      id: 'bike' as const,
      title: 'Bike Insurance',
      icon: Bike,
      price: 499,
      period: 'yr',
      coverage: 'Comprehensive Cover + Personal Accident ₹15 Lakhs'
    },
    {
      id: 'car' as const,
      title: 'Car Insurance',
      icon: Car,
      price: 1999,
      period: 'yr',
      coverage: 'Zero Depreciation + 24x7 Roadside Assistance'
    },
    {
      id: 'health' as const,
      title: 'Health Super Topup',
      icon: HeartPulse,
      price: 350,
      period: 'mo',
      coverage: '₹5 Lakhs Hospitalization Cover • Cashless across 10,000+ Hospitals'
    },
    {
      id: 'cyber' as const,
      title: 'Cyber Fraud Protection',
      icon: Lock,
      price: 49,
      period: 'mo',
      coverage: '₹1 Lakh UPI / Phishing / Wallet Theft Insurance'
    }
  ];

  const currentPlan = plans.find(p => p.id === selectedPlan) || plans[0];

  const handleBuy = () => {
    soundEngine.playSuccessChime();
    setIsPurchased(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-in fade-in">
      <div className="bg-white w-full max-w-md rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-800 to-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/20 text-teal-300 border border-teal-400/30 flex items-center justify-center">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base">ARRAI Insurance Suite</h3>
                <span className="bg-teal-500/20 text-teal-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-teal-500/30">
                  IRDAI Approved
                </span>
              </div>
              <p className="text-xs text-teal-200">Instant Paperless Policy in 60 Seconds</p>
            </div>
          </div>
          <button 
            onClick={() => { setIsPurchased(false); closeModal(); }}
            className="p-1.5 rounded-full hover:bg-white/10 text-slate-300 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {isPurchased ? (
          <div className="p-6 text-center space-y-4 animate-in zoom-in-95">
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="w-10 h-10" />
            </div>
            <div>
              <h4 className="text-xl font-black text-slate-900">Policy Issued Successfully!</h4>
              <p className="text-xs text-slate-500 mt-1">
                Your {currentPlan.title} policy is active. Policy documents saved to ARRAI DigiLocker.
              </p>
            </div>
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-left font-mono space-y-1">
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Policy Number:</span>
                <span className="font-bold text-slate-800">POL-ARRAI-{Date.now().toString().slice(-6)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-sans">Premium Paid:</span>
                <span className="font-bold text-teal-700">₹{currentPlan.price}/{currentPlan.period}</span>
              </div>
            </div>
            <button
              onClick={() => { setIsPurchased(false); closeModal(); }}
              className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
            >
              Done
            </button>
          </div>
        ) : (
          <div className="p-5 space-y-4">
            {/* Plan Selector Grid */}
            <div className="grid grid-cols-2 gap-2">
              {plans.map(p => {
                const Icon = p.icon;
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlan(p.id)}
                    className={`p-3 rounded-2xl border text-left transition-all ${
                      selectedPlan === p.id 
                        ? 'border-teal-600 bg-teal-50/50 shadow-xs' 
                        : 'border-slate-200 bg-slate-50 hover:bg-slate-100'
                    }`}
                  >
                    <Icon className={`w-5 h-5 mb-1.5 ${selectedPlan === p.id ? 'text-teal-700' : 'text-slate-500'}`} />
                    <span className="font-bold text-xs text-slate-900 block truncate">{p.title}</span>
                    <span className="text-[11px] font-black text-teal-700 font-mono mt-0.5 block">
                      ₹{p.price}/{p.period}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Coverage Details */}
            <div className="p-4 rounded-2xl bg-teal-50/60 border border-teal-100 space-y-1.5 text-xs">
              <span className="font-bold text-teal-900 block">Coverage Highlights:</span>
              <p className="text-slate-700">{currentPlan.coverage}</p>
            </div>

            {/* Vehicle Number Input if applicable */}
            {(selectedPlan === 'bike' || selectedPlan === 'car') && (
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Vehicle Registration Number</label>
                <input
                  type="text"
                  value={vehicleNumber}
                  onChange={(e) => setVehicleNumber(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 font-mono text-xs uppercase font-bold text-slate-800"
                />
              </div>
            )}

            {/* Buy Button */}
            <button
              onClick={handleBuy}
              className="w-full py-3.5 bg-gradient-to-r from-teal-700 to-emerald-700 hover:from-teal-600 hover:to-emerald-600 active:scale-98 text-white rounded-2xl text-xs font-bold shadow-md shadow-teal-500/20 transition-all flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>Pay ₹{currentPlan.price} & Activate Policy</span>
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
