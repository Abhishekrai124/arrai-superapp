import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, 
  CreditCard, 
  QrCode, 
  Building2, 
  Wallet, 
  Lock, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  ShieldCheck,
  RefreshCw
} from 'lucide-react';

export const CheckoutModal: React.FC = () => {
  const { activeModal, closeModal, executeGatewayCheckout, isProcessing } = useAppStore();

  const [method, setMethod] = useState<'UPI' | 'CARD' | 'NETBANKING' | 'WALLET'>('UPI');
  const [step, setStep] = useState<'select_method' | 'bank_otp' | 'result'>('select_method');
  
  // Form fields
  const [amount] = useState(1499.00);
  const [customerName] = useState('Gaurav Kumar');
  const [customerEmail] = useState('gaurav.kumar@example.com');
  const [customerPhone] = useState('+91 98765 43210');
  
  // Card inputs
  const [cardNumber, setCardNumber] = useState('4532 8920 1823 4819');
  const [cardExpiry, setCardExpiry] = useState('11/28');
  const [cardCvv, setCardCvv] = useState('821');

  // UPI inputs
  const [upiVpa, setUpiVpa] = useState('gaurav@okhdfcbank');

  // Netbanking
  const [selectedBank, setSelectedBank] = useState('HDFC Bank');

  // OTP Screen
  const [otp, setOtp] = useState('123456');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);

  if (activeModal !== 'merchantCheckout') return null;

  const handleProceedToOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setStep('bank_otp');
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    const res = await executeGatewayCheckout({
      amount,
      currency: 'INR',
      orderId: 'order_ARR_' + Math.floor(100000 + Math.random() * 900000),
      customerName,
      customerEmail,
      customerPhone,
      paymentMethod: method,
      otpEntered: otp
    });

    if (res.success) {
      setCheckoutSuccess(true);
      setStep('result');
    } else {
      setErrorMsg(res.error || 'Bank Authentication Failed');
      setCheckoutSuccess(false);
      setStep('result');
    }
  };

  const handleReset = () => {
    setStep('select_method');
    setErrorMsg(null);
    setCheckoutSuccess(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Top Razorpay Style Navy Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 flex items-center justify-center font-black text-slate-950 text-sm shadow-md">
              AP
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-sm tracking-tight text-white">ARRAI Standard Checkout</span>
                <span className="bg-emerald-500/20 text-emerald-300 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                  Secure 256-bit
                </span>
              </div>
              <p className="text-[11px] text-slate-400">Order #order_ARR_89210 • ARRAI Tech Store</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <span className="text-[10px] text-slate-400 block uppercase">Amount to Pay</span>
              <span className="text-base font-black font-mono text-emerald-400">
                ₹{amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
              </span>
            </div>

            <button
              onClick={closeModal}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 flex-1 overflow-y-auto">
          
          {/* STEP 1: Select Payment Method & Details */}
          {step === 'select_method' && (
            <form onSubmit={handleProceedToOtp} className="space-y-4">
              
              {/* Tabs for Payment Methods */}
              <div className="grid grid-cols-4 gap-1.5 p-1 bg-slate-100 rounded-2xl border border-slate-200">
                <button
                  type="button"
                  onClick={() => setMethod('UPI')}
                  className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
                    method === 'UPI' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <QrCode className="w-4 h-4" />
                  UPI / QR
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('CARD')}
                  className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
                    method === 'CARD' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  Card
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('NETBANKING')}
                  className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
                    method === 'NETBANKING' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4" />
                  NetBanking
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('WALLET')}
                  className={`py-2 text-xs font-bold rounded-xl flex flex-col items-center gap-1 transition-all ${
                    method === 'WALLET' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Wallet className="w-4 h-4" />
                  Wallet
                </button>
              </div>

              {/* METHOD 1: UPI Tab */}
              {method === 'UPI' && (
                <div className="space-y-3 pt-2">
                  <div className="p-3 bg-emerald-50/50 rounded-2xl border border-emerald-200 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <QrCode className="w-5 h-5 text-emerald-700" />
                      <div>
                        <span className="text-xs font-bold text-emerald-950 block">Scan QR with any UPI App</span>
                        <span className="text-[10px] text-emerald-700">PhonePe, GPay, Paytm, ARRAI Pay</span>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-emerald-700 bg-white px-2 py-1 rounded-lg border border-emerald-300">
                      Auto-Detect
                    </span>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Or Enter Virtual Payment Address (VPA)
                    </label>
                    <input
                      type="text"
                      value={upiVpa}
                      onChange={(e) => setUpiVpa(e.target.value)}
                      placeholder="e.g. mobile@okhdfcbank"
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                      required
                    />
                  </div>
                </div>
              )}

              {/* METHOD 2: Card Tab */}
              {method === 'CARD' && (
                <div className="space-y-3 pt-2">
                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        placeholder="•••• •••• •••• ••••"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                        required
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                        VISA
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        Expiry Date
                      </label>
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                        CVV / CVC
                      </label>
                      <input
                        type="password"
                        maxLength={4}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="•••"
                        className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* METHOD 3: NetBanking Tab */}
              {method === 'NETBANKING' && (
                <div className="space-y-3 pt-2">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Select NetBanking Bank
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {['HDFC Bank', 'State Bank of India', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Punjab National'].map((b) => (
                      <button
                        type="button"
                        key={b}
                        onClick={() => setSelectedBank(b)}
                        className={`p-2.5 rounded-xl border text-xs font-bold text-left transition-all ${
                          selectedBank === b 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 ring-1 ring-emerald-500' 
                            : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                        }`}
                      >
                        {b}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* METHOD 4: Wallet */}
              {method === 'WALLET' && (
                <div className="p-4 bg-indigo-50/70 border border-indigo-200 rounded-2xl text-xs text-indigo-900 space-y-1">
                  <span className="font-bold">ARRAI Pay PPI Wallet</span>
                  <p className="text-[11px] text-indigo-700">1-click frictionless authorization with zero OTP.</p>
                </div>
              )}

              {/* Customer details pill */}
              <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <span>Paying as: <strong>{customerName}</strong> ({customerPhone})</span>
                <span className="text-[10px] text-emerald-600 font-bold">Verified</span>
              </div>

              {/* Submit to Bank 3D Secure OTP Step */}
              <button
                type="submit"
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-slate-950 rounded-2xl font-black text-xs shadow-md shadow-emerald-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Bank 3D Secure Page (₹{amount})</span>
                <ArrowRight className="w-4 h-4 text-slate-950" />
              </button>

            </form>
          )}

          {/* STEP 2: Mock Bank 3D Secure OTP Screen */}
          {step === 'bank_otp' && (
            <form onSubmit={handleVerifyOtp} className="space-y-4">
              
              {/* Bank Simulator Banner */}
              <div className="p-4 rounded-2xl bg-slate-900 text-white space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-emerald-400">Mock Bank 3D Secure ACS</span>
                  <span className="font-mono text-slate-400 text-[10px]">Session ID: 9812-7721</span>
                </div>
                <p className="text-xs text-slate-300">
                  An OTP has been sent to your registered mobile number ending in <span className="font-mono font-bold text-white">43210</span>.
                </p>
                
                {/* Test Helper Guide */}
                <div className="mt-2 p-2.5 rounded-xl bg-slate-800 border border-slate-700 text-[11px] space-y-1">
                  <p className="font-bold text-amber-300">Test Credentials Guide:</p>
                  <p className="text-slate-300">
                    • Enter <code className="bg-emerald-950 text-emerald-300 px-1 py-0.5 rounded font-mono font-bold">123456</code> to trigger <strong>Payment Success + Webhook</strong>
                  </p>
                  <p className="text-slate-300">
                    • Enter <code className="bg-rose-950 text-rose-300 px-1 py-0.5 rounded font-mono font-bold">000000</code> to trigger <strong>Bank Decline Error</strong>
                  </p>
                </div>
              </div>

              {/* OTP Input */}
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Enter One Time Password (OTP)
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-2xl text-2xl font-mono font-black text-center tracking-widest text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              {/* Preset Buttons for Quick Testing */}
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setOtp('123456')}
                  className="py-2 px-3 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold text-center"
                >
                  Fill Success OTP (123456)
                </button>
                <button
                  type="button"
                  onClick={() => setOtp('000000')}
                  className="py-2 px-3 rounded-xl border border-rose-300 bg-rose-50 hover:bg-rose-100 text-rose-800 text-xs font-bold text-center"
                >
                  Fill Fail OTP (000000)
                </button>
              </div>

              {/* Submit Verification */}
              <button
                type="submit"
                disabled={isProcessing}
                className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-slate-950 rounded-2xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Authenticating with Issuing Bank...
                  </>
                ) : (
                  'Authorize Payment'
                )}
              </button>

              <button
                type="button"
                onClick={handleReset}
                className="w-full text-center text-xs font-semibold text-slate-500 hover:text-slate-800"
              >
                Cancel and return to payment methods
              </button>

            </form>
          )}

          {/* STEP 3: Result Screen (Success or Failed) */}
          {step === 'result' && (
            <div className="py-4 text-center space-y-4 animate-in zoom-in-95 duration-200">
              
              {checkoutSuccess ? (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                    <CheckCircle2 className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Payment Captured Successfully!</h3>
                  <p className="text-xs text-slate-600 max-w-sm mx-auto">
                    Amount of ₹{amount} has been credited to your merchant settlement pool. Webhook <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono font-bold">payment.captured</code> was dispatched.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  <div className="w-16 h-16 mx-auto rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shadow-lg shadow-rose-500/20">
                    <AlertCircle className="w-10 h-10" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900">Payment Authorization Failed</h3>
                  <p className="text-xs text-rose-600 max-w-sm mx-auto font-medium">
                    {errorMsg || 'Bank Authentication was declined (Code: 000000). Webhook payment.failed was dispatched.'}
                  </p>
                </div>
              )}

              <div className="pt-2 flex items-center justify-center gap-3">
                <button
                  onClick={handleReset}
                  className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  Try Another Payment
                </button>
                <button
                  onClick={closeModal}
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 rounded-xl text-xs font-black shadow-md transition-all"
                >
                  Done
                </button>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-50 border-t border-slate-100 text-center text-[10px] text-slate-400 flex items-center justify-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>PCI-DSS Level 1 Compliant • ARRAI Gateway Engine</span>
        </div>

      </div>
    </div>
  );
};
