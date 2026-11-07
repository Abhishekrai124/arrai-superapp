import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  AppMode, 
  AppSection,
  Transaction, 
  Contact, 
  ChatMessage, 
  ScratchCard, 
  PaymentLink, 
  MerchantPayment, 
  ApiKeys, 
  WebhookEvent, 
  BankAccount,
  PaymentMethodType,
  TransactionCategory,
  UserProfile,
  GramPost,
  GramStory,
  ConnectPost
} from '../types';
import { apiService } from '../services/api';
import { soundEngine } from '../utils/audio';
import confetti from 'canvas-confetti';

export interface DraftPayment {
  recipientName: string;
  recipientVpa: string;
  amount: number;
  note?: string;
  paymentMethod: PaymentMethodType;
  category?: TransactionCategory;
  serviceTitle?: string;
  billDetails?: any;
  contactId?: string;
  targetType?: 'contact' | 'vpa' | 'self';
}

interface AppStoreContextType {
  // Mode & Environment
  mode: AppMode;
  setMode: (mode: AppMode) => void;
  activeSection: AppSection;
  setActiveSection: (sec: AppSection) => void;
  consumerTab: string;
  setConsumerTab: (tab: string) => void;
  merchantTab: string;
  setMerchantTab: (tab: string) => void;
  isSandbox: boolean;
  setIsSandbox: (val: boolean) => void;
  
  // User Profile
  userProfile: UserProfile;
  updateUserProfile: (data: Partial<UserProfile>) => void;

  // Consumer State
  walletBalance: number;
  linkedBanks: BankAccount[];
  primaryBank: BankAccount;
  transactions: Transaction[];
  contacts: Contact[];
  activeChatContact: Contact | null;
  setActiveChatContact: (c: Contact | null) => void;
  chatMessages: Record<string, ChatMessage[]>;
  scratchCards: ScratchCard[];

  // Social: ARRAI Gram & Connect
  gramPosts: GramPost[];
  gramStories: GramStory[];
  likeGramPost: (postId: string) => void;
  tipGramCreator: (postId: string, amount: number) => Promise<boolean>;
  addGramComment: (postId: string, text: string) => void;
  connectPosts: ConnectPost[];
  likeConnectPost: (postId: string) => void;
  paySplitBill: (postId: string, memberName: string) => Promise<boolean>;

  // Merchant State
  merchantBalance: number;
  paymentLinks: PaymentLink[];
  merchantPayments: MerchantPayment[];
  apiKeys: ApiKeys;
  webhookUrl: string;
  setWebhookUrl: (url: string) => void;
  webhookLogs: WebhookEvent[];

  // Soundbox & Preferences
  soundboxEnabled: boolean;
  setSoundboxEnabled: (val: boolean) => void;
  soundboxLanguage: 'hi' | 'en';
  setSoundboxLanguage: (lang: 'hi' | 'en') => void;

  // Modals & Flows
  activeModal: string | null;
  openModal: (modal: string, draft?: any) => void;
  closeModal: () => void;
  draftPayment: DraftPayment | null;
  setDraftPayment: (draft: DraftPayment | null) => void;
  lastSuccessTxn: Transaction | null;
  isProcessing: boolean;
  errorMessage: string | null;

  // Actions
  executeSendMoney: (pin: string) => Promise<boolean>;
  executeAddMoney: (amount: number, source: string) => Promise<boolean>;
  executeBillPayment: (pin: string) => Promise<boolean>;
  executeScratchCard: (cardId: string) => Promise<number>;
  sendChatText: (contactId: string, text: string) => Promise<void>;
  executeChatPayment: (contactId: string, amount: number, note: string, pin: string) => Promise<boolean>;
  
  // Merchant Actions
  createNewPaymentLink: (data: { customerName: string; customerPhone: string; customerEmail: string; amount: number; purpose: string }) => Promise<PaymentLink>;
  executeGatewayCheckout: (data: any) => Promise<{ success: boolean; error?: string }>;
  executeMerchantRefund: (paymentId: string, amount: number, reason: string) => Promise<boolean>;
  regenerateApiKeys: () => Promise<void>;
  sendTestWebhook: (eventName: string) => Promise<void>;
  
  // Soundbox trigger
  triggerSoundboxTest: (amount?: number) => void;
}

const AppStoreContext = createContext<AppStoreContextType | null>(null);

// Default User Profile
const INITIAL_PROFILE: UserProfile = {
  id: 'usr_arrai_abhishek',
  name: 'Abhishek Rai',
  username: '@abhishek.rai',
  vpa: 'abhishek@arrai',
  phone: '+91 98201 00000',
  email: 'abhishek.rai@arraipay.in',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
  bio: 'FinTech Architect & Tech Explorer 🚀 Building ARRAI Super Ecosystem • Bangalore, India',
  kycVerified: true,
  mpin: '1234',
  biometricEnabled: true,
  appLockEnabled: false,
  language: 'en',
  soundboxAlerts: true,
  soundboxLanguage: 'hi',
  soundboxVoiceTone: 'female',
  privacyLevel: 'everyone',
  autoTopup: true,
  autoTopupAmount: 5000,
  joinedDate: 'October 2026',
  linkedSocials: {
    google: true,
    facebook: true,
    instagram: true,
    youtube: false,
    apple: false
  },
  digilockerDocs: [
    {
      id: 'doc_aadhaar',
      name: 'Aadhaar Card (UIDAI)',
      number: 'XXXX-XXXX-9021',
      verified: true,
      issueDate: '14 Jan 2021'
    },
    {
      id: 'doc_pan',
      name: 'Permanent Account Number (PAN)',
      number: 'ABCDE1234F',
      verified: true,
      issueDate: '08 Mar 2020'
    },
    {
      id: 'doc_dl',
      name: 'Driving License (MoRTH)',
      number: 'KA-05-20220019283',
      verified: true,
      issueDate: '19 Aug 2022'
    },
    {
      id: 'doc_rc',
      name: 'Vehicle Registration Certificate (RC)',
      number: 'KA-01-MJ-4092',
      verified: true,
      issueDate: '02 Feb 2023'
    }
  ]
};

