import { 
  Transaction, 
  SendMoneyPayload, 
  PayBillPayload, 
  CheckoutPayload, 
  PaymentLink, 
  MerchantPayment, 
  ApiKeys, 
  WebhookEvent,
  ChatMessage 
} from '../types';

// Simulated realistic FinTech network latency
const NETWORK_DELAY_MS = 800;

const delay = (ms: number = NETWORK_DELAY_MS) => new Promise((resolve) => setTimeout(resolve, ms));

const generateUtr = () => {
  return Math.floor(100000000000 + Math.random() * 900000000000).toString();
};

const generateUpiRef = () => {
  return 'ARRAI' + Math.floor(100000000 + Math.random() * 900000000).toString();
};

const generateTxnId = (prefix = 'ARRAI') => {
  return `${prefix}_TXN_${Date.now().toString(36).toUpperCase()}_${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
};

export const apiService = {
  /**
   * 1. Send Money via UPI / Wallet to Contact, VPA, or Account
   */
  async sendMoney(payload: SendMoneyPayload): Promise<Transaction> {
    await delay();

    if (!payload.amount || payload.amount <= 0) {
      throw new Error('Please enter a valid amount greater than ₹0');
    }

    const newTxn: Transaction = {
      id: generateTxnId(),
      type: 'sent',
      title: payload.recipientName,
      subtitle: `UPI ID: ${payload.recipientVpa}`,
      recipientVpa: payload.recipientVpa,
      amount: payload.amount,
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      category: 'upi',
      utr: generateUtr(),
      upiRef: generateUpiRef(),
      paymentMethod: payload.paymentMethod,
      receiptNote: payload.note || 'Payment via ARRAI Pay',
      bankDetails: payload.paymentMethod === 'BANK_ACCOUNT' ? {
        bankName: 'State Bank of India',
        accountLast4: '4829'
      } : undefined
    };

    return newTxn;
  },

  /**
   * 2. Add Money to ARRAI Wallet
   */
  async addWalletBalance(amount: number, source: string): Promise<Transaction> {
    await delay();

    if (amount <= 0) {
      throw new Error('Amount must be positive');
    }

    const newTxn: Transaction = {
      id: generateTxnId('WLT'),
      type: 'wallet_topup',
      title: 'Added to ARRAI Wallet',
      subtitle: `via ${source}`,
      amount: amount,
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      category: 'wallet',
      utr: generateUtr(),
      upiRef: generateUpiRef(),
      paymentMethod: 'NETBANKING',
      receiptNote: `Wallet top-up of ₹${amount}`
    };

    return newTxn;
  },

  /**
   * 3. Fetch Passbook / Ledger History
   */
  async fetchPassbook(filter?: string): Promise<Transaction[]> {
    await delay(400);
    const stored = localStorage.getItem('arrai_transactions');
    if (!stored) return [];
    
    let list: Transaction[] = JSON.parse(stored);
    if (filter && filter !== 'all') {
      list = list.filter(t => t.type === filter || t.status.toLowerCase() === filter);
    }
    return list;
  },

  /**
   * 4. Fetch BBPS Bill Details for Electricity, Mobile, DTH, etc.
   */
  async fetchBillDetails(category: string, operator: string, consumerNumber: string) {
    await delay(700);

    const mockAmounts: Record<string, number> = {
      electricity: 1420.50,
      recharge: 299.00,
      dth: 450.00,
      fastag: 500.00,
      broadband: 899.00,
      gas: 1050.00
    };

    const dummyAmount = mockAmounts[category] || 650.00;

    return {
      consumerName: 'Abhishek Kumar Rai',
      consumerNumber,
      operator,
      category,
      billAmount: dummyAmount,
      dueDate: new Date(Date.now() + 12 * 86400000).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      }),
      billPeriod: 'October - November',
      billNumber: 'BBPS_' + Math.floor(10000000 + Math.random() * 90000000)
    };
  },

  /**
   * 5. Pay BBPS Bill
   */
  async payBill(payload: PayBillPayload): Promise<Transaction> {
    await delay();

    const newTxn: Transaction = {
      id: generateTxnId('BBPS'),
      type: 'bbps_bill',
      title: `${payload.operator} Bill Paid`,
      subtitle: `ID: ${payload.consumerNumber}`,
      amount: payload.amount,
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      category: payload.category,
      utr: generateUtr(),
      upiRef: generateUpiRef(),
      paymentMethod: payload.paymentMethod,
      billDetails: {
        category: payload.category,
        operator: payload.operator,
        consumerNumber: payload.consumerNumber,
        billPeriod: payload.billPeriod || 'Current Cycle'
      },
      receiptNote: `BBPS Payment for ${payload.operator}`
    };

    return newTxn;
  },

  /**
   * 6. Scratch Card Reveal & Cashback Crediting
   */
  async revealScratchCard(cardId: string, amount: number): Promise<Transaction> {
    await delay(500);

    const newTxn: Transaction = {
      id: generateTxnId('RW'),
      type: 'cashback',
      title: 'ARRAI Cashback Reward',
      subtitle: 'Scratch Card Won',
      amount: amount,
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      category: 'reward',
      utr: generateUtr(),
      upiRef: generateUpiRef(),
      paymentMethod: 'ARRAI_WALLET',
      receiptNote: `Cashback won from ARRAI Rewards: ₹${amount}`
    };

    return newTxn;
  },

  /**
   * 7. Chat & WhatsApp Pay Message
   */
  async sendChatMessage(contactId: string, text: string): Promise<ChatMessage> {
    await delay(300);
    return {
      id: 'msg_' + Date.now().toString(36),
      contactId,
      sender: 'user',
      type: 'text',
      content: text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  },

  /**
   * 8. Send Money in Chat (WhatsApp Pay experience)
   */
  async sendChatPayment(contactId: string, contactName: string, contactVpa: string, amount: number, note: string): Promise<{ chatMessage: ChatMessage; transaction: Transaction }> {
    await delay();

    const txn = await this.sendMoney({
      recipientName: contactName,
      recipientVpa: contactVpa,
      amount,
      note,
      paymentMethod: 'ARRAI_WALLET'
    });

    const chatMsg: ChatMessage = {
      id: 'msg_pay_' + Date.now().toString(36),
      contactId,
      sender: 'user',
      type: 'payment_sent',
      amount,
      note: note || 'Paid using ARRAI Pay',
      transactionId: txn.id,
      status: 'SUCCESS',
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    return { chatMessage: chatMsg, transaction: txn };
  },

  /**
   * 9. Generate Developer API Keys (Razorpay style)
   */
  async generateApiKeys(mode: 'test' | 'live'): Promise<ApiKeys> {
    await delay(600);
    const prefix = mode === 'test' ? 'rzp_test_' : 'rzp_live_';
    const randomHex = () => Math.random().toString(36).substring(2, 10);
    
    return {
      keyId: `${prefix}arrai_${randomHex()}`,
      keySecret: `sec_${randomHex()}${randomHex()}`,
      mode,
      createdDate: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
    };
  },

  /**
   * 10. Create Payment Link (Razorpay Merchant)
   */
  async createPaymentLink(payload: {
    customerName: string;
    customerPhone: string;
    customerEmail: string;
    amount: number;
    purpose: string;
  }): Promise<PaymentLink> {
    await delay();

    const linkId = 'pl_arr_' + Math.floor(10000000 + Math.random() * 90000000);
    const newLink: PaymentLink = {
      id: linkId,
      customerName: payload.customerName,
      customerPhone: payload.customerPhone,
      customerEmail: payload.customerEmail,
      amount: payload.amount,
      purpose: payload.purpose,
      status: 'Created',
      createdAt: new Date().toISOString(),
      shortUrl: `https://pay.arrai.in/${linkId}`
    };

    return newLink;
  },

  /**
   * 11. Razorpay Gateway Checkout Processor & Mock Bank 3D OTP
   */
  async processGatewayCheckout(payload: CheckoutPayload): Promise<{ 
    success: boolean; 
    paymentId: string; 
    error?: string;
    merchantPayment?: MerchantPayment;
  }> {
    await delay();

    // Verification check for Mock OTP
    if (payload.otpEntered === '000000') {
      return {
        success: false,
        paymentId: 'pay_fail_' + Date.now().toString(36),
        error: 'Bank Authentication Failed: Invalid OTP or Card declined by Issuing Bank'
      };
    }

    if (payload.otpEntered !== '123456') {
      return {
        success: false,
        paymentId: 'pay_fail_' + Date.now().toString(36),
        error: 'Incorrect OTP. For test mode, enter 123456 for success or 000000 for failure.'
      };
    }

    const paymentId = 'pay_arr_' + Math.random().toString(36).substring(2, 10).toUpperCase();
    const fee = Math.round(payload.amount * 0.02 * 100) / 100; // 2% gateway fee
    const net = Math.round((payload.amount - fee) * 100) / 100;

    const merchantPayment: MerchantPayment = {
      id: paymentId,
      customerName: payload.customerName,
      customerEmail: payload.customerEmail,
      customerPhone: payload.customerPhone,
      method: payload.paymentMethod,
      amount: payload.amount,
      fee,
      net,
      status: 'captured',
      createdAt: new Date().toISOString(),
      orderId: payload.orderId || ('order_' + Math.floor(100000 + Math.random() * 900000)),
      description: 'Standard ARRAI Checkout'
    };

    return {
      success: true,
      paymentId,
      merchantPayment
    };
  },

  /**
   * 12. Issue Instant Merchant Refund
   */
  async issueMerchantRefund(paymentId: string, amount: number, reason: string): Promise<{ refundId: string; refundTxn: Transaction }> {
    await delay();

    const refundId = 'rfnd_arr_' + Math.random().toString(36).substring(2, 9);
    
    const refundTxn: Transaction = {
      id: generateTxnId('RFND'),
      type: 'refund',
      title: `Refund: ${paymentId}`,
      subtitle: reason || 'Merchant Initiated Refund',
      amount: amount,
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      category: 'merchant',
      utr: generateUtr(),
      upiRef: generateUpiRef(),
      paymentMethod: 'ARRAI_WALLET',
      receiptNote: `Refund of ₹${amount} issued successfully`
    };

    return { refundId, refundTxn };
  },

  /**
   * 13. Send Test Webhook Simulator
   */
  async sendTestWebhook(url: string, eventName: string, customPayload?: any): Promise<WebhookEvent> {
    await delay(700);

    const payload = customPayload || {
      entity: 'event',
      account_id: 'acc_arrai_merchant_01',
      event: eventName,
      contains: ['payment'],
      payload: {
        payment: {
          entity: {
            id: 'pay_arr_sample_' + Math.random().toString(36).substring(2, 7),
            amount: 149900,
            currency: 'INR',
            status: eventName === 'payment.failed' ? 'failed' : 'captured',
            method: 'upi',
            vpa: 'customer@okhdfcbank',
            email: 'gaurav.kumar@example.com',
            contact: '+919876543210',
            fee: 2998,
            tax: 540,
            error_code: eventName === 'payment.failed' ? 'BAD_REQUEST_ERROR' : null,
            error_description: eventName === 'payment.failed' ? 'Payment was declined by issuing bank' : null,
            created_at: Math.floor(Date.now() / 1000)
          }
        }
      },
      created_at: Math.floor(Date.now() / 1000)
    };

    return {
      id: 'evt_arr_' + Math.random().toString(36).substring(2, 10),
      event: eventName as any,
      payload,
      status: 'delivered',
      timestamp: new Date().toLocaleTimeString()
    };
  }
};
