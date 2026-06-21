import { Send, Paperclip, Mic } from "lucide-react";

interface ChatInputFormProps {
  input: string;
  setInput: (value: string) => void;
  sending: boolean;
  onSend: (message: string) => void;
}

export function ChatInputForm({ input, setInput, sending, onSend }: ChatInputFormProps) {
  return (
    <div className="flex flex-col gap-2 shrink-0 mb-3 md:mb-5">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          onSend(input);
        }}
        className="flex items-center gap-2.5 bg-white dark:bg-[#0c0827]/40 border border-slate-200 dark:border-white/[0.08] p-2 rounded-[20px] shadow-lg shrink-0 focus-within:border-violet-500/30 transition-all"
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask AI Agent to check alerts, draft emails, or search chat logs..."
          className="flex-1 bg-transparent border-0 px-3.5 py-2 text-[13px] sm:text-[13.5px] md:text-[14px] text-slate-900 placeholder:text-slate-400 dark:text-white dark:placeholder:text-slate-550 focus:ring-0 focus:outline-none"
        />
        
        {/* Inline Actions */}
        <div className="flex items-center gap-1.5 pr-1 shrink-0">
          <button
            type="button"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="Attach file"
          >
            <Paperclip className="w-4.5 h-4.5" />
          </button>
          
          <button
            type="button"
            className="p-2 rounded-lg text-slate-500 hover:text-slate-900 hover:bg-slate-100 dark:text-slate-400 dark:hover:text-white dark:hover:bg-white/[0.04] transition-colors cursor-pointer"
            title="Voice input"
          >
            <Mic className="w-4.5 h-4.5" />
          </button>
          
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="flex items-center justify-center w-9 h-9 rounded-full bg-[#5e35e8] hover:bg-[#4f22d6] text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-40 shrink-0 shadow-md cursor-pointer"
          >
            <Send className="w-4 h-4 translate-x-[1px]" strokeWidth={2.5} />
          </button>
        </div>
      </form>
      
      {/* Footer disclaimer */}
      <p className="text-center text-[11px] font-semibold text-slate-500 dark:text-slate-500 select-none">
        AI can make mistakes. Verify important information.
      </p>
    </div>
  );
}
