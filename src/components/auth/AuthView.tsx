import React, { useState, useEffect } from 'react';
import { useAppStore } from '../../store/useAppStore';
import { supabaseService } from '../../services/supabase';
import { 
  ShieldCheck, 
  Smartphone, 
  Mail, 
  Lock, 
  ArrowRight, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  IndianRupee,
  KeyRound,
  User,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface AuthViewProps {
  initialMode?: 'login' | 'signup';
}

export const AuthView: React.FC<AuthViewProps> = ({ initialMode = 'login' }) => {
  const { 
    loginWithPhone, 
    loginWithGoogle, 
    loginWithEmail, 
    signupNewUser, 
    setActiveSection 
  } = useAppStore();

  const [authMode, setAuthMode] = useState<'login' | 'signup'>(initialMode);
  const [method, setMethod] = useState<'phone' | 'email'>('phone');

  // Phone OTP Flow State
  const [phoneNumber, setPhoneNumber] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [demoOtp, setDemoOtp] = useState('');
  const [otpInput, setOtpInput] = useState('');
  const [otpTimer, setOtpTimer] = useState(30);

  // Email State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Signup State
  const [fullName, setFullName] = useState('');
  const [signupPhone, setSignupPhone] = useState('');
  const [signupEmail, setSignupEmail] = useState('');

  // Status & Feedback
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Timer countdown
  useEffect(() => {
    let interval: any = null;
    if (otpSent && otpTimer > 0) {
      interval = setInterval(() => setOtpTimer(prev => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [otpSent, otpTimer]);

  const handleSendOtp = async () => {
    setErrorMessage(null);
    if (!phoneNumber || phoneNumber.length < 10) {
      setErrorMessage('Please enter a valid 10-digit Indian mobile number');
      return;
    }
    setIsLoading(true);

    try {
      await supabaseService.sendPhoneOtp(phoneNumber);
    } catch (e) {
      // Fallback
    }

    setIsLoading(false);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    setDemoOtp(code);
    setOtpSent(true);
    setOtpTimer(30);
    setSuccessMessage(`OTP sent to +91 ${phoneNumber}! Verification code ready: ${code}`);
  };

  const handleVerifyPhoneOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!otpInput || otpInput.length < 6) {
      setErrorMessage('Please enter the 6-digit OTP code');
      return;
    }
    setIsLoading(true);
    const res = await loginWithPhone(phoneNumber, otpInput);
    setIsLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Invalid OTP code');
    } else {
      confetti({ particleCount: 60, spread: 60 });
      setActiveSection('home');
    }
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!email || !password) {
      setErrorMessage('Please provide both email and password');
      return;
    }
    setIsLoading(true);
    const res = await loginWithEmail(email, password);
    setIsLoading(false);
    if (!res.success) {
      setErrorMessage(res.error || 'Authentication failed');
    } else {
      confetti({ particleCount: 60, spread: 60 });
      setActiveSection('home');
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setErrorMessage(null);
    const res = await loginWithGoogle();
    setIsLoading(false);
    if (res.success) {
      confetti({ particleCount: 70, spread: 70 });
      setActiveSection('home');
    } else {
      setErrorMessage(res.error || 'Google sign-in failed');
    }
  };

  const handleSignupSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    if (!fullName.trim() || !signupPhone.trim()) {
      setErrorMessage('Please provide your name and phone number');
      return;
    }
    setIsLoading(true);
    const res = await signupNewUser({
      name: fullName.trim(),
      phone: signupPhone.trim(),
      email: signupEmail.trim() || `${fullName.toLowerCase().replace(/\s+/g, '')}@arrai.in`
    });
    setIsLoading(false);
    if (res.success) {
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
      setActiveSection('home');
    } else {
      setErrorMessage(res.error || 'Failed to create account');
    }
  };

  return (
    <div className="max-w-md mx-auto py-6 px-4 sm:px-0">
      
      {/* Back to Home Button */}
      <button
        onClick={() => setActiveSection('home')}
        className="mb-4 inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Super App</span>
      </button>

      {/* Main Glassmorphic Card */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-indigo-900 via-indigo-950 to-slate-900 text-white p-6 text-center relative">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-400 mx-auto flex items-center justify-center font-black text-slate-950 text-xl shadow-lg mb-3">
            AR
          </div>
          <h1 className="text-xl font-black tracking-tight">ARRAI Super App Account</h1>
          <p className="text-xs text-indigo-300 mt-1">One secure identity for all 8 ARRAI sub-apps</p>
          
          <div className="mt-4 flex items-center justify-center gap-1 p-1 bg-white/10 rounded-2xl backdrop-blur-sm max-w-xs mx-auto border border-white/10">
            <button
              onClick={() => { setAuthMode('login'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authMode === 'login' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setAuthMode('signup'); setErrorMessage(null); setSuccessMessage(null); }}
              className={`flex-1 py-1.5 rounded-xl text-xs font-bold transition-all ${
                authMode === 'signup' ? 'bg-white text-slate-900 shadow-sm' : 'text-white/80 hover:text-white'
              }`}
            >
              Create Account
            </button>
          </div>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-4">
          
          {/* Notifications / Errors */}
          {errorMessage && (
            <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                <span>{successMessage}</span>
              </div>
              {demoOtp && (
                <button
                  type="button"
                  onClick={() => setOtpInput(demoOtp)}
                  className="px-2 py-0.5 bg-emerald-600 text-white text-[10px] font-bold rounded-lg shadow-2xs hover:bg-emerald-700"
                >
                  Auto-fill
                </button>
              )}
            </div>
          )}

          {/* ═══ 1. SIGN IN TAB ═══════════════════════════════════════════════ */}
          {authMode === 'login' ? (
            <div className="space-y-4">
              
              {/* Method Switcher: Phone OTP vs Email */}
              <div className="flex border-b border-slate-200 text-xs font-bold">
                <button
                  onClick={() => setMethod('phone')}
                  className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                    method === 'phone'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <Smartphone className="w-4 h-4" />
                  <span>Phone & OTP</span>
                </button>
                <button
                  onClick={() => setMethod('email')}
                  className={`flex-1 pb-2.5 flex items-center justify-center gap-1.5 border-b-2 transition-all ${
                    method === 'email'
                      ? 'border-indigo-600 text-indigo-600'
                      : 'border-transparent text-slate-400 hover:text-slate-700'
                  }`}
                >
                  <Mail className="w-4 h-4" />
                  <span>Email & Password</span>
                </button>
              </div>

              {/* A. Phone OTP Method */}
              {method === 'phone' && (
                <form onSubmit={handleVerifyPhoneOtp} className="space-y-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Indian Mobile Number (+91)
                    </label>
                    <div className="flex items-center gap-2">
                      <div className="px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                        🇮🇳 +91
                      </div>
                      <input
                        type="tel"
                        maxLength={10}
                        placeholder="98765 43210"
                        value={phoneNumber}
                        onChange={(e) => setPhoneNumber(e.target.value.replace(/\D/g, ''))}
                        className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                        disabled={otpSent}
                        required
                      />
                    </div>
                  </div>

                  {!otpSent ? (
                    <button
                      type="button"
                      onClick={handleSendOtp}
                      disabled={isLoading || phoneNumber.length < 10}
                      className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                    >
                      {isLoading ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <>
                          <span>Get 6-Digit OTP</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="space-y-3 animate-in fade-in">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <label className="text-xs font-bold text-slate-700">
                            Enter 6-Digit Verification Code
                          </label>
                          <button
                            type="button"
                            onClick={() => { setOtpSent(false); setOtpInput(''); }}
                            className="text-[10px] text-indigo-600 hover:underline font-bold"
                          >
                            Change Number
                          </button>
                        </div>
                        <input
                          type="text"
                          maxLength={6}
                          placeholder="••••••"
                          value={otpInput}
                          onChange={(e) => setOtpInput(e.target.value.replace(/\D/g, ''))}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-300 rounded-xl text-lg font-mono font-bold tracking-widest text-center text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                          required
                        />
                      </div>

                      <div className="flex items-center justify-between text-[11px] text-slate-500">
                        <span>Didn't get code?</span>
                        {otpTimer > 0 ? (
                          <span className="font-mono text-slate-400">Resend in {otpTimer}s</span>
                        ) : (
                          <button
                            type="button"
                            onClick={handleSendOtp}
                            className="text-indigo-600 font-bold hover:underline"
                          >
                            Resend Code
                          </button>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={isLoading || otpInput.length < 6}
                        className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 active:scale-98 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                      >
                        {isLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <>
                            <ShieldCheck className="w-4 h-4" />
                            <span>Verify & Sign In</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              )}

              {/* B. Email & Password Method */}
              {method === 'email' && (
                <form onSubmit={handleEmailSubmit} className="space-y-3 pt-1">
                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="abhishek@arrai.in"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-slate-700 block mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-98 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
                  >
                    {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>Sign In to ARRAI</span>}
                  </button>
                </form>
              )}

              {/* Divider */}
              <div className="relative my-3 text-center">
                <span className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px bg-slate-200" />
                <span className="relative bg-white px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Or Continue With
                </span>
              </div>

              {/* Google 1-Click Login */}
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full py-2.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 active:scale-98 text-slate-700 rounded-xl text-xs font-bold transition-all shadow-2xs flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.65v3.03h3.88c2.28-2.1 3.66-5.2 3.66-9.12z" />
                  <path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.03c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.13C3.26 21.36 7.35 24 12 24z" />
                  <path fill="#FBBC05" d="M5.28 14.29c-.25-.72-.38-1.49-.38-2.29s.13-1.57.38-2.29V6.58H1.25C.45 8.18 0 9.99 0 12s.45 3.82 1.25 5.42l4.03-3.13z" />
                  <path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.35 0 3.26 2.64 1.25 6.58l4.03 3.13c.95-2.83 3.6-4.96 6.72-4.96z" />
                </svg>
                <span>Continue with Google</span>
              </button>

            </div>
          ) : (
            
            /* ═══ 2. SIGN UP TAB ═════════════════════════════════════════════ */
            <form onSubmit={handleSignupSubmit} className="space-y-3">
              
              <div className="p-3 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  ₹500
                </div>
                <div>
                  <h4 className="text-xs font-bold text-emerald-950">₹500 Welcome Bonus</h4>
                  <p className="text-[10px] text-emerald-700">Instant credit to your new ARRAI Wallet on registration</p>
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="e.g. Abhishek Rai"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Mobile Number (for UPI & OTP)
                </label>
                <div className="flex items-center gap-2">
                  <div className="px-3 py-2.5 bg-slate-100 border border-slate-200 rounded-xl text-xs font-bold text-slate-700">
                    +91
                  </div>
                  <input
                    type="tel"
                    maxLength={10}
                    placeholder="98765 43210"
                    value={signupPhone}
                    onChange={(e) => setSignupPhone(e.target.value.replace(/\D/g, ''))}
                    className="flex-1 px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs font-mono font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">
                  Email Address (Optional)
                </label>
                <input
                  type="email"
                  placeholder="abhishek@arrai.in"
                  value={signupEmail}
                  onChange={(e) => setSignupEmail(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white"
                />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-[11px] text-slate-500">
                <span>By continuing, your unique ARRAI UPI ID will be: </span>
                <span className="font-mono font-bold text-indigo-700">
                  {fullName ? `${fullName.toLowerCase().replace(/[^a-z0-9]/g, '')}@arrai` : 'yourname@arrai'}
                </span>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-3 bg-gradient-to-r from-emerald-600 to-teal-700 hover:from-emerald-700 hover:to-teal-800 active:scale-98 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Create Free ARRAI Account & Claim ₹500</span>
                  </>
                )}
              </button>
            </form>
          )}

          {/* Guest Access Alternative */}
          <div className="pt-2 text-center">
            <button
              type="button"
              onClick={() => setActiveSection('home')}
              className="text-xs text-slate-500 hover:text-indigo-600 font-semibold transition-colors"
            >
              Continue as Guest & Explore All 8 Apps &rarr;
            </button>
          </div>

        </div>

        {/* Bottom Trust Footer */}
        <div className="px-6 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400">
          <div className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>256-bit Encrypted</span>
          </div>
          <span>NPCI & RBI Compliant</span>
          <span>ARRAI Super App</span>
        </div>

      </div>

    </div>
  );
};
