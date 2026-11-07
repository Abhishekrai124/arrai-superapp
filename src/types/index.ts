export type AppMode = 'consumer' | 'merchant';

export type AppSection = 'home' | 'pay' | 'chat' | 'gram' | 'connect' | 'merchant' | 'settings' | 'store' | 'pulse' | 'pro' | 'caller' | 'chess' | 'login' | 'signup';

export type PaymentMethodType = 'ARRAI_WALLET' | 'BANK_ACCOUNT' | 'CARD' | 'NETBANKING' | 'UPI';

export type TransactionType = 
  | 'sent' 
  | 'received' 
  | 'wallet_topup' 
  | 'bbps_bill' 
  | 'cashback' 
  | 'merchant_payment' 
  | 'refund'
  | 'creator_tip';

export type TransactionStatus = 'SUCCESS' | 'FAILED' | 'PENDING' | 'REFUNDED';

export type TransactionCategory = 
  | 'upi' 
  | 'wallet' 
  | 'recharge' 
  | 'electricity' 
  | 'fastag' 
  | 'dth' 
  | 'broadband' 
  | 'gas' 
  | 'merchant' 
  | 'reward'
  | 'social';

export interface BankAccount {
  id: string;
  bankName: string;
  accountNumberMasked: string;
  accountLast4: string;
  ifsc: string;
  balance: number;
  isPrimary: boolean;
  logoColor: string;
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: 'payment' | 'chat' | 'gram' | 'connect' | 'system' | 'cashback';
  isRead: boolean;
  actionSection?: AppSection;
  actionTab?: string;
}

export interface Transaction {
  id: string;
  type: TransactionType;
  title: string;
  subtitle?: string;
  recipientVpa?: string;
  senderVpa?: string;
  amount: number;
  status: TransactionStatus;
  timestamp: string;
  category: TransactionCategory;
  utr: string;
  upiRef: string;
  paymentMethod: PaymentMethodType;
  bankDetails?: {
    bankName: string;
    accountLast4: string;
  };
  billDetails?: {
    category: string;
    operator: string;
    consumerNumber: string;
    billPeriod?: string;
  };
  receiptNote?: string;
}

export interface Contact {
  id: string;
  name: string;
  phone: string;
  vpa: string;
  avatar: string;
  recentAmount?: number;
  bankName?: string;
  isVerified: boolean;
  upiNumber?: string;
  username?: string;
  bio?: string;
}

export type ChatMessageType = 
  | 'text' 
  | 'payment_sent' 
  | 'payment_received' 
  | 'payment_request' 
  | 'image' 
  | 'voice_note';

export interface ChatMessage {
  id: string;
  contactId: string;
  sender: 'user' | 'contact';
  type: ChatMessageType;
  content?: string;
  amount?: number;
  transactionId?: string;
  status?: 'SUCCESS' | 'PENDING' | 'DECLINED';
  timestamp: string;
  note?: string;
  mediaUrl?: string;
  voiceDuration?: string;
  reaction?: string;
}

export interface ChatStatusItem {
  id: string;
  author: Contact;
  mediaUrl?: string;
  text?: string;
  timestamp: string;
  viewed: boolean;
}

export interface CallLog {
  id: string;
  contact: Contact;
  type: 'incoming' | 'outgoing' | 'missed';
  media: 'audio' | 'video';
  timestamp: string;
  duration?: string;
}

export interface ScratchCard {
  id: string;
  title: string;
  amount: number;
  isScratched: boolean;
  revealedAt?: string;
  cardTheme: string;
  description: string;
}

export interface PaymentLink {
  id: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  amount: number;
  purpose: string;
  status: 'Created' | 'Paid' | 'Expired';
  createdAt: string;
  shortUrl: string;
}

export interface MerchantPayment {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  method: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET';
  amount: number;
  fee: number;
  net: number;
  status: 'captured' | 'failed' | 'refunded';
  createdAt: string;
  orderId: string;
  refundId?: string;
  description: string;
}

export interface ApiKeys {
  keyId: string;
  keySecret: string;
  mode: 'test' | 'live';
  createdDate: string;
}

export interface WebhookEvent {
  id: string;
  event: 'payment.captured' | 'payment.failed' | 'refund.processed' | 'payment_link.paid';
  payload: Record<string, any>;
  status: 'delivered' | 'retrying';
  timestamp: string;
}

export interface SendMoneyPayload {
  recipientName: string;
  recipientVpa: string;
  amount: number;
  note?: string;
  paymentMethod: PaymentMethodType;
  bankId?: string;
}

export interface PayBillPayload {
  category: TransactionCategory;
  operator: string;
  consumerNumber: string;
  amount: number;
  billPeriod?: string;
  paymentMethod: PaymentMethodType;
}

export interface CheckoutPayload {
  amount: number;
  currency: string;
  orderId: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  paymentMethod: 'UPI' | 'CARD' | 'NETBANKING' | 'WALLET';
  otpEntered: string;
}

/* ==================== ARRAI ECOSYSTEM & SOCIAL MODELS ==================== */

export interface UserProfile {
  id: string;
  arraiId?: string;
  name: string;
  username: string;
  vpa: string;
  phone: string;
  email: string;
  avatar: string;
  bio: string;
  kycVerified: boolean;
  mpin: string;
  biometricEnabled: boolean;
  appLockEnabled?: boolean;
  language?: string;
  soundboxAlerts: boolean;
  soundboxLanguage: 'hi' | 'en';
  soundboxVoiceTone: 'female' | 'male';
  privacyLevel: 'everyone' | 'contacts' | 'nobody';
  autoTopup: boolean;
  autoTopupAmount: number;
  joinedDate: string;
  linkedSocials?: {
    google?: boolean;
    facebook?: boolean;
    instagram?: boolean;
    youtube?: boolean;
    apple?: boolean;
    whatsapp?: boolean;
  };
  digilockerDocs?: Array<{
    id: string;
    name: string;
    number: string;
    verified: boolean;
    issueDate: string;
  }>;
}

export interface GramComment {
  id: string;
  username: string;
  userAvatar: string;
  text: string;
  timestamp: string;
}

export interface GramPost {
  id: string;
  author: Contact;
  mediaUrl: string;
  caption: string;
  likesCount: number;
  hasLiked: boolean;
  commentsCount: number;
  comments: GramComment[];
  tipsReceived: number;
  timestamp: string;
  location?: string;
}

export interface GramStory {
  id: string;
  author: Contact;
  mediaUrl: string;
  hasUnseen: boolean;
  timestamp: string;
}

export interface GramReel {
  id: string;
  author: Contact;
  videoUrl: string;
  caption: string;
  audioTitle: string;
  likesCount: number;
  hasLiked: boolean;
  commentsCount: number;
  tipsReceived: number;
}

export interface SplitMember {
  name: string;
  avatar: string;
  status: 'PAID' | 'PENDING';
  amount: number;
}

export interface ConnectPost {
  id: string;
  author: Contact;
  groupName?: string;
  content: string;
  mediaUrl?: string;
  likesCount: number;
  hasLiked: boolean;
  sharesCount: number;
  timestamp: string;
  splitBill?: {
    id: string;
    title: string;
    totalAmount: number;
    perPersonAmount: number;
    members: SplitMember[];
  };
  marketplaceItem?: {
    title: string;
    price: number;
    location: string;
    image: string;
    category?: string;
    condition?: string;
  };
}

export interface ConnectCommunity {
  id: string;
  name: string;
  category: string;
  membersCount: number;
  coverImage: string;
  isJoined: boolean;
  description: string;
}
