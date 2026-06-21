"use client";

import { Sparkles } from "lucide-react";

// Inline Custom SVGs for Social Links
const TwitterIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const LinkedinIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
  </svg>
);

const GithubIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.464-1.11-1.464-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.579.688.481C19.138 20.161 22 16.418 22 12c0-5.523-4.477-10-10-10z" />
  </svg>
);

const DiscordIcon = () => (
  <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028c.462-.63.874-1.295 1.226-1.994.021-.041.001-.09-.041-.106a13.094 13.094 0 0 1-1.873-.894.077.077 0 0 1-.008-.128c.126-.093.252-.19.372-.287a.075.075 0 0 1 .077-.011c3.92 1.793 8.18 1.793 12.061 0a.073.073 0 0 1 .078.009c.12.099.246.195.373.289a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.894.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.956-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.956 2.418-2.156 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419 0-1.333.955-2.419 2.156-2.419 1.21 0 2.176 1.096 2.157 2.42 0 1.333-.946 2.418-2.156 2.418z" />
  </svg>
);

export function LandingFooter() {
  return (
    <footer className="border-t border-slate-200 dark:border-white/[0.05] bg-slate-50 dark:bg-slate-950/40 pt-16 pb-12 text-[13.5px] text-slate-500 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Main Grid Structure */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 pb-12 border-b border-slate-200 dark:border-white/[0.05]">
          
          {/* Logo & Moto (Col span 3) */}
          <div className="md:col-span-3 flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-violet-600 to-[#9061f9] flex items-center justify-center shadow-md">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="font-display font-extrabold text-[17px] text-slate-900 dark:text-white">
                Anshu<span className="text-violet-600 dark:text-violet-400">.ai</span>
              </span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed max-w-[200px]">
              Your AI copilot for a productive life.
            </p>
          </div>

          {/* Directory Links Columns (Col span 5: 3 columns) */}
          <div className="md:col-span-5 grid grid-cols-3 gap-6">
            {/* Product */}
            <div className="flex flex-col gap-3">
              <h5 className="font-bold text-slate-900 dark:text-white text-[12px] uppercase tracking-wider">Product</h5>
              <a href="#features" className="hover:text-violet-500 transition-colors font-medium">Features</a>
              <a href="#workflow" className="hover:text-violet-500 transition-colors font-medium">How It Works</a>
              <a href="#integrations" className="hover:text-violet-500 transition-colors font-medium">Integrations</a>
              <a href="#changelog" className="hover:text-violet-500 transition-colors font-medium">Changelog</a>
            </div>

            {/* Resources */}
            <div className="flex flex-col gap-3">
              <h5 className="font-bold text-slate-900 dark:text-white text-[12px] uppercase tracking-wider">Resources</h5>
              <a href="#docs" className="hover:text-violet-500 transition-colors font-medium">Documentation</a>
              <a href="#help" className="hover:text-violet-500 transition-colors font-medium">Help Center</a>
              <a href="#blog" className="hover:text-violet-500 transition-colors font-medium">Blog</a>
              <a href="#api" className="hover:text-violet-500 transition-colors font-medium">API Reference</a>
            </div>

            {/* Company */}
            <div className="flex flex-col gap-3">
              <h5 className="font-bold text-slate-900 dark:text-white text-[12px] uppercase tracking-wider">Company</h5>
              <a href="#about" className="hover:text-violet-500 transition-colors font-medium">About Us</a>
              <a href="#privacy" className="hover:text-violet-500 transition-colors font-medium">Privacy Policy</a>
              <a href="#terms" className="hover:text-violet-500 transition-colors font-medium">Terms of Service</a>
              <a href="#contact" className="hover:text-violet-500 transition-colors font-medium">Contact Us</a>
            </div>
          </div>

          {/* Newsletter Box (Col span 4) */}
          <div className="md:col-span-4 flex flex-col gap-4">
            <h5 className="font-bold text-slate-900 dark:text-white text-[12px] uppercase tracking-wider">Stay Updated</h5>
            <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Get the latest updates and productivity tips straight to your inbox.
            </p>
            
            <div className="flex gap-2 w-full max-w-sm mt-1">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-white/[0.08] rounded-xl px-4 py-2.5 text-[12.5px] text-slate-800 dark:text-slate-200 focus:outline-none focus:border-violet-500/50"
              />
              <button className="bg-violet-600 hover:bg-violet-500 text-white font-extrabold text-[12.5px] px-5 py-2.5 rounded-xl transition-all shadow-md shadow-violet-600/20 shrink-0 cursor-pointer">
                Subscribe
              </button>
            </div>
          </div>

        </div>

        {/* Footer Bottom Row */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 pt-8 text-[12.5px] font-medium text-slate-400 dark:text-slate-600">
          <div>
            © {new Date().getFullYear()} Anshu.ai. All rights reserved.
          </div>
          
          {/* Social Links */}
          <div className="flex items-center gap-5">
            <a href="https://twitter.com" target="_blank" rel="noreferrer" className="hover:text-violet-500 transition-colors">
              <TwitterIcon />
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="hover:text-violet-500 transition-colors">
              <LinkedinIcon />
            </a>
            <a href="https://github.com/anshukrmca" target="_blank" rel="noreferrer" className="hover:text-violet-500 transition-colors">
              <GithubIcon />
            </a>
            <a href="https://discord.com" target="_blank" rel="noreferrer" className="hover:text-violet-500 transition-colors">
              <DiscordIcon />
            </a>
          </div>
        </div>

      </div>
    </footer>
  );
}
