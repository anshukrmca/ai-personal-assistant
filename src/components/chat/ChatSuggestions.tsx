interface ChatSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

export function ChatSuggestions({ suggestions, onSelect }: ChatSuggestionsProps) {
  if (suggestions.length === 0) return null;
  
  return (
    <div className="flex flex-wrap items-center gap-2 py-2 shrink-0 justify-center md:justify-start">
      <span className="text-[12px] font-bold text-text-tertiary mr-1 select-none">Suggestions:</span>
      {suggestions.map((s) => (
        <button
          key={s}
          onClick={() => onSelect(s)}
          className="text-[12.5px] font-bold text-accent bg-accent-soft border border-accent/15 rounded-full px-4.5 py-1.5 hover:bg-accent/15 hover:border-accent/30 active:scale-97 cursor-pointer transition-all shadow-sm"
        >
          {s}
        </button>
      ))}
    </div>
  );
}
