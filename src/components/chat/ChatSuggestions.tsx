import { Sparkles, LayoutGrid } from "lucide-react";

interface ChatSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function ChatSuggestions({ suggestions, onSelect }: ChatSuggestionsProps) {
  if (suggestions.length === 0) return null;
  
  return (
    <div className="relative w-full shrink-0 mb-3 md:mb-5 group/suggestions">
      {/* Container with horizontal scroll */}
      <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide py-1.5 px-1 -mx-1 snap-x snap-mandatory scroll-smooth">
        {/* Label */}
        <div className="flex items-center gap-1.5 text-[11px] font-black text-slate-500 uppercase tracking-widest select-none shrink-0 pr-1.5 snap-start">
          <Sparkles className="w-3.5 h-3.5 text-violet-400" />
          <span>Suggestions</span>
        </div>
        
        {/* Suggestions list */}
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className="group flex items-center gap-2 text-[12.5px] md:text-[13px] font-bold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white bg-slate-50 hover:bg-slate-100 dark:bg-[#0c0827]/40 dark:hover:bg-[#0c0827]/60 border border-slate-200 dark:border-white/[0.08] hover:border-violet-500/40 dark:hover:border-violet-500/30 rounded-xl px-4 py-2 cursor-pointer transition-all active:scale-[0.98] snap-start whitespace-nowrap shrink-0 shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-violet-400 group-hover:scale-110 transition-transform shrink-0" />
            <span className="truncate max-w-[240px] sm:max-w-none">{s}</span>
          </button>
        ))}

        {/* "More" button */}
        <button
          onClick={() => onSelect("Explore smart rules")}
          className="group flex items-center gap-2 text-[12.5px] md:text-[13px] font-bold text-slate-700 hover:text-slate-950 dark:text-slate-200 dark:hover:text-white bg-slate-50 hover:bg-slate-100 dark:bg-[#0c0827]/40 dark:hover:bg-[#0c0827]/60 border border-slate-200 dark:border-white/[0.08] hover:border-violet-500/40 dark:hover:border-violet-500/30 rounded-xl px-4 py-2 cursor-pointer transition-all active:scale-[0.98] snap-start whitespace-nowrap shrink-0 shadow-sm"
        >
          <LayoutGrid className="w-3.5 h-3.5 text-violet-400 group-hover:rotate-12 transition-transform shrink-0" />
          <span>More</span>
        </button>
      </div>
      
      {/* Gradient fades to indicate scrolling on mobile */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-bg dark:from-[#090616] to-transparent pointer-events-none opacity-100 transition-opacity duration-300 group-hover/suggestions:opacity-0 rounded-r-xl" />
    </div>
  );
}
