"use client";

import React, { useEffect, useState } from "react";
import AppShell from "@/components/AppShell";
import { api } from "@/lib/apiClient";
import { User, Mail, Phone, Smile, Save, Loader2, Check } from "lucide-react";

export default function SettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [avatar, setAvatar] = useState("A");
  const [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    api.me().then((res) => {
      if (res.user) {
        setName(res.user.name || "");
        setEmail(res.user.email || "");
        setAvatar(res.user.avatar || "A");
        setPhoneNumber(res.user.phoneNumber || "");
      }
      setLoading(false);
    });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    
    try {
      await api.updateProfile({ name, email, avatar });
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (err) {
      console.error("Failed to update profile", err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <AppShell>
      <div className="px-4 md:px-6 py-8 max-w-3xl mx-auto w-full">
        <h1 className="text-2xl font-bold text-text-primary mb-2">Account Settings</h1>
        <p className="text-text-secondary text-sm mb-8">Manage your profile information and preferences.</p>

        {loading ? (
          <div className="flex items-center justify-center h-40">
            <Loader2 className="w-8 h-8 text-accent animate-spin" />
          </div>
        ) : (
          <div className="bg-surface border border-border rounded-3xl p-6 md:p-8 shadow-sm">
            <form onSubmit={handleSave} className="space-y-6">
              
              {/* Avatar Section */}
              <div className="flex items-center gap-6 pb-6 border-b border-border/50">
                <div className="w-20 h-20 rounded-full bg-surface-raised border border-border flex items-center justify-center text-3xl font-display font-bold relative overflow-hidden shrink-0 group">
                  <span className="relative z-10">{avatar || "A"}</span>
                  <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent"></div>
                  
                  {/* Hover overlay to hint at editing avatar */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-20 flex items-center justify-center cursor-pointer">
                    <Smile className="w-6 h-6 text-white" />
                  </div>
                </div>
                
                <div className="flex-1">
                  <label className="block text-[13px] font-bold text-text-secondary mb-1.5">Avatar Emoji</label>
                  <input 
                    type="text" 
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value.substring(0, 2))}
                    placeholder="e.g. 🦊 or A"
                    className="w-24 bg-surface-raised border border-border rounded-xl px-4 py-2.5 text-[14px] font-medium text-text-primary placeholder:text-text-tertiary focus:border-accent outline-none"
                    maxLength={2}
                  />
                  <p className="text-[11px] text-text-tertiary mt-2">Pick an emoji or 1-2 letters to represent you.</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <label className="block text-[13px] font-bold text-text-secondary mb-2 flex items-center gap-2">
                    <User className="w-4 h-4" /> Full Name
                  </label>
                  <input 
                    type="text" 
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name"
                    className="w-full bg-surface-raised border border-border rounded-xl px-4 py-3 text-[14px] font-medium text-text-primary placeholder:text-text-tertiary focus:border-accent outline-none transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[13px] font-bold text-text-secondary mb-2 flex items-center gap-2">
                    <Mail className="w-4 h-4" /> Email Address
                  </label>
                  <input 
                    type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-surface-raised border border-border rounded-xl px-4 py-3 text-[14px] font-medium text-text-primary placeholder:text-text-tertiary focus:border-accent outline-none transition-colors"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-[13px] font-bold text-text-secondary mb-2 flex items-center gap-2">
                    <Phone className="w-4 h-4" /> Phone Number (Read-only)
                  </label>
                  <input 
                    type="text" 
                    value={phoneNumber}
                    disabled
                    className="w-full bg-surface-raised/50 border border-border/50 rounded-xl px-4 py-3 text-[14px] font-medium text-text-tertiary cursor-not-allowed"
                  />
                  <p className="text-[11px] text-text-tertiary mt-2">Your phone number is used as your primary identifier and cannot be changed here.</p>
                </div>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex justify-end">
                <button 
                  type="submit" 
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-[14px] transition-all cursor-pointer bg-accent hover:brightness-110 active:scale-95 text-[#15110a] disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {saving ? (
                    <><Loader2 className="w-4.5 h-4.5 animate-spin" /> Saving...</>
                  ) : saved ? (
                    <><Check className="w-4.5 h-4.5" /> Saved!</>
                  ) : (
                    <><Save className="w-4.5 h-4.5" /> Save Changes</>
                  )}
                </button>
              </div>

            </form>
          </div>
        )}
      </div>
    </AppShell>
  );
}
