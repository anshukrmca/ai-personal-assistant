import { Sparkles } from "lucide-react";

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/[0.05] bg-slate-50 dark:bg-slate-950/40 py-12 text-[13.5px] text-slate-500 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-[#9061f9] flex items-center justify-center shadow-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-extrabold text-[17px] text-slate-900 dark:text-white transition-colors duration-300">
            Anshu<span className="text-violet-600 dark:text-violet-400">.ai</span>
          </span>
        </div>

        <div className="flex gap-8 font-semibold text-[13.5px]">
          <a href="#features" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Features</a>
          <a href="#workflow" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Workflow</a>
          <a href="#pricing" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-slate-900 dark:hover:text-slate-300 transition-colors">FAQ</a>
        </div>

        <div className="text-[12.5px] font-medium text-slate-500 dark:text-slate-600 transition-colors duration-300">
          © {new Date().getFullYear()} Anshu.ai. All rights reserved. Created for Anshu Personal Assistant.
        </div>
      </div>
    </footer>
  );
}
