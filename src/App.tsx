import { ArraiPulseView } from './components/social/ArraiPulseView';
import { ArraiProView } from './components/social/ArraiProView';
import { ArraiCallerView } from './components/telephony/ArraiCallerView';
import { MerchantSettingsView } from './components/merchant/MerchantSettingsView';
import { ArraiMapModal } from './components/consumer/ArraiMapModal';
import { ArraiStoreView } from './components/store/ArraiStoreView';
import { ArraiChessView } from './components/games/ArraiChessView';
import { AuthView } from './components/auth/AuthView';
import React, { useState } from 'react';
import { AppStoreProvider, useAppStore } from './store/useAppStore';
import { Navbar } from './components/common/Navbar';
import { Sidebar } from './components/common/Sidebar';
import { MobileBottomNav } from './components/common/MobileBottomNav';
import { Smartphone, History, Gift, Zap, ArrowLeft } from 'lucide-react';

// Super App Home Hub
import { SuperAppHome } from './components/home/SuperAppHome';

// Consumer Views
import { ConsumerHome } from './components/consumer/ConsumerHome';
import { WhatsAppChatPay } from './components/consumer/WhatsAppChatPayModal';
import { PassbookView } from './components/consumer/PassbookView';
import { RewardsView } from './components/consumer/RewardsView';
import { BbpsBillPayGrid } from './components/consumer/BbpsBillPayGrid';

// Social Views (ARRAI Gram & Connect)
import { ArraiGramView } from './components/social/ArraiGramView';
import { ArraiConnectView } from './components/social/ArraiConnectView';

// Profile & Settings
import { ProfileSettingsView } from './components/profile/ProfileSettingsView';

// Merchant Views
import { MerchantDashboard } from './components/merchant/MerchantDashboard';
import { PaymentLinksView } from './components/merchant/PaymentLinksView';
import { MerchantTransactionsView } from './components/merchant/MerchantTransactionsView';
import { DeveloperWebhooksView } from './components/merchant/DeveloperWebhooksView';

// Core Payment & QR Modals
import { UpiPinPadModal } from './components/consumer/UpiPinPadModal';
import { PaymentSuccessModal } from './components/consumer/PaymentSuccessModal';
import { AddMoneyModal } from './components/consumer/AddMoneyModal';
import { TransferModal } from './components/consumer/TransferModal';
import { QrScannerModal } from './components/consumer/QrScannerModal';
import { MyQrModal } from './components/consumer/MyQrModal';
import { BillPayModal } from './components/consumer/BillPayModal';
import { CheckoutModal } from './components/merchant/CheckoutModal';

// New Extensions & Super-App Modals
import { CheckBalanceModal } from './components/consumer/CheckBalanceModal';
import { PersonalLoanModal } from './components/consumer/PersonalLoanModal';
import { DigitalGoldModal } from './components/consumer/DigitalGoldModal';
import { CreditScoreModal } from './components/consumer/CreditScoreModal';
import { InsuranceModal } from './components/consumer/InsuranceModal';
import { BnplModal } from './components/consumer/BnplModal';
import { ArraiStoreModal } from './components/consumer/ArraiStoreModal';
import { ArraiDigilockerModal } from './components/consumer/ArraiDigilockerModal';

import { Contact } from './types';

