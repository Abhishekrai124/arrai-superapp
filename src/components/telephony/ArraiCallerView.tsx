import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';
import { 
  Phone, 
  PhoneCall, 
  PhoneOff, 
  PhoneIncoming, 
  PhoneOutgoing, 
  PhoneMissed, 
  ShieldCheck, 
  ShieldAlert, 
  Search, 
  UserCheck, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  Grid, 
  History, 
  Users, 
  Sparkles, 
  Check, 
  AlertTriangle,
  Delete,
  Clock,
  Plus,
  Settings,
  User
} from 'lucide-react';

interface CallRecord {
  id: string;
  name: string;
  number: string;
  type: 'incoming' | 'outgoing' | 'missed' | 'spam';
  timestamp: string;
  duration?: string;
  isSpam?: boolean;
  spamReportCount?: number;
  verifiedBadge?: boolean;
  carrier?: string;
  location?: string;
}

export const ArraiCallerView: React.FC = () => {
  const { contacts } = useAppStore();
  const [activeTab, setActiveTab] = useState<'keypad' | 'recents' | 'search' | 'shield' | 'settings'>('keypad');
  const [dialedNumber, setDialedNumber] = useState('');
  const [inCall, setInCall] = useState<CallRecord | null>(null);
  const [callDuration, setCallDuration] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const [isSpeaker, setIsSpeaker] = useState(true);
  const [spamShieldActive, setSpamShieldActive] = useState(true);
  const [searchNumber, setSearchNumber] = useState('');
  const [searchResult, setSearchResult] = useState<CallRecord | null>(null);
  const [syncToast, setSyncToast] = useState<string | null>(null);

  // Profile Settings State
  const [callerName, setCallerName] = useState('Abhishek Rai');
  const [callerNumber, setCallerNumber] = useState('+91 98765 43210');
  const [spamSensitivity, setSpamSensitivity] = useState<'Low' | 'Medium' | 'High'>('High');
  const [autoRecord, setAutoRecord] = useState(false);
  const [settingsSavedToast, setSettingsSavedToast] = useState(false);

  const [callHistory, setCallHistory] = useState<CallRecord[]>([
    {
      id: 'c1',
      name: 'Priya Sharma (Home)',
      number: '+91 98765 43210',
      type: 'incoming',
      timestamp: '10 mins ago',
      duration: '4m 12s',
      carrier: 'Jio 5G',
      location: 'New Delhi'
    },
    {
      id: 'c2',
      name: 'Suspected Credit Card Telemarketer',
      number: '+91 14098 21192',
      type: 'spam',
      timestamp: '1 hour ago',
      isSpam: true,
      spamReportCount: 4892,
      carrier: 'Unknown VoIP',
      location: 'Noida Hub'
    },
    {
      id: 'c3',
      name: 'Aarav Mehta',
      number: '+91 98201 12345',
      type: 'outgoing',
      timestamp: 'Yesterday',
      duration: '1m 45s',
      verifiedBadge: true,
      carrier: 'Airtel True5G',
      location: 'Mumbai'
    },
    {
      id: 'c4',
      name: 'Amazon Delivery Associate',
      number: '+91 99887 76655',
      type: 'incoming',
      timestamp: 'Nov 6',
      duration: '32s',
      verifiedBadge: true,
      carrier: 'Vi Gigaspeed',
      location: 'Gurugram'
    }
  ]);

  // Active call duration timer
  useEffect(() => {
    let interval: any = null;
    if (inCall) {
      interval = setInterval(() => {
        setCallDuration(prev => prev + 1);
      }, 1000);
    } else {
      setCallDuration(0);
    }
    return () => clearInterval(interval);
  }, [inCall]);

  const formatCallDuration = (sec: number) => {
    const mins = Math.floor(sec / 60);
    const remainingSecs = sec % 60;
    return `${mins.toString().padStart(2, '0')}:${remainingSecs.toString().padStart(2, '0')}`;
  };

  const handleDialDigit = (digit: string) => {
    soundEngine.playKeypadClick();
    if (dialedNumber.length < 15) {
      setDialedNumber(prev => prev + digit);
    }
  };

  const handleDeleteDigit = () => {
    soundEngine.playKeypadClick();
    setDialedNumber(prev => prev.slice(0, -1));
  };

  const handleStartCall = (targetNumber: string, targetName?: string) => {
    if (!targetNumber) return;
    soundEngine.playSuccessChime();
    
    // Check if spam
    const isSpam = targetNumber.startsWith('140') || targetNumber.includes('9821192');
    
    const newCall: CallRecord = {
      id: `call_${Date.now()}`,
      name: targetName || (isSpam ? '⚠️ Flagged Telemarketer' : 'Calling Contact'),
      number: targetNumber,
      type: 'outgoing',
      timestamp: 'Just now',
      isSpam,
      carrier: 'ARRAI VoIP Core'
    };

    setInCall(newCall);
  };

  const handleEndCall = () => {
    soundEngine.playKeypadClick();
    if (inCall) {
      setCallHistory(prev => [
        {
          ...inCall,
          duration: formatCallDuration(callDuration)
        },
        ...prev
      ]);
    }
    setInCall(null);
  };

  const handleSearchNumber = () => {
    soundEngine.playKeypadClick();
    const cleanNum = searchNumber.trim();
    if (!cleanNum) return;

    if (cleanNum.startsWith('140') || cleanNum.includes('9821192') || cleanNum.includes('99999')) {
      setSearchResult({
        id: 'res_spam',
        name: 'Bajaj Finance Telemarketing Bot',
        number: cleanNum,
        type: 'spam',
        timestamp: 'Active spammer',
        isSpam: true,
        spamReportCount: 12450,
        carrier: 'Bulk VoIP Gateway',
        location: 'Jaipur, Rajasthan'
      });
    } else {
      setSearchResult({
        id: 'res_valid',
        name: 'Rohan Deshmukh',
        number: cleanNum,
        type: 'incoming',
        timestamp: 'Verified User',
        isSpam: false,
        verifiedBadge: true,
        carrier: 'Jio True 5G',
        location: 'Pune, Maharashtra'
      });
    }
  };

  const handleSyncContacts = () => {
    soundEngine.playSuccessChime();
    setSyncToast(`Synced ${contacts.length + 42} Google Contacts into ARRAI Caller!`);
    setTimeout(() => setSyncToast(null), 3000);
  };

  return (
    <div className="space-y-4 pb-12 animate-in fade-in">
      
      {/* Toast Alert */}
      {syncToast && (
        <div className="bg-emerald-600 text-white px-4 py-2.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-lg animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4" />
            <span>{syncToast}</span>
          </div>
          <button onClick={() => setSyncToast(null)} className="text-white/80 hover:text-white">✕</button>
        </div>
      )}

      {/* ══ LIVE ACTIVE CALL OVERLAY ══════════════════════════════════════════ */}
      {inCall && (
        <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col justify-between p-6 sm:p-10 text-white animate-in zoom-in-95">
          <div className="text-center pt-8 space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span>ARRAI HD Web VoIP • End-to-End Encrypted</span>
            </div>

            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 mx-auto flex items-center justify-center text-3xl font-black shadow-2xl ring-4 ring-white/10 mt-4">
              {inCall.name.slice(0, 2).toUpperCase()}
            </div>

            <h2 className="text-2xl font-black tracking-tight">{inCall.name}</h2>
            <p className="text-sm font-mono text-slate-400">{inCall.number}</p>
            <p className="text-lg font-mono font-bold text-emerald-400">{formatCallDuration(callDuration)}</p>

            {inCall.isSpam && (
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/40">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span>Identified as Telemarketing Spam by ARRAI True Shield</span>
              </div>
            )}
          </div>

          {/* Call Controls */}
          <div className="max-w-sm mx-auto w-full space-y-8 pb-8">
            <div className="grid grid-cols-3 gap-6 text-center">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className={`p-4 rounded-full flex flex-col items-center gap-1 transition-all ${isMuted ? 'bg-white text-slate-900' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
              >
                {isMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
                <span className="text-[10px] font-bold mt-1">{isMuted ? 'Muted' : 'Mute'}</span>
              </button>

              <button
                onClick={() => setIsSpeaker(!isSpeaker)}
                className={`p-4 rounded-full flex flex-col items-center gap-1 transition-all ${isSpeaker ? 'bg-white text-slate-900' : 'bg-slate-800 text-white hover:bg-slate-700'}`}
              >
                {isSpeaker ? <Volume2 className="w-6 h-6" /> : <VolumeX className="w-6 h-6" />}
                <span className="text-[10px] font-bold mt-1">Speaker</span>
              </button>

              <button
                onClick={() => soundEngine.playKeypadClick()}
                className="p-4 rounded-full bg-slate-800 text-white hover:bg-slate-700 flex flex-col items-center gap-1 transition-all"
              >
                <Grid className="w-6 h-6" />
                <span className="text-[10px] font-bold mt-1">Keypad</span>
              </button>
            </div>

            {/* End Call Button */}
            <div className="flex justify-center">
              <button
                onClick={handleEndCall}
                className="w-20 h-20 rounded-full bg-rose-600 hover:bg-rose-500 active:scale-95 text-white flex items-center justify-center shadow-2xl shadow-rose-600/50 transition-all ring-4 ring-rose-400/30"
              >
                <PhoneOff className="w-8 h-8" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══ HEADER ═══════════════════════════════════════════════════════════ */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-700 text-white flex items-center justify-center shadow-md">
            <PhoneCall className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-base font-black text-slate-900">ARRAI Caller & True Shield</h1>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-200">
                AI Caller ID
              </span>
            </div>
            <p className="text-xs text-slate-500">ARRAI VoIP dialer & True Shield AI spam protection in one app</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleSyncContacts}
            className="px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5"
          >
            <Users className="w-3.5 h-3.5" />
            <span>Sync Contacts</span>
          </button>

          <button
            onClick={() => setSpamShieldActive(!spamShieldActive)}
            className={`px-3.5 py-2 font-bold text-xs rounded-xl transition-all flex items-center gap-1.5 border ${
              spamShieldActive 
                ? 'bg-emerald-50 text-emerald-800 border-emerald-300' 
                : 'bg-slate-100 text-slate-500 border-slate-200'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>{spamShieldActive ? 'Spam Shield ON' : 'Shield OFF'}</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex gap-1.5 text-xs font-bold shadow-xs overflow-x-auto">
        {[
          { id: 'keypad', label: 'Dialpad', icon: Grid },
          { id: 'recents', label: 'Call Log', icon: History },
          { id: 'search', label: 'Caller ID Lookup', icon: Search },
          { id: 'shield', label: 'Spam Protection', icon: ShieldAlert },
          { id: 'settings', label: 'Profile & Settings', icon: Settings },
        ].map(t => {
          const Icon = t.icon;
          const isActive = activeTab === t.id;
          return (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id as any)}
              className={`flex-1 py-2 px-2.5 rounded-xl flex items-center justify-center gap-1.5 transition-all whitespace-nowrap ${
                isActive ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{t.label}</span>
            </button>
          );
        })}
      </div>

      {/* ══ TAB 1: DIALPAD ══════════════════════════════════════════════════ */}
      {activeTab === 'keypad' && (
        <div className="max-w-sm mx-auto bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-5">
          {/* Number Display */}
          <div className="text-center py-2 min-h-14 flex items-center justify-center relative">
            <span className="text-2xl sm:text-3xl font-black font-mono tracking-wider text-slate-900">
              {dialedNumber || <span className="text-slate-300 text-lg">Enter phone number</span>}
            </span>
            {dialedNumber && (
              <button
                onClick={handleDeleteDigit}
                className="absolute right-0 p-2 text-slate-400 hover:text-rose-600 transition-colors"
              >
                <Delete className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Keypad Grid */}
          <div className="grid grid-cols-3 gap-3">
            {[
              { num: '1', letters: 'VOIP' },
              { num: '2', letters: 'ABC' },
              { num: '3', letters: 'DEF' },
              { num: '4', letters: 'GHI' },
              { num: '5', letters: 'JKL' },
              { num: '6', letters: 'MNO' },
              { num: '7', letters: 'PQRS' },
              { num: '8', letters: 'TUV' },
              { num: '9', letters: 'WXYZ' },
              { num: '*', letters: '' },
              { num: '0', letters: '+' },
              { num: '#', letters: '' },
            ].map(k => (
              <button
                key={k.num}
                onClick={() => handleDialDigit(k.num)}
                className="h-16 rounded-2xl bg-slate-50 hover:bg-blue-50/60 active:scale-95 border border-slate-100 flex flex-col items-center justify-center transition-all group"
              >
                <span className="text-xl font-black text-slate-800 group-hover:text-blue-700">{k.num}</span>
                {k.letters && <span className="text-[9px] font-bold text-slate-400 tracking-wider">{k.letters}</span>}
              </button>
            ))}
          </div>

          {/* Call Action Button */}
          <div className="pt-2 flex justify-center">
            <button
              onClick={() => handleStartCall(dialedNumber)}
              disabled={!dialedNumber}
              className={`w-full py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm text-white shadow-lg transition-all ${
                dialedNumber
                  ? 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-500/30 active:scale-98'
                  : 'bg-slate-300 cursor-not-allowed'
              }`}
            >
              <Phone className="w-5 h-5" />
              <span>Call via ARRAI VoIP</span>
            </button>
          </div>
        </div>
      )}

      {/* ══ TAB 2: CALL LOG / RECENTS ═══════════════════════════════════════ */}
      {activeTab === 'recents' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <h3 className="font-black text-sm text-slate-900">Recent Call Logs</h3>
            <span className="text-xs text-slate-400">{callHistory.length} calls recorded</span>
          </div>

          <div className="divide-y divide-slate-100">
            {callHistory.map(call => (
              <div key={call.id} className="py-3 flex items-center justify-between group hover:bg-slate-50/60 px-2 rounded-2xl transition-all">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${
                    call.isSpam 
                      ? 'bg-rose-100 text-rose-700' 
                      : call.type === 'incoming' 
                      ? 'bg-emerald-100 text-emerald-700' 
                      : 'bg-blue-100 text-blue-700'
                  }`}>
                    {call.isSpam ? (
                      <ShieldAlert className="w-5 h-5" />
                    ) : call.type === 'incoming' ? (
                      <PhoneIncoming className="w-5 h-5" />
                    ) : (
                      <PhoneOutgoing className="w-5 h-5" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-bold ${call.isSpam ? 'text-rose-600' : 'text-slate-900'}`}>
                        {call.name}
                      </span>
                      {call.verifiedBadge && (
                        <Check className="w-3.5 h-3.5 text-blue-600 stroke-[3]" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <span>{call.number}</span>
                      <span>•</span>
                      <span>{call.timestamp}</span>
                      {call.duration && (
                        <>
                          <span>•</span>
                          <span className="text-slate-600 font-medium">{call.duration}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleStartCall(call.number, call.name)}
                  className="p-2.5 rounded-xl bg-slate-100 hover:bg-emerald-100 text-slate-600 hover:text-emerald-700 transition-all"
                  title="Call Back"
                >
                  <PhoneCall className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ══ TAB 3: ARRAI CALLER ID LOOKUP ═══════════════════════════════════════ */}
      {activeTab === 'search' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5">
          <div>
            <h3 className="font-black text-sm text-slate-900">ARRAI True Shield AI Caller ID Search</h3>
            <p className="text-xs text-slate-500 mt-0.5">Find identity, spam reports, and location of any unknown telephone number</p>
          </div>

          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Enter 10-digit number (e.g. 9876543210 or 1409821192)..."
                value={searchNumber}
                onChange={(e) => setSearchNumber(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-2xl border border-slate-200 bg-slate-50 text-xs text-slate-900 font-mono focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <button
              onClick={handleSearchNumber}
              className="px-5 py-2.5 bg-blue-700 hover:bg-blue-600 text-white rounded-2xl text-xs font-bold transition-all shadow-xs"
            >
              Identify
            </button>
          </div>

          {searchResult && (
            <div className={`p-4 rounded-3xl border ${searchResult.isSpam ? 'bg-rose-50 border-rose-200' : 'bg-blue-50/60 border-blue-200'} space-y-3 animate-in fade-in`}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${searchResult.isSpam ? 'bg-rose-600 text-white' : 'bg-blue-600 text-white'}`}>
                    {searchResult.isSpam ? <ShieldAlert className="w-6 h-6" /> : <UserCheck className="w-6 h-6" />}
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-slate-900 flex items-center gap-1.5">
                      {searchResult.name}
                      {searchResult.verifiedBadge && <Check className="w-4 h-4 text-blue-600 stroke-[3]" />}
                    </h4>
                    <p className="text-xs font-mono text-slate-500">{searchResult.number}</p>
                  </div>
                </div>

                <button
                  onClick={() => handleStartCall(searchResult.number, searchResult.name)}
                  className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Call</span>
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs pt-2 border-t border-slate-200/60">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Telecom Carrier</span>
                  <span className="font-medium text-slate-700">{searchResult.carrier}</span>
                </div>
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Registered Location</span>
                  <span className="font-medium text-slate-700">{searchResult.location}</span>
                </div>
              </div>

              {searchResult.isSpam && (
                <div className="p-3 bg-rose-100/80 border border-rose-200 rounded-2xl text-rose-800 text-xs flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span><strong>{searchResult.spamReportCount?.toLocaleString()} users</strong> reported this caller as financial spam / fraud.</span>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* ══ TAB 4: SPAM PROTECTION ═════════════════════════════════════════ */}
      {activeTab === 'shield' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-slate-900">ARRAI True Shield Community Protection</h3>
              <p className="text-xs text-slate-500">Live blacklist powered by 50 million Indian users</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">Auto-Block Top Spammers</span>
                <span className="text-[11px] text-slate-500">Silently reject known robocalls and loan spam</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
            </div>

            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
              <div>
                <span className="font-bold text-slate-800 block">International Unknown Caller Alert</span>
                <span className="text-[11px] text-slate-500">Flag suspicious +92, +880, +234 incoming calls</span>
              </div>
              <input type="checkbox" defaultChecked className="rounded text-blue-600" />
            </div>
          </div>
        </div>
      )}

      {/* ══ TAB 5: PROFILE & SETTINGS ═══════════════════════════════════════ */}
      {activeTab === 'settings' && (
        <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-5 animate-in fade-in">
          <div>
            <h3 className="font-black text-sm text-slate-900">ARRAI Caller & True Shield Profile Settings</h3>
            <p className="text-xs text-slate-500 mt-0.5">Customize your outgoing Caller ID identity, spam sensitivity, and VoIP call preferences</p>
          </div>

          {settingsSavedToast && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-2xl flex items-center gap-2 text-emerald-800 text-xs font-bold animate-in fade-in">
              <Check className="w-4 h-4 text-emerald-600" />
              <span>Caller Profile & Spam Protection settings saved successfully!</span>
            </div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Public Caller ID Display Name
                </label>
                <input
                  type="text"
                  value={callerName}
                  onChange={(e) => setCallerName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                  Primary ARRAI VoIP Number
                </label>
                <input
                  type="text"
                  value={callerNumber}
                  onChange={(e) => setCallerNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-bold text-slate-900 focus:bg-white outline-none"
                />
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-slate-900">Spam Shield Filtering Strictness</h4>
                  <p className="text-[11px] text-slate-500">How aggressively ARRAI True Shield flags or blocks unknown callers</p>
                </div>
                <div className="flex items-center gap-1.5">
                  {(['Low', 'Medium', 'High'] as const).map(lvl => (
                    <button
                      key={lvl}
                      type="button"
                      onClick={() => setSpamSensitivity(lvl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                        spamSensitivity === lvl
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                      }`}
                    >
                      {lvl}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
                <div>
                  <h4 className="text-xs font-black text-slate-900">Auto-Record VoIP Calls</h4>
                  <p className="text-[11px] text-slate-500">Save encrypted voice transcripts for safety & reference</p>
                </div>
                <input
                  type="checkbox"
                  checked={autoRecord}
                  onChange={(e) => setAutoRecord(e.target.checked)}
                  className="rounded text-blue-600 w-4 h-4 cursor-pointer"
                />
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playSuccessChime();
                setSettingsSavedToast(true);
                setTimeout(() => setSettingsSavedToast(false), 2500);
              }}
              className="px-5 py-2.5 rounded-xl bg-blue-700 hover:bg-blue-600 text-white font-bold text-xs shadow-xs transition-all"
            >
              Save Caller Settings
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
