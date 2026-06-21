"use client";

import { Layers, CheckCircle2 } from "lucide-react";

// Inline brand SVGs for the integration grid tiles
const GmailSVG = () => (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M20 4H4C2.9 4 2 4.9 2 6V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V6C22 4.9 21.1 4 20 4Z" fill="#EA4335" />
    <path d="M22 6V18C22 19.1 21.1 20 20 20H18V8L12 13L6 8V20H4C2.9 20 2 19.1 2 18V6C2 4.9 2.9 4 4 4H5L12 10L19 4H20C21.1 4 22 4.9 22 6Z" fill="#34A853" />
    <path d="M22 6V10L12 15L2 10V6C2 4.9 2.9 4 4 4H20C21.1 4 22 4.9 22 6Z" fill="#4285F4" />
    <path d="M12 15L2 10V18C2 19.1 2.9 20 4 20H20C21.1 20 22 19.1 22 18V10L12 15Z" fill="#FBBC05" />
  </svg>
);

const CalendarSVG = () => (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="4" fill="#4285F4" />
    <rect x="4" y="6" width="16" height="14" rx="2" fill="white" />
    <text x="12" y="17" fill="#4285F4" fontSize="11" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif">31</text>
    <rect x="6" y="2" width="2" height="4" rx="1" fill="#EA4335" />
    <rect x="16" y="2" width="2" height="4" rx="1" fill="#EA4335" />
  </svg>
);

const SlackSVG = () => (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523 2.528 2.528 0 0 1-2.522-2.523 2.528 2.528 0 0 1 2.522-2.52h2.52v2.52zm1.261 0a2.528 2.528 0 0 1 2.52-2.52h5.043a2.528 2.528 0 0 1 2.522 2.52v5.042a2.528 2.528 0 0 1-2.522 2.52H8.824a2.528 2.528 0 0 1-2.52-2.52v-5.042z" fill="#36C5F0" />
    <path d="M8.824 5.043a2.528 2.528 0 0 1 2.52-2.522 2.528 2.528 0 0 1 2.522 2.522v2.52h-2.522a2.528 2.528 0 0 1-2.52-2.52zm0 1.261a2.528 2.528 0 0 1 2.52 2.52v5.043a2.528 2.528 0 0 1-2.522 2.522H3.782a2.528 2.528 0 0 1-2.52-2.522V8.824a2.528 2.528 0 0 1 2.52-2.52h5.042z" fill="#2EB67D" />
    <path d="M18.958 8.825a2.528 2.528 0 0 1 2.522-2.52 2.528 2.528 0 0 1 2.52 2.52v2.52h-2.52a2.528 2.528 0 0 1-2.522-2.52zm-1.262 0a2.528 2.528 0 0 1-2.52 2.52h-5.043a2.528 2.528 0 0 1-2.522-2.52V3.782a2.528 2.528 0 0 1 2.522-2.52h5.043a2.528 2.528 0 0 1 2.52 2.52v5.042z" fill="#ECB22E" />
    <path d="M15.176 18.957a2.528 2.528 0 0 1-2.522 2.52 2.528 2.528 0 0 1-2.52-2.52v-2.52h2.52a2.528 2.528 0 0 1 2.522 2.52zm0-1.262a2.528 2.528 0 0 1-2.522-2.52v-5.043a2.528 2.528 0 0 1 2.52-2.522h5.043a2.528 2.528 0 0 1 2.522 2.522v5.043a2.528 2.528 0 0 1-2.522 2.52h-5.043z" fill="#E01E5A" />
  </svg>
);

const NotionSVG = () => (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="white" />
    <path d="M4.223 2.143a2.21 2.21 0 0 0-1.745.86L.93 5.484a2.227 2.227 0 0 0-.43 1.341v12.918c0 1.258.98 2.114 2.19 2.114h16.62c1.233 0 2.19-.88 2.19-2.114V4.227A2.218 2.218 0 0 0 19.31 2.14h-15.09z" fill="black" />
    <path d="M4.09 4.31h14.887a.544.544 0 0 1 .533.533V18.17a.544.544 0 0 1-.533.533H4.09a.544.544 0 0 1-.533-.533V4.843a.544.544 0 0 1 .533-.533z" fill="white" />
    <path d="M6.59 6.81a.69.69 0 0 0-.69.69v8.62a.69.69 0 0 0 1.38 0v-8.62a.69.69 0 0 0-.69-.69zm5.38 0a.69.69 0 0 0-.69.69v4.208L8.608 7.03A.69.69 0 0 0 8 7.5v6.208a.69.69 0 0 0 1.38 0V9.5l2.672 4.288a.69.69 0 0 0 .608.332.69.69 0 0 0 .69-.69v-6.21a.69.69 0 0 0-.69-.69zm5.38 0a.69.69 0 0 0-.69.69v4.208l-2.672-4.208A.69.69 0 0 0 13.38 7.5v6.208a.69.69 0 0 0 1.38 0V9.5l2.672 4.288a.69.69 0 0 0 .608.332.69.69 0 0 0 .69-.69v-6.21a.69.69 0 0 0-.69-.69z" fill="black" />
  </svg>
);

