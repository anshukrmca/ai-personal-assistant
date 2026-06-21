import { Settings, Menu, ChevronDown, Layers, Sparkles } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Integration, IntegrationPlatform } from "@/lib/types";
import { PLATFORM_META } from "@/lib/platformMeta";
import Link from "next/link";

interface ChatHeaderProps {
  integrations: Integration[];
  activePlatform: string;
  onPlatformChange: (platform: string) => void;
  onToggleSidebar?: () => void;
  user: { name: string; avatar: string } | null;
}

export function ChatHeader({ integrations, activePlatform, onPlatformChange, onToggleSidebar, user }: ChatHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const platforms = [
    { id: "all", label: "All Apps", icon: Layers },
    ...integrations.filter(i => i.status === "connected").map(i => {
      const meta = PLATFORM_META[i.platform as IntegrationPlatform];
      return {
        id: i.platform,
        label: meta?.label || i.platform,
        icon: meta?.icon || Layers
      };
    })
  ];

  // Find the active platform object
  const active = platforms.find(p => p.id === activePlatform) || platforms[0];
  const activeMeta = activePlatform !== "all" ? PLATFORM_META[activePlatform as IntegrationPlatform] : null;
  const activeBrandColor = activeMeta?.color || "var(--accent)";

  return (
    <header className="w-full bg-white dark:bg-[#0b081e]/60 backdrop-blur-md border border-slate-200 dark:border-white/[0.06] rounded-2xl p-2.5 sm:p-3 md:px-5 md:py-3.5 flex items-center justify-between gap-2 sm:gap-4 mb-6 shadow-xl relative z-40 transition-all duration-300">
      {/* Left side: Navigation / Title & Context Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onToggleSidebar && (
          <button 
            onClick={onToggleSidebar} 
            className="p-1.5 sm:p-2 cursor-pointer rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all shrink-0"
            title="Toggle Sidebar"
          >
            <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        )}

        {/* AI Brand Mark */}
        <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-gradient-to-tr from-[#7e3af2] to-fuchsia-500 border border-white/[0.08] shadow-md shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>

        {/* Title */}
        <h1 className="text-[14px] sm:text-[15px] md:text-[16px] font-display font-black text-slate-950 dark:text-white leading-none shrink-0">
          AI Assistant
        </h1>
        
        <div className="h-4 w-px bg-slate-200 dark:bg-white/[0.08] hidden sm:block" />

        {/* Context Dropdown Button */}
        <div className="relative inline-block text-left">
          <button 
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center gap-1 sm:gap-1.5 bg-slate-550/10 dark:bg-slate-950/40 hover:bg-slate-100 dark:hover:bg-slate-950/60 border border-slate-200 dark:border-white/[0.08] rounded-xl text-[11px] sm:text-[12px] font-bold px-2.5 py-1.5 cursor-pointer hover:border-violet-500/30 outline-none text-slate-700 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white transition-all"
            style={{
              borderColor: isDropdownOpen ? `${activeBrandColor}80` : undefined,
            }}
          >
            <span 
              className="flex items-center justify-center w-3.5 h-3.5 rounded-md transition-colors"
              style={{ 
                color: activeBrandColor,
                backgroundColor: activePlatform !== "all" ? `${activeBrandColor}15` : "transparent"
              }}
            >
              {(() => {
                const Icon = active.icon;
                return <Icon className="w-3 h-3 sm:w-3.5 sm:h-3.5" />;
              })()}
            </span>
            <span className="truncate max-w-[80px] sm:max-w-[160px]">{active.label}</span>
            <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-slate-500 transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
          </button>
          
          <AnimatePresence>
            {isDropdownOpen && (
              <>
                <div 
                  className="fixed inset-0 z-45 cursor-default" 
                  onClick={() => setIsDropdownOpen(false)} 
                />
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.96 }}
                  transition={{ duration: 0.12, ease: "easeOut" }}
                  className="absolute top-full left-0 mt-2 w-48 bg-white dark:bg-[#0b081e] border border-slate-200 dark:border-white/[0.08] rounded-xl shadow-xl z-50 overflow-hidden py-1.5"
                >
                  <div className="px-3 py-1.5 text-[10px] font-bold text-slate-500 dark:text-slate-500 uppercase tracking-wider">
                    Select Context
                  </div>
                  
                  <div className="max-h-60 overflow-y-auto scrollbar-hide">
                    {platforms.map(p => {
                      const Icon = p.icon;
                      const isSelected = activePlatform === p.id;
                      const pMeta = p.id !== "all" ? PLATFORM_META[p.id as IntegrationPlatform] : null;
                      const brandColor = pMeta?.color || "var(--accent)";
                      
                      return (
                        <button
                          key={p.id}
                          onClick={() => {
                            onPlatformChange(p.id);
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full cursor-pointer text-left px-3 py-2 text-[13px] font-medium transition-all flex items-center justify-between group ${
                            isSelected 
                              ? 'bg-slate-100 dark:bg-white/[0.04] text-violet-650 dark:text-violet-400 font-bold' 
                              : 'text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-white/[0.02] hover:text-slate-950 dark:hover:text-white'
                          }`}
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <span 
                              className={`flex items-center justify-center w-5 h-5 rounded-lg transition-all ${
                                isSelected ? 'scale-105' : 'opacity-70 group-hover:opacity-100'
                              }`}
                              style={{ 
                                color: brandColor, 
                                backgroundColor: isSelected ? `${brandColor}15` : 'transparent' 
                              }}
                            >
                              <Icon className="w-3.5 h-3.5" />
                            </span>
                            <span className="truncate">{p.label}</span>
                          </div>
                          {isSelected && (
                            <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right side: Sync Status & User Info */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        
        {/* Sync Live Badge */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-[11px] font-extrabold tracking-wider uppercase">
          <span className="relative flex h-1.5 w-1.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
          </span>
          <span className="hidden sm:inline">Sync Live</span>
        </div>

        <div className="h-5 w-px bg-slate-200 dark:bg-white/[0.08]" />

        {/* Settings button */}
        <Link 
          href="/integrations"
          className="p-1.5 cursor-pointer rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-white/[0.05] hover:text-slate-900 dark:hover:text-white active:scale-95 transition-all"
          title="Manage Integrations"
        >
          <Settings className="w-4.5 h-4.5 sm:w-5 sm:h-5" />
        </Link>

        {/* User profile avatar with green online badge */}
        <div className="relative w-8.5 h-8.5 rounded-full border border-slate-200 dark:border-white/[0.08] bg-slate-100 dark:bg-[#0c0827] flex items-center justify-center shrink-0 overflow-visible select-none">
          {user?.avatar && (user.avatar.startsWith("http://") || user.avatar.startsWith("https://")) ? (
            <img src={user.avatar} alt="User Avatar" className="w-full h-full object-cover rounded-full" />
          ) : (
            <span className="text-[12.5px] font-black text-violet-650 dark:text-violet-300 uppercase">{user?.avatar?.substring(0, 2) || "A"}</span>
          )}
          <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white dark:border-[#090616] shadow-[0_0_8px_rgba(16,185,129,0.7)]" />
        </div>
      </div>

    </header>
  );
}