// Default Seed Data
const INITIAL_BANKS: BankAccount[] = [
  {
    id: 'sbi_01',
    bankName: 'State Bank of India',
    accountNumberMasked: '•••• •••• 4829',
    accountLast4: '4829',
    ifsc: 'SBIN0001824',
    balance: 84250.00,
    isPrimary: true,
    logoColor: '#1a56db'
  },
  {
    id: 'hdfc_02',
    bankName: 'HDFC Bank',
    accountNumberMasked: '•••• •••• 9104',
    accountLast4: '9104',
    ifsc: 'HDFC0000412',
    balance: 42100.50,
    isPrimary: false,
    logoColor: '#004c8f'
  }
];

const INITIAL_CONTACTS: Contact[] = [
  {
    id: 'c_rahul',
    name: 'Rahul Sharma',
    username: '@rahul.sharma',
    phone: '+91 98201 49821',
    vpa: 'rahul.sharma@arrai',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    recentAmount: 1200,
    bankName: 'HDFC Bank',
    isVerified: true,
    upiNumber: '9820149821',
    bio: 'Product Designer at Bangalore • Coffee & Code ☕'
  },
  {
    id: 'c_priya',
    name: 'Priya Patel',
    username: '@priya.lens',
    phone: '+91 97112 34901',
    vpa: 'priya.patel@arrai',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    recentAmount: 2500,
    bankName: 'ICICI Bank',
    isVerified: true,
    upiNumber: '9711234901',
    bio: 'Travel photographer & digital creator 📸'
  },
  {
    id: 'c_vikram',
    name: 'Vikram Malhotra',
    username: '@vikram.m',
    phone: '+91 98840 91822',
    vpa: 'vikram.m@arrai',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    recentAmount: 450,
    bankName: 'State Bank of India',
    isVerified: true,
    bio: 'FinTech Investor & Startup Enthusiast 📈'
  },
  {
    id: 'c_ananya',
    name: 'Ananya Verma',
    username: '@ananya.v',
    phone: '+91 99200 48192',
    vpa: 'ananya@arrai',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80',
    recentAmount: 780,
    bankName: 'Axis Bank',
    isVerified: true,
    bio: 'UI/UX Lead • Music producer 🎧'
  },
  {
    id: 'c_kiran_store',
    name: 'Kiran Kirana Store',
    username: '@kiran.kirana',
    phone: '+91 98110 55194',
    vpa: 'kirankirana@arrai',
    avatar: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80',
    recentAmount: 340,
    bankName: 'Kotak Mahindra Bank',
    isVerified: true,
    bio: 'Daily essentials & groceries • Koramangala'
  },
  {
    id: 'c_chai_point',
    name: 'Chai Point Express',
    username: '@chaipoint.koramangala',
    phone: '+91 90001 88291',
    vpa: 'chaipoint.koramangala@arrai',
    avatar: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=150&auto=format&fit=crop&q=80',
    recentAmount: 85,
    bankName: 'IndusInd Bank',
    isVerified: true,
    bio: 'Fresh brew & snacks • Indiranagar 100ft Rd'
  }
];

const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'ARRAI_TXN_881920',
    type: 'sent',
    title: 'Rahul Sharma',
    subtitle: 'Dinner share (ARRAI UPI)',
    recipientVpa: 'rahul.sharma@arrai',
    amount: 1200.00,
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 3600000 * 2).toISOString(),
    category: 'upi',
    utr: '438910294819',
    upiRef: 'ARRAI82918401',
    paymentMethod: 'BANK_ACCOUNT',
    bankDetails: { bankName: 'State Bank of India', accountLast4: '4829' },
    receiptNote: 'Food & Drinks Bill split'
  },
  {
    id: 'ARRAI_TXN_772911',
    type: 'sent',
    title: 'Chai Point Express',
    subtitle: 'Paid at Counter (QR Scan)',
    recipientVpa: 'chaipoint.koramangala@arrai',
    amount: 85.00,
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 3600000 * 6).toISOString(),
    category: 'merchant',
    utr: '438910118492',
    upiRef: 'ARRAI71940182',
    paymentMethod: 'ARRAI_WALLET',
    receiptNote: 'Ginger Chai & Bun Maska'
  },
  {
    id: 'ARRAI_TXN_661902',
    type: 'bbps_bill',
    title: 'Tata Power Electricity',
    subtitle: 'BBPS Bill Consumer: 902819241',
    amount: 1420.50,
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 86400000 * 1).toISOString(),
    category: 'electricity',
    utr: '438909182736',
    upiRef: 'ARRAI61928471',
    paymentMethod: 'ARRAI_WALLET',
    billDetails: {
      category: 'electricity',
      operator: 'Tata Power Mumbai',
      consumerNumber: '902819241',
      billPeriod: 'October 2026'
    },
    receiptNote: 'Electricity Utility Bill'
  },
  {
    id: 'ARRAI_TXN_551029',
    type: 'cashback',
    title: 'ARRAI Cashback Reward',
    subtitle: 'Scratch Card Won',
    amount: 45.00,
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 86400000 * 2).toISOString(),
    category: 'reward',
    utr: '438908271649',
    upiRef: 'ARRAI51829304',
    paymentMethod: 'ARRAI_WALLET',
    receiptNote: 'Festive Scratch Cashback'
  },
  {
    id: 'ARRAI_TXN_441920',
    type: 'received',
    title: 'Priya Patel',
    subtitle: 'Received to ARRAI Wallet',
    senderVpa: 'priya.patel@arrai',
    amount: 2500.00,
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 86400000 * 3).toISOString(),
    category: 'upi',
    utr: '438907361829',
    upiRef: 'ARRAI41728391',
    paymentMethod: 'ARRAI_WALLET',
    receiptNote: 'Weekend Trip Expense'
  },
  {
    id: 'ARRAI_TXN_331092',
    type: 'wallet_topup',
    title: 'Added to ARRAI Wallet',
    subtitle: 'via SBI Netbanking',
    amount: 5000.00,
    status: 'SUCCESS',
    timestamp: new Date(Date.now() - 86400000 * 5).toISOString(),
    category: 'wallet',
    utr: '438906472819',
    upiRef: 'ARRAI31627384',
    paymentMethod: 'NETBANKING',
    receiptNote: 'Monthly Wallet Budget'
  }
];

