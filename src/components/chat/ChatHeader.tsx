import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Plus, ChevronDown } from "lucide-react";

import { Integration } from "@/lib/types";

interface ChatHeaderProps {
  integrations: Integration[];
  activePlatform: string;
  onPlatformChange: (platform: string) => void;
  onNewChat: () => void;
}

export function ChatHeader({ integrations, activePlatform, onPlatformChange, onNewChat }: ChatHeaderProps) {
  const connectedPlatforms = integrations.filter((i) => i.status === "connected");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getPlatformName = (platform: string) => {
    if (platform === "all") return "All Sources";
    if (platform === "google_calendar") return "Google Calendar";
    return platform.charAt(0).toUpperCase() + platform.slice(1);
  };

  return (
    <div className="flex items-center justify-between flex-wrap gap-4 mb-6 shrink-0">
      <div>
        <h1 className="font-display font-bold text-2xl md:text-3xl tracking-tight text-text-primary">
          AI Agent
        </h1>
        <div className="flex items-center gap-2 mt-1 flex-wrap">
          <span className="text-[13px] font-bold text-text-secondary">
            Anshu Intelligent Agent
          </span>
          <span className="w-1 h-1 rounded-full bg-success" />
          <span className="text-[12px] font-semibold text-success flex items-center gap-1.5">
            Connected to 
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-1 bg-transparent border-b border-success/30 font-bold outline-none cursor-pointer text-success hover:border-success/60 transition-all pb-0.5"
              >
                {getPlatformName(activePlatform)}
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} />
              </button>
              
              {dropdownOpen && (
                <div className="absolute top-full left-0 mt-1.5 w-48 bg-surface border border-border shadow-lg rounded-xl overflow-hidden z-50 rise-in">
                  <div className="py-1 flex flex-col">
                    <button 
                      onClick={() => { onPlatformChange("all"); setDropdownOpen(false); }}
                      className={`cursor-pointer text-left px-4 py-2 text-[13px] font-semibold hover:bg-surface-raised transition-colors ${activePlatform === 'all' ? 'text-accent bg-accent/5' : 'text-text-primary'}`}
                    >
                      All Sources
                    </button>
                    {connectedPlatforms.map((i) => (
                      <button 
                        key={i.platform}
                        onClick={() => { onPlatformChange(i.platform); setDropdownOpen(false); }}
                        className={`cursor-pointer text-left px-4 py-2 text-[13px] font-semibold hover:bg-surface-raised transition-colors ${activePlatform === i.platform ? 'text-accent bg-accent/5' : 'text-text-primary'}`}
                      >
                        {getPlatformName(i.platform)}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2">
          <span className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-success/10 text-success text-[13px] font-bold">
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            Sync Live
          </span>
        </div>

        {/* Landing Page link */}
        <Link
          href="/dashboard"
          className="flex items-center gap-1 bg-surface border border-border text-text-secondary hover:text-text-primary px-3.5 py-1.5 rounded-xl text-[12px] font-bold transition-all shadow-sm active:scale-98"
        >
          Landing Page
          <ArrowRight className="w-3.5 h-3.5 text-text-tertiary" />
        </Link>

        {/* New Chat Button */}
        <button
          onClick={onNewChat}
          className="flex items-center gap-2 rounded-xl border border-danger/30 hover:border-danger/55 bg-surface px-4 py-1.5 text-[12px] font-bold text-danger hover:bg-danger/5 cursor-pointer active:scale-98 transition-all shadow-sm"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>
    </div>
  );
}
