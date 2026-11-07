import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { MerchantPayment } from '../../types';
import { 
  RotateCcw, 
  Search, 
  Filter, 
  Download, 
  CheckCircle2, 
  AlertCircle, 
  ArrowDownLeft, 
  X, 
  Loader2,
  ShieldCheck,
  CreditCard,
  Building2,
  QrCode
} from 'lucide-react';

export const MerchantTransactionsView: React.FC = () => {
  const { merchantPayments, executeMerchantRefund, isProcessing } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [filterMethod, setFilterMethod] = useState<string>('all');
  
  // Refund Modal State
  const [selectedPaymentForRefund, setSelectedPaymentForRefund] = useState<MerchantPayment | null>(null);
  const [refundReason, setRefundReason] = useState('Customer Return Request');
  const [refundSuccessMsg, setRefundSuccessMsg] = useState<string | null>(null);

  const filteredPayments = merchantPayments.filter(p => {
    if (filterMethod !== 'all' && p.method !== filterMethod) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      return (
        p.customerName.toLowerCase().includes(q) ||
        p.id.toLowerCase().includes(q) ||
        p.customerEmail.toLowerCase().includes(q) ||
        p.orderId.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleTriggerRefund = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPaymentForRefund) return;

    const ok = await executeMerchantRefund(
      selectedPaymentForRefund.id,
      selectedPaymentForRefund.amount,
      refundReason
    );

    if (ok) {
      setRefundSuccessMsg(`Refund of ₹${selectedPaymentForRefund.amount} processed successfully via instant bank reversal.`);
      setTimeout(() => {
        setSelectedPaymentForRefund(null);
        setRefundSuccessMsg(null);
      }, 1800);
    }
  };

  const getMethodBadge = (method: MerchantPayment['method']) => {
    if (method === 'UPI') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
          <QrCode className="w-3 h-3 text-emerald-600" /> UPI
        </span>
      );
    }
    if (method === 'CARD') {
      return (
        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-blue-800 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
          <CreditCard className="w-3 h-3 text-blue-600" /> Card
        </span>
      );
    }
    return (
      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded-md">
        <Building2 className="w-3 h-3" /> NetBanking
      </span>
    );
  };

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <RotateCcw className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight">Payments & Instant Refunds</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Audit customer payments, platform interchange fees, and initiate instant customer refunds.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-300 bg-emerald-900/40 px-3 py-2 rounded-xl border border-emerald-800">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Automated ARRAI PG Reconciled</span>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search payment ID, order ID, customer name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {['all', 'UPI', 'CARD', 'NETBANKING'].map((m) => (
            <button
              key={m}
              onClick={() => setFilterMethod(m)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                filterMethod === m
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {m}
            </button>
          ))}
        </div>

      </div>

      {/* Transactions Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Payment ID & Order</th>
                <th className="py-3 px-4">Customer</th>
                <th className="py-3 px-4">Method</th>
                <th className="py-3 px-4">Gross Amount</th>
                <th className="py-3 px-4">Fee (2%)</th>
                <th className="py-3 px-4">Net Settlement</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Refund Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredPayments.map((p) => {
                const isRefunded = p.status === 'refunded';
                return (
                  <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                    
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-slate-900 block">{p.id}</span>
                      <span className="text-[10px] text-slate-400">{p.orderId}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-800 block">{p.customerName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{p.customerEmail}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      {getMethodBadge(p.method)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-bold text-slate-900">
                      ₹{p.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4 font-mono text-slate-500">
                      ₹{p.fee.toFixed(2)}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-black text-emerald-700">
                      ₹{p.net.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        isRefunded
                          ? 'bg-rose-100 text-rose-800 border border-rose-300'
                          : 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isRefunded ? 'bg-rose-600' : 'bg-emerald-600'}`} />
                        {p.status.toUpperCase()}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      {isRefunded ? (
                        <span className="text-[11px] font-mono text-slate-400 italic">
                          Refunded ({p.refundId || 'rfnd_done'})
                        </span>
                      ) : (
                        <button
                          onClick={() => setSelectedPaymentForRefund(p)}
                          className="px-3 py-1 bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 rounded-lg text-xs font-bold transition-colors active:scale-95"
                        >
                          Issue Refund
                        </button>
                      )}
                    </td>

                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Refund Modal */}
      {selectedPaymentForRefund && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            
            <div className="p-4 sm:p-5 bg-gradient-to-r from-rose-900 to-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4 text-rose-400" />
                <h3 className="font-bold text-sm">Issue Instant Customer Refund</h3>
              </div>
              <button
                onClick={() => setSelectedPaymentForRefund(null)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleTriggerRefund} className="p-5 space-y-4">
              
              {refundSuccessMsg ? (
                <div className="p-3 bg-emerald-50 text-emerald-800 rounded-2xl border border-emerald-200 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{refundSuccessMsg}</span>
                </div>
              ) : (
                <>
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-500">Payment ID:</span>
                      <span className="font-mono font-bold text-slate-900">{selectedPaymentForRefund.id}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Customer:</span>
                      <span className="font-bold text-slate-900">{selectedPaymentForRefund.customerName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-500">Original Amount:</span>
                      <span className="font-mono font-black text-rose-700">
                        ₹{selectedPaymentForRefund.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                      </span>
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                      Reason for Refund
                    </label>
                    <select
                      value={refundReason}
                      onChange={(e) => setRefundReason(e.target.value)}
                      className="w-full px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-medium text-slate-800"
                    >
                      <option value="Customer Return Request">Customer Return Request</option>
                      <option value="Duplicate Order Charged">Duplicate Order Charged</option>
                      <option value="Service Cancellation">Service Cancellation</option>
                      <option value="Fraudulent Transaction Suspect">Fraudulent Transaction Suspect</option>
                    </select>
                  </div>

                  <p className="text-[11px] text-slate-500">
                    Executing this refund will immediately reverse the funds back to customer's UPI/Card source and trigger the <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded font-mono font-bold">refund.processed</code> webhook.
                  </p>

                  <button
                    type="submit"
                    disabled={isProcessing}
                    className="w-full py-3 bg-rose-600 hover:bg-rose-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Reversing Settlement Funds...
                      </>
                    ) : (
                      `Confirm Full Refund (₹${selectedPaymentForRefund.amount})`
                    )}
                  </button>
                </>
              )}

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
