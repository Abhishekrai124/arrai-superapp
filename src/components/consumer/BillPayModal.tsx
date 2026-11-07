import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  X, 
  Zap, 
  Smartphone, 
  Tv, 
  Car, 
  Wifi, 
  Flame, 
  Loader2, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Calendar,
  User,
  Wallet,
  Building2,
  AlertCircle
} from 'lucide-react';
import { apiService } from '../../services/api';
import { PaymentMethodType, TransactionCategory } from '../../types';

export const BillPayModal: React.FC = () => {
  const { activeModal, closeModal, draftPayment, openModal, walletBalance, primaryBank } = useAppStore();

  const category: TransactionCategory = (draftPayment?.category as TransactionCategory) || 'electricity';
  const serviceTitle = draftPayment?.serviceTitle || 'Utility Bill';

  const [operator, setOperator] = useState('');
  const [consumerNumber, setConsumerNumber] = useState('');
  const [isFetchingBill, setIsFetchingBill] = useState(false);
  const [billData, setBillData] = useState<any>(null);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethodType>('ARRAI_WALLET');
  const [fetchError, setFetchError] = useState<string | null>(null);

  if (activeModal !== 'billPay') return null;

  const operatorsByCategory: Record<string, string[]> = {
    electricity: ['Tata Power Mumbai', 'BESCOM Bangalore', 'Adani Electricity Mumbai', 'BSES Rajdhani Delhi', 'MSEB Maharashtra'],
    recharge: ['Jio Prepaid', 'Airtel Prepaid', 'Vodafone Idea (Vi)', 'BSNL Mobile'],
    dth: ['Tata Play (Tata Sky)', 'Airtel Digital TV', 'Dish TV India', 'Sun Direct'],
    fastag: ['ICICI Bank FASTag', 'ARRAI Bank FASTag', 'NHAI FASTag', 'SBI FASTag'],
    broadband: ['JioFiber Infocomm', 'Airtel Xstream Fiber', 'ACT Fibernet', 'Hathway Broadband'],
    gas: ['Mahanagar Gas Ltd (MGL)', 'Indraprastha Gas Ltd (IGL)', 'Adani Total Gas', 'Gujarat Gas']
  };

  const currentOperators = operatorsByCategory[category] || operatorsByCategory.electricity;

  const handleFetchBill = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!operator || !consumerNumber) {
      setFetchError('Please select an operator and enter your account/consumer ID');
      return;
    }

    setFetchError(null);
    setIsFetchingBill(true);

    try {
      const data = await apiService.fetchBillDetails(category, operator, consumerNumber);
      setBillData(data);
    } catch (err: any) {
      setFetchError('Failed to fetch bill from provider. Please check consumer ID.');
    } finally {
      setIsFetchingBill(false);
    }
  };

  const handleProceedToPin = () => {
    if (!billData) return;

    if (paymentMethod === 'ARRAI_WALLET' && walletBalance < billData.billAmount) {
      setFetchError(`Insufficient ARRAI Wallet balance (₹${walletBalance}). Switch to Bank A/C.`);
      return;
    }

    // Pass details to authentic UPI MPIN Pad
    openModal('upiPin', {
      recipientName: billData.operator,
      recipientVpa: `${operator.toLowerCase().replace(/\s+/g, '')}.bbps@arrai`,
      amount: billData.billAmount,
      note: `BBPS Bill Pay: ${billData.consumerNumber}`,
      paymentMethod,
      category,
      billDetails: {
        operator: billData.operator,
        consumerNumber: billData.consumerNumber,
        billPeriod: billData.billPeriod
      }
    });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4">
      <div className="w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in slide-in-from-bottom sm:zoom-in-95 duration-200 max-h-[92vh] flex flex-col">
        
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-indigo-700 to-indigo-800 text-white shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-lg bg-white/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-sm">Bharat BillPay (BBPS)</h3>
              <p className="text-[11px] text-indigo-100">{serviceTitle}</p>
            </div>
          </div>

          <button
            onClick={closeModal}
            className="p-1.5 rounded-lg text-indigo-200 hover:text-white hover:bg-white/10"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          
          {fetchError && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{fetchError}</span>
            </div>
          )}

          {!billData ? (
            /* Step 1: Select operator & Enter Number */
            <form onSubmit={handleFetchBill} className="space-y-4">
              
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Select Provider / Operator
                </label>
                <select
                  value={operator}
                  onChange={(e) => setOperator(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                >
                  <option value="">-- Choose Operator --</option>
                  {currentOperators.map((op) => (
                    <option key={op} value={op}>{op}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  {category === 'recharge' ? 'Mobile Number (10 Digits)' : 'Consumer Number / Account ID'}
                </label>
                <input
                  type="text"
                  placeholder={category === 'recharge' ? 'e.g. 9820149821' : 'e.g. 902819241 or CA Number'}
                  value={consumerNumber}
                  onChange={(e) => setConsumerNumber(e.target.value)}
                  className="w-full px-3.5 py-3 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                  required
                />
                <span className="text-[10px] text-slate-400 mt-1 block">
                  Find your consumer number on your recent physical or email bill
                </span>
              </div>

              <button
                type="submit"
                disabled={isFetchingBill || !operator || !consumerNumber}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-2xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isFetchingBill ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Fetching Live Bill from BBPS...
                  </>
                ) : (
                  <>
                    Fetch Bill & Due Amount
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* Step 2: Bill Summary & Pay */
            <div className="space-y-4 animate-in fade-in duration-200">
              
              <div className="p-4 rounded-2xl bg-indigo-50/60 border border-indigo-200 space-y-3">
                <div className="flex items-center justify-between border-b border-indigo-100 pb-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-bold text-indigo-950">{billData.operator}</span>
                  </div>
                  <button
                    onClick={() => setBillData(null)}
                    className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800"
                  >
                    Change
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Consumer Name</span>
                    <span className="font-bold text-slate-800">{billData.consumerName}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Consumer ID</span>
                    <span className="font-mono font-bold text-slate-800">{billData.consumerNumber}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Due Date</span>
                    <span className="font-semibold text-rose-600">{billData.dueDate}</span>
                  </div>
                  <div>
                    <span className="text-slate-500 block text-[10px] uppercase">Bill Period</span>
                    <span className="font-semibold text-slate-700">{billData.billPeriod}</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-indigo-100 flex items-baseline justify-between">
                  <span className="text-xs font-bold text-indigo-950">Total Bill Amount</span>
                  <span className="text-2xl font-black font-mono text-indigo-900">
                    ₹{billData.billAmount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {/* Payment Method Selector */}
              <div>
                <span className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Select Payment Account
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
                    <span className="text-[10px] text-slate-500 font-mono">•••• {primaryBank.accountLast4}</span>
                  </label>
                </div>
              </div>

              {/* Submit to PIN */}
              <button
                type="button"
                onClick={handleProceedToPin}
                className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 text-white rounded-2xl font-bold text-xs shadow-md shadow-indigo-600/20 transition-all flex items-center justify-center gap-2"
              >
                <span>Proceed to Pay ₹{billData.billAmount.toLocaleString('en-IN')}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

            </div>
          )}

          <div className="text-center text-[10px] text-slate-400 flex items-center justify-center gap-1 pt-2">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            <span>Bharat BillPay (BBPS) Guaranteed Instant Clearance</span>
          </div>

        </div>

      </div>
    </div>
  );
};
