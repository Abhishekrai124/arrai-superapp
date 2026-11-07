import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Link2, 
  Plus, 
  Copy, 
  Check, 
  Share2, 
  ExternalLink, 
  Search, 
  Calendar, 
  CreditCard, 
  Clock, 
  Loader2,
  X,
  AlertCircle
} from 'lucide-react';

export const PaymentLinksView: React.FC = () => {
  const { paymentLinks, createNewPaymentLink, isProcessing, openModal } = useAppStore();

  const [showCreateModal, setShowCreateModal] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [amount, setAmount] = useState('2500');
  const [purpose, setPurpose] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const handleCreateLink = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(amount);
    if (!val || val <= 0) return;

    await createNewPaymentLink({
      customerName,
      customerPhone,
      customerEmail,
      amount: val,
      purpose: purpose || 'General Invoice Payment'
    });

    setShowCreateModal(false);
    setCustomerName('');
    setCustomerPhone('');
    setCustomerEmail('');
    setAmount('2500');
    setPurpose('');
  };

  const handleCopy = (link: string, id: string) => {
    navigator.clipboard.writeText(link);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleShareWhatsApp = (l: any) => {
    const text = `Hi ${l.customerName}, please pay ₹${l.amount} for "${l.purpose}" using this secure ARRAI Pay link: ${l.shortUrl}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const filteredLinks = paymentLinks.filter(l => 
    l.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.purpose.toLowerCase().includes(searchQuery.toLowerCase()) ||
    l.id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 rounded-xl border border-emerald-500/30 text-emerald-400">
              <Link2 className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight">Payment Links & Invoices</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Create shareable payment links and get paid via UPI, Credit Cards, NetBanking, and Wallets.
          </p>
        </div>

        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 active:scale-95 font-bold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 shrink-0"
        >
          <Plus className="w-4 h-4" />
          Create Payment Link
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-xs flex items-center justify-between gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by customer name, purpose, or link ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />
        </div>

        <span className="text-xs font-semibold text-slate-500 shrink-0">
          {filteredLinks.length} Links
        </span>
      </div>

      {/* Payment Links Table */}
      <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase tracking-wider font-bold">
              <tr>
                <th className="py-3 px-4">Link ID & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Purpose</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredLinks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500">
                    No payment links found. Click "Create Payment Link" to generate one.
                  </td>
                </tr>
              ) : (
                filteredLinks.map((link) => (
                  <tr key={link.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono">
                      <span className="font-bold text-slate-800 block">{link.id}</span>
                      <span className="text-[10px] text-slate-400">
                        {new Date(link.createdAt).toLocaleDateString('en-IN', {
                          day: 'numeric',
                          month: 'short'
                        })}
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="font-bold text-slate-900 block">{link.customerName}</span>
                      <span className="text-[10px] text-slate-500 font-mono">{link.customerPhone}</span>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 font-medium">
                      {link.purpose}
                    </td>

                    <td className="py-3.5 px-4 font-mono font-black text-slate-900">
                      ₹{link.amount.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </td>

                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        link.status === 'Paid'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : link.status === 'Expired'
                          ? 'bg-slate-100 text-slate-600'
                          : 'bg-amber-100 text-amber-800 border border-amber-300'
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${link.status === 'Paid' ? 'bg-emerald-600' : 'bg-amber-600'}`} />
                        {link.status}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        
                        {/* Copy Link Button */}
                        <button
                          onClick={() => handleCopy(link.shortUrl, link.id)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Copy Link"
                        >
                          {copiedId === link.id ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>

                        {/* WhatsApp Share */}
                        <button
                          onClick={() => handleShareWhatsApp(link)}
                          className="p-1.5 rounded-lg border border-slate-200 text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors"
                          title="Share to WhatsApp"
                        >
                          <Share2 className="w-3.5 h-3.5" />
                        </button>

                        {/* Preview Checkout */}
                        <button
                          onClick={() => openModal('merchantCheckout')}
                          className="px-2 py-1 bg-slate-100 hover:bg-slate-200 rounded-lg text-[11px] font-bold text-slate-700 transition-colors flex items-center gap-1"
                          title="Test Payment Checkout"
                        >
                          <CreditCard className="w-3 h-3" />
                          Pay
                        </button>

                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create Payment Link Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-in zoom-in-95 duration-200">
            
            <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-900 to-emerald-950 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Link2 className="w-4 h-4 text-emerald-400" />
                <h3 className="font-bold text-sm">Create New Payment Link</h3>
              </div>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateLink} className="p-5 space-y-3.5">
              
              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Customer Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ramesh Kumar"
                  value={customerName}
                  onChange={(e) => setCustomerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Customer Phone
                  </label>
                  <input
                    type="text"
                    placeholder="+91 98200 00000"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-900"
                    required
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="1"
                    placeholder="2500"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-bold text-slate-900"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Customer Email (Optional)
                </label>
                <input
                  type="email"
                  placeholder="ramesh@example.com"
                  value={customerEmail}
                  onChange={(e) => setCustomerEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
                  Purpose / Description
                </label>
                <input
                  type="text"
                  placeholder="e.g. Website Development Advance, Invoice #8821"
                  value={purpose}
                  onChange={(e) => setPurpose(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={isProcessing}
                className="w-full mt-2 py-3 bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-slate-950 rounded-xl font-black text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating Short Link...
                  </>
                ) : (
                  'Create Payment Link'
                )}
              </button>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
