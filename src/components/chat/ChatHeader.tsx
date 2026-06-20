import { Settings, LogOut, Menu, ChevronDown, Layers, Sparkles } from "lucide-react";
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
}

export function ChatHeader({ integrations, activePlatform, onPlatformChange, onToggleSidebar }: ChatHeaderProps) {
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
    <header className="w-full bg-surface/40 backdrop-blur-lg border border-border/50 rounded-2xl p-2.5 sm:p-3 md:px-5 md:py-3.5 flex items-center justify-between gap-2 sm:gap-4 mb-6 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] dark:shadow-[0_4px_30px_rgba(0,0,0,0.2)] relative z-40 transition-all duration-300">
      {/* Left side: Navigation / Title & Context Dropdown */}
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        {onToggleSidebar && (
          <>
            <button 
              onClick={onToggleSidebar} 
              className="p-1.5 sm:p-2 cursor-pointer rounded-xl text-text-tertiary hover:bg-surface-raised/80 hover:text-text-primary active:scale-95 transition-all duration-200 shrink-0"
              title="Toggle Sidebar"
            >
              <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
            </button>
            <div className="h-5 w-px bg-border/50 hidden sm:block" />
          </>
        )}

        {/* AI Brand Mark - hidden on mobile to save space */}
        <div className="relative hidden sm:flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-accent/20 to-accent-soft border border-accent/30 overflow-hidden shadow-[0_0_12px_rgba(124,58,237,0.12)] shrink-0">
          <div className="absolute inset-0 bg-gradient-to-tr from-accent to-info opacity-10 animate-pulse" />
          <Sparkles className="w-4 h-4 text-accent animate-pulse" />
        </div>

        {/* Title & Selector Wrapper */}
        <div className="flex items-center gap-2 sm:gap-3 min-w-0">
          <h1 className="hidden sm:block text-[15px] md:text-[17px] font-display font-bold tracking-tight text-text-primary leading-none shrink-0">
            AI Assistant
          </h1>
          
          <div className="hidden sm:block h-4 w-px bg-border/40" />

          {/* Context Dropdown Button */}
          <div className="relative inline-block text-left">
            <button 
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 sm:gap-1.5 bg-surface/80 hover:bg-surface border border-border/80 rounded-xl text-[11px] sm:text-[12px] font-semibold px-2 py-1.5 sm:px-2.5 sm:py-1.5 cursor-pointer hover:border-accent/40 hover:shadow-sm outline-none text-text-secondary hover:text-text-primary transition-all duration-200"
              style={{
                borderColor: isDropdownOpen ? `${activeBrandColor}60` : undefined,
                boxShadow: isDropdownOpen ? `0 0 10px ${activeBrandColor}15` : undefined
              }}
            >
              <span 
                className="flex items-center justify-center w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md transition-colors"
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
              <ChevronDown className={`w-3 h-3 sm:w-3.5 sm:h-3.5 text-text-tertiary transition-transform duration-200 shrink-0 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            <AnimatePresence>
              {isDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40 cursor-default" 
                    onClick={() => setIsDropdownOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.96 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute top-full left-0 mt-2 w-48 bg-surface border border-border rounded-xl shadow-xl z-50 overflow-hidden py-1.5"
                  >
                    <div className="px-3 py-1.5 text-[10px] font-bold text-text-tertiary uppercase tracking-wider">
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
                            className={`w-full cursor-pointer text-left px-3 py-2 text-[13px] font-medium transition-all duration-200 flex items-center justify-between group ${
                              isSelected 
                                ? 'bg-accent/5 text-accent font-bold' 
                                : 'text-text-secondary hover:bg-surface-raised hover:text-text-primary'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span 
                                className={`flex items-center justify-center w-5 h-5 rounded-lg transition-all duration-200 ${
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
                              <div className="w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
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
      </div>

      {/* Right side: Sync Status & Quick Actions */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        
        {/* Sync Status Badge - compact on mobile */}
        <div className="flex items-center gap-1.5 sm:px-3 sm:py-1.5 sm:rounded-xl sm:bg-success/5 sm:dark:bg-success/10 sm:border sm:border-success/15 text-success text-[12px] font-bold tracking-wide sm:shadow-[0_2px_10px_rgba(16,185,129,0.02)]">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-success"></span>
          </span>
          <span className="hidden sm:inline">Sync Live</span>
        </div>

        <div className="h-5 w-px bg-border/50 hidden sm:block" />

        {/* Settings button */}
        <Link 
          href="/integrations"
          className="p-1.5 sm:p-2 cursor-pointer rounded-xl text-text-tertiary hover:bg-surface-raised hover:text-text-primary active:scale-95 transition-all duration-200"
          title="Manage Integrations"
        >
          <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
        </Link>
      </div>

    </header>
  );
}