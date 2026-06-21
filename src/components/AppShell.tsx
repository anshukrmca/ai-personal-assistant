"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  ChevronsRight,
  ChevronsLeft,
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

  const [user, setUser] = useState<{name: string, email: string | null, avatar: string} | null>(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }

    api.me().then(res => {
      if (res.user) setUser(res.user);
    }).catch(console.error);
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
      <motion.aside 
        initial={false}
        animate={{ 
          width: isCollapsed ? 88 : 256,
          paddingLeft: isCollapsed ? 12 : 20,
          paddingRight: isCollapsed ? 12 : 20
        }}
        transition={{ type: "spring", stiffness: 350, damping: 30, mass: 0.8 }}
        className="hidden md:flex flex-col border-r border-border/60 bg-surface py-6 shrink-0 shadow-[4px_0_24px_rgba(0,0,0,0.02)] relative z-50 h-full"
      >
        
        {/* Toggle Button */}
        <button 
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="absolute -right-3.5 top-9 w-7 h-7 bg-surface border border-border rounded-full flex items-center justify-center text-text-tertiary hover:text-text-primary shadow-sm z-50 transition-transform hover:scale-110 cursor-pointer"
        >
          {isCollapsed ? <ChevronsRight className="w-4 h-4" /> : <ChevronsLeft className="w-4 h-4" />}
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
            const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href));
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center group rounded-xl transition-all duration-200 cursor-pointer ${
                  isCollapsed ? 'justify-center p-3' : 'px-4 py-3 gap-3'
                } ${
                  isActive 
                    ? "bg-accent text-[#15110a] shadow-sm shadow-accent/20" 
                    : "text-text-secondary hover:bg-surface-raised hover:text-text-primary"
                }`}
              >
                <Icon className={`w-5 h-5 shrink-0 transition-transform duration-200 ${isActive ? '' : 'group-hover:scale-110'} ${isCollapsed ? 'ml-0' : ''}`} />
                {!isCollapsed && (
                  <span className="font-bold text-[14.5px] whitespace-nowrap">{item.label}</span>
                )}
                
                {/* Tooltip for Collapsed State */}
                {isCollapsed && (
                  <div className="absolute left-full ml-5 px-3 py-2 bg-slate-800 text-white text-[12px] font-bold rounded-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 whitespace-nowrap shadow-xl z-50 flex items-center pointer-events-none translate-x-1 group-hover:translate-x-0">
                    <div className="absolute -left-1 top-1/2 -translate-y-1/2 w-2.5 h-2.5 bg-slate-800 rotate-45 rounded-[2px]"></div>
                    {item.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* User Profile / Settings (Desktop) */}
        <div className="mt-auto pt-6 relative">
          {/* Settings Menu Dropdown */}
          <AnimatePresence>
          {isProfileMenuOpen && (
            <div className="absolute bottom-[calc(100%+12px)] left-0 w-52 bg-surface border border-border/80 rounded-2xl shadow-xl flex flex-col p-2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-200">
              <Link 
                href="/settings" 
                onClick={() => setIsProfileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-raised text-text-secondary hover:text-text-primary transition-colors text-[13.5px] font-bold"
              >
                <Settings className="w-4 h-4" />
                Account Settings
              </Link>
              
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
          </AnimatePresence>

          {/* User profile toggle */}
          <button 
            onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
            className={`flex items-center transition-all hover:bg-surface-raised rounded-xl cursor-pointer group w-full ${isCollapsed ? 'justify-center p-2' : 'gap-3 px-2 py-2'} ${isProfileMenuOpen ? 'bg-surface-raised' : ''}`}
          >
            <div className="w-10 h-10 rounded-full bg-surface-raised flex items-center justify-center font-display font-bold text-text-primary shrink-0 border border-border/60 shadow-sm relative overflow-hidden">
              {user?.avatar && (user.avatar.startsWith("http://") || user.avatar.startsWith("https://")) ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover relative z-10" />
              ) : (
                <span className="relative z-10">{user?.avatar?.substring(0, 2) || "A"}</span>
              )}
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
                  <p className="text-[13px] font-bold text-text-primary truncate">{user?.name || "User"}</p>
                  <p className="text-[11.5px] text-text-tertiary truncate font-medium">{user?.email || "No Email"}</p>
                </div>
                <ChevronUp className={`w-4 h-4 text-text-tertiary transition-transform duration-200 shrink-0 ${isProfileMenuOpen ? '' : 'rotate-180'}`} />
              </>
            )}
          </button>
        </div>
      </motion.aside>

      <div className="flex flex-col flex-1 min-w-0 h-full relative">
        {/* Mobile Top Bar */}
        <div className="md:hidden flex items-center justify-between px-4 py-3 bg-surface/85 backdrop-blur-xl border-b border-border/60 z-40 sticky top-0 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-accent to-[#9061f9] flex items-center justify-center text-white shadow-sm">
              <Sparkles className="w-4 h-4" />
            </div>
            <span className="font-display font-bold text-[16px] tracking-tight">
              Anshu<span className="text-accent">.ai</span>
            </span>
          </div>
          
          {/* User profile toggle for mobile */}
          <div className="relative shrink-0">
            <button 
              onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
              className={`flex items-center justify-center w-8 h-8 rounded-full bg-surface-raised border border-border/60 shadow-sm relative overflow-hidden transition-all duration-200 cursor-pointer shrink-0 ${isProfileMenuOpen ? 'ring-2 ring-accent' : ''}`}
            >
              {user?.avatar && (user.avatar.startsWith("http://") || user.avatar.startsWith("https://")) ? (
                <img src={user.avatar} alt="Avatar" className="w-full h-full object-cover relative z-10" />
              ) : (
                <span className="relative z-10 text-[11px] font-bold text-text-primary">{user?.avatar?.substring(0, 2) || "A"}</span>
              )}
              <div className="absolute inset-0 bg-gradient-to-tr from-accent/20 to-transparent"></div>
            </button>

            {/* Profile Menu Dropdown for mobile */}
            <AnimatePresence>
              {isProfileMenuOpen && (
                <>
                  {/* Backdrop to dismiss profile dropdown */}
                  <div 
                    className="fixed inset-0 z-40 bg-black/5 backdrop-blur-[1px] md:hidden" 
                    onClick={() => setIsProfileMenuOpen(false)} 
                  />
                  <motion.div
                    initial={{ opacity: 0, y: -15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    transition={{ duration: 0.2, ease: "easeOut" }}
                    className="absolute top-full right-0 mt-3 w-52 bg-surface border border-border/80 rounded-2xl shadow-xl flex flex-col p-2 z-50 overflow-hidden origin-top-right"
                  >
                    <div className="px-3 py-2 mb-1 border-b border-border/50">
                      <p className="text-[10px] font-bold text-text-tertiary uppercase tracking-wider">{user?.name || "User"}</p>
                      <p className="text-[11.5px] text-text-tertiary truncate font-medium">{user?.email || "No Email"}</p>
                    </div>
                    
                    <Link 
                      href="/settings" 
                      onClick={() => setIsProfileMenuOpen(false)}
                      className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-surface-raised text-text-secondary hover:text-text-primary transition-colors text-[13px] font-bold"
                    >
                      <Settings className="w-4 h-4" />
                      Account Settings
                    </Link>
                    
                    <button 
                      onClick={() => {
                        toggleTheme();
                        setIsProfileMenuOpen(false);
                      }}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-surface-raised text-text-secondary hover:text-text-primary transition-colors text-[13px] font-bold cursor-pointer"
                    >
                      {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                      {theme === 'light' ? 'Dark Mode' : 'Light Mode'}
                    </button>
                    
                    <div className="h-px bg-border/50 my-1 mx-2"></div>
                    
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl hover:bg-danger/10 text-text-secondary hover:text-danger transition-colors text-[13px] font-bold cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign out
                    </button>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Mobile Floating Bottom Nav */}
        <div className="md:hidden fixed bottom-4 left-4 right-4 z-50 bg-surface/90 backdrop-blur-xl border border-border/80 rounded-[1.25rem] shadow-[0_8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_8px_40px_rgba(0,0,0,0.4)] shrink-0 pb-[env(safe-area-inset-bottom)]">
          <div className="flex items-center justify-between px-2 py-1.5 relative">
            {NAV_ITEMS.map((item) => {
              const active = pathname?.startsWith(item.href);
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`relative flex flex-col items-center justify-center w-14 h-12 transition-all duration-200 rounded-xl ${
                    active ? "text-accent" : "text-text-tertiary hover:text-text-secondary"
                  }`}
                >
                  {active && (
                    <div className="absolute inset-0 bg-accent/10 rounded-xl -z-10" />
                  )}
                  <Icon className={`shrink-0 transition-transform ${active ? 'scale-110 w-5 h-5 mb-0.5' : 'w-5 h-5'}`} strokeWidth={active ? 2.5 : 2} />
                  {active && <span className="text-[9px] font-bold tracking-wide">{item.label}</span>}
                </Link>
              );
            })}
          </div>
        </div>

        <main className="flex-1 min-w-0 h-full overflow-y-auto pb-20 md:pb-0 relative z-10">{children}</main>
      </div>
    </div>
  );
}
