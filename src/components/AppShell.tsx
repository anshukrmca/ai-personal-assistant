"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import {
  LayoutGrid,
  Plug,
  MessageSquare,
  LogOut,
  Sparkles,
  Bell,
  Briefcase,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Sun,
  Moon,
  Settings,
} from "lucide-react";
import { api } from "@/lib/apiClient";

const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutGrid },
  { href: "/chat", label: "AI Agent", icon: MessageSquare },
  { href: "/briefing", label: "Briefing", icon: Briefcase },
  { href: "/integrations", label: "Integrations", icon: Plug },
  { href: "/alerts", label: "Alerts", icon: Bell },
];

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  function toggleTheme() {
    const nextTheme = theme === "light" ? "dark" : "light";
    setTheme(nextTheme);
    localStorage.setItem("theme", nextTheme);
    if (nextTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }

  async function handleLogout() {
    await api.logout();
    router.push("/login");
  }

  return (
    <div className="flex h-[100dvh] w-full bg-bg text-text-primary overflow-hidden">
      <aside className={`hidden md:flex flex-col border-r border-border/60 bg-surface py-6 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] transition-all duration-300 relative z-50 h-full ${isCollapsed ? 'w-[88px] px-3' : 'w-64 px-5'}`}>
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-9 w-7 h-7 bg-surface border border-border rounded-full flex items-center justify-center text-text-tertiary hover:text-text-primary shadow-sm z-50 transition-transform hover:scale-110 cursor-pointer"
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>

        {/* App Logo */}
        <div className={`flex items-center mb-10 transition-all ${isCollapsed ? 'justify-center px-0' : 'gap-3 px-2'}`}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent to-[#9061f9] flex items-center justify-center shadow-sm shrink-0 text-white">
            <Sparkles className="w-4.5 h-4.5" />
          </div>
          {!isCollapsed && (
            <span className="font-display font-extrabold text-[20px] tracking-tight text-text-primary truncate">
              Anshu<span className="text-accent">.ai</span>
            </span>
          )}
        </div>

        {/* Navigation items */}
        <nav className="flex flex-col gap-1.5 flex-1 relative">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`group relative flex items-center rounded-xl transition-all duration-200 ${
                  isCollapsed ? 'justify-center p-3' : 'gap-3 px-3.5 py-3'
                } ${
                  active
                    ? "bg-accent/10 text-accent font-bold"
                    : "text-text-secondary hover:bg-surface-raised hover:text-text-primary font-semibold"
                }`}
              >
                <Icon className={`shrink-0 transition-transform ${active && !isCollapsed ? 'scale-110' : ''} ${isCollapsed ? 'w-[22px] h-[22px] group-hover:scale-110' : 'w-[18px] h-[18px]'}`} strokeWidth={active ? 2.5 : 2} />
                {!isCollapsed && <span className="text-[14px] truncate">{item.label}</span>}
                
                {/* Custom Animated Tooltip */}
                {isCollapsed && (
                  <div className="absolute left-full ml-4 px-3 py-2 bg-slate-800 text-white text-[12px] font-bold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl z-50 flex items-center pointer-events-none translate-x-1 group-hover:translate-x-0">
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-slate-800 rotate-45 rounded-[2px]"></div>
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Panel */}
        <div className="mt-auto pt-5 border-t border-border/50 flex flex-col gap-3 relative shrink-0">
          
          {/* Profile Menu Dropdown */}
          {isProfileMenuOpen && (
            <div className={`absolute bottom-full mb-3 bg-surface border border-border-soft rounded-[1.5rem] shadow-[0_8px_30px_rgb(0,0,0,0.12)] flex flex-col p-2 z-50 transition-all origin-bottom-left animate-in fade-in slide-in-from-bottom-2 ${isCollapsed ? 'left-2 w-48' : 'left-0 right-0'}`}>
              <div className="px-3 py-2 mb-1 border-b border-border/50">
                <p className="text-[11px] font-bold text-text-tertiary uppercase tracking-wider">Preferences</p>
              </div>
              
              <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-raised text-text-secondary hover:text-text-primary transition-colors text-[13.5px] font-bold cursor-pointer">
                <Settings className="w-4 h-4" />
                Account Settings
              </button>
              
              <button 
                onClick={toggleTheme}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-raised text-text-secondary hover:text-text-primary transition-colors text-[13.5px] font-bold cursor-pointer"
              >
                {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
              </button>
              
              <div className="h-px bg-border/50 my-1 mx-2"></div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-danger/10 text-text-secondary hover:text-danger transition-colors text-[13.5px] font-bold cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Sign out
              </button>
            </div>
          )}

          {/* User profile toggle */}
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`flex items-center transition-all hover:bg-surface-raised rounded-xl cursor-pointer group ${isCollapsed ? 'justify-center p-2' : 'gap-3 px-2 py-2'} ${isProfileMenuOpen ? 'bg-surface-raised' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-surface-raised flex items-center justify-center font-display font-bold text-text-primary shrink-0 border border-border/60 shadow-sm relative overflow-hidden">
              <span className="relative z-10">A</span>
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent"></div>
              
              {/* User Profile Tooltip for Collapsed State */}
              {isCollapsed && !isProfileMenuOpen && (
                <div className="absolute left-full ml-5 px-3 py-2 bg-slate-800 text-white text-[12px] font-bold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl z-50 flex items-center pointer-events-none translate-x-1 group-hover:translate-x-0">
                  <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-slate-800 rotate-45 rounded-[2px]"></div>
                  Profile Menu
                </div>
              )}
            </div>
            
            {!isCollapsed && (
              <>
                <div className="min-w-0 flex-1 text-left">
                  <p className="text-[13px] font-bold text-text-primary truncate">Anshu</p>
                  <p className="text-[11.5px] text-text-tertiary truncate font-medium">anshu@intelligent.agent</p>
                </div>
                <ChevronUp className={`w-4 h-4 text-text-tertiary transition-transform duration-200 ${isProfileMenuOpen ? '' : 'rotate-180'}`} />
              </>
            )}
          </button>
        </div>
      </aside>

      {/* Mobile top nav -> Bottom Nav */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface/90 backdrop-blur-xl border-t border-border pb-safe shadow-[0_-8px_30px_rgba(0,0,0,0.06)]">
        <div className="flex items-center justify-around px-2 py-2">
          {NAV_ITEMS.map((item) => {
            const active = pathname?.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex flex-col items-center gap-1.5 px-3 py-2 rounded-2xl transition-all ${
                  active ? "text-accent" : "text-text-tertiary hover:text-text-primary"
                }`}
              >
                {active && (
                  <span className="absolute -top-[1px] w-8 h-1 bg-gradient-to-r from-accent to-[#9061f9] rounded-b-full shadow-[0_2px_8px_rgba(124,58,237,0.5)]"></span>
                )}
                <Icon className={`w-[22px] h-[22px] transition-transform ${active ? 'scale-110 -translate-y-0.5' : ''}`} strokeWidth={active ? 2.5 : 2} />
                <span className={`text-[10px] font-bold transition-all ${active ? 'opacity-100' : 'opacity-80'}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </div>

      <main className="flex-1 min-w-0 h-full overflow-y-auto pb-20 md:pb-0 relative z-10">{children}</main>
    </div>
  );
}
