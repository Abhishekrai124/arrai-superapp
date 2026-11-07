import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Transaction } from '../../types';
import { 
  History, 
  Search, 
  ArrowUpRight, 
  ArrowDownLeft, 
  PlusCircle, 
  Zap, 
  Gift, 
  RotateCcw, 
  Download, 
  Filter, 
  ChevronRight, 
  X, 
  Copy, 
  Check, 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ArrowLeft 
} from 'lucide-react';

export const PassbookView: React.FC = () => {
  const { transactions, walletBalance, setConsumerTab } = useAppStore();
  const [filter, setFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTxn, setSelectedTxn] = useState<Transaction | null>(null);
  const [copiedUtr, setCopiedUtr] = useState(false);

  const filters = [
    { id: 'all', label: 'All Transactions' },
    { id: 'sent', label: 'Paid / Sent' },
    { id: 'received', label: 'Received' },
    { id: 'wallet_topup', label: 'Added to Wallet' },
    { id: 'bbps_bill', label: 'BBPS Bills' },
    { id: 'cashback', label: 'Cashback & Rewards' }
  ];

  const filteredTransactions = transactions.filter(t => {
    // Type Filter
    if (filter !== 'all' && t.type !== filter) return false;

    // Search Query
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchTitle = t.title.toLowerCase().includes(q);
      const matchUtr = t.utr.includes(q);
      const matchId = t.id.toLowerCase().includes(q);
      const matchVpa = (t.recipientVpa || t.senderVpa || '').toLowerCase().includes(q);
      return matchTitle || matchUtr || matchId || matchVpa;
    }
    return true;
  });

  const handleCopyUtr = (utr: string) => {
    navigator.clipboard.writeText(utr);
    setCopiedUtr(true);
    setTimeout(() => setCopiedUtr(false), 2000);
  };

  const exportCsv = () => {
    const headers = ['Transaction ID', 'Type', 'Title', 'Amount', 'Status', 'Date', 'UTR', 'Method'];
    const rows = transactions.map(t => [
      t.id,
      t.type,
      `"${t.title.replace(/"/g, '""')}"`,
      t.amount,
      t.status,
      t.timestamp,
      t.utr,
      t.paymentMethod
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ARRAI_Pay_Statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const getTxnIcon = (type: Transaction['type'], category: Transaction['category']) => {
    if (type === 'sent') return <ArrowUpRight className="w-5 h-5 text-rose-600" />;
    if (type === 'received') return <ArrowDownLeft className="w-5 h-5 text-emerald-600" />;
    if (type === 'wallet_topup') return <PlusCircle className="w-5 h-5 text-indigo-600" />;
    if (type === 'bbps_bill') return <Zap className="w-5 h-5 text-amber-600" />;
    if (type === 'cashback') return <Gift className="w-5 h-5 text-purple-600" />;
    if (type === 'refund') return <RotateCcw className="w-5 h-5 text-teal-600" />;
    return <ArrowUpRight className="w-5 h-5 text-slate-600" />;
  };

  return (
    <div className="space-y-4">
      
      {/* Passbook Hero Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-indigo-950 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-indigo-500/20 rounded-xl border border-indigo-500/30">
              <History className="w-5 h-5 text-indigo-400" />
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight">ARRAI Passbook & Bank Ledger</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Realtime audit log for UPI transactions, wallet loads, and Bharat Bill payments.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setConsumerTab('home')}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Pay Dashboard</span>
          </button>

          <button
            onClick={exportCsv}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4" />
            Download Statement (CSV)
          </button>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 space-y-3 shadow-xs">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by payee name, UPI VPA, UTR, or Txn ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
            />
          </div>

          <div className="text-xs text-slate-500 font-semibold self-center sm:self-auto flex items-center gap-1">
            <span>Showing {filteredTransactions.length} of {transactions.length}</span>
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filter === f.id
                  ? 'bg-indigo-600 text-white shadow-xs'
                  : 'bg-slate-100 hover:bg-slate-200 text-slate-600'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Transactions List */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs divide-y divide-slate-100">
        {filteredTransactions.length === 0 ? (
          <div className="py-12 text-center space-y-2">
            <History className="w-10 h-10 mx-auto text-slate-300" />
            <p className="text-xs font-bold text-slate-600">No transactions match your search</p>
            <p className="text-[11px] text-slate-400">Try adjusting your filters or search keywords</p>
          </div>
        ) : (
          filteredTransactions.map((txn) => {
            const isCredit = txn.type === 'received' || txn.type === 'cashback' || txn.type === 'wallet_topup' || txn.type === 'refund';
            return (
              <div
                key={txn.id}
                onClick={() => setSelectedTxn(txn)}
                className="p-4 hover:bg-slate-50/80 cursor-pointer transition-colors flex items-center justify-between gap-3 group"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="w-10 h-10 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform">
                    {getTxnIcon(txn.type, txn.category)}
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900 truncate">
                        {txn.title}
                      </span>
                      {txn.status === 'SUCCESS' && (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 truncate">
                      {txn.subtitle || txn.receiptNote || `Ref: ${txn.id}`}
                    </p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(txn.timestamp).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short'
                      })} • {new Date(txn.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="text-right shrink-0 flex items-center gap-2">
                  <div>
                    <span className={`text-xs sm:text-sm font-black font-mono block ${
                      isCredit ? 'text-emerald-600' : 'text-slate-900'
                    }`}>
                      {isCredit ? '+' : '-'} ₹{txn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {txn.paymentMethod === 'ARRAI_WALLET' ? 'Wallet' : 'Bank A/C'}
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 transition-colors" />
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Detailed Receipt Drawer (When clicking a transaction) */}
      {selectedTxn && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200 overflow-y-auto">
            
            <div>
              {/* Drawer Header */}
              <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-900 text-white">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-white/10 flex items-center justify-center">
                    {getTxnIcon(selectedTxn.type, selectedTxn.category)}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Transaction Details</h3>
                    <p className="text-[10px] text-slate-400 font-mono">{selectedTxn.id}</p>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedTxn(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Amount Banner */}
              <div className="p-6 text-center bg-slate-50 border-b border-slate-200">
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  {selectedTxn.type === 'received' ? 'Amount Received' : 'Amount Paid'}
                </span>
                <div className="text-3xl font-black font-mono tracking-tight text-slate-900 mt-1">
                  ₹{selectedTxn.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                </div>
                <div className="mt-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Transaction Successful
                </div>
              </div>

              {/* Receipt Specs */}
              <div className="p-5 space-y-3 text-xs">
                
                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Payee / Sender</span>
                  <span className="font-bold text-slate-800">{selectedTxn.title}</span>
                </div>

                {selectedTxn.recipientVpa && (
                  <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                    <span className="text-slate-500">UPI VPA</span>
                    <span className="font-mono text-indigo-700 font-semibold">{selectedTxn.recipientVpa}</span>
                  </div>
                )}

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">UTR / Bank Ref Number</span>
                  <div className="flex items-center gap-1">
                    <span className="font-mono font-bold text-slate-900">{selectedTxn.utr}</span>
                    <button
                      onClick={() => handleCopyUtr(selectedTxn.utr)}
                      className="p-1 text-slate-400 hover:text-indigo-600"
                    >
                      {copiedUtr ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Payment Channel</span>
                  <span className="font-semibold text-slate-800">
                    {selectedTxn.paymentMethod === 'ARRAI_WALLET' ? 'ARRAI PPI Wallet' : 'UPI (Bank Account)'}
                  </span>
                </div>

                <div className="flex items-center justify-between py-1.5 border-b border-slate-100">
                  <span className="text-slate-500">Completed At</span>
                  <span className="font-medium text-slate-700">
                    {new Date(selectedTxn.timestamp).toLocaleString()}
                  </span>
                </div>

                {selectedTxn.billDetails && (
                  <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">BBPS Bill Info</span>
                    <p className="text-amber-950 font-medium">Consumer ID: {selectedTxn.billDetails.consumerNumber}</p>
                    <p className="text-amber-800 text-[11px]">Provider: {selectedTxn.billDetails.operator}</p>
                  </div>
                )}

                {selectedTxn.receiptNote && (
                  <div className="pt-2">
                    <span className="text-slate-500 block text-[11px]">Remarks:</span>
                    <p className="italic text-slate-700 mt-0.5">{selectedTxn.receiptNote}</p>
                  </div>
                )}

              </div>
            </div>

            {/* Drawer Bottom Actions */}
            <div className="p-5 border-t border-slate-100 bg-slate-50 space-y-2">
              <button
                onClick={() => {
                  const text = `Transaction Receipt from ARRAI Pay: Paid ₹${selectedTxn.amount} for ${selectedTxn.title}. Ref: ${selectedTxn.id}, UTR: ${selectedTxn.utr}`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
                }}
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                Share on WhatsApp
              </button>

              <button
                onClick={() => setSelectedTxn(null)}
                className="w-full py-2 bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 rounded-xl font-bold text-xs"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
