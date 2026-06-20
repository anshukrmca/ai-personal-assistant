import { Layers, Sparkles, Mail, Calendar, MessageSquareText } from "lucide-react";

const Slack = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.824a2.528 2.528 0 0 1-2.52-2.52v-5.042zM8.824 5.043a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.522 2.522H3.782a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.042zm10.134 3.782a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52v2.52h-2.52a2.528 2.528 0 0 1-2.522-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V3.782a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.042zm-3.78 10.132a2.528 2.528 0 0 1-2.522 2.52 2.528 2.528 0 0 1-2.52-2.52v-2.52h2.52a2.528 2.528 0 0 1 2.522 2.52zm0-1.262a2.528 2.528 0 0 1-2.522-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.522h5.043a2.528 2.528 0 0 1 2.522 2.522v5.043a2.528 2.528 0 0 1-2.522 2.52h-5.043z" />
  </svg>
);

export function LandingIntegrations() {
  return (
    <section id="integrations" className="py-20 md:py-28 border-t border-slate-200 dark:border-white/[0.05] bg-slate-50 dark:bg-slate-950/20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/5 text-indigo-600 dark:text-indigo-400 text-[12px] font-bold w-fit transition-colors duration-300">
            <Layers className="w-3.5 h-3.5" /> Platform Integrations
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight transition-colors duration-300">
            Connects With Your Entire Tech Stack
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-[15.5px] leading-relaxed transition-colors duration-300">
            No complex setup. Connect your workspace channels directly. Anshu AI works with the platforms you already rely on every day.
          </p>

          <div className="space-y-3 mt-2 text-[14.5px]">
            <div className="flex items-center gap-3">
              <div className="w-5.5 h-5.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400 transition-colors duration-300">✓</div>
              <span className="text-slate-700 dark:text-slate-300 transition-colors duration-300">OAuth 2.0 secure connections</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5.5 h-5.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400 transition-colors duration-300">✓</div>
              <span className="text-slate-700 dark:text-slate-300 transition-colors duration-300">Bi-directional notification sync</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5.5 h-5.5 rounded-md bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 flex items-center justify-center text-emerald-500 dark:text-emerald-400 transition-colors duration-300">✓</div>
              <span className="text-slate-700 dark:text-slate-300 transition-colors duration-300">Custom Webhook support for developers</span>
            </div>
          </div>
        </div>

        {/* Visual Platform Circles Web */}
        <div className="lg:col-span-7 flex justify-center items-center relative py-8">
          <div className="absolute w-80 h-80 bg-violet-100 dark:bg-violet-600/10 rounded-full blur-[80px] pointer-events-none transition-colors duration-300"></div>
          
          {/* Center Node */}
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-violet-600 to-[#9061f9] flex items-center justify-center shadow-lg shadow-violet-600/40 relative z-20 border border-white/20 animate-float-fast">
            <Sparkles className="w-9 h-9 text-white" />
          </div>

          {/* Orbit Items */}
          {/* Gmail */}
          <div className="absolute top-2 w-14 h-14 rounded-2xl bg-white dark:bg-red-500/10 border border-slate-200 dark:border-red-500/20 flex items-center justify-center shadow-xl animate-float-slow z-10 hover:bg-slate-50 dark:hover:bg-red-500/20 transition-colors duration-300" style={{ left: "20%" }}>
            <Mail className="w-6.5 h-6.5 text-red-500 dark:text-red-400" />
          </div>
          {/* Calendar */}
          <div className="absolute top-8 w-14 h-14 rounded-2xl bg-white dark:bg-blue-500/10 border border-slate-200 dark:border-blue-500/20 flex items-center justify-center shadow-xl animate-float-medium z-10 hover:bg-slate-50 dark:hover:bg-blue-500/20 transition-colors duration-300" style={{ right: "18%" }}>
            <Calendar className="w-6.5 h-6.5 text-blue-500 dark:text-blue-400" />
          </div>
          {/* Slack */}
          <div className="absolute bottom-6 w-14 h-14 rounded-2xl bg-white dark:bg-pink-500/10 border border-slate-200 dark:border-pink-500/20 flex items-center justify-center shadow-xl animate-float-slow z-10 hover:bg-slate-50 dark:hover:bg-pink-500/20 transition-colors duration-300" style={{ left: "25%" }}>
            <Slack className="w-6.5 h-6.5 text-pink-500 dark:text-pink-400" />
          </div>
          {/* WhatsApp */}
          <div className="absolute bottom-10 w-14 h-14 rounded-2xl bg-white dark:bg-emerald-500/10 border border-slate-200 dark:border-emerald-500/20 flex items-center justify-center shadow-xl animate-float-medium z-10 hover:bg-slate-50 dark:hover:bg-emerald-500/20 transition-colors duration-300" style={{ right: "22%" }}>
            <MessageSquareText className="w-6.5 h-6.5 text-emerald-500 dark:text-emerald-400" />
          </div>
        </div>

      </div>
    </section>
  );
}