const OutlookSVG = () => (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#0078D4" />
    <path d="M5.5 5.5H18.5V18.5H5.5V5.5Z" fill="white" opacity="0.1" />
    <path d="M3.5 6.5L12 11.5L20.5 6.5V17.5H3.5V6.5Z" fill="white" />
    <path d="M12 11.5L3.5 6.5H20.5L12 11.5Z" fill="#E2E2E2" />
  </svg>
);

const TeamsSVG = () => (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#4B53BC" />
    <path d="M8.5 7C7.67 7 7 7.67 7 8.5C7 9.33 7.67 10 8.5 10C9.33 10 10 9.33 10 8.5C10 7.67 9.33 7 8.5 7ZM15.5 7C14.67 7 14 7.67 14 8.5C14 9.33 14.67 10 15.5 10C16.33 10 17 9.33 17 8.5C17 7.67 16.33 7 15.5 7Z" fill="white" />
    <path d="M4 15.5V17H13V15.5C13 13.57 9.77 12.5 8.5 12.5C7.23 12.5 4 13.57 4 15.5ZM11 15.5V17H20V15.5C20 13.57 16.77 12.5 15.5 12.5C14.88 12.5 13.25 12.78 12.18 13.33C12.7 13.97 13 14.73 13 15.5H11Z" fill="white" />
  </svg>
);

const TrelloSVG = () => (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#0079BF" />
    <rect x="4.5" y="4.5" width="6" height="11" rx="1.5" fill="white" />
    <rect x="13.5" y="4.5" width="6" height="7" rx="1.5" fill="white" />
  </svg>
);

const AsanaSVG = () => (
  <svg viewBox="0 0 24 24" className="w-9 h-9" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect width="24" height="24" rx="5" fill="#1E1E24" />
    <circle cx="12" cy="7.5" r="2.5" fill="#FC636B" />
    <circle cx="8" cy="14.5" r="2.5" fill="#FC636B" />
    <circle cx="16" cy="14.5" r="2.5" fill="#FC636B" />
  </svg>
);

export function LandingIntegrations() {
  const integrationTiles = [
    { name: "Gmail", icon: GmailSVG },
    { name: "Google Calendar", icon: CalendarSVG },
    { name: "Slack", icon: SlackSVG },
    { name: "Notion", icon: NotionSVG },
    { name: "Microsoft Outlook", icon: OutlookSVG },
    { name: "Microsoft Teams", icon: TeamsSVG },
    { name: "Trello", icon: TrelloSVG },
    { name: "Asana", icon: AsanaSVG },
    { name: "More", icon: null }
  ];

  return (
    <section id="integrations" className="py-12 md:py-14 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        
        {/* Left Info Column */}
        <div className="lg:col-span-5 flex flex-col gap-6 text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-indigo-500/20 bg-indigo-950/20 text-indigo-400 text-[12px] font-bold w-fit">
            <Layers className="w-3.5 h-3.5" /> Integrations
          </div>
          <h2 className="font-display font-black text-3xl sm:text-4xl text-slate-900 dark:text-white leading-tight">
            Connects With Your Entire Tech Stack
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-[15.5px] leading-relaxed">
            No complex setup. Connect your workspace channels directly. Anshu AI works with the platforms you already rely on every day.
          </p>

          {/* Checklist */}
          <div className="space-y-4 mt-2 text-[14px]">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5.5 h-5.5 text-violet-500 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-bold">OAuth 2.0 secure connections</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5.5 h-5.5 text-violet-500 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-bold">Bi-directional multi-tool sync</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5.5 h-5.5 text-violet-500 shrink-0" />
              <span className="text-slate-700 dark:text-slate-300 font-bold">Custom Webhook support for developers</span>
            </div>
          </div>
        </div>

        {/* Right 3x3 Grid Column */}
        <div className="lg:col-span-7 relative">
          <div className="absolute w-80 h-80 bg-violet-600/10 rounded-full blur-[80px] pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
          
          <div className="grid grid-cols-3 gap-4 relative z-10">
            {integrationTiles.map((tile, idx) => {
              const IconComponent = tile.icon;
              const isMore = tile.name === "More";
              
              return (
                <div 
                  key={idx}
                  className="bg-white dark:bg-slate-950/40 border border-slate-200 dark:border-white/[0.08] rounded-2xl p-5 flex flex-col items-center justify-center min-h-[110px] sm:min-h-[125px] hover:border-violet-500/30 hover:shadow-lg hover:shadow-violet-600/[0.03] transition-all duration-300 group cursor-pointer"
                >
                  {isMore ? (
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-white/[0.05] flex items-center justify-center text-slate-500 dark:text-slate-400 font-extrabold text-[22px] group-hover:scale-105 transition-transform">
                      +
                    </div>
                  ) : (
                    IconComponent && (
                      <div className="group-hover:scale-105 transition-transform duration-300">
                        <IconComponent />
                      </div>
                    )
                  )}
                  
                  <span className="text-[11.5px] font-bold text-slate-500 dark:text-slate-400 mt-3 tracking-wide">
                    {isMore ? "More" : tile.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
}