const INITIAL_SCRATCH_CARDS: ScratchCard[] = [
  {
    id: 'sc_01',
    title: 'Festive Bumper Reward',
    amount: 75,
    isScratched: false,
    cardTheme: 'from-amber-400 via-orange-500 to-yellow-600',
    description: 'Special Diwali UPI Cashback'
  },
  {
    id: 'sc_02',
    title: 'BBPS Bill Pay Bonus',
    amount: 35,
    isScratched: false,
    cardTheme: 'from-indigo-500 via-purple-600 to-pink-500',
    description: 'Electricity Bill Reward'
  },
  {
    id: 'sc_03',
    title: 'Weekend Merchant Treat',
    amount: 45,
    isScratched: true,
    revealedAt: new Date(Date.now() - 86400000 * 2).toLocaleDateString(),
    cardTheme: 'from-emerald-400 to-teal-600',
    description: 'Chai Point QR Scan Cashback'
  }
];

// Seed ARRAI Gram Posts (Instagram Re-engineered)
const INITIAL_GRAM_POSTS: GramPost[] = [
  {
    id: 'post_01',
    author: INITIAL_CONTACTS[1], // Priya Patel
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&auto=format&fit=crop&q=80',
    caption: 'Sunset hues at Gokarna Beach 🌅 Best weekend escape with the crew! Splitting fuel & food seamlessly on ARRAI Pay ✨',
    likesCount: 342,
    hasLiked: false,
    commentsCount: 18,
    tipsReceived: 150,
    timestamp: '2 hours ago',
    location: 'Gokarna, Karnataka',
    comments: [
      { id: 'c1', username: 'rahul.sharma', userAvatar: INITIAL_CONTACTS[0].avatar, text: 'Awesome capture Priya! What camera did you use?', timestamp: '1h ago' },
      { id: 'c2', username: 'ananya.v', userAvatar: INITIAL_CONTACTS[3].avatar, text: 'Take me along next time! 😍', timestamp: '30m ago' }
    ]
  },
  {
    id: 'post_02',
    author: INITIAL_CONTACTS[0], // Rahul Sharma
    mediaUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&auto=format&fit=crop&q=80',
    caption: 'Late night code sprint 💻 Polishing the ARRAI super-app release. High-frequency FinTech + real-time social streams.',
    likesCount: 289,
    hasLiked: true,
    commentsCount: 12,
    tipsReceived: 250,
    timestamp: '5 hours ago',
    location: 'Indiranagar, Bangalore',
    comments: [
      { id: 'c3', username: 'abhishek.rai', userAvatar: INITIAL_PROFILE.avatar, text: 'Looks super clean Rahul! Love the typography 🚀', timestamp: '4h ago' }
    ]
  },
  {
    id: 'post_03',
    author: INITIAL_CONTACTS[5], // Chai Point
    mediaUrl: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=800&auto=format&fit=crop&q=80',
    caption: 'Monsoon special: Ginger Cardamom Chai with freshly toasted Bun Maska ☕🥖 Pay in 1-second with ARRAI QR & get ₹15 cashback!',
    likesCount: 512,
    hasLiked: false,
    commentsCount: 34,
    tipsReceived: 420,
    timestamp: 'Yesterday',
    location: 'Chai Point • Koramangala',
    comments: []
  }
];

// Seed ARRAI Gram Stories
const INITIAL_GRAM_STORIES: GramStory[] = [
  {
    id: 'story_01',
    author: INITIAL_CONTACTS[1],
    mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&auto=format&fit=crop&q=80',
    hasUnseen: true,
    timestamp: '1h'
  },
  {
    id: 'story_02',
    author: INITIAL_CONTACTS[0],
    mediaUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400&auto=format&fit=crop&q=80',
    hasUnseen: true,
    timestamp: '3h'
  },
  {
    id: 'story_03',
    author: INITIAL_CONTACTS[3],
    mediaUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&auto=format&fit=crop&q=80',
    hasUnseen: false,
    timestamp: '5h'
  },
  {
    id: 'story_04',
    author: INITIAL_CONTACTS[2],
    mediaUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&auto=format&fit=crop&q=80',
    hasUnseen: true,
    timestamp: '8h'
  }
];

// Seed ARRAI Connect Posts (Facebook/Community re-engineered)
const INITIAL_CONNECT_POSTS: ConnectPost[] = [
  {
    id: 'connect_01',
    author: INITIAL_CONTACTS[0], // Rahul
    groupName: 'Bangalore Tech Founders & Developers',
    content: 'Hey everyone! We just finished the Goa weekend hackathon. Here is the group bill split for the villa rental & food. Please settle your shares via ARRAI Pay!',
    likesCount: 45,
    hasLiked: false,
    sharesCount: 8,
    timestamp: '4 hours ago',
    splitBill: {
      id: 'split_goa_01',
      title: 'Goa Villa & Dinner Expenses',
      totalAmount: 6000,
      perPersonAmount: 1500,
      members: [
        { name: 'Rahul Sharma', avatar: INITIAL_CONTACTS[0].avatar, status: 'PAID', amount: 1500 },
        { name: 'Priya Patel', avatar: INITIAL_CONTACTS[1].avatar, status: 'PAID', amount: 1500 },
        { name: 'Abhishek Rai (You)', avatar: INITIAL_PROFILE.avatar, status: 'PENDING', amount: 1500 },
        { name: 'Vikram Malhotra', avatar: INITIAL_CONTACTS[2].avatar, status: 'PENDING', amount: 1500 }
      ]
    }
  },
  {
    id: 'connect_02',
    author: INITIAL_CONTACTS[2], // Vikram
    groupName: 'ARRAI Verified Marketplace',
    content: 'Upgrading my workstation setup! Selling my mint condition Apple Magic Keyboard & Trackpad. Verified buyers can pay with 1-click ARRAI Escrow.',
    likesCount: 29,
    hasLiked: true,
    sharesCount: 3,
    timestamp: 'Yesterday at 3:15 PM',
    marketplaceItem: {
      title: 'Apple Magic Keyboard + Magic Trackpad (Space Grey)',
      price: 8500,
      location: 'HSR Layout, Bangalore',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=600&auto=format&fit=crop&q=80'
    }
  }
];

