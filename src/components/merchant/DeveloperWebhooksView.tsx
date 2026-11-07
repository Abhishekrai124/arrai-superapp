import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { 
  Code2, 
  Key, 
  Copy, 
  Check, 
  RefreshCw, 
  Send, 
  CheckCircle2, 
  Terminal, 
  Radio, 
  ShieldCheck, 
  ExternalLink,
  Loader2
} from 'lucide-react';

export const DeveloperWebhooksView: React.FC = () => {
  const { 
    apiKeys, 
    regenerateApiKeys, 
    webhookUrl, 
    setWebhookUrl, 
    webhookLogs, 
    sendTestWebhook,
    isSandbox,
    setIsSandbox 
  } = useAppStore();

  const [copiedKeyId, setCopiedKeyId] = useState(false);
  const [copiedSecret, setCopiedSecret] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState('payment.captured');
  const [isSendingWebhook, setIsSendingWebhook] = useState(false);
  const [activeCodeSnippet, setActiveCodeSnippet] = useState<'curl' | 'node' | 'python' | 'react'>('node');

  const handleCopy = (text: string, type: 'key' | 'secret') => {
    navigator.clipboard.writeText(text);
    if (type === 'key') {
      setCopiedKeyId(true);
      setTimeout(() => setCopiedKeyId(false), 2000);
    } else {
      setCopiedSecret(true);
      setTimeout(() => setCopiedSecret(false), 2000);
    }
  };

  const handleSendTestWebhook = async () => {
    setIsSendingWebhook(true);
    await sendTestWebhook(selectedEvent);
    setIsSendingWebhook(false);
  };

  const codeSnippets = {
    node: `// Node.js Express / NestJS Integration with ARRAI Pay SDK
import Razorpay from 'razorpay';

const arraiClient = new Razorpay({
  key_id: '${apiKeys.keyId}',
  key_secret: '${apiKeys.keySecret}'
});

// Create Order
app.post('/api/create-order', async (req, res) => {
  const options = {
    amount: 1499 * 100, // amount in paisa (₹1,499.00)
    currency: 'INR',
    receipt: 'order_rcptid_11'
  };
  const order = await arraiClient.orders.create(options);
  res.json(order);
});`,

    curl: `# cURL ARRAI Pay Order Creation
curl -u ${apiKeys.keyId}:${apiKeys.keySecret} \\
  -X POST https://api.arrai.in/v1/orders \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 149900,
    "currency": "INR",
    "receipt": "order_rcptid_11",
    "notes": {
      "channel": "UPI & Cards"
    }
  }'`,

    python: `# Python Django / FastAPI Integration
import razorpay

client = razorpay.Client(auth=("${apiKeys.keyId}", "${apiKeys.keySecret}"))

order = client.order.create({
    "amount": 149900,
    "currency": "INR",
    "payment_capture": "1"
})
print("Order created:", order['id'])`,

    react: `// React Frontend Checkout Component
const openArraiCheckout = () => {
  const options = {
    key: "${apiKeys.keyId}",
    amount: 149900,
    currency: "INR",
    name: "ARRAI Tech",
    description: "Pro Subscription",
    handler: function (response) {
      alert("Payment ID: " + response.razorpay_payment_id);
    },
    prefill: {
      name: "Abhishek Rai",
      email: "abhishek@arraipay"
    },
    theme: { color: "#059669" }
  };
  const rzp = new window.Razorpay(options);
  rzp.open();
};`
  };

  return (
    <div className="space-y-5">
      
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-850 to-emerald-950 text-white rounded-3xl p-5 sm:p-6 shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-emerald-500/20 text-emerald-400 rounded-xl border border-emerald-500/30">
              <Code2 className="w-5 h-5" />
            </div>
            <h2 className="text-base sm:text-lg font-black tracking-tight">Developer API & Webhooks</h2>
          </div>
          <p className="text-xs text-slate-300 mt-1">
            Access credentials, configure realtime webhook alerts, and integrate the ARRAI Pay Gateway SDK.
          </p>
        </div>

        {/* Test vs Live Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
          <button
            onClick={() => setIsSandbox(true)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              isSandbox ? 'bg-amber-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Test Mode
          </button>
          <button
            onClick={() => setIsSandbox(false)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
              !isSandbox ? 'bg-emerald-500 text-slate-950 shadow-md' : 'text-slate-400 hover:text-white'
            }`}
          >
            Live Mode
          </button>
        </div>
      </div>

      {/* API Keys Card */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Key className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">API Credentials</h3>
              <p className="text-[11px] text-slate-500">
                Generated {apiKeys.createdDate} • Use in your server-side environment variables
              </p>
            </div>
          </div>

          <button
            onClick={regenerateApiKeys}
            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Regenerate Keys
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          
          {/* Key ID */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                ARRAI_KEY_ID ({isSandbox ? 'Test' : 'Live'})
              </span>
              <button
                onClick={() => handleCopy(apiKeys.keyId, 'key')}
                className="text-slate-400 hover:text-emerald-700 p-1"
                title="Copy Key ID"
              >
                {copiedKeyId ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <code className="text-xs font-mono font-bold text-slate-900 block truncate">
              {apiKeys.keyId}
            </code>
          </div>

          {/* Key Secret */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                ARRAI_KEY_SECRET
              </span>
              <button
                onClick={() => handleCopy(apiKeys.keySecret, 'secret')}
                className="text-slate-400 hover:text-emerald-700 p-1"
                title="Copy Key Secret"
              >
                {copiedSecret ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <code className="text-xs font-mono font-bold text-slate-900 block truncate">
              {apiKeys.keySecret}
            </code>
          </div>

        </div>
      </div>

      {/* Webhook Configuration & Simulator */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-emerald-600 animate-pulse" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Webhook Endpoints & Simulator</h3>
              <p className="text-[11px] text-slate-500">Receive HTTP POST payloads when transaction state changes</p>
            </div>
          </div>
        </div>

        {/* Webhook URL Input */}
        <div>
          <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-1">
            Your Webhook Target URL
          </label>
          <div className="flex flex-col sm:flex-row gap-2">
            <input
              type="url"
              value={webhookUrl}
              onChange={(e) => setWebhookUrl(e.target.value)}
              placeholder="https://api.yourdomain.com/webhooks/arrai"
              className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500"
            />
            
            <div className="flex items-center gap-2">
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="px-3 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-bold text-slate-800"
              >
                <option value="payment.captured">payment.captured</option>
                <option value="payment.failed">payment.failed</option>
                <option value="refund.processed">refund.processed</option>
                <option value="payment_link.paid">payment_link.paid</option>
              </select>

              <button
                onClick={handleSendTestWebhook}
                disabled={isSendingWebhook}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-slate-950 font-black text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 shrink-0"
              >
                {isSendingWebhook ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Send Test Webhook
              </button>
            </div>
          </div>
        </div>

        {/* Live Webhook Event Logs */}
        <div className="pt-2">
          <span className="text-xs font-bold text-slate-700 uppercase tracking-wider block mb-2">
            Recent Webhook Dispatches ({webhookLogs.length})
          </span>

          <div className="space-y-2 max-h-56 overflow-y-auto">
            {webhookLogs.map((log) => (
              <div key={log.id} className="p-3 bg-slate-900 text-white rounded-2xl border border-slate-800 space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-emerald-400" />
                    <span className="font-mono font-bold text-emerald-400">{log.event}</span>
                    <span className="text-[10px] text-slate-400 font-mono">({log.id})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                      200 OK
                    </span>
                    <span className="text-[10px] text-slate-400">{log.timestamp}</span>
                  </div>
                </div>

                <pre className="p-2.5 rounded-xl bg-slate-950 text-slate-300 font-mono text-[11px] overflow-x-auto">
                  {JSON.stringify(log.payload, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Code Integration Snippets */}
      <div className="bg-slate-900 text-white rounded-3xl border border-slate-800 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-5 h-5 text-emerald-400" />
            <h3 className="text-sm font-bold">SDK Code Integration</h3>
          </div>

          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800">
            {(['node', 'curl', 'python', 'react'] as const).map((snip) => (
              <button
                key={snip}
                onClick={() => setActiveCodeSnippet(snip)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                  activeCodeSnippet === snip
                    ? 'bg-emerald-500 text-slate-950 shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {snip.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        <pre className="p-4 rounded-2xl bg-slate-950 text-emerald-300 font-mono text-xs overflow-x-auto border border-slate-800/80 leading-relaxed">
          {codeSnippets[activeCodeSnippet]}
        </pre>
      </div>

    </div>
  );
};
