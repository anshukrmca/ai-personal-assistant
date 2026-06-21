"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/apiClient";
import { 
  User, 
  Mail, 
  Phone, 
  Smile, 
  Save, 
  Loader2, 
  Check, 
  HelpCircle, 
  Globe, 
  Clock, 
  Sparkles, 
  Pencil, 
  CheckCircle2,
  ChevronDown
} from "lucide-react";
import { useToast } from "@/components/ui/ToastProvider";

export default function SettingsPage() {
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  // State for changes tracking
  const [originalProfile, setOriginalProfile] = useState<any>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("A");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [username, setUsername] = useState("");
  const [country, setCountry] = useState("");
  const [timezone, setTimezone] = useState("");
  const [bio, setBio] = useState("");

  useEffect(() => {
    api.me().then((res) => {
      if (res.user) {
        setOriginalProfile(res.user);
        setName(res.user.name || "");
        setEmail(res.user.email || "");
        setAvatar(res.user.avatar || "A");
        setPhoneNumber(res.user.phoneNumber || "");
        setUsername(res.user.username || "");
        setCountry(res.user.country || "");
        setTimezone(res.user.timezone || "");
        setBio(res.user.bio || "");
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    
    try {
      const payload: any = { name, email, avatar, username, country, timezone, bio };
      if (!phoneNumber.startsWith("NONE_") && phoneNumber.trim() !== "") {
        payload.phoneNumber = phoneNumber;
      }
      
      await api.updateProfile(payload);
      setOriginalProfile(payload); // update reference point
      setSaved(true);
      addToast("Profile updated successfully!", "success");
      setTimeout(() => setSaved(false), 3000);
    } catch (err: any) {
      console.error("Failed to update profile", err);
      addToast(err.message || "Failed to update profile", "error");
    } finally {
      setSaving(false);
    }
  };

  const handleDiscard = () => {
    if (originalProfile) {
      setName(originalProfile.name || "");
      setEmail(originalProfile.email || "");
      setAvatar(originalProfile.avatar || "A");
      setUsername(originalProfile.username || "");
      setCountry(originalProfile.country || "");
      setTimezone(originalProfile.timezone || "");
      setBio(originalProfile.bio || "");
      setPhoneNumber(originalProfile.phoneNumber || "");
      addToast("Changes discarded", "info");
    }
  };

  const handleGenerateAvatar = () => {
    const emojis = [
      "🦊", "🦁", "🦉", "🦄", "🐧", "🦖", "🚀", "👽", "☠️", "🌈", 
      "🔥", "💻", "⚡️", "🌟", "🍔", "🍕", "🎨", "👾", "🤖", "🧙‍♂️",
      "🥑", "🌶️", "🎸", "🎯", "🎭", "🎪", "✈️", "🗺️", "🔑", "📦"
    ];
    const randomEmoji = emojis[Math.floor(Math.random() * emojis.length)];
    setAvatar(randomEmoji);
    addToast(`Generated: ${randomEmoji}`, "success");
  };

  return (
    <AppShell>
      <div className="px-4 md:px-8 py-8 w-full max-w-6xl mx-auto space-y-6">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-text-primary mb-1">Account Settings</h1>
            <p className="text-text-secondary text-sm">Manage your profile information and preferences.</p>
          </div>
          <button 
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 border border-[#7e3af2]/35 bg-[#0c0827]/30 text-violet-400 font-semibold text-[13px] rounded-xl hover:bg-[#7e3af2]/10 transition-colors w-fit shrink-0 cursor-pointer"
          >
            <HelpCircle className="w-4 h-4" /> Need Help?
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-48">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : (
          <div className="space-y-6">
            
            {/* Profile Avatar Glassmorphic Banner */}
            <div className="bg-gradient-to-r from-[#140b2e]/60 via-[#0c0827]/60 to-slate-950/80 border border-white/[0.06] rounded-3xl p-6 md:p-8 flex flex-col md:flex-row justify-between items-center gap-8 relative overflow-hidden shadow-xl">
              
              {/* Star/circle decorations */}
              <div className="absolute top-[-10%] right-[-10%] w-[200px] h-[200px] bg-violet-600/10 rounded-full blur-[80px] pointer-events-none"></div>
              <div className="absolute bottom-[-10%] left-[20%] w-[150px] h-[150px] bg-fuchsia-600/5 rounded-full blur-[60px] pointer-events-none"></div>

              {/* Left Side: Avatar with pencil overlay */}
              <div className="flex flex-col sm:flex-row items-center gap-6 z-10 w-full md:w-auto">
                <div className="w-24 h-24 rounded-full bg-slate-900 border border-violet-500/20 flex items-center justify-center text-4xl font-display font-bold relative overflow-hidden shrink-0 group shadow-lg">
                  {avatar && (avatar.startsWith("http://") || avatar.startsWith("https://")) ? (
                    <img src={avatar} alt="Avatar" className="w-full h-full object-cover relative z-10" />
                  ) : (
                    <span className="relative z-10">{avatar || "A"}</span>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-tr from-violet-600/20 to-transparent"></div>
                  
                  {/* Edit Pencil Badge Overlay */}
                  <div className="absolute bottom-1.5 right-1.5 w-6 h-6 rounded-full bg-violet-600 border border-slate-950 flex items-center justify-center text-white cursor-pointer shadow-md">
                    <Pencil className="w-3.2 h-3.2" />
                  </div>
                </div>

                {/* Edit Controls */}
                <div className="flex-1 text-center sm:text-left">
                  <h3 className="font-bold text-[16px] text-white leading-none mb-1">Profile Avatar</h3>
                  <p className="text-slate-400 text-[12.5px] mb-3">Add an emoji or initials to personalize your profile.</p>
                  
                  <div className="flex items-center justify-center sm:justify-start gap-2.5">
                    <input 
                      type="text" 
                      value={avatar}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (val.startsWith("http")) {
                          setAvatar(val);
                        } else {
                          setAvatar(val.substring(0, 8));
                        }
                      }}
                      placeholder="e.g. 🦊 or URL"
                      className="bg-slate-950/70 border border-white/[0.08] rounded-xl px-4 py-2.5 text-[13.5px] font-medium text-text-primary placeholder:text-text-tertiary focus:border-violet-500/60 outline-none w-full max-w-[180px] transition-colors"
                      maxLength={avatar.startsWith("http") ? undefined : 8}
                    />
                    <button 
                      type="button"
                      onClick={handleGenerateAvatar}
                      className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-violet-500/30 bg-violet-600/10 hover:bg-violet-600/20 text-violet-400 font-bold text-[12.5px] cursor-pointer transition-all"
                    >
                      <Sparkles className="w-4 h-4" /> Generate
                    </button>
                  </div>
                  <p className="text-[11px] text-text-tertiary mt-2">You can use an emoji or 1-2 letters.</p>
                </div>
              </div>

              {/* Right Side: Floating Badge vector card graphics */}
              <div className="hidden lg:flex items-center justify-center shrink-0 z-10 mr-4">
                <div className="w-48 h-28 bg-[#0c0827]/40 border border-white/[0.05] rounded-2xl p-4 shadow-[0_8px_30px_rgb(0,0,0,0.5)] relative overflow-hidden backdrop-blur-xl flex flex-col justify-between scale-105">
                  <div className="absolute -bottom-8 -right-8 w-24 h-24 bg-violet-600/25 rounded-full blur-xl"></div>
                  
                  {/* Top line of card */}
                  <div className="flex justify-between items-center">
                    <div className="w-4 h-4 rounded-full bg-violet-500/30 flex items-center justify-center">
                      <Sparkles className="w-2 h-2 text-violet-400" />
                    </div>
                    <span className="w-2.5 h-1 bg-violet-500/30 rounded-full"></span>
                  </div>

                  {/* Center mock layout */}
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-violet-500/10 flex items-center justify-center text-text-primary text-[14px]">
                      {avatar && (avatar.startsWith("http") ? "AK" : avatar)}
                    </div>
                    <div className="space-y-1.5 flex-1">
                      <div className="w-20 h-1.5 bg-violet-500/25 rounded-full"></div>
                      <div className="w-12 h-1 bg-violet-500/15 rounded-full"></div>
                    </div>
                  </div>

                  {/* Bottom bar of card */}
                  <div className="w-full h-1 bg-violet-500/10 rounded-full"></div>
                </div>
              </div>

            </div>

            {/* Inputs Form Container */}
            <div className="bg-[#0b081e]/60 border border-white/[0.06] rounded-[2rem] p-6 md:p-8 shadow-xl">
              <form onSubmit={handleSave} className="space-y-6">
                
                {/* Two-Column Form Layout */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Full Name */}
                  <div>
                    <label className="block text-[13px] font-bold text-text-secondary mb-2.5 flex items-center gap-2">
                      <User className="w-4 h-4 text-violet-400" /> Full Name
                    </label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your name"
                      className="w-full bg-slate-950/60 border border-white/[0.08] rounded-xl px-4 py-3 text-[14px] font-medium text-text-primary placeholder:text-text-tertiary focus:border-violet-500/60 outline-none transition-all"
                    />
                  </div>

                  {/* Username */}
                  <div>
                    <label className="block text-[13px] font-bold text-text-secondary mb-2.5 flex items-center gap-2">
                      <User className="w-4 h-4 text-violet-400" /> Username
                    </label>
                    <div className="relative flex items-center">
                      <input 
                        type="text" 
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                        className="w-full bg-slate-950/60 border border-white/[0.08] rounded-xl pl-4 pr-11 py-3 text-[14px] font-medium text-text-primary placeholder:text-text-tertiary focus:border-violet-500/60 outline-none transition-all"
                      />
                      {username.trim() !== "" && (
                        <CheckCircle2 className="absolute right-3.5 w-4.5 h-4.5 text-emerald-400" />
                      )}
                    </div>
                  </div>

                  {/* Email Address */}
                  <div>
                    <label className="block text-[13px] font-bold text-text-secondary mb-2.5 flex items-center gap-2">
                      <Mail className="w-4 h-4 text-violet-400" /> Email Address
                    </label>
                    <div className="relative flex items-center">
                      <input 
                        type="email" 
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Enter your email"
                        className="w-full bg-slate-950/60 border border-white/[0.08] rounded-xl pl-4 pr-11 py-3 text-[14px] font-medium text-text-primary placeholder:text-text-tertiary focus:border-violet-500/60 outline-none transition-all"
                      />
                      {email.trim() !== "" && email.includes("@") && (
                        <CheckCircle2 className="absolute right-3.5 w-4.5 h-4.5 text-emerald-400" />
                      )}
                    </div>
                  </div>

                  {/* Phone Number */}
                  <div>
                    <label className="block text-[13px] font-bold text-text-secondary mb-2.5 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-violet-400" /> Phone Number {!phoneNumber.startsWith("NONE_") && phoneNumber !== "" ? "(Read-only)" : ""}
                    </label>
                    <input 
                      type="text" 
                      value={phoneNumber.startsWith("NONE_") ? "" : phoneNumber}
                      onChange={(e) => setPhoneNumber(e.target.value)}
                      disabled={!phoneNumber.startsWith("NONE_") && phoneNumber !== ""}
                      placeholder="e.g. +1 650-555-1234"
                      className={`w-full bg-slate-950/60 border rounded-xl px-4 py-3 text-[14px] font-medium transition-all ${
                        !phoneNumber.startsWith("NONE_") && phoneNumber !== "" 
                          ? "border-white/[0.04] text-text-tertiary cursor-not-allowed bg-slate-950/20" 
                          : "border-white/[0.08] text-text-primary placeholder:text-text-tertiary focus:border-violet-500/60 outline-none"
                      }`}
                    />
                    {!phoneNumber.startsWith("NONE_") && phoneNumber !== "" && (
                      <p className="text-[10.5px] text-text-tertiary mt-2">Your phone number is verified as your primary credential.</p>
                    )}
                  </div>

                  {/* Country Selection */}
                  <div>
                    <label className="block text-[13px] font-bold text-text-secondary mb-2.5 flex items-center gap-2">
                      <Globe className="w-4 h-4 text-violet-400" /> Country
                    </label>
                    <div className="relative flex items-center">
                      <input 
                        type="text" 
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        placeholder="e.g. United States"
                        className="w-full bg-slate-950/60 border border-white/[0.08] rounded-xl pl-4 pr-11 py-3 text-[14px] font-medium text-text-primary placeholder:text-text-tertiary focus:border-violet-500/60 outline-none transition-all"
                      />
                      <ChevronDown className="absolute right-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Timezone Selection */}
                  <div>
                    <label className="block text-[13px] font-bold text-text-secondary mb-2.5 flex items-center gap-2">
                      <Clock className="w-4 h-4 text-violet-400" /> Timezone
                    </label>
                    <div className="relative flex items-center">
                      <input 
                        type="text" 
                        value={timezone}
                        onChange={(e) => setTimezone(e.target.value)}
                        placeholder="e.g. America/Los_Angeles"
                        className="w-full bg-slate-950/60 border border-white/[0.08] rounded-xl pl-4 pr-11 py-3 text-[14px] font-medium text-text-primary placeholder:text-text-tertiary focus:border-violet-500/60 outline-none transition-all"
                      />
                      <ChevronDown className="absolute right-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Bio Description (Double Col) */}
                  <div className="md:col-span-2">
                    <label className="block text-[13px] font-bold text-text-secondary mb-2.5 flex items-center gap-2">
                      <Pencil className="w-4 h-4 text-violet-400" /> Bio
                    </label>
                    <div className="relative">
                      <textarea 
                        value={bio}
                        onChange={(e) => setBio(e.target.value.substring(0, 200))}
                        placeholder="Tell us a little bit about yourself..."
                        rows={4}
                        className="w-full bg-slate-950/60 border border-white/[0.08] rounded-2xl px-4 py-3 pb-8 text-[14px] font-medium text-text-primary placeholder:text-text-tertiary focus:border-violet-500/60 outline-none transition-colors custom-scrollbar resize-none"
                      />
                      <span className="absolute bottom-2.5 right-3 text-[10.5px] text-text-tertiary font-medium">
                        {bio.length} / 200
                      </span>
                    </div>
                  </div>

                </div>

                {/* Submit & Discard Footers */}
                <div className="pt-6 border-t border-white/[0.05] flex items-center justify-between">
                  <button 
                    type="button"
                    onClick={handleDiscard}
                    className="text-slate-400 hover:text-white font-bold text-[13.5px] transition-colors cursor-pointer"
                  >
                    Discard Changes
                  </button>

                  <button 
                    type="submit" 
                    disabled={saving}
                    className="flex items-center gap-2 px-6 py-3 rounded-xl font-extrabold text-[14px] transition-all cursor-pointer bg-gradient-to-r from-violet-600 to-[#7e3af2] hover:brightness-110 text-white disabled:opacity-70 disabled:cursor-not-allowed shadow-lg shadow-violet-600/25 hover:scale-[1.01]"
                  >
                    {saving ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</>
                    ) : saved ? (
                      <><Check className="w-4 h-4" /> Saved!</>
                    ) : (
                      <><Save className="w-4 h-4" /> Save Changes</>
                    )}
                  </button>
                </div>

              </form>
            </div>

          </div>
        )}

      </div>
    </AppShell>
  );
}
