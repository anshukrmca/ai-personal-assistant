"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Sparkles, MessageSquareText, Smartphone, ArrowRight, ArrowLeft } from "lucide-react";
import { api } from "@/lib/apiClient";

export default function LoginPage() {
  const router = useRouter();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [channel, setChannel] = useState<"sms" | "whatsapp">("whatsapp");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (phoneNumber.trim().length < 7) {
      setError("Enter a valid phone number, e.g. +91 98765 43210");
      return;
    }

    setLoading(true);
    try {
      const res = await api.requestOtp(phoneNumber.trim(), channel);
      sessionStorage.setItem("pendingPhone", phoneNumber.trim());
      sessionStorage.setItem("pendingChannel", channel);
      if (res.devCode) {
        sessionStorage.setItem("devCode", res.devCode);
      }
      router.push("/verify");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center px-4 bg-[#030014] text-slate-100 relative overflow-hidden">
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
        
        {/* Back Link to Landing */}
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-slate-400 hover:text-white text-[13px] mb-6 transition-colors font-medium group"
        >
          <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-0.5" /> Back to Home
        </Link>

        {/* Brand Header */}
        <div className="flex items-center gap-3 mb-8 justify-center">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-[#9061f9] flex items-center justify-center shadow-lg shadow-violet-600/30">
            <Sparkles className="w-4.5 h-4.5 text-white" />
          </div>
          <span className="font-display font-extrabold text-[20px] tracking-tight text-white">
            Anshu<span className="text-violet-400">.ai</span>
          </span>
        </div>

        {/* Glassmorphism Card */}
        <div className="bg-white/[0.02] border border-white/[0.06] rounded-3xl p-8 shadow-2xl backdrop-blur-2xl">
          <h1 className="font-display font-bold text-[22px] tracking-tight text-white mb-1.5">
            Sign in to your assistant
          </h1>
          <p className="text-slate-400 text-[14px] mb-7 leading-relaxed font-medium">
            We&apos;ll send a one-time code to verify it&apos;s you. No password to remember.
          </p>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label
                htmlFor="phone"
                className="block text-[13px] font-semibold text-slate-300 mb-2"
              >
                Phone number
              </label>
              <div className="relative">
                <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-slate-500" />
                <input
                  id="phone"
                  type="tel"
                  inputMode="tel"
                  placeholder="+91 98765 43210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full bg-slate-950/40 border border-white/[0.08] rounded-xl pl-10 pr-4 py-3 text-[14px] font-mono text-white placeholder:text-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <span className="block text-[13px] font-semibold text-slate-300 mb-2">
                Verify via
              </span>
              <div className="grid grid-cols-2 gap-2.5">
                <button
                  type="button"
                  onClick={() => setChannel("whatsapp")}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-[13.5px] font-semibold transition-all cursor-pointer ${
                    channel === "whatsapp"
                      ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-400 shadow-md shadow-emerald-500/5"
                      : "border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <MessageSquareText className="w-[15px] h-[15px]" />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={() => setChannel("sms")}
                  className={`flex items-center justify-center gap-2 rounded-xl border py-2.5 text-[13.5px] font-semibold transition-all cursor-pointer ${
                    channel === "sms"
                      ? "border-violet-500/30 bg-violet-500/10 text-violet-400 shadow-md shadow-violet-500/5"
                      : "border-white/5 bg-white/[0.02] text-slate-400 hover:bg-white/[0.05] hover:text-white"
                  }`}
                >
                  <Smartphone className="w-[15px] h-[15px]" />
                  SMS
                </button>
              </div>
            </div>

            {error && (
              <p className="text-[13px] text-red-400 bg-red-500/10 rounded-xl px-3.5 py-2.5 border border-red-500/20 font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-[14.5px] rounded-xl py-3.5 mt-1 hover:scale-[1.01] hover:shadow-[0_0_20px_rgba(124,58,237,0.3)] active:scale-[0.99] transition-all disabled:opacity-60 cursor-pointer"
            >
              {loading ? "Sending code…" : "Send verification code"}
              {!loading && <ArrowRight className="w-[15px] h-[15px]" />}
            </button>
          </form>
        </div>

        <p className="text-center text-slate-500 text-[12.5px] mt-6 font-medium">
          Mock mode — no real SMS/WhatsApp is sent. The dev code is displayed on the next screen.
        </p>
      </div>
    </div>
  );
}