const INITIAL_MERCHANT_PAYMENTS: MerchantPayment[] = [
  {
    id: 'pay_arr_881902',
    customerName: 'Gaurav Kumar',
    customerEmail: 'gaurav.kumar@example.com',
    customerPhone: '+91 98765 43210',
    method: 'UPI',
    amount: 1499.00,
    fee: 29.98,
    net: 1469.02,
    status: 'captured',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    orderId: 'order_991823',
    description: 'Pro Plan Subscription'
  },
  {
    id: 'pay_arr_772019',
    customerName: 'Neha Singh',
    customerEmail: 'neha.singh@gmail.com',
    customerPhone: '+91 98200 11928',
    method: 'CARD',
    amount: 3499.00,
    fee: 69.98,
    net: 3429.02,
    status: 'captured',
    createdAt: new Date(Date.now() - 7200000).toISOString(),
    orderId: 'order_882910',
    description: 'E-commerce Purchase'
  },
  {
    id: 'pay_arr_661928',
    customerName: 'Amitav Bose',
    customerEmail: 'amitav.bose@tech.in',
    customerPhone: '+91 97110 88291',
    method: 'NETBANKING',
    amount: 850.00,
    fee: 17.00,
    net: 833.00,
    status: 'captured',
    createdAt: new Date(Date.now() - 14400000).toISOString(),
    orderId: 'order_771920',
    description: 'Software Addon'
  }
];

const INITIAL_PAYMENT_LINKS: PaymentLink[] = [
  {
    id: 'pl_arr_882910',
    customerName: 'Rohan Mehta',
    customerPhone: '+91 98201 12948',
    customerEmail: 'rohan@mehtaconsulting.com',
    amount: 5000.00,
    purpose: 'Design Consultation & Strategy',
    status: 'Paid',
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    shortUrl: 'https://pay.arrai.in/pl_arr_882910'
  },
  {
    id: 'pl_arr_994821',
    customerName: 'TechCorp India',
    customerPhone: '+91 99002 81920',
    customerEmail: 'billing@techcorp.in',
    amount: 14999.00,
    purpose: 'Enterprise Platform License',
    status: 'Created',
    createdAt: new Date(Date.now() - 86400000 * 1).toISOString(),
    shortUrl: 'https://pay.arrai.in/pl_arr_994821'
  },
  {
    id: 'pl_arr_771822',
    customerName: 'Sarah Jenkins',
    customerPhone: '+91 98112 00491',
    customerEmail: 'sarah.j@creative.io',
    amount: 8500.00,
    purpose: 'Freelance Mobile UI Prototype',
    status: 'Created',
    createdAt: new Date().toISOString(),
    shortUrl: 'https://pay.arrai.in/pl_arr_771822'
  }
];

const INITIAL_CHAT_MESSAGES: Record<string, ChatMessage[]> = {
  'c_rahul': [
    {
      id: 'm1',
      contactId: 'c_rahul',
      sender: 'contact',
      type: 'text',
      content: 'Hey Abhishek! Thanks for hanging out yesterday.',
      timestamp: 'Yesterday 10:15 PM'
    },
    {
      id: 'm2',
      contactId: 'c_rahul',
      sender: 'contact',
      type: 'text',
      content: 'Total bill was ₹2,400. Can you pay your share of ₹1,200?',
      timestamp: 'Yesterday 10:16 PM'
    },
    {
      id: 'm3',
      contactId: 'c_rahul',
      sender: 'user',
      type: 'payment_sent',
      amount: 1200,
      note: 'Dinner share (ARRAI UPI)',
      transactionId: 'ARRAI_TXN_881920',
      status: 'SUCCESS',
      timestamp: 'Today 9:30 AM'
    },
    {
      id: 'm4',
      contactId: 'c_rahul',
      sender: 'contact',
      type: 'text',
      content: 'Received! Thanks a ton bro 🙌',
      timestamp: 'Today 9:32 AM'
    }
  ],
  'c_priya': [
    {
      id: 'p1',
      contactId: 'c_priya',
      sender: 'contact',
      type: 'payment_received',
      amount: 2500,
      note: 'Weekend Trip Expense',
      status: 'SUCCESS',
      timestamp: '3 days ago'
    },
    {
      id: 'p2',
      contactId: 'c_priya',
      sender: 'user',
      type: 'text',
      content: 'Got the money Priya, thanks!',
      timestamp: '3 days ago'
    }
  ]
};

// ── URL Deep-Linking & Route Helpers ─────────────────────────────────────
export const pathToSection = (path: string): AppSection => {
  const clean = path.replace(/^\/+|\/+$/g, '').toLowerCase().split('/')[0];
  if (!clean || clean === 'home') return 'home';
  if (clean === 'chat') return 'chat';
  if (clean === 'store' || clean === 'apps') return 'store';
  if (clean === 'chess') return 'chess';
  if (clean === 'caller') return 'caller';
  if (clean === 'gram' || clean === 'social') return 'gram';
  if (clean === 'connect' || clean === 'community') return 'connect';
  if (clean === 'merchant') return 'merchant';
  if (clean === 'pulse') return 'pulse';
  if (clean === 'pro') return 'pro';
  if (clean === 'settings' || clean === 'profile') return 'settings';
  if (['pay', 'wallet', 'passbook', 'rewards', 'bbps', 'billpay'].includes(clean)) return 'pay';
  return 'home';
};

