import React, { useState } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { soundEngine } from '../../utils/audio';
import { 
  User, 
  ShieldCheck, 
  Key, 
  KeyRound,
  Building2, 
  Volume2, 
  Lock, 
  Smartphone, 
  Check, 
  Copy, 
  Edit3, 
  Save, 
  Download, 
  RotateCcw, 
  Bell, 
  Eye, 
  Sparkles,
  QrCode,
  CheckCircle2,
  Trash2,
  Plus,
  Globe,
  Fingerprint,
  Share2,
  ExternalLink,
  Camera,
  AtSign,
  Mail,
  Phone,
  FileText,
  Trophy,
  Briefcase,
  Radio,
  LayoutDashboard,
  MessageSquare,
  LogOut
} from 'lucide-react';

export const ProfileSettingsView: React.FC = () => {
  const { 
    userProfile, 
    updateUserProfile, 
    linkedBanks, 
    walletBalance, 
    transactions, 
    triggerSoundboxTest,
    soundboxEnabled,
    setSoundboxEnabled,
    logout,
    soundboxLanguage,
    setSoundboxLanguage,
    openModal,
    setActiveSection,
    setMode,
    setMerchantTab
  } = useAppStore();

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [nameInput, setNameInput] = useState(userProfile.name);
  const [phoneInput, setPhoneInput] = useState(userProfile.phone);
  const [emailInput, setEmailInput] = useState(userProfile.email);
  const [bioInput, setBioInput] = useState(userProfile.bio);
  const [vpaInput, setVpaInput] = useState(userProfile.vpa.replace('@arrai', ''));
  const [avatarUrl, setAvatarUrl] = useState(userProfile.avatar);
  const [copiedVpa, setCopiedVpa] = useState(false);
  const [copiedArraiId, setCopiedArraiId] = useState(false);

  // Security & PIN
  const [showMpinModal, setShowMpinModal] = useState(false);
  const [newMpin, setNewMpin] = useState('');
  const [confirmMpin, setConfirmMpin] = useState('');
  const [mpinSuccess, setMpinSuccess] = useState(false);
  const [mpinError, setMpinError] = useState<string | null>(null);

  // Status feedback
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Preset Avatar choices
  const avatarPresets = [
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&auto=format&fit=crop&q=80'
  ];

  // Languages list
  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'hi', label: 'Hindi', native: 'हिन्दी' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' },
    { code: 'te', label: 'Telugu', native: 'తెలుగు' },
    { code: 'mr', label: 'Marathi', native: 'मराठी' },
    { code: 'bn', label: 'Bengali', native: 'বাংলা' },
    { code: 'gu', label: 'Gujarati', native: 'ગુજરાતી' },
    { code: 'kn', label: 'Kannada', native: 'ಕನ್ನಡ' }
  ];

  const handleCopyVpa = () => {
    navigator.clipboard.writeText(userProfile.vpa);
    setCopiedVpa(true);
    setTimeout(() => setCopiedVpa(false), 2000);
  };

  const handleCopyArraiId = () => {
    navigator.clipboard.writeText(userProfile.arraiId || 'arrai_abhishek82');
    setCopiedArraiId(true);
    setTimeout(() => setCopiedArraiId(false), 2000);
  };

  const handleSaveProfile = () => {
    const formattedVpa = vpaInput.trim() ? `${vpaInput.trim().replace('@arrai', '')}@arrai` : userProfile.vpa;
    updateUserProfile({
      name: nameInput,
      phone: phoneInput,
      email: emailInput,
      bio: bioInput,
      vpa: formattedVpa,
      avatar: avatarUrl
    });
    setIsEditingProfile(false);
    setSaveSuccess(true);
    soundEngine.playSuccessChime();
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleChangeMpin = (e: React.FormEvent) => {
    e.preventDefault();
    if (newMpin.length !== 4) {
      setMpinError('MPIN must be exactly 4 digits');
      return;
    }
    if (newMpin !== confirmMpin) {
      setMpinError('MPINs do not match');
      return;
    }

    updateUserProfile({ mpin: newMpin });
    setMpinSuccess(true);
    setMpinError(null);
    soundEngine.playSuccessChime();
    setTimeout(() => {
      setShowMpinModal(false);
      setMpinSuccess(false);
      setNewMpin('');
      setConfirmMpin('');
    }, 1500);
  };

  const toggleSocialLink = (network: 'google' | 'facebook' | 'instagram' | 'youtube' | 'apple' | 'whatsapp') => {
    soundEngine.playKeypadClick();
    const current = userProfile.linkedSocials || {};
    updateUserProfile({
      linkedSocials: {
        ...current,
        [network]: !current[network]
      }
    });
  };

  const handleExportStatement = () => {
    soundEngine.playSuccessChime();
    const headers = ['Transaction ID', 'Type', 'Title', 'Amount', 'Status', 'Date', 'UTR'];
    const rows = transactions.map(t => [
      t.id,
      t.type,
      `"${t.title.replace(/"/g, '""')}"`,
      t.amount,
      t.status,
      t.timestamp,
      t.utr
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `ARRAI_Statement_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportJsonData = () => {
    soundEngine.playSuccessChime();
    const data = {
      profile: userProfile,
      walletBalance,
      linkedBanks,
      transactions,
      exportedAt: new Date().toISOString()
    };
    const jsonBlob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(jsonBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `ARRAI_UserData_Full_${Date.now()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-10">
      
      {/* 1. Profile Hero Card with Complete Editing */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="absolute -right-10 -bottom-10 w-44 h-44 rounded-full bg-indigo-500/10 blur-2xl pointer-events-none" />

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 sm:gap-5">
            <div className="relative group">
              <img
                src={avatarUrl}
                alt={userProfile.name}
                className="w-20 h-20 rounded-3xl object-cover ring-4 ring-indigo-500/40 shadow-xl"
              />
              <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-white rounded-full p-1 shadow-md" title="Full KYC Verified">
                <Check className="w-3.5 h-3.5 stroke-[3]" />
              </span>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black tracking-tight">{userProfile.name}</h1>
                <span className="bg-emerald-500/20 text-emerald-300 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-500/30">
                  Full KYC
                </span>
              </div>
              <p className="text-xs text-indigo-300 font-mono mt-0.5">{userProfile.phone} • {userProfile.email}</p>

              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                {/* ARRAI ID Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-violet-500/20 backdrop-blur-md border border-violet-400/30 text-xs">
                  <span className="text-[10px] uppercase font-bold text-violet-300">ARRAI ID:</span>
                  <span className="font-mono text-white font-bold">{userProfile.arraiId || 'arrai_abhishek82'}</span>
                  <button
                    onClick={handleCopyArraiId}
                    className="text-slate-300 hover:text-white transition-colors"
                    title="Copy ARRAI ID"
                  >
                    {copiedArraiId ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>

                {/* VPA Copy Pill */}
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/15 text-xs">
                  <span className="text-[10px] uppercase font-bold text-indigo-300">UPI:</span>
                  <span className="font-mono text-indigo-200 font-bold">{userProfile.vpa}</span>
                  <button
                    onClick={handleCopyVpa}
                    className="text-slate-300 hover:text-white transition-colors"
                    title="Copy ARRAI UPI ID"
                  >
                    {copiedVpa ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openModal('myQr')}
              className="px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center gap-1.5"
            >
              <QrCode className="w-4 h-4" />
              <span>My QR</span>
            </button>
            <button
              onClick={() => setIsEditingProfile(!isEditingProfile)}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-bold rounded-xl transition-all border border-white/20 flex items-center gap-1.5"
            >
              <Edit3 className="w-4 h-4" />
              <span>{isEditingProfile ? 'Cancel' : 'Edit Profile'}</span>
            </button>
          </div>
        </div>

        {/* Edit Form or Bio View */}
        <div className="mt-5 pt-4 border-t border-white/10 relative z-10">
          {isEditingProfile ? (
            <div className="space-y-4 animate-in fade-in">
              {/* Avatar Selector & Upload from Gallery / Google */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400 block">Avatar Picture</label>
                  <span className="text-[10px] text-emerald-400 font-semibold">Gallery & Google Sync</span>
                </div>
                
                <div className="flex flex-wrap items-center gap-2.5">
                  {avatarPresets.map((preset, idx) => (
                    <img
                      key={idx}
                      src={preset}
                      alt="Preset"
                      onClick={() => setAvatarUrl(preset)}
                      className={`w-11 h-11 rounded-2xl object-cover cursor-pointer transition-all border-2 ${
                        avatarUrl === preset ? 'border-emerald-400 scale-105 ring-2 ring-emerald-400/30' : 'border-transparent opacity-60 hover:opacity-100'
                      }`}
                    />
                  ))}

                  {/* Upload from Gallery (File input) */}
                  <label className="w-11 h-11 rounded-2xl border-2 border-dashed border-indigo-400/50 bg-indigo-500/10 hover:bg-indigo-500/20 flex flex-col items-center justify-center cursor-pointer transition-all text-indigo-300 hover:text-white" title="Upload from Device / Gallery">
                    <Camera className="w-4 h-4" />
                    <span className="text-[8px] font-bold mt-0.5">Gallery</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (event) => {
                            if (event.target?.result) {
                              setAvatarUrl(event.target.result as string);
                            }
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>

                  {/* Sync from Google Account Avatar */}
                  <button
                    type="button"
                    onClick={() => {
                      const googleAvatar = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&auto=format&fit=crop&q=80';
                      setAvatarUrl(googleAvatar);
                    }}
                    className="px-2.5 py-2 rounded-2xl border border-white/20 bg-white/10 hover:bg-white/20 text-white text-[10px] font-bold flex items-center gap-1.5 transition-all"
                    title="Sync photo from connected Google Account"
                  >
                    <span>Google Sync</span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Full Name</label>
                  <input
                    type="text"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={phoneInput}
                    onChange={(e) => setPhoneInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs font-mono text-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Email ID</label>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Custom UPI Handle (@arrai)</label>
                  <div className="flex">
                    <input
                      type="text"
                      value={vpaInput}
                      onChange={(e) => setVpaInput(e.target.value.toLowerCase().replace(/[^a-z0-9._]/g, ''))}
                      className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-l-xl text-xs font-mono text-white"
                      placeholder="username"
                    />
                    <span className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-r-xl text-xs font-mono text-slate-300 font-bold">
                      @arrai
                    </span>
                  </div>
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase font-bold text-slate-400 block mb-1">Bio / Profile Status</label>
                <textarea
                  rows={2}
                  value={bioInput}
                  onChange={(e) => setBioInput(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-xs text-white"
                />
              </div>

              <button
                onClick={handleSaveProfile}
                className="px-5 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs rounded-xl flex items-center gap-1.5 transition-all shadow-md"
              >
                <Save className="w-4 h-4" />
                <span>Save All Profile Changes</span>
              </button>
            </div>
          ) : (
            <p className="text-xs text-slate-300 leading-relaxed">
              {userProfile.bio}
            </p>
          )}

          {saveSuccess && (
            <p className="text-xs text-emerald-400 font-bold mt-2 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Profile & UPI handle updated successfully!
            </p>
          )}
        </div>
      </div>

      {/* ══ ARRAI ACCOUNT CENTER (APPLE ID & GOOGLE ACCOUNT STYLE) ════════ */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-violet-600 via-indigo-600 to-blue-700 text-white flex items-center justify-center font-black shadow-md shadow-violet-500/20">
              <KeyRound className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-black text-slate-900 tracking-tight">ARRAI Account Center</h3>
                <span className="px-2 py-0.5 rounded-full bg-violet-50 border border-violet-200 text-violet-700 text-[10px] font-bold">
                  Official Ecosystem Account
                </span>
              </div>
              <p className="text-[11px] text-slate-400">One secure identity across ARRAI SuperApp services, payments & cloud</p>
            </div>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-xl border border-emerald-200 flex items-center gap-1 self-start sm:self-auto">
            <ShieldCheck className="w-3.5 h-3.5" />
            Active & Protected
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Universal ARRAI ID</span>
            <p className="font-mono font-bold text-sm text-slate-900 truncate">{userProfile.arraiId || 'arrai_abhishek82'}</p>
            <p className="text-[10px] text-slate-500">Sign in on web, mobile & ecosystem apps</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">ARRAI Cloud Sync</span>
            <p className="font-bold text-sm text-emerald-600 flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Supabase Connected
            </p>
            <p className="text-[10px] text-slate-500">Profiles, Ledger & True Shield live sync</p>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Ecosystem Storage</span>
            <p className="font-bold text-sm text-indigo-600">15 GB ARRAI Vault</p>
            <p className="text-[10px] text-slate-500">End-to-end encrypted backup</p>
          </div>
        </div>
      </div>

      {/* 2. ARRAI Ecosystem Sub-App Profiles & Configuration Hub */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between pb-2 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-black text-slate-900">ARRAI Sub-App Profiles & Settings</h3>
              <p className="text-[11px] text-slate-500">Manage identity, privacy, and preferences across all ARRAI apps</p>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">
            8 Native Apps
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {[
            {
              id: 'chess',
              name: 'ARRAI Chess Arena',
              subtitle: 'Elo 2450 GM · Themes · Bots',
              icon: Trophy,
              color: 'from-emerald-600 to-teal-700',
              action: () => { setMode('consumer'); setActiveSection('chess'); }
            },
            {
              id: 'caller',
              name: 'ARRAI Caller & True Shield',
              subtitle: 'VoIP Phone · AI Spam Blocker',
              icon: Phone,
              color: 'from-blue-600 to-cyan-700',
              action: () => { setMode('consumer'); setActiveSection('caller'); }
            },
            {
              id: 'pulse',
              name: 'ARRAI Pulse',
              subtitle: 'Handle @abhishek · Verified Tick',
              icon: Radio,
              color: 'from-slate-800 to-slate-950',
              action: () => { setMode('consumer'); setActiveSection('pulse'); }
            },
            {
              id: 'pro',
              name: 'ARRAI Pro Network',
              subtitle: 'Career Profile · CV · Jobs',
              icon: Briefcase,
              color: 'from-indigo-700 to-blue-800',
              action: () => { setMode('consumer'); setActiveSection('pro'); }
            },
            {
              id: 'gram',
              name: 'ARRAI Gram',
              subtitle: 'Creator Profile · Reels · Bio',
              icon: Camera,
              color: 'from-pink-600 to-rose-700',
              action: () => { setMode('consumer'); setActiveSection('gram'); }
            },
            {
              id: 'connect',
              name: 'ARRAI Connect',
              subtitle: 'Communities · Hometown · Events',
              icon: Globe,
              color: 'from-blue-600 to-indigo-700',
              action: () => { setMode('consumer'); setActiveSection('connect'); }
            },
            {
              id: 'merchant',
              name: 'ARRAI Merchant',
              subtitle: 'Business KYC · T+0 Settlement · API',
              icon: LayoutDashboard,
              color: 'from-teal-700 to-emerald-800',
              action: () => { setMode('merchant'); setMerchantTab('settings'); setActiveSection('merchant'); }
            },
            {
              id: 'chat',
              name: 'ARRAI Chat',
              subtitle: 'Account · Privacy · 24h Messages',
              icon: MessageSquare,
              color: 'from-emerald-600 to-teal-800',
              action: () => { setMode('consumer'); setActiveSection('chat'); }
            }
          ].map((app) => {
            const Icon = app.icon;
            return (
              <button
                key={app.id}
                onClick={app.action}
                className="p-3 rounded-2xl bg-slate-50 hover:bg-slate-100/80 border border-slate-200/80 text-left transition-all group flex flex-col justify-between"
              >
                <div className="flex items-center gap-2.5 mb-2">
                  <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${app.color} text-white flex items-center justify-center shadow-xs shrink-0 group-hover:scale-105 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-xs font-black text-slate-900 truncate">{app.name}</h4>
                    <p className="text-[10px] text-slate-400 truncate">{app.subtitle}</p>
                  </div>
                </div>

                <div className="flex items-center justify-end text-[10px] font-bold text-indigo-600 group-hover:text-indigo-800 pt-1 border-t border-slate-200/60">
                  <span>Configure Settings →</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Linked Bank Accounts Manager (ARRAI UPI 2.0) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Linked Bank Accounts (UPI 2.0)</h3>
              <p className="text-[11px] text-slate-500">NPCI Certified Direct Bank Settlement</p>
            </div>
          </div>

          <button
            onClick={() => openModal('checkBalance')}
            className="text-xs font-bold text-indigo-600 hover:text-indigo-800 flex items-center gap-1"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Check Balance</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {linkedBanks.map((bank) => (
            <div key={bank.id} className="p-4 rounded-2xl border border-slate-200 bg-slate-50/50 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xs shadow-xs"
                  style={{ backgroundColor: bank.logoColor }}
                >
                  {bank.bankName.slice(0, 3).toUpperCase()}
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-xs text-slate-900">{bank.bankName}</span>
                    {bank.isPrimary && (
                      <span className="px-1.5 py-0.2 bg-emerald-100 text-emerald-800 text-[9px] font-bold rounded">Primary</span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 block">{bank.accountNumberMasked}</span>
                  <span className="text-[10px] text-slate-400 font-mono">IFSC: {bank.ifsc}</span>
                </div>
              </div>

              <button
                onClick={() => openModal('checkBalance')}
                className="px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-700 rounded-xl border border-slate-200 text-xs font-bold transition-all shadow-xs"
              >
                ₹ Check
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. ARRAI Vault / DigiLocker Sovereign Government Identity Documents */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-emerald-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">ARRAI Vault & Sovereign DigiLocker</h3>
              <p className="text-[11px] text-slate-500">Aadhaar, PAN, Driving License, RC stored with 256-Bit Encryption</p>
            </div>
          </div>

          <button
            onClick={() => openModal('digilocker')}
            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <span>Open Vault</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {(userProfile.digilockerDocs || []).map(doc => (
            <div 
              key={doc.id}
              onClick={() => openModal('digilocker')}
              className="p-3 rounded-2xl border border-slate-200 bg-slate-50/70 hover:bg-emerald-50/40 hover:border-emerald-300 transition-all cursor-pointer text-left"
            >
              <FileText className="w-5 h-5 text-emerald-600 mb-1.5" />
              <span className="font-bold text-xs text-slate-900 block truncate">{doc.name}</span>
              <span className="text-[10px] font-mono font-semibold text-slate-500 block truncate mt-0.5">{doc.number}</span>
              <span className="text-[9px] font-bold text-emerald-600 flex items-center gap-0.5 mt-1">
                <CheckCircle2 className="w-3 h-3" /> Verified
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Security, PIN & Biometric Locks */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Lock className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">Security & Authentication</h3>
            <p className="text-[11px] text-slate-500">4-Digit UPI MPIN, Fingerprint & App Lock</p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div>
              <span className="font-bold text-xs text-slate-900 block">UPI Transaction PIN</span>
              <span className="text-[11px] text-slate-500 mt-0.5 block">Used for every payment approval</span>
            </div>
            <button
              onClick={() => setShowMpinModal(true)}
              className="mt-3 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all"
            >
              Change 4-Digit PIN
            </button>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-xs text-slate-900 block">Biometric / Face ID</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Fast biometric sign-in</span>
              </div>
              <Fingerprint className="w-5 h-5 text-indigo-600" />
            </div>
            <label className="mt-3 flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-slate-700">
                {userProfile.biometricEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <input
                type="checkbox"
                checked={userProfile.biometricEnabled}
                onChange={(e) => updateUserProfile({ biometricEnabled: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>

          <div className="p-4 rounded-2xl border border-slate-200 bg-slate-50 flex flex-col justify-between">
            <div className="flex justify-between items-start">
              <div>
                <span className="font-bold text-xs text-slate-900 block">App Lock on Open</span>
                <span className="text-[11px] text-slate-500 mt-0.5 block">Require lock screen PIN</span>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-600" />
            </div>
            <label className="mt-3 flex items-center justify-between cursor-pointer">
              <span className="text-xs font-bold text-slate-700">
                {userProfile.appLockEnabled ? 'Enabled' : 'Disabled'}
              </span>
              <input
                type="checkbox"
                checked={userProfile.appLockEnabled || false}
                onChange={(e) => updateUserProfile({ appLockEnabled: e.target.checked })}
                className="rounded text-indigo-600 focus:ring-indigo-500"
              />
            </label>
          </div>
        </div>

        {/* Change MPIN Modal Drawer */}
        {showMpinModal && (
          <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-200 animate-in slide-in-from-top-2">
            <form onSubmit={handleChangeMpin} className="space-y-3 max-w-sm mx-auto">
              <h4 className="font-bold text-xs text-slate-800 uppercase tracking-wider text-center">Set New 4-Digit UPI MPIN</h4>
              
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">New 4-Digit PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={newMpin}
                    onChange={(e) => setNewMpin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-center font-mono text-base font-bold tracking-widest"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-slate-500 font-bold block mb-1">Confirm PIN</label>
                  <input
                    type="password"
                    maxLength={4}
                    value={confirmMpin}
                    onChange={(e) => setConfirmMpin(e.target.value.replace(/\D/g, ''))}
                    placeholder="••••"
                    className="w-full px-3 py-2 bg-white rounded-xl border border-slate-200 text-center font-mono text-base font-bold tracking-widest"
                  />
                </div>
              </div>

              {mpinError && <p className="text-xs text-rose-600 font-bold text-center">{mpinError}</p>}
              {mpinSuccess && <p className="text-xs text-emerald-600 font-bold text-center">MPIN updated successfully!</p>}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowMpinModal(false)}
                  className="flex-1 py-2 rounded-xl border border-slate-300 text-slate-700 text-xs font-bold bg-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 rounded-xl bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700"
                >
                  Update PIN
                </button>
              </div>
            </form>
          </div>
        )}
      </div>

      {/* 5. Connected Social Accounts (Google, Facebook, Instagram, YouTube, Apple) */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Connected Accounts & Social Sync</h3>
              <p className="text-[11px] text-slate-500">Link Facebook, Instagram, YouTube, Google for 1-click social import</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {[
            { id: 'whatsapp' as const, name: 'WhatsApp', email: userProfile.phone, color: 'text-emerald-600' },
            { id: 'instagram' as const, name: 'Instagram', email: userProfile.username, color: 'text-pink-600' },
            { id: 'google' as const, name: 'Google Account', email: userProfile.email, color: 'text-rose-600' },
            { id: 'facebook' as const, name: 'Facebook', email: userProfile.name, color: 'text-blue-600' },
            { id: 'youtube' as const, name: 'YouTube Channel', email: 'ARRAI Creator Hub', color: 'text-red-600' },
            { id: 'apple' as const, name: 'Apple ID', email: userProfile.email, color: 'text-slate-900' }
          ].map(soc => {
            const isLinked = userProfile.linkedSocials?.[soc.id] ?? false;
            return (
              <div key={soc.id} className="p-3.5 rounded-2xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                <div>
                  <span className={`font-bold text-xs ${soc.color} block`}>{soc.name}</span>
                  <span className="text-[11px] text-slate-500 block truncate">{soc.email}</span>
                </div>
                <button
                  onClick={() => toggleSocialLink(soc.id)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition-all ${
                    isLinked 
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' 
                      : 'bg-white border border-slate-300 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {isLinked ? 'Linked ✓' : 'Connect'}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 6. Language & Localization */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center gap-2">
          <Globe className="w-5 h-5 text-indigo-600" />
          <div>
            <h3 className="text-sm font-bold text-slate-900">App Language & Regional Settings</h3>
            <p className="text-[11px] text-slate-500">Choose your preferred Indian regional language</p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {languages.map(lang => (
            <button
              key={lang.code}
              onClick={() => {
                updateUserProfile({ language: lang.code });
                soundEngine.playKeypadClick();
              }}
              className={`p-2.5 rounded-xl border text-left transition-all ${
                (userProfile.language || 'en') === lang.code
                  ? 'bg-indigo-50 border-indigo-500 shadow-xs'
                  : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span className="font-bold text-xs text-slate-900 block">{lang.native}</span>
              <span className="text-[10px] text-slate-500">{lang.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* 7. Data Privacy & Sovereign Export */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Download className="w-5 h-5 text-indigo-600" />
            <div>
              <h3 className="text-sm font-bold text-slate-900">Export Your ARRAI Data</h3>
              <p className="text-[11px] text-slate-500">Download complete ledger statement & ecosystem data</p>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-2.5">
          <button
            onClick={handleExportStatement}
            className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Download Bank Statement (CSV)</span>
          </button>
          <button
            onClick={handleExportJsonData}
            className="px-4 py-2.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl border border-indigo-200 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Export Full Ecosystem Data (JSON)</span>
          </button>
        </div>
      </div>

      {/* 8. Account Session & Authentication Control */}
      <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Account Session & Authentication</h3>
            <p className="text-[11px] text-slate-500">
              Active Session: <span className="font-mono font-bold text-slate-800">{userProfile.phone}</span> ({userProfile.vpa})
            </p>
          </div>
          <span className="text-[10px] font-bold px-2.5 py-1 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-full">
            Active Identity
          </span>
        </div>

        <div className="flex flex-wrap gap-2.5 pt-1">
          <button
            onClick={() => setActiveSection('login')}
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-bold border border-indigo-200 transition-all flex items-center gap-1.5"
          >
            <span>Switch Account / Sign In with Another Number</span>
          </button>
          
          <button
            onClick={() => {
              if (window.confirm('Are you sure you want to log out of ARRAI Super App?')) {
                logout();
              }
            }}
            className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-700 rounded-xl text-xs font-bold border border-rose-200 transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

    </div>
  );
};
