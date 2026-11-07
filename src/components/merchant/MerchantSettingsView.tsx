import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';
import { 
  Building2, 
  ShieldCheck, 
  CreditCard, 
  Key, 
  Globe, 
  Bell, 
  Sliders, 
  Save, 
  Check, 
  Copy, 
  QrCode, 
  ExternalLink,
  Lock,
  Landmark,
  FileText
} from 'lucide-react';

export const MerchantSettingsView: React.FC = () => {
  const { isSandbox, setIsSandbox } = useAppStore();
  const [businessName, setBusinessName] = useState('ARRAI Technologies Private Limited');
  const [gstin, setGstin] = useState('07AAAAA0000A1Z5');
  const [settlementBank, setSettlementBank] = useState('HDFC Bank (•••• 4921)');
  const [settlementSchedule, setSettlementSchedule] = useState<'instant' | 't1'>('instant');
  const [upiIntentEnabled, setUpiIntentEnabled] = useState(true);
  const [cardSaveEnabled, setCardSaveEnabled] = useState(true);
  const [internationalCards, setInternationalCards] = useState(false);
  const [autoRefunds, setAutoRefunds] = useState(true);
  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    soundEngine.playSuccessChime();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  return (
    <div className="space-y-5">
      {saveToast && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow-xl animate-in fade-in flex items-center gap-2">
          <Check className="w-4 h-4 text-emerald-400" />
          <span>Merchant settings saved successfully!</span>
        </div>
      )}

      {/* Header */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-200 text-teal-700 flex items-center justify-center">
            <Building2 className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-black text-slate-900">Merchant Business & Gateway Settings</h2>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                KYC Verified
              </span>
            </div>
            <p className="text-xs text-slate-500">Configure business identity, instant settlement account, and ARRAI Gateway payment methods</p>
          </div>
        </div>

        <button
          onClick={handleSave}
          className="px-4 py-2 bg-teal-700 hover:bg-teal-600 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
        >
          <Save className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        
        {/* 1. Business Profile & KYC */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <FileText className="w-4 h-4 text-teal-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Business Profile & Legal</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Registered Business Name</label>
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-500 font-semibold block mb-1">GSTIN Number</label>
              <input
                type="text"
                value={gstin}
                onChange={(e) => setGstin(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-mono text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-500 font-semibold block mb-1">Merchant Account ID</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value="acc_arrai_merchant_01"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-100 font-mono text-slate-600"
                />
                <button 
                  onClick={() => navigator.clipboard.writeText('acc_arrai_merchant_01')}
                  className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-600"
                  title="Copy"
                >
                  <Copy className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Bank Settlement & Payouts */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Landmark className="w-4 h-4 text-emerald-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Bank Settlement & Payouts</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-500 font-semibold block mb-1">Primary Settlement Account</label>
              <input
                type="text"
                value={settlementBank}
                onChange={(e) => setSettlementBank(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 font-medium text-slate-800 focus:bg-white focus:ring-2 focus:ring-teal-500 outline-none"
              />
            </div>

            <div>
              <label className="text-slate-500 font-semibold block mb-1">Settlement Cycle</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setSettlementSchedule('instant')}
                  className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                    settlementSchedule === 'instant'
                      ? 'bg-emerald-50 border-emerald-400 text-emerald-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  ⚡ Instant (T+0)
                </button>
                <button
                  type="button"
                  onClick={() => setSettlementSchedule('t1')}
                  className={`py-2 px-3 rounded-xl border font-bold text-center transition-all ${
                    settlementSchedule === 't1'
                      ? 'bg-teal-50 border-teal-400 text-teal-800'
                      : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  Standard (T+1)
                </button>
              </div>
            </div>

            <div className="p-3 bg-emerald-50 rounded-2xl border border-emerald-200 text-[11px] text-emerald-800">
              <span className="font-bold block">✓ Instant Settlement Active</span>
              Payments captured via UPI and Cards are credited to your bank within 15 seconds.
            </div>
          </div>
        </div>

        {/* 3. Payment Methods & Gateways */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <CreditCard className="w-4 h-4 text-indigo-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Payment Methods Acceptance</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">UPI 2.0 & Dynamic QR Intent</span>
                <span className="text-[11px] text-slate-500">ARRAI Pay, BHIM & All Bank Handles</span>
              </div>
              <input
                type="checkbox"
                checked={upiIntentEnabled}
                onChange={(e) => setUpiIntentEnabled(e.target.checked)}
                className="rounded text-teal-600"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">Saved Cards & RuPay Credit on UPI</span>
                <span className="text-[11px] text-slate-500">Tokenized card storage compliant with RBI</span>
              </div>
              <input
                type="checkbox"
                checked={cardSaveEnabled}
                onChange={(e) => setCardSaveEnabled(e.target.checked)}
                className="rounded text-teal-600"
              />
            </label>

            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">International Cards & Forex</span>
                <span className="text-[11px] text-slate-500">Accept USD, EUR, GBP payments via ARRAI Global & Visa</span>
              </div>
              <input
                type="checkbox"
                checked={internationalCards}
                onChange={(e) => setInternationalCards(e.target.checked)}
                className="rounded text-teal-600"
              />
            </label>
          </div>
        </div>

        {/* 4. Automated Refunds & Environment */}
        <div className="bg-white rounded-3xl border border-slate-200 p-5 shadow-xs space-y-4">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-purple-600" />
            <h3 className="font-bold text-xs uppercase tracking-wider text-slate-700">Automation & Sandbox</h3>
          </div>

          <div className="space-y-3 text-xs">
            <label className="flex items-center justify-between p-2 rounded-xl hover:bg-slate-50 cursor-pointer">
              <div>
                <span className="font-bold text-slate-800 block">Instant Automated Refunds</span>
                <span className="text-[11px] text-slate-500">Auto-credit back to original source on dispute</span>
              </div>
              <input
                type="checkbox"
                checked={autoRefunds}
                onChange={(e) => setAutoRefunds(e.target.checked)}
                className="rounded text-teal-600"
              />
            </label>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Environment Mode</span>
                <span className="text-[11px] text-slate-500">{isSandbox ? 'Test Mode (Sandbox)' : 'Production (Live)'}</span>
              </div>
              <button
                type="button"
                onClick={() => setIsSandbox(!isSandbox)}
                className={`px-3 py-1.5 rounded-xl font-bold transition-all ${
                  isSandbox 
                    ? 'bg-amber-100 text-amber-800 border border-amber-300' 
                    : 'bg-emerald-600 text-white'
                }`}
              >
                {isSandbox ? 'Test' : 'Live'}
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
