# ARRAI Pay 🚀
### Next-Gen Hybrid FinTech Platform: PhonePe + Paytm + Razorpay + WhatsApp Pay

**ARRAI Pay** is a production-grade, interactive Frontend Web & Mobile-Responsive FinTech application (PWA ready) re-engineered to combine the best features of India's leading payment platforms:
- **PhonePe:** UPI 2.0 flows, Contacts, MPIN keypad, tactile audio feedback, and celebration receipts.
- **Paytm:** ARRAI Wallet, Passbook ledger, and Bharat BillPay (BBPS) utility services.
- **WhatsApp Pay:** Conversational chat & pay interface where users can chat with contacts and send/request money directly inside interactive chat bubbles.
- **Razorpay:** B2B Merchant Dashboard, Standard Checkout popup modal, live Webhook simulator, payment links generator, and instant customer refunds.

---

## 🏗️ Architecture & Folder Structure

```
ARRAAI PAY/
├── public/
│   ├── manifest.json            # PWA Web App Manifest
│   └── favicon.svg              # App Logo
├── src/
│   ├── types/
│   │   └── index.ts             # Strongly-typed FinTech domain models
│   ├── services/
│   │   └── api.ts               # Centralized async API service layer (800ms delay)
│   ├── utils/
│   │   └── audio.ts             # Web Audio API chime + Speech Synthesis Soundbox
│   ├── store/
│   │   └── useAppStore.tsx      # Global state context with localStorage persistence
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.tsx       # Mode switcher, Live/Sandbox toggle, Soundbox menu
│   │   │   ├── Sidebar.tsx      # Desktop navigation (pay.arrai.in style)
│   │   │   └── MobileBottomNav.tsx # Mobile floating bottom navigation
│   │   ├── consumer/
│   │   │   ├── ConsumerHome.tsx # Consumer Dashboard container
│   │   │   ├── WalletCard.tsx   # ARRAI Wallet & UPI VPA card
│   │   │   ├── QuickTransferBar.tsx # PhonePe 4-action transfer grid
│   │   │   ├── RecentContactsRow.tsx # Contact avatars with quick pay
│   │   │   ├── BbpsBillPayGrid.tsx  # Bharat BillPay utility services
│   │   │   ├── UpiPinPadModal.tsx   # 4/6-digit numeric UPI MPIN pad
│   │   │   ├── PaymentSuccessModal.tsx # Animated receipt with UTR & WhatsApp share
│   │   │   ├── AddMoneyModal.tsx    # Wallet top-up modal
│   │   │   ├── TransferModal.tsx    # Send money (Contact, VPA, Bank)
│   │   │   ├── QrScannerModal.tsx   # Camera simulator with presets
│   │   │   ├── MyQrModal.tsx        # Personal UPI QR code
│   │   │   ├── PassbookView.tsx     # Searchable ledger & CSV export
│   │   │   ├── BillPayModal.tsx     # BBPS 4-step bill fetch & pay
│   │   │   ├── RewardsView.tsx      # HTML5 Canvas scratch cards
│   │   │   └── WhatsAppChatPayModal.tsx # WhatsApp conversational pay interface
│   │   └── merchant/
│   │       ├── MerchantDashboard.tsx # Razorpay analytics & volume chart
│   │       ├── CheckoutModal.tsx     # Standard Checkout popup & Mock Bank OTP
│   │       ├── PaymentLinksView.tsx  # Create & track shareable payment links
│   │       ├── MerchantTransactionsView.tsx # Incoming payments & instant refunds
│   │       └── DeveloperWebhooksView.tsx    # API keys & Webhook simulator
│   ├── App.tsx                  # Root application router
│   ├── main.tsx                 # React DOM root
│   └── index.css                # Tailwind v4 styling & animations
├── package.json
├── vite.config.ts
└── tsconfig.json
```

---

## ⚡ Core Features & User Journeys

### 1. Consumer Experience (PhonePe + Paytm + WhatsApp Pay)
- **ARRAI Wallet & UPI Card:** Displays live virtual balance (default `₹25,000.00`), quick "+ Add Money" modal, copyable VPA (`abhishek@arraipay`), and primary bank account display.
- **Quick Transfer Bar:** Instant actions for "Scan Any QR", "To Mobile / Contact", "To UPI ID / VPA", and "To Self / Bank".
- **Bharat BillPay (BBPS):** Fully interactive modals for Mobile Recharge, Electricity Bill (Tata Power, BESCOM, Adani), DTH, FASTag, Broadband, and Gas. Fetches live simulated bill and allows instant clearance.
- **Tactile UPI MPIN Pad:** Realistic 4-digit keypad with masked dots, touch/click sound, and NPCI 256-bit encryption assurance.
- **Animated Success & Receipt:** Confetti blast, PhonePe chime, voice announcement, transaction ID, UTR, and WhatsApp sharing.
- **Interactive Scratch Cards:** HTML5 canvas where users drag to scratch foil and win cashback credited straight to their ARRAI Wallet.
- **WhatsApp Chat & Pay:** Dedicated conversational interface with contacts. Send texts, view payment request cards, and tap "Pay ₹X" right inside chat bubbles.

### 2. Merchant & Developer Gateway (Razorpay Suite)
- **Merchant Analytics Overview:** Total Gross Volume, Settled Amount, 99.4% Success Rate, and interactive 7-Day Revenue & Volume chart.
- **ARRAI Checkout Simulator:** Authentic Razorpay Standard Checkout popup supporting UPI, Cards, NetBanking, and Wallet.
  - Enter test OTP `123456` for instant success + `payment.captured` webhook.
  - Enter test OTP `000000` for simulated bank decline + `payment.failed` webhook.
- **Payment Links Generator:** Create links with customer name, phone, amount, and purpose. Live table with `Created` and `Paid` statuses.
- **Instant Merchant Refunds:** Reverses payments with one click, marks status as `refunded`, deducts settlement balance, and updates the consumer ledger.
- **Developer API & Webhooks:** Live vs Test mode switch, 1-click API Key generator (`ARRAI_KEY_ID` & `ARRAI_KEY_SECRET`), Webhook URL dispatcher with real-time JSON payload viewer, and SDK code integration snippets in cURL, Node.js, Python, and React.

---

## 🛠️ How to Run Locally

```bash
# 1. Install dependencies
npm install

# 2. Start Vite development server
npm run dev

# 3. Build for production
npm run build
```
