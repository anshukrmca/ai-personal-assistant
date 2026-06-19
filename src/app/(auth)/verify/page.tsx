"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles, ShieldCheck, ArrowLeft } from "lucide-react";
import { api } from "@/lib/apiClient";

function readSessionValue(key: string): string | null {
  if (typeof window === "undefined") return null;
  return sessionStorage.getItem(key);
}

export default function VerifyPage() {
  const router = useRouter();
  const [phone] = useState<string | null>(() => readSessionValue("pendingPhone"));
  const [channel] = useState<"sms" | "whatsapp">(
    () => (readSessionValue("pendingChannel") as "sms" | "whatsapp" | null) ?? "whatsapp"
  );
  const [devCode, setDevCode] = useState<string | null>(() => readSessionValue("devCode"));
  const [digits, setDigits] = useState<string[]>(Array(6).fill(""));
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (!phone) {
      router.replace("/login");
    }
  }, [phone, router]);

  function handleChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return;
    const next = [...digits];
    next[index] = value.slice(-1);
    setDigits(next);
    if (value && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    if (!phone) return;
    const code = digits.join("");
    if (code.length !== 6) {
      setError("Enter the 6-digit code");
      return;
    }
    setError(null);
    setLoading(true);
    try {
      await api.verifyOtp(phone, code, channel);
      sessionStorage.removeItem("pendingPhone");
      sessionStorage.removeItem("pendingChannel");
      sessionStorage.removeItem("devCode");
      router.push("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Verification failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleResend() {
    if (!phone) return;
    setError(null);
    try {
      const res = await api.requestOtp(phone, channel);
      if (res.devCode) {
        setDevCode(res.devCode);
        sessionStorage.setItem("devCode", res.devCode);
      }
      setDigits(Array(6).fill(""));
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Couldn't resend code");
    }
  }

  if (!phone) {
    return null;
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-4 bg-[#030014] text-slate-100 relative overflow-hidden">
      {/* Decorative glows */}
      <div
        aria-hidden
        className="absolute -top-32 -right-32 w-96 h-96 rounded-full blur-3xl opacity-25 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--accent), transparent 70%)" }}
      />
      <div
        aria-hidden
        className="absolute -bottom-40 -left-32 w-96 h-96 rounded-full blur-3xl opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, var(--info), transparent 70%)" }}
      />

      <div className="w-full max-w-[420px] rise-in relative z-10">
        
        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-[#9061f9] flex items-center justify-center shadow-lg shadow-violet-600/30">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-display font-extrabold text-[20px] tracking-tight text-white">
            Anshu<span className="text-violet-400">.ai</span>
          </span>
        </div>

        {/* Glassmorphic Card */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
          <button
            onClick={() => router.push("/login")}
            className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-[13px] mb-6 transition-colors font-medium group cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to sign in
          </button>

          <div className="w-11 h-11 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-4">
            <ShieldCheck className="w-5 h-5 text-emerald-400" />
          </div>

          <h1 className="font-display font-bold text-[22px] tracking-tight text-white mb-1.5">
            Enter your code
          </h1>
          <p className="text-slate-400 text-[14px] mb-7 leading-relaxed font-medium">
            Sent via {channel === "whatsapp" ? "WhatsApp" : "SMS"} to{" "}
            <span className="font-mono text-white bg-white/5 px-2 py-0.5 rounded border border-white/5">{phone}</span>
          </p>

          {devCode && (
            <div className="mb-6 rounded-xl border border-violet-500/30 bg-violet-500/10 px-4 py-3 shadow-[0_0_15px_rgba(124,58,237,0.1)]">
              <p className="text-[12px] text-violet-400 font-bold mb-0.5 uppercase tracking-wider">
                Dev mode — your code
              </p>
              <p className="font-mono text-[20px] tracking-[0.3em] font-extrabold text-violet-300">
                {devCode}
              </p>
            </div>
          )}

          <form onSubmit={handleVerify} className="flex flex-col gap-6">
            <div className="flex justify-between gap-2">
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputsRef.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={(e) => handleChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-full aspect-square text-center bg-slate-950/40 border border-white/[0.08] rounded-xl text-[20px] font-mono text-white focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                />
              ))}
            </div>

            {error && (
              <p className="text-[13px] text-red-400 bg-red-500/10 rounded-xl px-3.5 py-2.5 border border-red-500/20 font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-[14.5px] rounded-xl py-3.5 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Verifying code…" : "Verify & continue"}
            </button>

            <button
              type="button"
              onClick={handleResend}
              className="text-slate-400 text-[13px] hover:text-white font-semibold transition-colors cursor-pointer"
            >
              Didn&apos;t get a code? Resend code
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

