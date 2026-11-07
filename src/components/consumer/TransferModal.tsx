import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, 
  UserCheck, 
  AtSign, 
  Building2, 
  ArrowRight, 
  Search, 
  CheckCircle2, 
  Wallet,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { PaymentMethodType } from '../../types';

export const TransferModal: React.FC = () => {
  const { 
    activeModal, 
    closeModal, 
    draftPayment, 
    contacts, 
    openModal, 
    walletBalance, 
    primaryBank 
  } = useAppStore();

  const [tab, setTab] = useState<'contact' | 'vpa' | 'self'>('contact');
  const [recipientName, setRecipientName] = useState('');
  const [recipientVpa, setRecipientVpa] = useState('');
  const [amount, setAmount] = useState('500');
  const [note, setNote] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('ARRAI_WALLET');
  const [searchQuery, setSearchQuery] = useState('');
  const [validationError, setValidationError] = useState<string | null>(null);

  // Sync draft data if passed when opening modal
  useEffect(() => {
    if (draftPayment) {
      if (draftPayment.targetType) setTab(draftPayment.targetType);
      if (draftPayment.recipientName) setRecipientName(draftPayment.recipientName);
      if (draftPayment.recipientVpa) setRecipientVpa(draftPayment.recipientVpa);
      if (draftPayment.amount) setAmount(draftPayment.amount.toString());
      if (draftPayment.note) setNote(draftPayment.note);
    }
  }, [draftPayment, activeModal]);

  if (activeModal !== 'transfer') return null;

  const quickPills = [100, 500, 1000, 2500];

  const handleSelectContact = (c: any) => {
    setRecipientName(c.name);
    setRecipientVpa(c.vpa);
    setValidationError(null);
  };

  const handleProceedToPin = (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    const val = parseFloat(amount);
    if (!val || val <= 0) {
      setValidationError('Please enter a valid amount');
      return;
    }

    if (paymentMethod === 'ARRAI_WALLET' && walletBalance < val) {
      setValidationError(`Insufficient ARRAI Wallet balance (₹${walletBalance}). Select your linked bank account or add money.`);
      return;
    }

    let finalName = recipientName;
    let finalVpa = recipientVpa;

    if (tab === 'self') {
      finalName = 'Self (HDFC Bank)';
      finalVpa = 'self.hdfc@arraipay';
    } else if (tab === 'vpa') {
      if (!finalVpa.includes('@')) {
        setValidationError('Please enter a valid UPI ID (e.g. name@okhdfcbank or user@arraipay)');
        return;
      }
      if (!finalName) {
        finalName = finalVpa.split('@')[0];
      }
    } else if (tab === 'contact') {
      if (!finalName) {
        setValidationError('Please select or enter a contact');
        return;
      }
      if (!finalVpa) {
        finalVpa = finalName.toLowerCase().replace(/\s+/g, '') + '@arraipay';
      }
    }

    // Open authentic UPI MPIN Pad with populated draft
    openModal('upiPin', {
      recipientName: finalName,
      recipientVpa: finalVpa,
      amount: val,
      note: note || 'Payment via ARRAI Pay',
      paymentMethod
    });
  };

  const filteredContacts = contacts.filter(c => 
    c.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    c.phone.includes(searchQuery) ||
    c.vpa.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-700 to-indigo-800 text-white shrink-0">
          <div>
            <h3 className="font-bold text-sm">Send Money via UPI</h3>
            <p className="text-[11px] text-indigo-100">Fast, instant & zero transaction fee</p>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="grid grid-cols-3 border-b border-slate-200 bg-slate-50 shrink-0">
          <button
            onClick={() => { setTab('contact'); setValidationError(null); }}
            className={`py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === 'contact' 
                ? 'border-indigo-600 text-indigo-700 bg-white' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <UserCheck className="w-3.5 h-3.5" />
            Contact
          </button>
          <button
            onClick={() => { setTab('vpa'); setValidationError(null); }}
            className={`py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === 'vpa' 
                ? 'border-indigo-600 text-indigo-700 bg-white' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <AtSign className="w-3.5 h-3.5" />
            UPI ID / VPA
          </button>
          <button
            onClick={() => { setTab('self'); setValidationError(null); }}
            className={`py-3 text-xs font-bold flex items-center justify-center gap-1.5 border-b-2 transition-all ${
              tab === 'self' 
                ? 'border-indigo-600 text-indigo-700 bg-white' 
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            To Self A/C
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleProceedToPin} className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {validationError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* TAB 1: Contacts list */}
          {tab === 'contact' && (
            <div className="space-y-3">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search name, phone or UPI ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              {/* Selected contact badge */}
              {recipientName && (
                <div className="p-2.5 bg-indigo-50 border border-indigo-200 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <div>
                      <span className="text-xs font-bold text-indigo-950 block">{recipientName}</span>
                      <span className="text-[10px] text-indigo-700 font-mono">{recipientVpa}</span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => { setRecipientName(''); setRecipientVpa(''); }}
                    className="text-xs font-semibold text-slate-400 hover:text-slate-600"
                  >
                    Change
                  </button>
                </div>
              )}

              {/* Contacts Pick list */}
              <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                {filteredContacts.map((c) => (
                  <div
                    key={c.id}
                    onClick={() => handleSelectContact(c)}
                    className={`flex items-center justify-between p-2 rounded-xl cursor-pointer border transition-all ${
                      recipientVpa === c.vpa
                        ? 'bg-indigo-50/70 border-indigo-400'
                        : 'border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <img src={c.avatar} alt={c.name} className="w-8 h-8 rounded-full object-cover" />
                      <div>
                        <div className="flex items-center gap-1">
                          <span className="text-xs font-bold text-slate-800">{c.name}</span>
                          {c.isVerified && <span className="text-[9px] bg-emerald-100 text-emerald-700 px-1 rounded">UPI</span>}
                        </div>
                        <span className="text-[10px] text-slate-500 font-mono">{c.phone}</span>
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{c.vpa}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: Direct UPI ID */}
          {tab === 'vpa' && (
            <div className="space-y-3">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Recipient UPI ID / VPA
                </label>
                <input
                  type="text"
                  placeholder="e.g. rohan@okhdfcbank or merchant@paytm"
                  value={recipientVpa}
                  onChange={(e) => setRecipientVpa(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                  Recipient Name (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Rohan Mehta"
                  value={recipientName}
                  onChange={(e) => setRecipientName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Self Bank Account */}
          {tab === 'self' && (
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 space-y-2">
              <span className="text-xs font-bold text-slate-700">Transfer from State Bank of India to:</span>
              <div className="p-3 bg-white rounded-xl border border-indigo-200 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-lg bg-indigo-900 text-white font-bold text-xs flex items-center justify-center">
                    HDFC
                  </div>
                  <div>
                    <span className="text-xs font-bold text-slate-900 block">HDFC Bank A/C</span>
                    <span className="text-[10px] text-slate-500 font-mono">•••• 9104 (IFSC: HDFC0000412)</span>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-600">Verified</span>
              </div>
            </div>
          )}

          {/* Amount Input */}
          <div className="pt-2">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Transfer Amount
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

          {/* Quick Amount Pills */}
          <div className="grid grid-cols-4 gap-2">
            {quickPills.map((val) => (
              <button
                type="button"
                key={val}
                onClick={() => setAmount(val.toString())}
                className={`py-1.5 text-xs font-bold rounded-xl border transition-all ${
                  amount === val.toString()
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-700'
                    : 'bg-white border-slate-200 text-slate-600 hover:border-slate-300'
                }`}
              >
                ₹{val}
              </button>
            ))}
          </div>

          {/* Optional Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Add a Note
            </label>
            <input
              type="text"
              placeholder="What's this payment for? (e.g. Dinner, rent, groceries)"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          {/* Payment Method Selector */}
          <div className="pt-2">
            <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Pay From
            </span>
            <div className="grid grid-cols-2 gap-2">
              <label 
                className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'ARRAI_WALLET'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Wallet className="w-4 h-4 text-indigo-600" />
                  <input
                    type="radio"
                    name="method"
                    checked={paymentMethod === 'ARRAI_WALLET'}
                    onChange={() => setPaymentMethod('ARRAI_WALLET')}
                    className="text-indigo-600"
                  />
                </div>
                <span className="text-xs font-bold text-slate-900">ARRAI Wallet</span>
                <span className="text-[10px] text-slate-500 font-mono">Bal: ₹{walletBalance.toLocaleString('en-IN')}</span>
              </label>

              <label 
                className={`p-3 rounded-2xl border cursor-pointer flex flex-col justify-between transition-all ${
                  paymentMethod === 'BANK_ACCOUNT'
                    ? 'border-indigo-600 bg-indigo-50/50 ring-1 ring-indigo-500'
                    : 'border-slate-200 bg-white hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <Building2 className="w-4 h-4 text-blue-600" />
                  <input
                    type="radio"
                    name="method"
                    checked={paymentMethod === 'BANK_ACCOUNT'}
                    onChange={() => setPaymentMethod('BANK_ACCOUNT')}
                    className="text-indigo-600"
                  />
                </div>
                <span className="text-xs font-bold text-slate-900 truncate">{primaryBank.bankName}</span>
                <span className="text-[10px] text-slate-500 font-mono">A/C •••• {primaryBank.accountLast4}</span>
              </label>
            </div>
          </div>

          {/* Submit -> Launches UPI MPIN Pad */}
          <button
            type="submit"
            className="w-full mt-3 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-2xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
          >
            <span>Proceed to Enter UPI PIN</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>NPCI Unified Payments Interface Certified</span>
          </div>

        </form>

      </div>
    </div>
  );
};