const MainAppContent: React.FC = () => {
  const { 
    mode, 
    activeSection, 
    setActiveSection, 
    consumerTab, 
    setConsumerTab, 
    merchantTab, 
    setMerchantTab,
    openModal,
    isAuthenticated
  } = useAppStore();
  const [chatContact, setChatContact] = useState<Contact | null>(null);

  const currentTab = mode === 'consumer' ? consumerTab : merchantTab;

  const handleSelectTab = (tab: string) => {
    if (mode === 'consumer') {
      setConsumerTab(tab);
    } else {
      setMerchantTab(tab);
    }
  };

  const handleOpenChat = (contact: Contact) => {
    setChatContact(contact);
    setActiveSection('chat');
  };

  // Require Login: User must authenticate to access ARRAI SuperApp
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex flex-col justify-center items-center p-4 py-8">
        <AuthView initialMode={activeSection === 'signup' ? 'signup' : 'login'} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900 pb-20 md:pb-6">
      
      {/* 1. Global Sticky Navbar with ARRAI Suite Switcher */}
      <Navbar />

      {/* 2. Main Viewport: Sidebar + Active Section Workspace */}
      <div className="max-w-7xl mx-auto w-full px-3 sm:px-6 lg:px-8 flex-1 flex gap-6 mt-4">
        
        {/* Desktop Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={handleSelectTab}
        />

        {/* Dynamic Super-App Section Container */}
        <main className="flex-1 min-w-0">
          
                    {/* SECTION 7: ARRAI Store Dedicated Hub */}
          {activeSection === 'store' && (
            <ArraiStoreView />
          )}

          {/* SECTION: ARRAI Pulse (Microblogging) */}
          {activeSection === 'pulse' && (
            <ArraiPulseView />
          )}

          {/* SECTION: ARRAI Pro Network (Careers & Jobs) */}
          {activeSection === 'pro' && (
            <ArraiProView />
          )}

          {/* SECTION: ARRAI Caller (Dialer & True Shield) */}
          {activeSection === 'caller' && (
            <ArraiCallerView />
          )}

          {/* SECTION: ARRAI Chess Arena (Grandmaster Edition) */}
          {activeSection === 'chess' && (
            <ArraiChessView />
          )}

{/* SECTION 0: ARRAI Super App Home Hub */}
          {activeSection === 'home' && (
            <SuperAppHome onOpenChat={handleOpenChat} />
          )}

          {/* SECTION 1: ARRAI Pay (UPI, Wallet, BBPS, Passbook, Rewards) */}
          {activeSection === 'pay' && (
            <div className="space-y-4">
              {/* Pay Navigation Header / Sub Tabs (Always Accessible) */}
              <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs overflow-x-auto">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setConsumerTab('home')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      consumerTab === 'home'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Smartphone className="w-3.5 h-3.5" />
                    <span>Pay Home</span>
                  </button>
                  <button
                    onClick={() => setConsumerTab('passbook')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      consumerTab === 'passbook'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Passbook & Ledger</span>
                  </button>
                  <button
                    onClick={() => setConsumerTab('rewards')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      consumerTab === 'rewards'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Gift className="w-3.5 h-3.5" />
                    <span>Rewards & Scratch</span>
                  </button>
                  <button
                    onClick={() => setConsumerTab('bbps')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      consumerTab === 'bbps'
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>BBPS Bill Pay</span>
                  </button>
                </div>

                {consumerTab !== 'home' && (
                  <button
                    onClick={() => setConsumerTab('home')}
                    className="text-xs font-bold text-indigo-600 hover:text-indigo-800 px-2.5 py-1.5 rounded-lg hover:bg-indigo-50 flex items-center gap-1 shrink-0 ml-2 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to Pay</span>
                  </button>
                )}
              </div>

              {consumerTab === 'home' && (
                <ConsumerHome
                  onSelectTab={handleSelectTab}
                  onOpenChat={handleOpenChat}
                />
              )}

              {consumerTab === 'passbook' && (
                <PassbookView />
              )}

              {consumerTab === 'rewards' && (
                <RewardsView />
              )}

              {consumerTab === 'bbps' && (
                <div className="space-y-4">
                  <BbpsBillPayGrid />
                  <PassbookView />
                </div>
              )}
            </div>
          )}

          {/* SECTION 2: ARRAI Chat (WhatsApp Re-engineered) */}
          {activeSection === 'chat' && (
            <WhatsAppChatPay
              initialContact={chatContact}
              onClose={() => setActiveSection('home')}
            />
          )}

          {/* SECTION 3: ARRAI Gram (Instagram Re-engineered) */}
          {activeSection === 'gram' && (
            <ArraiGramView />
          )}

          {/* SECTION 4: ARRAI Connect (Facebook / Communities Re-engineered) */}
          {activeSection === 'connect' && (
            <ArraiConnectView />
          )}

          {/* SECTION 5: Profile & Settings */}
          {activeSection === 'settings' && (
            <ProfileSettingsView />
          )}

          {/* SECTION: Authentication (Sign In & Sign Up) */}
          {(activeSection === 'login' || activeSection === 'signup') && (
            <AuthView initialMode={activeSection === 'signup' ? 'signup' : 'login'} />
          )}

          {/* SECTION 6: ARRAI Merchant Suite & Gateway */}
          {activeSection === 'merchant' && (
            <div className="space-y-4">
              {/* Universal Merchant Sub-Navigation Bar (Always Visible) */}
              <div className="flex items-center justify-between bg-white rounded-2xl border border-slate-200 p-1.5 shadow-xs overflow-x-auto">
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setMerchantTab('dashboard')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      merchantTab === 'dashboard'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>📊 Dashboard</span>
                  </button>

                  <button
                    onClick={() => setMerchantTab('links')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      merchantTab === 'links'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>🔗 Payment Links</span>
                  </button>

                  <button
                    onClick={() => setMerchantTab('transactions')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      merchantTab === 'transactions'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>💳 Transactions & Refunds</span>
                  </button>

                  <button
                    onClick={() => setMerchantTab('developer')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      merchantTab === 'developer'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>⚡ API Keys & Webhooks</span>
                  </button>

                  <button
                    onClick={() => setMerchantTab('settings')}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      merchantTab === 'settings'
                        ? 'bg-teal-700 text-white shadow-xs'
                        : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                    }`}
                  >
                    <span>⚙️ Merchant Settings</span>
                  </button>
                </div>

                <button
                  onClick={() => openModal('merchantCheckout')}
                  className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-xs shrink-0 ml-2 transition-all"
                >
                  Checkout Modal
                </button>
              </div>

              {merchantTab === 'dashboard' && (
                <MerchantDashboard
                  onSelectTab={handleSelectTab}
                />
              )}

              {merchantTab === 'links' && (
                <PaymentLinksView />
              )}

              {merchantTab === 'transactions' && (
                <MerchantTransactionsView />
              )}

              {merchantTab === 'developer' && (
                <DeveloperWebhooksView />
              )}

              {merchantTab === 'settings' && (
                <MerchantSettingsView />
              )}
            </div>
          )}
        </main>
      </div>

      {/* 3. Mobile Bottom Nav — no props needed, self-contained */}
      <MobileBottomNav />

      {/* 4. Global Modals and Step-by-Step Drawers */}
      <UpiPinPadModal />
      <PaymentSuccessModal />
      <AddMoneyModal />
      <TransferModal />
      <QrScannerModal />
      <MyQrModal />
      <BillPayModal />
      <CheckoutModal />

      {/* 5. ARRAI Super-App & FinTech Extensions Modals */}
      <CheckBalanceModal />
      <PersonalLoanModal />
      <DigitalGoldModal />
      <CreditScoreModal />
      <InsuranceModal />
      <BnplModal />
      <ArraiMapModal />
      <ArraiStoreModal />
      <ArraiDigilockerModal />

    </div>
  );
};

export default function App() {
  return (
    <AppStoreProvider>
      <MainAppContent />
    </AppStoreProvider>
  );
}