export const sectionToPath = (sec: AppSection): string => {
  if (sec === 'home') return '/';
  return `/${sec}`;
};

export const AppStoreProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Mode & Navigation synchronized with URL
  const [activeSection, setActiveSectionState] = useState<AppSection>(() => {
    if (typeof window !== 'undefined') {
      const fromUrl = pathToSection(window.location.pathname);
      if (fromUrl !== 'home') return fromUrl;
    }
    return (localStorage.getItem('arrai_active_section') as AppSection) || 'home';
  });

  const [mode, setModeState] = useState<AppMode>(() => {
    if (typeof window !== 'undefined' && window.location.pathname.startsWith('/merchant')) {
      return 'merchant';
    }
    return (localStorage.getItem('arrai_mode') as AppMode) || 'consumer';
  });

  const [consumerTab, setConsumerTab] = useState<string>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      if (p.includes('passbook') || p.includes('wallet')) return 'passbook';
      if (p.includes('rewards')) return 'rewards';
      if (p.includes('bbps') || p.includes('billpay')) return 'bbps';
    }
    return 'home';
  });
  const [merchantTab, setMerchantTab] = useState<string>('dashboard');

  // Push URL to browser history on section change
  const setActiveSection = useCallback((sec: AppSection) => {
    setActiveSectionState(sec);
    localStorage.setItem('arrai_active_section', sec);
    if (sec === 'merchant') {
      setModeState('merchant');
      localStorage.setItem('arrai_mode', 'merchant');
    }
    if (typeof window !== 'undefined') {
      const targetPath = sectionToPath(sec);
      if (window.location.pathname !== targetPath) {
        window.history.pushState({ section: sec }, '', targetPath);
      }
    }
  }, []);

  // Listen to browser Back / Forward buttons (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === 'undefined') return;
      const sec = pathToSection(window.location.pathname);
      setActiveSectionState(sec);
      localStorage.setItem('arrai_active_section', sec);
      if (sec === 'merchant') {
        setModeState('merchant');
      } else {
        setModeState('consumer');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const [isSandbox, setIsSandbox] = useState(true);

  // User Profile
  const [userProfile, setUserProfile] = useState<UserProfile>(() => {
    const saved = localStorage.getItem('arrai_user_profile');
    return saved ? JSON.parse(saved) : INITIAL_PROFILE;
  });

  // Consumer Financial State
  const [walletBalance, setWalletBalance] = useState<number>(() => {
    const saved = localStorage.getItem('arrai_wallet_balance');
    return saved ? parseFloat(saved) : 25000.00;
  });

  const [linkedBanks] = useState<BankAccount[]>(INITIAL_BANKS);
  const primaryBank = linkedBanks.find(b => b.isPrimary) || linkedBanks[0];

  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem('arrai_transactions');
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });

  const [contacts] = useState<Contact[]>(INITIAL_CONTACTS);
  const [activeChatContact, setActiveChatContact] = useState<Contact | null>(null);

  const [chatMessages, setChatMessages] = useState<Record<string, ChatMessage[]>>(() => {
    const saved = localStorage.getItem('arrai_chat_messages');
    return saved ? JSON.parse(saved) : INITIAL_CHAT_MESSAGES;
  });

  const [scratchCards, setScratchCards] = useState<ScratchCard[]>(() => {
    const saved = localStorage.getItem('arrai_scratch_cards');
    return saved ? JSON.parse(saved) : INITIAL_SCRATCH_CARDS;
  });

  // Social: ARRAI Gram & Connect
  const [gramPosts, setGramPosts] = useState<GramPost[]>(() => {
    const saved = localStorage.getItem('arrai_gram_posts');
    return saved ? JSON.parse(saved) : INITIAL_GRAM_POSTS;
  });

  const [gramStories] = useState<GramStory[]>(INITIAL_GRAM_STORIES);

  const [connectPosts, setConnectPosts] = useState<ConnectPost[]>(() => {
    const saved = localStorage.getItem('arrai_connect_posts');
    return saved ? JSON.parse(saved) : INITIAL_CONNECT_POSTS;
  });

  // Merchant States
  const [merchantBalance, setMerchantBalance] = useState<number>(() => {
    const saved = localStorage.getItem('arrai_merchant_balance');
    return saved ? parseFloat(saved) : 148750.00;
  });

  const [paymentLinks, setPaymentLinks] = useState<PaymentLink[]>(() => {
    const saved = localStorage.getItem('arrai_payment_links');
    return saved ? JSON.parse(saved) : INITIAL_PAYMENT_LINKS;
  });

  const [merchantPayments, setMerchantPayments] = useState<MerchantPayment[]>(() => {
    const saved = localStorage.getItem('arrai_merchant_payments');
    return saved ? JSON.parse(saved) : INITIAL_MERCHANT_PAYMENTS;
  });

  const [apiKeys, setApiKeys] = useState<ApiKeys>(() => {
    const saved = localStorage.getItem('arrai_api_keys');
    return saved ? JSON.parse(saved) : {
      keyId: 'rzp_test_arrai_k9x2m4',
      keySecret: 'sec_7f92b8d0e14a2b9c',
      mode: 'test',
      createdDate: 'Oct 24, 2026'
    };
  });

  const [webhookUrl, setWebhookUrl] = useState('https://api.merchantapp.in/v1/arrai-webhooks');
  const [webhookLogs, setWebhookLogs] = useState<WebhookEvent[]>([
    {
      id: 'evt_sample_01',
      event: 'payment.captured',
      payload: { payment_id: 'pay_arr_881902', amount: 149900, status: 'captured' },
      status: 'delivered',
      timestamp: '30 mins ago'
    }
  ]);

  // Soundbox Preferences
  const [soundboxEnabled, setSoundboxEnabled] = useState(userProfile.soundboxAlerts);
  const [soundboxLanguage, setSoundboxLanguage] = useState<'hi' | 'en'>(userProfile.soundboxLanguage);

  // Modals & Navigation
  const [activeModal, setActiveModal] = useState<string | null>(null);
  const [draftPayment, setDraftPayment] = useState<DraftPayment | null>(null);
  const [lastSuccessTxn, setLastSuccessTxn] = useState<Transaction | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Persistence to localStorage
  useEffect(() => {
    localStorage.setItem('arrai_mode', mode);
  }, [mode]);

  useEffect(() => {
    localStorage.setItem('arrai_active_section', activeSection);
  }, [activeSection]);

  useEffect(() => {
    localStorage.setItem('arrai_user_profile', JSON.stringify(userProfile));
  }, [userProfile]);

  useEffect(() => {
    localStorage.setItem('arrai_wallet_balance', walletBalance.toString());
  }, [walletBalance]);

  useEffect(() => {
    localStorage.setItem('arrai_merchant_balance', merchantBalance.toString());
  }, [merchantBalance]);

  useEffect(() => {
    localStorage.setItem('arrai_transactions', JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem('arrai_chat_messages', JSON.stringify(chatMessages));
  }, [chatMessages]);

  useEffect(() => {
    localStorage.setItem('arrai_scratch_cards', JSON.stringify(scratchCards));
  }, [scratchCards]);

  useEffect(() => {
    localStorage.setItem('arrai_gram_posts', JSON.stringify(gramPosts));
  }, [gramPosts]);

  useEffect(() => {
    localStorage.setItem('arrai_connect_posts', JSON.stringify(connectPosts));
  }, [connectPosts]);

  useEffect(() => {
    localStorage.setItem('arrai_payment_links', JSON.stringify(paymentLinks));
  }, [paymentLinks]);

  useEffect(() => {
    localStorage.setItem('arrai_merchant_payments', JSON.stringify(merchantPayments));
  }, [merchantPayments]);

  useEffect(() => {
    localStorage.setItem('arrai_api_keys', JSON.stringify(apiKeys));
  }, [apiKeys]);

  const setMode = (newMode: AppMode) => {
    setModeState(newMode);
    setActiveModal(null);
  };

  const updateUserProfile = (data: Partial<UserProfile>) => {
    setUserProfile(prev => ({ ...prev, ...data }));
    if (data.soundboxAlerts !== undefined) setSoundboxEnabled(data.soundboxAlerts);
    if (data.soundboxLanguage !== undefined) setSoundboxLanguage(data.soundboxLanguage);
  };

  const openModal = (modal: string, draft?: any) => {
    setErrorMessage(null);
    if (draft) setDraftPayment(draft);
    setActiveModal(modal);
  };

  const closeModal = () => {
    setActiveModal(null);
    setErrorMessage(null);
  };

  // Helper celebration trigger
  const triggerCelebration = (amount: number) => {
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {}

    if (soundboxEnabled) {
      soundEngine.announceSoundbox(amount, soundboxLanguage);
    } else {
      soundEngine.playSuccessChime();
    }
  };

  // Soundbox audio test button
  const triggerSoundboxTest = (amount = 500) => {
    soundEngine.announceSoundbox(amount, soundboxLanguage);
  };

  // Social: Like Gram Post
  const likeGramPost = (postId: string) => {
    setGramPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.hasLiked;
        return {
          ...p,
          hasLiked: nextLiked,
          likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1
        };
      }
      return p;
    }));
  };

  // Social: Tip Creator via ARRAI Pay
  const tipGramCreator = async (postId: string, amount: number): Promise<boolean> => {
    if (walletBalance < amount) {
      alert('Insufficient ARRAI Wallet balance. Please add money.');
      return false;
    }

    const post = gramPosts.find(p => p.id === postId);
    if (!post) return false;

    // Deduct from wallet
    setWalletBalance(prev => prev - amount);

    // Create tip transaction
    const tipTxn: Transaction = {
      id: 'ARRAI_TIP_' + Date.now().toString(36).toUpperCase(),
      type: 'creator_tip',
      title: `Creator Tip to ${post.author.name}`,
      subtitle: `ARRAI Gram post tip`,
      recipientVpa: post.author.vpa,
      amount,
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      category: 'social',
      utr: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      upiRef: 'ARRAITIP' + Math.floor(10000000 + Math.random() * 90000000),
      paymentMethod: 'ARRAI_WALLET',
      receiptNote: `Tipped ₹${amount} for post "${post.caption.slice(0, 30)}..."`
    };

    setTransactions(prev => [tipTxn, ...prev]);

    // Update post tips count
    setGramPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return { ...p, tipsReceived: p.tipsReceived + amount };
      }
      return p;
    }));

    triggerCelebration(amount);
    return true;
  };

  // Social: Add Comment to Gram Post
  const addGramComment = (postId: string, text: string) => {
    if (!text.trim()) return;
    const newComment = {
      id: 'c_' + Date.now().toString(36),
      username: userProfile.username.replace('@', ''),
      userAvatar: userProfile.avatar,
      text,
      timestamp: 'Just now'
    };

    setGramPosts(prev => prev.map(p => {
      if (p.id === postId) {
        return {
          ...p,
          commentsCount: p.commentsCount + 1,
          comments: [...p.comments, newComment]
        };
      }
      return p;
    }));
  };

  // Social: Like Connect Post
  const likeConnectPost = (postId: string) => {
    setConnectPosts(prev => prev.map(p => {
      if (p.id === postId) {
        const nextLiked = !p.hasLiked;
        return {
          ...p,
          hasLiked: nextLiked,
          likesCount: nextLiked ? p.likesCount + 1 : p.likesCount - 1
        };
      }
      return p;
    }));
  };

  // Social: Settle Group Split Bill in ARRAI Connect
  const paySplitBill = async (postId: string, memberName: string): Promise<boolean> => {
    const post = connectPosts.find(p => p.id === postId);
    if (!post || !post.splitBill) return false;

    const amount = post.splitBill.perPersonAmount;
    if (walletBalance < amount) {
      alert('Insufficient wallet balance to settle split bill.');
      return false;
    }

    setWalletBalance(prev => prev - amount);

    const splitTxn: Transaction = {
      id: 'ARRAI_SPLIT_' + Date.now().toString(36).toUpperCase(),
      type: 'sent',
      title: post.splitBill.title,
      subtitle: `Group Bill Share to ${post.author.name}`,
      recipientVpa: post.author.vpa,
      amount,
      status: 'SUCCESS',
      timestamp: new Date().toISOString(),
      category: 'social',
      utr: Math.floor(100000000000 + Math.random() * 900000000000).toString(),
      upiRef: 'ARRAISPLIT' + Math.floor(10000000 + Math.random() * 90000000),
      paymentMethod: 'ARRAI_WALLET',
      receiptNote: `Settled share for ${post.splitBill.title}`
    };

    setTransactions(prev => [splitTxn, ...prev]);

    setConnectPosts(prev => prev.map(p => {
      if (p.id === postId && p.splitBill) {
        return {
          ...p,
          splitBill: {
            ...p.splitBill,
            members: p.splitBill.members.map(m => {
              if (m.name.includes(memberName)) {
                return { ...m, status: 'PAID' };
              }
              return m;
            })
          }
        };
      }
      return p;
    }));

    triggerCelebration(amount);
    return true;
  };

  // 1. Execute Send Money Flow
  const executeSendMoney = async (pin: string): Promise<boolean> => {
    if (!draftPayment) return false;
    if (pin.length !== 4 && pin.length !== 6) {
      setErrorMessage('Please enter a valid 4 or 6-digit MPIN');
      return false;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const newTxn = await apiService.sendMoney({
        recipientName: draftPayment.recipientName,
        recipientVpa: draftPayment.recipientVpa,
        amount: draftPayment.amount,
        note: draftPayment.note,
        paymentMethod: draftPayment.paymentMethod
      });

      if (draftPayment.paymentMethod === 'ARRAI_WALLET') {
        if (walletBalance < draftPayment.amount) {
          throw new Error('Insufficient ARRAI Wallet balance.');
        }
        setWalletBalance(prev => prev - draftPayment.amount);
      }

      setTransactions(prev => [newTxn, ...prev]);

      if (draftPayment.amount >= 100) {
        const bonusCard: ScratchCard = {
          id: 'sc_' + Date.now().toString(36),
          title: 'Cashback Reward',
          amount: Math.floor(15 + Math.random() * 45),
          isScratched: false,
          cardTheme: 'from-violet-500 via-indigo-600 to-purple-800',
          description: `Reward for payment to ${draftPayment.recipientName}`
        };
        setScratchCards(prev => [bonusCard, ...prev]);
      }

      setLastSuccessTxn(newTxn);
      setActiveModal('paymentSuccess');
      triggerCelebration(draftPayment.amount);
      return true;
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment failed.');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // 2. Execute Add Money
  const executeAddMoney = async (amount: number, source: string): Promise<boolean> => {
    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const newTxn = await apiService.addWalletBalance(amount, source);
      setWalletBalance(prev => prev + amount);
      setTransactions(prev => [newTxn, ...prev]);
      setLastSuccessTxn(newTxn);
      setActiveModal('paymentSuccess');
      triggerCelebration(amount);
      return true;
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to add money');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // 3. Execute BBPS Bill Payment
  const executeBillPayment = async (pin: string): Promise<boolean> => {
    if (!draftPayment || !draftPayment.billDetails) return false;
    if (pin.length !== 4 && pin.length !== 6) {
      setErrorMessage('Please enter a valid 4 or 6-digit MPIN');
      return false;
    }

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const newTxn = await apiService.payBill({
        category: draftPayment.category || 'electricity',
        operator: draftPayment.billDetails.operator,
        consumerNumber: draftPayment.billDetails.consumerNumber,
        amount: draftPayment.amount,
        billPeriod: draftPayment.billDetails.billPeriod,
        paymentMethod: draftPayment.paymentMethod
      });

      if (draftPayment.paymentMethod === 'ARRAI_WALLET') {
        if (walletBalance < draftPayment.amount) {
          throw new Error('Insufficient ARRAI Wallet balance.');
        }
        setWalletBalance(prev => prev - draftPayment.amount);
      }

      setTransactions(prev => [newTxn, ...prev]);

      const bonusCard: ScratchCard = {
        id: 'sc_bill_' + Date.now().toString(36),
        title: 'BBPS Bill Cashback',
        amount: Math.floor(20 + Math.random() * 30),
        isScratched: false,
        cardTheme: 'from-amber-500 to-rose-600',
        description: `Reward for ${draftPayment.billDetails.operator} bill payment`
      };
      setScratchCards(prev => [bonusCard, ...prev]);

      setLastSuccessTxn(newTxn);
      setActiveModal('paymentSuccess');
      triggerCelebration(draftPayment.amount);
      return true;
    } catch (err: any) {
      setErrorMessage(err.message || 'Bill payment failed');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // 4. Scratch Card Reveal
  const executeScratchCard = async (cardId: string): Promise<number> => {
    const card = scratchCards.find(c => c.id === cardId);
    if (!card || card.isScratched) return 0;

    const cashbackTxn = await apiService.revealScratchCard(cardId, card.amount);
    
    setWalletBalance(prev => prev + card.amount);
    setTransactions(prev => [cashbackTxn, ...prev]);

    setScratchCards(prev => prev.map(c => {
      if (c.id === cardId) {
        return { ...c, isScratched: true, revealedAt: new Date().toLocaleDateString() };
      }
      return c;
    }));

    triggerCelebration(card.amount);
    return card.amount;
  };

  // 5. Chat Messaging & WhatsApp Pay
  const sendChatText = async (contactId: string, text: string) => {
    if (!text.trim()) return;
    const msg = await apiService.sendChatMessage(contactId, text);
    setChatMessages(prev => ({
      ...prev,
      [contactId]: [...(prev[contactId] || []), msg]
    }));
  };

  const executeChatPayment = async (contactId: string, amount: number, note: string, pin: string): Promise<boolean> => {
    if (pin.length !== 4 && pin.length !== 6) {
      setErrorMessage('Invalid UPI MPIN');
      return false;
    }

    if (walletBalance < amount) {
      setErrorMessage('Insufficient ARRAI Wallet balance. Add money to proceed.');
      return false;
    }

    const contact = contacts.find(c => c.id === contactId);
    if (!contact) return false;

    setIsProcessing(true);
    setErrorMessage(null);

    try {
      const { chatMessage, transaction } = await apiService.sendChatPayment(
        contactId,
        contact.name,
        contact.vpa,
        amount,
        note
      );

      setWalletBalance(prev => prev - amount);
      setTransactions(prev => [transaction, ...prev]);
      setChatMessages(prev => ({
        ...prev,
        [contactId]: [...(prev[contactId] || []), chatMessage]
      }));

      triggerCelebration(amount);
      return true;
    } catch (err: any) {
      setErrorMessage(err.message || 'Payment failed');
      return false;
    } finally {
      setIsProcessing(false);
    }
  };

  // 6. Merchant - Create Payment Link
  const createNewPaymentLink = async (data: { customerName: string; customerPhone: string; customerEmail: string; amount: number; purpose: string }) => {
    setIsProcessing(true);
    try {
      const link = await apiService.createPaymentLink(data);
      setPaymentLinks(prev => [link, ...prev]);
      return link;
    } finally {
      setIsProcessing(false);
    }
  };

  // 7. Merchant - ARRAI PG Checkout Simulator
  const executeGatewayCheckout = async (data: any) => {
    setIsProcessing(true);
    setErrorMessage(null);
    try {
      const res = await apiService.processGatewayCheckout(data);
      if (!res.success) {
        const failEvent = await apiService.sendTestWebhook(webhookUrl, 'payment.failed', {
          event: 'payment.failed',
          payment_id: res.paymentId,
          amount: data.amount * 100,
          error: res.error
        });
        setWebhookLogs(prev => [failEvent, ...prev]);
        return { success: false, error: res.error };
      }

      if (res.merchantPayment) {
        setMerchantPayments(prev => [res.merchantPayment!, ...prev]);
        setMerchantBalance(prev => prev + res.merchantPayment!.net);

        const successEvent = await apiService.sendTestWebhook(webhookUrl, 'payment.captured', {
          event: 'payment.captured',
          payment_id: res.paymentId,
          amount: data.amount * 100,
          method: data.paymentMethod
        });
        setWebhookLogs(prev => [successEvent, ...prev]);
      }

      triggerCelebration(data.amount);
      return { success: true };
    } catch (err: any) {
      return { success: false, error: err.message };
    } finally {
      setIsProcessing(false);
    }
  };

  // 8. Merchant - Issue Refund
  const executeMerchantRefund = async (paymentId: string, amount: number, reason: string): Promise<boolean> => {
    setIsProcessing(true);
    try {
      const { refundId, refundTxn } = await apiService.issueMerchantRefund(paymentId, amount, reason);

      setMerchantPayments(prev => prev.map(p => {
        if (p.id === paymentId) {
          return { ...p, status: 'refunded', refundId };
        }
        return p;
      }));

      setMerchantBalance(prev => Math.max(0, prev - amount));
      setTransactions(prev => [refundTxn, ...prev]);
      setWalletBalance(prev => prev + amount);

      const refundEvent = await apiService.sendTestWebhook(webhookUrl, 'refund.processed', {
        event: 'refund.processed',
        payment_id: paymentId,
        refund_id: refundId,
        amount: amount * 100,
        reason
      });
      setWebhookLogs(prev => [refundEvent, ...prev]);

      return true;
    } finally {
      setIsProcessing(false);
    }
  };

  // 9. Merchant - API Keys & Webhook
  const regenerateApiKeys = async () => {
    const keys = await apiService.generateApiKeys(apiKeys.mode);
    setApiKeys(keys);
  };

  const sendTestWebhook = async (eventName: string) => {
    const event = await apiService.sendTestWebhook(webhookUrl, eventName);
    setWebhookLogs(prev => [event, ...prev]);
  };

  return (
    <AppStoreContext.Provider
      value={{
        mode,
        setMode,
        activeSection,
        setActiveSection,
        consumerTab,
        setConsumerTab,
        merchantTab,
        setMerchantTab,
        isSandbox,
        setIsSandbox,
        userProfile,
        updateUserProfile,
        walletBalance,
        linkedBanks,
        primaryBank,
        transactions,
        contacts,
        activeChatContact,
        setActiveChatContact,
        chatMessages,
        scratchCards,
        gramPosts,
        gramStories,
        likeGramPost,
        tipGramCreator,
        addGramComment,
        connectPosts,
        likeConnectPost,
        paySplitBill,
        merchantBalance,
        paymentLinks,
        merchantPayments,
        apiKeys,
        webhookUrl,
        setWebhookUrl,
        webhookLogs,
        soundboxEnabled,
        setSoundboxEnabled,
        soundboxLanguage,
        setSoundboxLanguage,
        activeModal,
        openModal,
        closeModal,
        draftPayment,
        setDraftPayment,
        lastSuccessTxn,
        isProcessing,
        errorMessage,
        executeSendMoney,
        executeAddMoney,
        executeBillPayment,
        executeScratchCard,
        sendChatText,
        executeChatPayment,
        createNewPaymentLink,
        executeGatewayCheckout,
        executeMerchantRefund,
        regenerateApiKeys,
        sendTestWebhook,
        triggerSoundboxTest
      }}
    >
      {children}
    </AppStoreContext.Provider>
  );
};

export const useAppStore = () => {
  const context = useContext(AppStoreContext);
  if (!context) {
    throw new Error('useAppStore must be used within an AppStoreProvider');
  }
  return context;
};
