import React, { useState, useRef, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { Contact, ChatMessage, CallLog, ChatStatusItem } from '../../types';
import { 
  Send, 
  Paperclip, 
  Plus, 
  IndianRupee, 
  Check, 
  CheckCheck, 
  Phone, 
  Video, 
  MoreVertical, 
  ArrowLeft, 
  ShieldCheck, 
  CreditCard, 
  Smile, 
  X, 
  Loader2, 
  Receipt,
  Lock,
  Wallet,
  Mic,
  Camera,
  Image as ImageIcon,
  PhoneCall,
  PhoneOff,
  PhoneIncoming,
  PhoneOutgoing,
  Clock,
  Volume2,
  Users,
  UserCheck,
  Star,
  QrCode,
  Laptop,
  CheckCircle,
  Settings,
  Bell,
  Eye,
  EyeOff,
  History,
  Archive,
  Palette,
  Calendar,
  Shield,
  KeyRound,
  Radio,
  FileText,
  UserX,
  ChevronRight,
  Globe,
  Share2
} from 'lucide-react';

interface WhatsAppChatPayProps {
  onClose?: () => void;
  initialContact?: Contact | null;
}

export const WhatsAppChatPay: React.FC<WhatsAppChatPayProps> = ({ onClose, initialContact }) => {
  const { 
    contacts, 
    chatMessages, 
    sendChatText, 
    executeChatPayment, 
    walletBalance, 
    openModal,
    userProfile,
    setActiveSection,
    setMode,
    setConsumerTab
  } = useAppStore();

  const [activeTab, setActiveTab] = useState<'chats' | 'status' | 'calls'>('chats');
  const [selectedContact, setSelectedContact] = useState<Contact>(initialContact || contacts[0]);
  const [inputText, setInputText] = useState('');
  const [showAttachMenu, setShowAttachMenu] = useState(false);
  const [showPayDrawer, setShowPayDrawer] = useState(false);
  const [payAmount, setPayAmount] = useState('500');
  const [payNote, setPayNote] = useState('Dinner split');
  const [pinInput, setPinInput] = useState('');
  const [isSubmittingPay, setIsSubmittingPay] = useState(false);
  const [payError, setPayError] = useState<string | null>(null);

  // WhatsApp 3-dots Menu & Settings Modal state
  const [showThreeDotMenu, setShowThreeDotMenu] = useState(false);
  const [activeSettingsModal, setActiveSettingsModal] = useState<
    'main' | 'account' | 'privacy' | 'chats' | 'notifications' | 'appearance' | 'events' | 'parental' | 'linkedDevices' | null
  >(null);
  const [disappearingMessages, setDisappearingMessages] = useState(false);
  const [readReceipts, setReadReceipts] = useState(true);
  const [chatTheme, setChatTheme] = useState<'system' | 'dark' | 'light'>('system');
  const [chatWallpaper, setChatWallpaper] = useState('doodle');
  const [menuToast, setMenuToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setMenuToast(msg);
    setTimeout(() => setMenuToast(null), 2500);
  };


  // Voice recording simulator
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);

  // Active Call Simulator
  const [activeCall, setActiveCall] = useState<{ contact: Contact; type: 'audio' | 'video' } | null>(null);
  const [callDuration, setCallDuration] = useState(0);

  // Status updates state
  const [statusList, setStatusList] = useState<ChatStatusItem[]>([
    {
      id: 'st_1',
      author: contacts[1], // Priya
      mediaUrl: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
      text: 'Weekend getaway in Gokarna 🌊',
      timestamp: 'Today, 10:15 AM',
      viewed: false
    },
    {
      id: 'st_2',
      author: contacts[0], // Rahul
      mediaUrl: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=400',
      text: 'Shipping the new ARRAI update 💻🚀',
      timestamp: 'Today, 8:40 AM',
      viewed: false
    }
  ]);

  // Calls list
  const [callLogs] = useState<CallLog[]>([
    {
      id: 'call_1',
      contact: contacts[0],
      type: 'incoming',
      media: 'video',
      timestamp: 'Yesterday, 8:30 PM',
      duration: '4m 12s'
    },
    {
      id: 'call_2',
      contact: contacts[1],
      type: 'outgoing',
      media: 'audio',
      timestamp: '2 days ago',
      duration: '12m 45s'
    },
    {
      id: 'call_3',
      contact: contacts[2],
      type: 'missed',
      media: 'audio',
      timestamp: '3 days ago'
    }
  ]);

  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const activeMessages: ChatMessage[] = chatMessages[selectedContact.id] || [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeMessages]);

  // Call timer simulation
  useEffect(() => {
    let interval: any;
    if (activeCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeCall]);

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;
    const text = inputText;
    setInputText('');
    await sendChatText(selectedContact.id, text);
  };

  const handleSendVoiceNote = async () => {
    setIsRecordingVoice(true);
    setTimeout(async () => {
      setIsRecordingVoice(false);
      await sendChatText(selectedContact.id, '🎤 Voice note (0:08)');
    }, 1500);
  };

  const handleInlinePay = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseFloat(payAmount);
    if (!val || val <= 0) return;
    if (pinInput.length !== 4 && pinInput.length !== 6) {
      setPayError('Please enter a 4-digit MPIN');
      return;
    }

    setIsSubmittingPay(true);
    setPayError(null);

    const success = await executeChatPayment(selectedContact.id, val, payNote, pinInput);
    setIsSubmittingPay(false);

    if (success) {
      setShowPayDrawer(false);
      setPinInput('');
    } else {
      setPayError('Payment could not be completed. Check wallet balance or PIN.');
    }
  };

  const formatCallTime = (secs: number) => {
    const mins = Math.floor(secs / 60);
    const remainder = secs % 60;
    return `${mins.toString().padStart(2, '0')}:${remainder.toString().padStart(2, '0')}`;
  };

  const quickAmounts = [100, 200, 500, 1000, 2000];

  return (
    <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-sm h-[calc(100vh-8.5rem)] md:h-[650px] flex">
      
      {/* LEFT: WhatsApp Sidebar (Chats, Status, Calls) */}
      <div className={`w-full md:w-80 border-r border-slate-200 flex flex-col bg-slate-50 shrink-0 ${
        selectedContact && 'hidden md:flex'
      }`}>
        
        {/* Top Header with 3-Dots Menu */}
        <div className="p-4 border-b border-slate-200 bg-emerald-800 text-white flex items-center justify-between relative">
          <div className="flex items-center gap-2">
            <span className="text-lg">💬</span>
            <h3 className="font-bold text-sm tracking-tight">ARRAI Chat</h3>
          </div>
          
          <div className="flex items-center gap-1.5 relative">
            <span className="text-[10px] font-bold bg-white/20 text-white px-2 py-0.5 rounded-full">
              Encrypted
            </span>
            
            <button
              onClick={() => setShowThreeDotMenu(!showThreeDotMenu)}
              className="p-1 rounded-lg hover:bg-white/10 text-white transition-colors"
              title="Menu"
            >
              <MoreVertical className="w-5 h-5" />
            </button>

            {/* WhatsApp Style 3-Dot Dropdown Menu */}
            {showThreeDotMenu && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowThreeDotMenu(false)} 
                />
                <div className="absolute right-0 top-10 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 py-2 z-50 text-slate-800 animate-in zoom-in-95 duration-150">
                  <button
                    onClick={() => { setShowThreeDotMenu(false); showToast('New Group creation started'); }}
                    className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                  >
                    <Users className="w-4 h-4 text-emerald-600" />
                    <span>New Group</span>
                  </button>

                  <button
                    onClick={() => { setShowThreeDotMenu(false); showToast('New Community opened'); }}
                    className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                  >
                    <UserCheck className="w-4 h-4 text-indigo-600" />
                    <span>New Community</span>
                  </button>

                  <button
                    onClick={() => { setShowThreeDotMenu(false); setActiveSettingsModal('linkedDevices'); }}
                    className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                  >
                    <Laptop className="w-4 h-4 text-blue-600" />
                    <span>Linked Devices</span>
                  </button>

                  <button
                    onClick={() => { setShowThreeDotMenu(false); showToast('⭐ Starred Messages view'); }}
                    className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                  >
                    <Star className="w-4 h-4 text-amber-500" />
                    <span>Starred Messages</span>
                  </button>

                  <button
                    onClick={() => { setShowThreeDotMenu(false); setShowPayDrawer(true); }}
                    className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                  >
                    <CreditCard className="w-4 h-4 text-emerald-600" />
                    <span>Payments & UPI</span>
                  </button>

                  <button
                    onClick={() => { setShowThreeDotMenu(false); showToast('✓ All messages marked as read'); }}
                    className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                  >
                    <CheckCircle className="w-4 h-4 text-teal-600" />
                    <span>Mark all read</span>
                  </button>

                  <button
                    onClick={() => { setShowThreeDotMenu(false); showToast('Account switcher opened'); }}
                    className="w-full px-4 py-2 text-left text-xs font-bold hover:bg-slate-50 flex items-center gap-2.5 text-slate-700"
                  >
                    <Radio className="w-4 h-4 text-violet-600" />
                    <span>Switch Account</span>
                  </button>

                  <div className="my-1 border-t border-slate-100" />

                  <button
                    onClick={() => { setShowThreeDotMenu(false); setActiveSettingsModal('main'); }}
                    className="w-full px-4 py-2 text-left text-xs font-black text-emerald-700 hover:bg-emerald-50 flex items-center gap-2.5"
                  >
                    <Settings className="w-4 h-4 text-emerald-700" />
                    <span>Chat Settings</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* WhatsApp Tabs (Chats, Status, Calls) */}
        <div className="grid grid-cols-3 bg-emerald-900 text-emerald-200 text-xs font-bold border-b border-emerald-950">
          <button
            onClick={() => setActiveTab('chats')}
            className={`py-2.5 text-center border-b-2 transition-all ${
              activeTab === 'chats' ? 'border-white text-white bg-white/10' : 'border-transparent text-emerald-300'
            }`}
          >
            Chats ({contacts.length})
          </button>
          <button
            onClick={() => setActiveTab('status')}
            className={`py-2.5 text-center border-b-2 transition-all ${
              activeTab === 'status' ? 'border-white text-white bg-white/10' : 'border-transparent text-emerald-300'
            }`}
          >
            Status
          </button>
          <button
            onClick={() => setActiveTab('calls')}
            className={`py-2.5 text-center border-b-2 transition-all ${
              activeTab === 'calls' ? 'border-white text-white bg-white/10' : 'border-transparent text-emerald-300'
            }`}
          >
            Calls
          </button>
        </div>

        {/* Tab 1: Chats List */}
        {activeTab === 'chats' && (
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {contacts.map((c) => {
              const msgs = chatMessages[c.id] || [];
              const lastMsg = msgs[msgs.length - 1];
              const isSelected = selectedContact.id === c.id;

              return (
                <div
                  key={c.id}
                  onClick={() => setSelectedContact(c)}
                  className={`p-3.5 flex items-center gap-3 cursor-pointer transition-colors ${
                    isSelected ? 'bg-emerald-50 border-l-4 border-emerald-600' : 'hover:bg-white'
                  }`}
                >
                  <div className="relative shrink-0">
                    <img src={c.avatar} alt={c.name} className="w-11 h-11 rounded-2xl object-cover shadow-xs" />
                    <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 ring-2 ring-white" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 truncate">{c.name}</span>
                      <span className="text-[10px] text-slate-400 font-medium">
                        {lastMsg ? lastMsg.timestamp.split(' ')[0] : 'Online'}
                      </span>
                    </div>

                    <p className="text-[11px] text-slate-500 truncate mt-0.5 flex items-center gap-1">
                      {lastMsg ? (
                        lastMsg.type === 'payment_sent' ? (
                          <span className="text-emerald-700 font-bold flex items-center gap-0.5">
                            ✓ Sent ₹{lastMsg.amount}
                          </span>
                        ) : lastMsg.type === 'payment_received' ? (
                          <span className="text-indigo-700 font-bold flex items-center gap-0.5">
                            ✓ Received ₹{lastMsg.amount}
                          </span>
                        ) : (
                          <span>{lastMsg.content}</span>
                        )
                      ) : (
                        <span>Tap to start chat & pay</span>
                      )}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Tab 2: Status / Stories View */}
        {activeTab === 'status' && (
          <div className="overflow-y-auto flex-1 p-3 space-y-4">
            {/* My Status */}
            <div className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white cursor-pointer">
              <div className="relative">
                <img src={userProfile.avatar} alt="" className="w-12 h-12 rounded-full object-cover" />
                <span className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold ring-2 ring-white">+</span>
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">My Status</h4>
                <p className="text-[10px] text-slate-500">Tap to add status update</p>
              </div>
            </div>

            <div className="space-y-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block px-2">
                Recent Updates
              </span>
              {statusList.map((st) => (
                <div key={st.id} className="flex items-center gap-3 p-2 rounded-2xl hover:bg-white cursor-pointer">
                  <div className="p-0.5 rounded-full ring-2 ring-emerald-500">
                    <img src={st.author.avatar} alt="" className="w-11 h-11 rounded-full object-cover" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{st.author.name}</h4>
                    <p className="text-[11px] text-slate-600 line-clamp-1">{st.text}</p>
                    <span className="text-[9px] text-slate-400">{st.timestamp}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Tab 3: Calls Log */}
        {activeTab === 'calls' && (
          <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
            {callLogs.map((call) => (
              <div key={call.id} className="p-3.5 flex items-center justify-between hover:bg-white cursor-pointer">
                <div className="flex items-center gap-3">
                  <img src={call.contact.avatar} alt="" className="w-10 h-10 rounded-2xl object-cover" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">{call.contact.name}</h4>
                    <div className="flex items-center gap-1 text-[10px] text-slate-500">
                      {call.type === 'incoming' && <PhoneIncoming className="w-3 h-3 text-emerald-600" />}
                      {call.type === 'outgoing' && <PhoneOutgoing className="w-3 h-3 text-blue-600" />}
                      {call.type === 'missed' && <PhoneCall className="w-3 h-3 text-rose-500" />}
                      <span>{call.timestamp} {call.duration ? `(${call.duration})` : ''}</span>
                    </div>
                  </div>
                </div>

                <button 
                  onClick={() => setActiveCall({ contact: call.contact, type: call.media })}
                  className="p-2 text-emerald-700 hover:bg-emerald-50 rounded-xl"
                >
                  {call.media === 'video' ? <Video className="w-4 h-4" /> : <Phone className="w-4 h-4" />}
                </button>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* RIGHT: Active Chat Conversation */}
      <div className={`flex-1 flex flex-col bg-[#efeae2] relative ${
        !selectedContact && 'hidden md:flex'
      }`}>
        
        {/* Chat Header */}
        <div className="p-3.5 bg-slate-900 text-white flex items-center justify-between shrink-0 shadow-xs z-10">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSelectedContact(null as any)}
              className="md:hidden p-1 rounded-lg text-slate-300 hover:text-white"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="relative">
              <img src={selectedContact.avatar} alt={selectedContact.name} className="w-9 h-9 rounded-xl object-cover" />
              <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-1 ring-slate-900" />
            </div>

            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-xs text-white">{selectedContact.name}</span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-bold px-1.5 py-0.2 rounded border border-emerald-500/30">
                  ARRAI Verified
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-mono block">{selectedContact.vpa}</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            
            {/* Audio Call Button */}
            <button
              onClick={() => setActiveCall({ contact: selectedContact, type: 'audio' })}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Voice Call"
            >
              <Phone className="w-4 h-4" />
            </button>

            {/* Video Call Button */}
            <button
              onClick={() => setActiveCall({ contact: selectedContact, type: 'video' })}
              className="p-2 text-slate-300 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
              title="Video Call"
            >
              <Video className="w-4 h-4" />
            </button>

            {/* Direct Pay Action */}
            <button
              onClick={() => setShowPayDrawer(true)}
              className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold flex items-center gap-1 shadow-sm transition-all active:scale-95"
            >
              <IndianRupee className="w-3.5 h-3.5" />
              Pay
            </button>
          </div>
        </div>

        {/* Messages Stream */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {/* Security note bubble */}
          <div className="mx-auto max-w-xs text-center py-1.5 px-3 rounded-xl bg-amber-100/90 text-amber-900 text-[10px] font-medium border border-amber-200 shadow-xs flex items-center justify-center gap-1">
            <Lock className="w-3 h-3 text-amber-700" />
            <span>Messages & UPI payments are end-to-end encrypted by NPCI.</span>
          </div>

          {activeMessages.map((msg) => {
            const isMe = msg.sender === 'user';

            // Payment Sent Card Bubble
            if (msg.type === 'payment_sent') {
              return (
                <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                  <div className="max-w-xs bg-emerald-700 text-white rounded-2xl p-4 shadow-md space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-emerald-100">
                      <span className="font-semibold uppercase tracking-wider">Payment Sent</span>
                      <span className="font-mono">{msg.timestamp}</span>
                    </div>

                    <div className="text-2xl font-black font-mono text-white">
                      ₹{msg.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>

                    {msg.note && (
                      <p className="text-xs text-emerald-100 italic">"{msg.note}"</p>
                    )}

                    <div className="pt-2 border-t border-emerald-600 flex items-center justify-between text-[10px] text-emerald-200">
                      <span className="flex items-center gap-1">
                        <CheckCheck className="w-3.5 h-3.5 text-white" />
                        Completed via ARRAI Pay
                      </span>
                      <button
                        onClick={() => {
                          setMode('consumer');
                          setConsumerTab('passbook');
                          setActiveSection('pay');
                        }}
                        className="underline hover:text-white"
                      >
                        Receipt
                      </button>
                    </div>
                  </div>
                </div>
              );
            }

            // Payment Received Bubble
            if (msg.type === 'payment_received') {
              return (
                <div key={msg.id} className="flex justify-start">
                  <div className="max-w-xs bg-white text-slate-900 rounded-2xl p-4 shadow-md border border-slate-200 space-y-2">
                    <div className="flex items-center justify-between text-[11px] text-indigo-600 font-bold">
                      <span>Payment Received</span>
                      <span className="font-mono text-slate-400">{msg.timestamp}</span>
                    </div>

                    <div className="text-2xl font-black font-mono text-slate-900">
                      ₹{msg.amount?.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </div>

                    {msg.note && (
                      <p className="text-xs text-slate-600 italic">"{msg.note}"</p>
                    )}

                    <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                      <span className="text-emerald-600 font-semibold">Credited to ARRAI Wallet</span>
                    </div>
                  </div>
                </div>
              );
            }

            // Normal Text Message Bubble
            return (
              <div key={msg.id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 shadow-xs text-xs ${
                  isMe 
                    ? 'bg-[#d9fdd3] text-slate-900 rounded-tr-xs' 
                    : 'bg-white text-slate-900 rounded-tl-xs'
                }`}>
                  <p className="leading-relaxed">{msg.content}</p>
                  <div className="flex items-center justify-end gap-1 mt-1 text-[9px] text-slate-500">
                    <span>{msg.timestamp}</span>
                    {isMe && <CheckCheck className="w-3 h-3 text-emerald-600" />}
                  </div>
                </div>
              </div>
            );
          })}
          <div ref={messagesEndRef} />
        </div>

        {/* Quick Amount Pills */}
        <div className="px-4 py-1.5 bg-slate-100/90 border-t border-slate-200 flex items-center gap-2 overflow-x-auto scrollbar-none">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider shrink-0">
            Quick Pay:
          </span>
          {quickAmounts.map((val) => (
            <button
              key={val}
              onClick={() => {
                setPayAmount(val.toString());
                setShowPayDrawer(true);
              }}
              className="px-2.5 py-1 bg-white hover:bg-emerald-50 hover:border-emerald-400 border border-slate-200 text-slate-700 hover:text-emerald-700 rounded-lg text-xs font-bold transition-all shadow-2xs whitespace-nowrap"
            >
              ₹{val}
            </button>
          ))}
        </div>

        {/* Bottom Input Field Bar with Voice Note & Attach Menu */}
        <form onSubmit={handleSendText} className="p-3 bg-white border-t border-slate-200 flex items-center gap-2 shrink-0">
          
          <button
            type="button"
            onClick={() => setShowPayDrawer(!showPayDrawer)}
            className="p-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 rounded-xl transition-colors font-bold flex items-center gap-1 text-xs"
            title="Pay in Chat"
          >
            <IndianRupee className="w-4 h-4" />
            <span className="hidden sm:inline">Pay</span>
          </button>

          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder={`Message or pay ${selectedContact.name}...`}
            className="flex-1 py-2.5 px-4 bg-slate-100 border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-emerald-500 focus:bg-white"
          />

          {inputText.trim() ? (
            <button
              type="submit"
              className="p-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl transition-all shadow-xs"
            >
              <Send className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleSendVoiceNote}
              className={`p-2.5 rounded-xl transition-all shadow-xs ${
                isRecordingVoice ? 'bg-rose-600 text-white animate-pulse' : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
              title="Send Voice Note"
            >
              <Mic className="w-4 h-4" />
            </button>
          )}
        </form>

        {/* INLINE PAY DRAWER */}
        {showPayDrawer && (
          <div className="absolute inset-x-0 bottom-0 bg-white border-t-2 border-emerald-500 rounded-t-3xl shadow-2xl p-5 z-20 animate-in slide-in-from-bottom duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                  ₹
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-900">
                    Pay {selectedContact.name}
                  </h4>
                  <p className="text-[10px] text-slate-500 font-mono">{selectedContact.vpa}</p>
                </div>
              </div>

              <button
                onClick={() => setShowPayDrawer(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleInlinePay} className="pt-3 space-y-3">
              {payError && (
                <div className="p-2 bg-rose-50 text-rose-700 text-xs rounded-xl border border-rose-200">
                  {payError}
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">Amount (₹)</label>
                  <input
                    type="number"
                    value={payAmount}
                    onChange={(e) => setPayAmount(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-base font-bold font-mono text-slate-900 mt-1"
                    required
                  />
                </div>

                <div>
                  <label className="text-[10px] font-bold text-slate-600 uppercase">UPI MPIN</label>
                  <input
                    type="password"
                    maxLength={6}
                    placeholder="••••"
                    value={pinInput}
                    onChange={(e) => setPinInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-base font-mono font-bold tracking-widest text-slate-900 mt-1"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-slate-600 uppercase">Payment Note</label>
                <input
                  type="text"
                  value={payNote}
                  onChange={(e) => setPayNote(e.target.value)}
                  placeholder="e.g. Lunch split, chai, rent"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 mt-1"
                />
              </div>

              <div className="flex items-center justify-between text-xs text-slate-500 pt-1">
                <span>Paying from ARRAI Wallet</span>
                <span className="font-mono font-bold text-slate-800">
                  Bal: ₹{walletBalance.toLocaleString('en-IN')}
                </span>
              </div>

              <button
                type="submit"
                disabled={isSubmittingPay}
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmittingPay ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Completing UPI Transfer...
                  </>
                ) : (
                  `Confirm & Send ₹${parseFloat(payAmount || '0').toLocaleString('en-IN')}`
                )}
              </button>
            </form>
          </div>
        )}

      </div>

      {/* ACTIVE CALL OVERLAY MODAL */}
      {activeCall && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-6 text-white animate-in zoom-in-95">
          <div className="text-center pt-8 space-y-2">
            <span className="text-xs uppercase font-bold text-emerald-400 tracking-wider">
              ARRAI Encrypted {activeCall.type === 'video' ? 'Video' : 'Voice'} Call
            </span>
            <div className="text-sm font-mono text-slate-300">
              {formatCallTime(callDuration)}
            </div>
          </div>

          <div className="text-center space-y-4">
            <div className="relative mx-auto w-28 h-28 rounded-full overflow-hidden ring-4 ring-emerald-500/50 shadow-2xl">
              <img src={activeCall.contact.avatar} alt="" className="w-full h-full object-cover" />
            </div>
            <div>
              <h2 className="text-2xl font-black">{activeCall.contact.name}</h2>
              <p className="text-xs text-slate-400 font-mono mt-1">{activeCall.contact.vpa}</p>
            </div>
          </div>

          {/* Call Controls */}
          <div className="pb-8 flex items-center justify-center gap-6">
            <button className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white shadow-lg">
              <Mic className="w-6 h-6" />
            </button>

            <button
              onClick={() => setActiveCall(null)}
              className="p-5 rounded-full bg-rose-600 hover:bg-rose-700 text-white shadow-xl shadow-rose-600/40 active:scale-95 transition-all"
            >
              <PhoneOff className="w-7 h-7" />
            </button>

            <button className="p-4 rounded-full bg-slate-800 hover:bg-slate-700 text-white shadow-lg">
              <Volume2 className="w-6 h-6" />
            </button>
          </div>
        </div>
      )}


      {/* Toast Notification */}
      {menuToast && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs font-bold px-4 py-2 rounded-2xl shadow-xl backdrop-blur-sm animate-in fade-in duration-200">
          {menuToast}
        </div>
      )}

      {/* ══ FULL WHATSAPP SETTINGS MODAL ══════════════════════════════════ */}
      {activeSettingsModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 animate-in fade-in">
          <div className="bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 flex flex-col max-h-[85vh]">
            
            {/* Modal Header */}
            <div className="bg-emerald-800 text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {activeSettingsModal !== 'main' && (
                  <button
                    onClick={() => setActiveSettingsModal('main')}
                    className="p-1.5 rounded-xl hover:bg-white/10 text-white"
                  >
                    <ArrowLeft className="w-5 h-5" />
                  </button>
                )}
                <div>
                  <h3 className="font-bold text-sm">
                    {activeSettingsModal === 'main' && 'ARRAI Chat Settings'}
                    {activeSettingsModal === 'account' && 'Account Settings'}
                    {activeSettingsModal === 'privacy' && 'Privacy Settings'}
                    {activeSettingsModal === 'chats' && 'Chats & Backups'}
                    {activeSettingsModal === 'notifications' && 'Notification Preferences'}
                    {activeSettingsModal === 'appearance' && 'Appearance & Wallpaper'}
                    {activeSettingsModal === 'events' && 'Events & Reminders'}
                    {activeSettingsModal === 'parental' && 'Parental Controls'}
                    {activeSettingsModal === 'linkedDevices' && 'Linked Devices'}
                  </h3>
                  <p className="text-[10px] text-emerald-200">End-to-End Encrypted</p>
                </div>
              </div>
              <button
                onClick={() => setActiveSettingsModal(null)}
                className="p-1.5 rounded-xl hover:bg-white/10 text-emerald-100 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              
              {/* 1. MAIN SETTINGS LIST */}
              {activeSettingsModal === 'main' && (
                <div className="space-y-1.5">
                  {/* User Profile Card */}
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3 mb-3">
                    <img src={userProfile.avatar} alt={userProfile.name} className="w-12 h-12 rounded-2xl object-cover ring-2 ring-emerald-500" />
                    <div className="min-w-0 flex-1">
                      <h4 className="font-bold text-sm text-slate-900 truncate">{userProfile.name}</h4>
                      <p className="text-[11px] text-slate-500 font-mono">{userProfile.phone}</p>
                      <p className="text-[10px] text-emerald-600 truncate">{userProfile.bio || 'Hey there! I am using ARRAI Chat'}</p>
                    </div>
                  </div>

                  {[
                    { id: 'account', label: 'Account', sub: 'Security notifications, change number, passkeys', icon: KeyRound, color: 'text-blue-600 bg-blue-50' },
                    { id: 'privacy', label: 'Privacy', sub: 'Block contacts, disappearing messages, status', icon: Shield, color: 'text-emerald-600 bg-emerald-50' },
                    { id: 'chats', label: 'Chats & History', sub: 'Chat history, cloud backup, archive all', icon: History, color: 'text-indigo-600 bg-indigo-50' },
                    { id: 'notifications', label: 'Notifications', sub: 'Message, group & call alert tones, vibration', icon: Bell, color: 'text-amber-600 bg-amber-50' },
                    { id: 'appearance', label: 'Appearance', sub: 'Dark/light theme, custom chat wallpaper', icon: Palette, color: 'text-pink-600 bg-pink-50' },
                    { id: 'events', label: 'Events & Broadcast', sub: 'Scheduled reminders, broadcast lists', icon: Calendar, color: 'text-purple-600 bg-purple-50' },
                    { id: 'parental', label: 'Parental Controls', sub: 'Safe mode, purchase limits, time restrictions', icon: Lock, color: 'text-rose-600 bg-rose-50' },
                  ].map(item => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveSettingsModal(item.id as any)}
                        className="w-full p-3 rounded-2xl hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all flex items-center justify-between text-left group"
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className={`p-2.5 rounded-xl ${item.color} shrink-0`}>
                            <Icon className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <span className="font-bold text-xs text-slate-800 block">{item.label}</span>
                            <span className="text-[10px] text-slate-400 truncate block">{item.sub}</span>
                          </div>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-600 shrink-0" />
                      </button>
                    );
                  })}
                </div>
              )}

              {/* 2. ACCOUNT SETTINGS */}
              {activeSettingsModal === 'account' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 block">Security Notifications</span>
                    <p className="text-[11px] text-slate-500">Get notified when your security code changes with a contact.</p>
                    <label className="flex items-center justify-between pt-1 cursor-pointer">
                      <span className="text-slate-700 font-medium">Show security alerts</span>
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    </label>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Change Phone Number</span>
                      <span className="text-[11px] text-slate-500">Current: {userProfile.phone}</span>
                    </div>
                    <button onClick={() => showToast('Number change verification initiated')} className="px-3 py-1 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100">
                      Edit
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Passkeys & Two-Step Verification</span>
                      <span className="text-[11px] text-slate-500">PIN protection active</span>
                    </div>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Active</span>
                  </div>
                </div>
              )}

              {/* 3. PRIVACY SETTINGS */}
              {activeSettingsModal === 'privacy' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Disappearing Messages</span>
                      <span className="text-[11px] text-slate-500">Auto-delete messages after 24h</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={disappearingMessages} 
                      onChange={(e) => {
                        setDisappearingMessages(e.target.checked);
                        showToast(e.target.checked ? 'Disappearing messages enabled (24h)' : 'Disappearing messages disabled');
                      }}
                      className="rounded text-emerald-600" 
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Read Receipts (Blue Ticks)</span>
                      <span className="text-[11px] text-slate-500">If turned off, you won't send or receive read receipts</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={readReceipts} 
                      onChange={(e) => {
                        setReadReceipts(e.target.checked);
                        showToast(e.target.checked ? 'Read receipts enabled' : 'Read receipts turned off');
                      }}
                      className="rounded text-emerald-600" 
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Blocked Accounts</span>
                      <span className="text-[11px] text-slate-500">0 contacts blocked</span>
                    </div>
                    <button onClick={() => showToast('No contacts currently blocked')} className="px-3 py-1 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100">
                      Manage
                    </button>
                  </div>
                </div>
              )}

              {/* 4. CHATS & HISTORY */}
              {activeSettingsModal === 'chats' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Chat Backup</span>
                      <span className="text-[11px] text-slate-500">Back up to encrypted local cloud</span>
                    </div>
                    <button 
                      onClick={() => showToast('✓ Chat history backed up successfully!')}
                      className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 shadow-xs"
                    >
                      Back Up Now
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Archive All Chats</span>
                      <span className="text-[11px] text-slate-500">Keep chats archived when new messages arrive</span>
                    </div>
                    <button onClick={() => showToast('Archive preferences updated')} className="px-3 py-1 bg-white border border-slate-300 text-slate-700 font-bold rounded-xl hover:bg-slate-100">
                      Configure
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-rose-800 block">Clear All Chat Histories</span>
                      <span className="text-[11px] text-rose-600">Permanently delete messages</span>
                    </div>
                    <button onClick={() => showToast('Chat clear canceled')} className="px-3 py-1 bg-white border border-rose-300 text-rose-700 font-bold rounded-xl hover:bg-rose-100">
                      Clear
                    </button>
                  </div>
                </div>
              )}

              {/* 5. NOTIFICATIONS */}
              {activeSettingsModal === 'notifications' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 block">Conversation Tones</span>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-slate-700">Play sounds for incoming and outgoing messages</span>
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    </label>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <span className="font-bold text-slate-800 block">Reaction Notifications</span>
                    <label className="flex items-center justify-between cursor-pointer">
                      <span className="text-slate-700">Show alerts for emoji reactions</span>
                      <input type="checkbox" defaultChecked className="rounded text-emerald-600" />
                    </label>
                  </div>
                </div>
              )}

              {/* 6. APPEARANCE */}
              {activeSettingsModal === 'appearance' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-2">Theme Mode</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['system', 'light', 'dark'].map((thm) => (
                        <button
                          key={thm}
                          onClick={() => {
                            setChatTheme(thm as any);
                            showToast(`Theme set to ${thm}`);
                          }}
                          className={`py-2 rounded-xl font-bold capitalize border text-center transition-all ${
                            chatTheme === thm ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          {thm}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-800 block mb-2">Chat Wallpaper</span>
                    <div className="grid grid-cols-3 gap-2">
                      {['doodle', 'slate', 'emerald'].map((wp) => (
                        <button
                          key={wp}
                          onClick={() => {
                            setChatWallpaper(wp);
                            showToast(`Wallpaper set to ${wp}`);
                          }}
                          className={`py-2 rounded-xl font-bold capitalize border text-center transition-all ${
                            chatWallpaper === wp ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white border-slate-200 text-slate-700'
                          }`}
                        >
                          {wp}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* 7. EVENTS & BROADCAST */}
              {activeSettingsModal === 'events' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">New Broadcast List</span>
                      <span className="text-[11px] text-slate-500">Send single message to multiple contacts</span>
                    </div>
                    <button onClick={() => showToast('Broadcast list creation ready')} className="px-3.5 py-1.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700">
                      Create
                    </button>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-800 block">Upcoming Chat Reminders</span>
                      <span className="text-[11px] text-slate-500">Scheduled events & payment dues</span>
                    </div>
                    <span className="text-[10px] font-bold text-purple-700 bg-purple-100 px-2 py-0.5 rounded-full">2 Pending</span>
                  </div>
                </div>
              )}

              {/* 8. PARENTAL CONTROLS */}
              {activeSettingsModal === 'parental' && (
                <div className="space-y-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4 text-rose-600" />
                      <span className="font-bold text-slate-800">Child Safe Mode</span>
                    </div>
                    <p className="text-[11px] text-slate-500">Filter unknown contacts, disable random group invitations, and require UPI PIN for payments above ₹500.</p>
                    <label className="flex items-center justify-between pt-1 cursor-pointer">
                      <span className="text-slate-700 font-medium">Safe Mode Active</span>
                      <input type="checkbox" defaultChecked className="rounded text-rose-600" />
                    </label>
                  </div>
                </div>
              )}

              {/* 9. LINKED DEVICES */}
              {activeSettingsModal === 'linkedDevices' && (
                <div className="space-y-3 text-xs">
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-center space-y-2">
                    <Laptop className="w-8 h-8 text-emerald-700 mx-auto" />
                    <h4 className="font-bold text-sm text-emerald-950">Use ARRAI on Web and Desktop</h4>
                    <p className="text-[11px] text-emerald-700">Open web.arrai.in on your other computer or tablet and scan QR code.</p>
                    <button 
                      onClick={() => showToast('QR Scanner for Linked Devices opened')}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs"
                    >
                      Link a Device
                    </button>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200">
                    <span className="font-bold text-slate-800 block text-[11px] mb-2 uppercase tracking-wider text-slate-400">Device Status</span>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <Laptop className="w-4 h-4 text-slate-600" />
                        <div>
                          <p className="font-bold text-slate-800">Windows (Chrome)</p>
                          <p className="text-[10px] text-slate-400">Active now</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">Connected</span>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>
        </div>
      )}

    </div>
  );
};
