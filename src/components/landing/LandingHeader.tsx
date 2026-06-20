"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Menu, X, Sun, Moon } from "lucide-react";
import type { SessionPayload } from "@/lib/types";

interface LandingHeaderProps {
  session: SessionPayload | null;
}

export function LandingHeader({ session }: LandingHeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [showHeader, setShowHeader] = useState(true);
  const [isScrolled, setIsScrolled] = useState(false);
  const [theme, setTheme] = useState("dark");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem("theme") || "dark";
    setTheme(savedTheme);
    if (savedTheme === "dark") {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    let lastScrollY = window.scrollY;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      setIsScrolled(currentScrollY > 20);

      if (currentScrollY > lastScrollY && currentScrollY > 100) {
        setShowHeader(false);
      } else {
        setShowHeader(true);
      }
      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
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

  // Prevent hydration mismatch for theme icon
  const renderThemeIcon = () => {
    if (!mounted) return <div className="w-5 h-5" />;
    return theme === "light" ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />;
  };

  return (
    <>
      {/* Navigation Header */}
      <header className={`fixed top-0 left-0 right-0 z-50 w-full transition-all duration-300 ${
        showHeader ? "translate-y-0" : "-translate-y-full"
      } ${
        isScrolled 
          ? "border-b border-slate-200 dark:border-white/[0.08] bg-white/85 dark:bg-[#030014]/85 backdrop-blur-xl shadow-[0_8px_30px_rgb(0,0,0,0.1)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.3)]" 
          : "border-b border-slate-200 dark:border-white/[0.02] bg-white/40 dark:bg-[#030014]/40 backdrop-blur-md"
      }`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-violet-600 to-[#9061f9] flex items-center justify-center shadow-lg shadow-violet-600/30">
              <Sparkles className="w-4.5 h-4.5 text-white" />
            </div>
            <span className="font-display font-extrabold text-[20px] tracking-tight text-slate-900 dark:text-white transition-colors duration-300">
              Anshu<span className="text-violet-600 dark:text-violet-400">.ai</span>
            </span>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 text-[14.5px] font-semibold text-slate-600 dark:text-slate-300 transition-colors duration-300">
            <a href="#features" className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
            <a href="#workflow" className="hover:text-slate-900 dark:hover:text-white transition-colors">How It Works</a>
            <a href="#integrations" className="hover:text-slate-900 dark:hover:text-white transition-colors">Integrations</a>
            <a href="#pricing" className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
            <a href="#faq" className="hover:text-slate-900 dark:hover:text-white transition-colors">FAQ</a>
          </nav>

          {/* Nav CTAs & Theme Toggle */}
          <div className="hidden md:flex items-center gap-4">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {renderThemeIcon()}
            </button>
            
            {session ? (
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-[14px] shadow-lg shadow-violet-600/25 transition-all hover:scale-[1.02] cursor-pointer"
              >
                Go to Dashboard
                <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2.5 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-[14.5px] transition-colors duration-300"
                >
                  Sign In
                </Link>
                <Link
                  href="/login"
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-white font-bold text-[14.5px] shadow-lg shadow-violet-600/25 transition-all hover:scale-[1.02] cursor-pointer"
                >
                  Get Started Free
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/10 transition-colors cursor-pointer"
              aria-label="Toggle Theme"
            >
              {renderThemeIcon()}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown Nav */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-200 dark:border-white/[0.05] bg-white/95 dark:bg-[#030014]/95 backdrop-blur-2xl py-6 px-4 space-y-4 animate-in fade-in slide-in-from-top-4 duration-200 transition-colors duration-300">
            <div className="flex flex-col gap-4 text-[15.5px] font-semibold text-slate-600 dark:text-slate-300 pl-2">
              <a href="#features" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#workflow" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900 dark:hover:text-white transition-colors">How It Works</a>
              <a href="#integrations" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900 dark:hover:text-white transition-colors">Integrations</a>
              <a href="#pricing" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900 dark:hover:text-white transition-colors">Pricing</a>
              <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="hover:text-slate-900 dark:hover:text-white transition-colors">FAQ</a>
            </div>
            <div className="pt-4 border-t border-slate-200 dark:border-white/[0.05] flex flex-col gap-3">
              {session ? (
                <Link
                  href="/dashboard"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-[14.5px] cursor-pointer"
                >
                  Go to Dashboard
                  <ArrowRight className="w-4 h-4" />
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-3 text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white font-bold text-[14.5px] transition-colors duration-300"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold text-[14.5px] cursor-pointer"
                  >
                    Get Started Free
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
}
