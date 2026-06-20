import { Sparkles } from "lucide-react";

interface ChatSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function ChatSuggestions({ suggestions, onSelect }: ChatSuggestionsProps) {
  if (suggestions.length === 0) return null;
  
  return (
    <div className="relative w-full shrink-0 mb-2 md:mb-4 group/suggestions">
      {/* Container with horizontal scroll */}
      <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide py-1.5 px-1 -mx-1 snap-x snap-mandatory scroll-smooth">
        {/* Label */}
        <div className="flex items-center gap-1.5 text-[10px] md:text-[11px] font-bold text-text-tertiary uppercase tracking-wider select-none shrink-0 pr-1 snap-start">
          <Sparkles className="w-3 h-3 text-accent/60" />
          <span>Suggestions</span>
        </div>
        
        {/* Suggestions list */}
        {suggestions.map((s) => (
          <button
            key={s}
            onClick={() => onSelect(s)}
            className="group flex items-center gap-2 text-[12px] md:text-[13px] font-medium text-text-secondary hover:text-text-primary bg-surface/60 hover:bg-surface border border-border/80 hover:border-accent/30 rounded-xl px-3.5 py-2 cursor-pointer transition-all duration-200 shadow-sm active:scale-95 snap-start whitespace-nowrap shrink-0"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-accent/40 group-hover:bg-accent transition-colors shrink-0" />
            <span className="truncate max-w-[240px] sm:max-w-none">{s}</span>
          </button>
        ))}
      </div>
      
      {/* Gradient fades to indicate scrolling on mobile */}
      <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-surface to-transparent pointer-events-none opacity-100 transition-opacity duration-300 group-hover/suggestions:opacity-0 rounded-r-xl" />
    </div>
  );
}
