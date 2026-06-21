"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, ArrowLeft, Mail, Lock, Loader2, Smartphone, KeyRound } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { signInWithPopup, signInWithEmailAndPassword, createUserWithEmailAndPassword, RecaptchaVerifier, signInWithPhoneNumber } from "firebase/auth";
import { auth, googleProvider, linkedinProvider } from "@/lib/firebase/client";
import { api } from "@/lib/apiClient";
import { useToast } from "@/components/ui/ToastProvider";

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
  const { addToast } = useToast();
  
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
      console.log("[LOGIN] 1. Starting popup sign-in...");
      const result = await signInWithPopup(auth, provider);
      console.log("[LOGIN] 2. Popup completed, user:", result.user.email);
      const idToken = await result.user.getIdToken();
      console.log("[LOGIN] 3. Got idToken, verifying with backend...");
      const response = await api.verifyFirebaseToken(idToken);
      console.log("[LOGIN] 4. Backend response:", response);
      
      // Store dynamic E2EE keys
      if (response.encryptionKey && response.encryptionIv) {
        sessionStorage.setItem('ai_assistant_enc_key', response.encryptionKey);
        sessionStorage.setItem('ai_assistant_enc_iv', response.encryptionIv);
      }
      
      console.log("[LOGIN] 5. Navigating to /dashboard...");
      addToast("Successfully logged in!", "success");
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error("[LOGIN] ERROR:", err);
      addToast(err.message || "Failed to sign in", "error");
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
      const response = await api.verifyFirebaseToken(idToken);
      
      if (response.encryptionKey && response.encryptionIv) {
        sessionStorage.setItem('ai_assistant_enc_key', response.encryptionKey);
        sessionStorage.setItem('ai_assistant_enc_iv', response.encryptionIv);
      }
      
      addToast("Authentication successful!", "success");
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error(err);
      addToast(err.message || "Authentication failed", "error");
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
      addToast("Verification code sent!", "info");
    } catch (err: any) {
      console.error(err);
      addToast(err.message || "Failed to send SMS", "error");
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
      const response = await api.verifyFirebaseToken(idToken);
      
      if (response.encryptionKey && response.encryptionIv) {
        sessionStorage.setItem('ai_assistant_enc_key', response.encryptionKey);
        sessionStorage.setItem('ai_assistant_enc_iv', response.encryptionIv);
      }
      
      addToast("Phone verified successfully!", "success");
      window.location.href = "/dashboard";
    } catch (err: any) {
      console.error(err);
      addToast("Invalid verification code", "error");
      setError("Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-slate-50 dark:bg-[#030014] font-sans overflow-hidden">
      
      {/* Left Pane (Dark Blue, hidden on mobile) */}
      <motion.div 
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="hidden lg:flex flex-col w-1/2 bg-[#0A0D27] relative overflow-hidden text-white p-12 justify-between"
      >
        {/* Decorative Background Pattern */}
        <div className="absolute inset-0 opacity-10 pointer-events-none" style={{ backgroundImage: "radial-gradient(#ffffff 1px, transparent 1px)", backgroundSize: "24px 24px" }} />
        <motion.div 
          animate={{ scale: [1, 1.1, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -top-32 -left-32 w-96 h-96 bg-violet-600 rounded-full blur-[120px] pointer-events-none" 
        />
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-600 rounded-full blur-[120px] pointer-events-none" 
        />

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3">
          <motion.div 
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.5 }}
            className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-[#9061f9] flex items-center justify-center shadow-lg"
          >
            <Sparkles className="w-4 h-4 text-white" />
          </motion.div>
          <span className="font-display font-extrabold text-[22px] tracking-tight text-white">
            Anshu<span className="text-violet-400">.ai</span>
          </span>
        </div>

        {/* Dashboard Mockup Placeholder */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="relative z-10 flex-1 flex flex-col items-center justify-center mt-12 mb-12 w-full max-w-lg mx-auto min-h-0"
        >
          <motion.img 
            whileHover={{ y: -10, scale: 1.02, filter: "brightness(1.1)", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
            transition={{ duration: 0.4 }}
            src="/dashboard-mockup.png" 
            alt="Dashboard Mockup" 
            className="w-full h-auto max-h-full object-contain rounded-xl shadow-2xl border border-white/10"
          />
        </motion.div>

        {/* Bottom Text */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="relative z-10 text-center max-w-md mx-auto"
        >
          <h2 className="text-3xl font-bold mb-4 font-display">Your Smart Personal Assistant</h2>
          <p className="text-slate-400 text-[15px] leading-relaxed">
            Manage your schedule, reply to emails, and stay on top of your alerts without lifting a finger. 
          </p>
        </motion.div>
      </motion.div>

      {/* Right Pane (White Form) */}
      <motion.div 
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 bg-white dark:bg-slate-900 relative overflow-y-auto"
      >
        <Link href="/" className="absolute top-6 left-6 sm:top-8 sm:left-8 cursor-pointer inline-flex items-center gap-1.5 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 text-[13px] font-medium transition-colors lg:hidden">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>

        <div className="w-full max-w-[400px] mt-10 sm:mt-0">
          
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-center mb-6 sm:mb-8"
          >
            <h1 className="font-display font-bold text-2xl sm:text-3xl text-slate-900 dark:text-white mb-2">
              {isSignUp ? "Create Your Account" : "Welcome Back"}
            </h1>
            <p className="text-slate-500 dark:text-slate-400 text-[14px] sm:text-[15px]">
              {isSignUp ? "Sign up to get started." : "Please enter your details to sign in."}
            </p>
          </motion.div>

          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleProviderSignIn(googleProvider)} 
            disabled={loading} 
            className="w-full flex items-center justify-center gap-3 bg-[#F8FAFC] dark:bg-white/5 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 font-semibold text-[14px] rounded-xl py-3 hover:bg-slate-100 dark:hover:bg-white/10 transition-colors disabled:opacity-60 cursor-pointer mb-3 shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            Sign {isSignUp ? "Up" : "In"} with Google
          </motion.button>
          
          <motion.button 
            whileHover={{ scale: 1.01 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => handleProviderSignIn(linkedinProvider)} 
            disabled={loading} 
            className="w-full flex items-center justify-center gap-3 bg-[#0a66c2] text-white font-semibold text-[14px] rounded-xl py-3 hover:bg-[#0055b3] transition-colors disabled:opacity-60 cursor-pointer mb-6 shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/448234/linkedin.svg" alt="LinkedIn" className="w-5 h-5 invert" />
            Sign {isSignUp ? "Up" : "In"} with LinkedIn
          </motion.button>

          <div className="relative flex items-center mb-6">
            <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
            <span className="flex-shrink-0 mx-4 text-slate-400 dark:text-slate-500 text-[12px] font-medium uppercase tracking-wider">OR</span>
            <div className="flex-grow border-t border-slate-200 dark:border-white/10"></div>
          </div>

          {/* Auth Method Toggles */}
          <div className="flex bg-slate-100 dark:bg-white/5 p-1 rounded-xl mb-6 relative">
            <button 
              onClick={() => { setAuthMethod("email"); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer relative z-10 ${authMethod === "email" ? "text-slate-800 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              Email
            </button>
            <button 
              onClick={() => { setAuthMethod("phone"); setError(null); }}
              className={`flex-1 py-2 rounded-lg text-[13px] font-semibold transition-colors cursor-pointer relative z-10 ${authMethod === "phone" ? "text-slate-800 dark:text-white" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"}`}
            >
              Phone Number
            </button>
            {/* Sliding highlight */}
            <motion.div 
              layout
              className="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-white dark:bg-white/10 rounded-lg shadow-sm border border-slate-200 dark:border-white/5 pointer-events-none"
              animate={{ left: authMethod === "email" ? "4px" : "calc(50% + 2px)" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
          </div>

          {/* Forms */}
          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              {authMethod === "email" ? (
                <motion.form 
                  key="email-form"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.2 }}
                  onSubmit={handleEmailAuth} 
                  className="flex flex-col gap-4"
                >
                  <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                    <input type="email" required placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-[14px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#5a5ce5] focus:ring-1 focus:ring-[#5a5ce5] outline-none transition-all shadow-sm" />
                  </motion.div>
                  <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
                    <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                    <input type="password" required placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-[14px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#5a5ce5] focus:ring-1 focus:ring-[#5a5ce5] outline-none transition-all shadow-sm" />
                  </motion.div>

                  <AnimatePresence>
                    {isSignUp && (
                      <motion.div 
                        initial={{ opacity: 0, height: 0 }} 
                        animate={{ opacity: 1, height: "auto" }} 
                        exit={{ opacity: 0, height: 0 }}
                        className="flex items-start gap-2 mt-1 overflow-hidden"
                      >
                        <input type="checkbox" id="terms" className="mt-1 w-4 h-4 rounded border-slate-300 text-[#5a5ce5] focus:ring-[#5a5ce5]" required />
                        <label htmlFor="terms" className="text-[13px] text-slate-500">
                          I agree to the <a href="#" className="text-[#5a5ce5] hover:underline font-medium">Terms & Conditions</a>
                        </label>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {error && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[13px] text-red-500 bg-red-50 rounded-xl px-4 py-3 border border-red-100 font-medium mt-1">{error}</motion.p>}

                  <motion.button 
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit" 
                    disabled={loading} 
                    className="flex items-center justify-center gap-2 bg-[#5a5ce5] hover:bg-[#4a4cc7] text-white font-semibold text-[15px] rounded-xl py-3.5 mt-3 transition-colors disabled:opacity-60 cursor-pointer shadow-md shadow-[#5a5ce5]/30"
                  >
                    {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : isSignUp ? "Register" : "Sign In"}
                  </motion.button>
                  
                  <div className="mt-6 text-center">
                    <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-slate-500 hover:text-slate-800 text-[14px] transition-colors cursor-pointer">
                      {isSignUp ? "Already have an account? " : "Don't have an account? "}
                      <span className="text-[#5a5ce5] font-semibold">{isSignUp ? "Sign In" : "Sign Up"}</span>
                    </button>
                  </div>
                </motion.form>
              ) : (
                <motion.div
                  key="phone-form"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.2 }}
                >
                  {!confirmationResult ? (
                    <form onSubmit={handlePhoneSubmit} className="flex flex-col gap-4">
                      <div className="flex gap-2">
                        <div ref={toggleRef} className="relative w-[120px]">
                          <motion.div 
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="w-full h-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-3 pr-2 py-3.5 text-[14px] text-slate-900 dark:text-white flex items-center justify-between cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors shadow-sm"
                          >
                            <span className="flex items-center gap-2">
                              <img src={`https://flagcdn.com/w20/${COUNTRIES.find(c => c.code === countryCode)?.iso || 'in'}.png`} width="20" alt="flag" className="rounded-[2px] shadow-sm" />
                              <span className="font-semibold">{countryCode}</span>
                            </span>
                            <div className="text-slate-400 text-[10px]">▼</div>
                          </motion.div>

                          <AnimatePresence>
                            {isDropdownOpen && (
                              <>
                                <div className="fixed inset-0 z-40" onClick={() => setIsDropdownOpen(false)}></div>
                                <motion.div 
                                  initial={{ opacity: 0, y: dropdownPos === "top" ? 10 : -10 }}
                                  animate={{ opacity: 1, y: 0 }}
                                  exit={{ opacity: 0, y: dropdownPos === "top" ? 10 : -10 }}
                                  className={`absolute left-0 w-[240px] max-h-[240px] overflow-y-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 flex flex-col py-1.5 ${dropdownPos === "top" ? "bottom-full mb-2" : "top-full mt-2"}`}
                                >
                                  {COUNTRIES.map(c => (
                                    <div 
                                      key={c.code}
                                      onClick={() => { setCountryCode(c.code); setIsDropdownOpen(false); }}
                                      className={`px-4 py-2.5 text-[14px] cursor-pointer flex items-center justify-between transition-colors ${countryCode === c.code ? 'bg-[#5a5ce5]/10 text-[#5a5ce5] font-semibold' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800'}`}
                                    >
                                      <div className="flex items-center gap-3">
                                        <img src={`https://flagcdn.com/w20/${c.iso}.png`} width="20" alt={c.iso} className="rounded-[2px] shadow-sm" />
                                        <span className="truncate max-w-[130px]">{c.label}</span>
                                      </div>
                                      <span className="text-slate-400 text-[13px]">{c.code}</span>
                                    </div>
                                  ))}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                        <motion.div className="relative flex-1" whileFocus={{ scale: 1.01 }}>
                          <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                          <input type="tel" required placeholder="82105 00193" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-[14px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#5a5ce5] focus:ring-1 focus:ring-[#5a5ce5] outline-none transition-all shadow-sm" />
                        </motion.div>
                      </div>
                      
                      <AnimatePresence>
                        {isSignUp && (
                          <motion.div 
                            initial={{ opacity: 0, height: 0 }} 
                            animate={{ opacity: 1, height: "auto" }} 
                            exit={{ opacity: 0, height: 0 }}
                            className="flex items-start gap-2 mt-1 overflow-hidden"
                          >
                            <input type="checkbox" id="terms_phone" className="mt-1 w-4 h-4 rounded border-slate-300 text-[#5a5ce5] focus:ring-[#5a5ce5]" required />
                            <label htmlFor="terms_phone" className="text-[13px] text-slate-500">
                              I agree to the <a href="#" className="text-[#5a5ce5] hover:underline font-medium">Terms & Conditions</a>
                            </label>
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {error && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[13px] text-red-500 bg-red-50 rounded-xl px-4 py-3 border border-red-100 font-medium mt-1">{error}</motion.p>}
                      
                      <div id="recaptcha-container" className="flex justify-center my-2"></div>

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        disabled={loading} 
                        className="flex items-center justify-center gap-2 bg-[#5a5ce5] hover:bg-[#4a4cc7] text-white font-semibold text-[15px] rounded-xl py-3.5 mt-3 transition-colors disabled:opacity-60 cursor-pointer shadow-md shadow-[#5a5ce5]/30"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Send SMS Code"}
                      </motion.button>

                      <div className="mt-6 text-center">
                        <button type="button" onClick={() => setIsSignUp(!isSignUp)} className="text-slate-500 hover:text-slate-800 text-[14px] transition-colors cursor-pointer">
                          {isSignUp ? "Already have an account? " : "Don't have an account? "}
                          <span className="text-[#5a5ce5] font-semibold">{isSignUp ? "Sign In" : "Sign Up"}</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <motion.form 
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      onSubmit={handleCodeVerify} 
                      className="flex flex-col gap-4"
                    >
                      <motion.div className="relative" whileFocus={{ scale: 1.01 }}>
                        <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[18px] h-[18px] text-slate-400" />
                        <input type="text" required placeholder="6-digit code" value={verificationCode} onChange={(e) => setVerificationCode(e.target.value)} className="w-full bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl pl-11 pr-4 py-3.5 text-[14px] text-slate-900 dark:text-white placeholder:text-slate-400 focus:border-[#5a5ce5] focus:ring-1 focus:ring-[#5a5ce5] outline-none transition-all shadow-sm" />
                      </motion.div>
                      
                      {error && <motion.p initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="text-[13px] text-red-500 bg-red-50 rounded-xl px-4 py-3 border border-red-100 font-medium mt-1">{error}</motion.p>}

                      <motion.button 
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit" 
                        disabled={loading} 
                        className="flex items-center justify-center gap-2 bg-[#5a5ce5] hover:bg-[#4a4cc7] text-white font-semibold text-[15px] rounded-xl py-3.5 mt-3 transition-colors disabled:opacity-60 cursor-pointer shadow-md shadow-[#5a5ce5]/30"
                      >
                        {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Verify & Sign In"}
                      </motion.button>
                    </motion.form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

        </div>
      </motion.div>
    </div>
  );
}
