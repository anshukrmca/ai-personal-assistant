"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft, Mail, Lock, Loader2, Smartphone, KeyRound } from "lucide-react";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, googleProvider, linkedinProvider } from "@/lib/firebase/client";
import { api } from "@/lib/apiClient";

declare global {
  interface Window {
    recaptchaVerifier: any;
  }
}

const COUNTRIES = [
  { code: "+1", iso: "us", label: "United States" },
  { code: "+44", iso: "gb", label: "United Kingdom" },
  { code: "+91", iso: "in", label: "India" },
  { code: "+61", iso: "au", label: "Australia" },
  { code: "+81", iso: "jp", label: "Japan" },
  { code: "+49", iso: "de", label: "Germany" },
  { code: "+33", iso: "fr", label: "France" },
  { code: "+55", iso: "br", label: "Brazil" },
  { code: "+52", iso: "mx", label: "Mexico" },
  { code: "+27", iso: "za", label: "South Africa" },
  { code: "+971", iso: "ae", label: "UAE" }
];

export default function LoginPage() {
  const router = useRouter();
  
  // Auth Method State
  const [authMethod, setAuthMethod] = useState<"email" | "phone">("email");
  
  // Email State
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  
  // Phone State
  const [countryCode, setCountryCode] = useState("+91");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [dropdownPos, setDropdownPos] = useState<"bottom" | "top">("bottom");
  const toggleRef = useRef<HTMLDivElement>(null);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState("");
  const [confirmationResult, setConfirmationResult] = useState<any>(null);

  // General State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Auto-position dropdown based on screen space
  useEffect(() => {
    if (isDropdownOpen && toggleRef.current) {
      const rect = toggleRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      if (spaceBelow < 250) {
        setDropdownPos("top");
      } else {
        setDropdownPos("bottom");
      }
    }
  }, [isDropdownOpen]);

  const handleProviderSignIn = async (provider: any) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, provider);
      const idToken = await result.user.getIdToken();
      await api.verifyFirebaseToken(idToken);
      router.push("/briefing");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to sign in");
    } finally {
      setLoading(false);
    }
  };

  const handleEmailAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let result;
      if (isSignUp) {
        result = await createUserWithEmailAndPassword(auth, email, password);
      } else {
        result = await signInWithEmailAndPassword(auth, email, password);
      }
      const idToken = await result.user.getIdToken();
      await api.verifyFirebaseToken(idToken);
      router.push("/briefing");
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    // Combine country code and phone number, stripping any inner whitespace or existing +
    const rawPhone = phoneNumber.replace(/\D/g, "");
    const formattedPhone = `${countryCode}${rawPhone}`;

    if (rawPhone.length < 5) {
      setError("Please enter a valid phone number.");
      setLoading(false);
      return;
    }

    try {
      if (!window.recaptchaVerifier) {
        window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
          'size': 'invisible'
        });
      }
      const appVerifier = window.recaptchaVerifier;
      const result = await signInWithPhoneNumber(auth, formattedPhone, appVerifier);
      setConfirmationResult(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "Failed to send SMS");
    } finally {
      setLoading(false);
    }
  };

  const handleCodeVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const result = await confirmationResult.confirm(verificationCode);
      const idToken = await result.user.getIdToken();
      await api.verifyFirebaseToken(idToken);
      router.push("/briefing");
    } catch (err: any) {
      console.error(err);
      setError("Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-[#030014] text-slate-100 relative overflow-hidden">
      {/* Decorative glows */}
      <div aria-hidden className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none" style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }} />
      <div aria-hidden className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none" style={{ background: "radial-gradient(circle, var(--info), transparent 70%)" }} />

      <div className="w-full max-w-[420px] rise-in relative z-10">
        
        <Link href="/" className="cursor-pointer inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-[13px] mb-6 transition-colors font-medium group">
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to Home
        </Link>

        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-[#9061f9] flex items-center justify-center shadow-lg shadow-violet-600/30">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-display font-extrabold text-[20px] tracking-tight text-white">
            Anshu<span className="text-violet-400">.ai</span>
          </span>
        </div>

        <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
          <h1 className="font-display font-bold text-[22px] tracking-tight text-white mb-1.5 text-center">
            {isSignUp ? "Create an account" : "Welcome back"}
          </h1>
          <p className="text-slate-400 text-[14px] mb-7 leading-relaxed font-medium text-center">
            Sign in to access your personal assistant.
          </p>

          {/* Social Logins */}
          <div className="space-y-3 mb-6">
            <button onClick={() => handleProviderSignIn(googleProvider)} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-white text-slate-900 font-bold text-[14px] rounded-xl py-3 hover:bg-slate-100 transition-colors disabled:opacity-60 cursor-pointer">
              <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
              Continue with Google
            </button>
            <button onClick={() => handleProviderSignIn(linkedinProvider)} disabled={loading} className="w-full flex items-center justify-center gap-3 bg-[#0a66c2] text-white font-bold text-[14px] rounded-xl py-3 hover:bg-[#004182] transition-colors disabled:opacity-60 cursor-pointer">
              <img src="https://www.svgrepo.com/show/448234/linkedin.svg" alt="LinkedIn" className="w-5 h-5 invert" />
              Continue with LinkedIn
            </button>
          </div>

          <div className="relative flex items-center py-2 mb-6">
            <div className="flex-grow border-t border-white/[0.08]"></div>
            <span className="flex-shrink-0 mx-4 text-slate-500 text-[12px] font-medium uppercase tracking-wider">Or continue with</span>
            <div className="flex-grow border-t border-white/[0.08]"></div>
          </div>

          {/* Auth Method Toggles */}
          <div className="flex bg-white/[0.03] p-1 rounded-xl mb-6">
            <button 
              onClick={() => { setAuthMethod("email"); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-colors cursor-pointer ${authMethod === "email" ? "bg-white/[0.08] text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
            >
              Email
            </button>
            <button 
              onClick={() => { setAuthMethod("phone"); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-[13px] font-bold transition-colors cursor-pointer ${authMethod === "phone" ? "bg-white/[0.08] text-white shadow-sm" : "text-slate-400 hover:text-white"}`}
            >
              Phone Number
            </button>
          </div>

          {/* Forms */}
          {authMethod === "email" ? (
            <form onSubmit={handleEmailAuth} className="flex flex-col gap-4">
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-500" />
                <input type="email" required placeholder="Email address" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-slate-950/40 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-[14px] text-white placeholder:text-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all" />
              </div>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-500" />
                <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-slate-950/40 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-[14px] text-white placeholder:text-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all" />
              </div>

              {error && <p className="text-[13px] text-red-400 bg-red-500/10 rounded-xl px-3.5 py-2.5 border border-red-500/20 font-medium">{error}</p>}

              <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-[14.5px] rounded-xl py-3.5 mt-2 hover:scale-[1.01] transition-all disabled:opacity-60 cursor-pointer">
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isSignUp ? "Sign Up" : "Sign In"}
              </button>
              
              <div className="mt-4 text-center">
                <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-slate-400 hover:text-white text-[13px] font-medium transition-colors cursor-pointer">
                  {isSignUp ? "Already have an account? Sign in" : "Don't have an account? Sign up"}
                </button>
              </div>
            </form>
          ) : (
            <div>
              {!confirmationResult ? (
                <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
                  <div className="flex gap-2">
                    <div ref={toggleRef} className="relative w-[110px]">
                      <div 
                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                        className="w-full h-full bg-slate-950/40 border border-white/[0.08] rounded-xl pl-3 pr-2 py-3 text-[14px] text-white flex items-center justify-between cursor-pointer hover:bg-white/[0.02] transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <img 
                            src={`https://flagcdn.com/w20/${COUNTRIES.find(c => c.code === countryCode)?.iso || 'in'}.png`} 
                            width="20" 
                            alt="flag" 
                            className="rounded-[2px]" 
                          />
                          <span className="font-medium text-slate-200">{countryCode}</span>
                        </span>
                        <div className="text-slate-500 text-[10px]">▼</div>
                      </div>

                      {isDropdownOpen && (
                        <>
                          <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                          <div className={`absolute left-0 w-[240px] max-h-[240px] overflow-y-auto bg-slate-900 border border-white/[0.08] rounded-xl shadow-2xl z-50 flex flex-col py-1.5 rise-in ${dropdownPos === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}>
                            {COUNTRIES.map(c => (
                              <div 
                                key={c.code}
                                onClick={() => { setCountryCode(c.code); setIsDropdownOpen(false); }}
                                className={`px-4 py-2.5 text-[14px] cursor-pointer flex items-center justify-between transition-colors ${countryCode === c.code ? 'bg-violet-500/10 text-violet-300 font-medium' : 'text-slate-200 hover:bg-white/[0.04]'}`}
                              >
                                <div className="flex items-center gap-3">
                                  <img src={`https://flagcdn.com/w20/${c.iso}.png`} width="20" alt={c.iso} className="rounded-[2px]" />
                                  <span className="truncate max-w-[130px]">{c.label}</span>
                                </div>
                                <span className="text-slate-400 text-[13px]">{c.code}</span>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                    <div className="relative flex-1">
                      <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-500" />
                      <input type="tel" required placeholder="82105 00193" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-slate-950/40 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-[14px] text-white placeholder:text-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all" />
                    </div>
                  </div>
                  
                  {error && <p className="text-[13px] text-red-400 bg-red-500/10 rounded-xl px-3.5 py-2.5 border border-red-500/20 font-medium">{error}</p>}
                  
                  <div id="recaptcha-container" className="flex justify-center my-2"></div>

                  <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-[14.5px] rounded-xl py-3.5 mt-2 hover:scale-[1.01] transition-all disabled:opacity-60 cursor-pointer">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send SMS Code"}
                  </button>
                </form>
              ) : (
                <form onSubmit={handleCodeVerify} className="flex flex-col gap-4">
                  <div className="relative">
                    <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-500" />
                    <input type="text" required placeholder="6-digit code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="w-full bg-slate-950/40 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-[14px] text-white placeholder:text-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all" />
                  </div>
                  
                  {error && <p className="text-[13px] text-red-400 bg-red-500/10 rounded-xl px-3.5 py-2.5 border border-red-500/20 font-medium">{error}</p>}

                  <button type="submit" disabled={loading} className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-[14.5px] rounded-xl py-3.5 mt-2 hover:scale-[1.01] transition-all disabled:opacity-60 cursor-pointer">
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Sign In"}
                  </button>
                </form>
              )}
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
