import { Send } from "lucide-react";

interface ChatInputFormProps {
  input: string;
  setInput: (value: string) => void;
  sending: boolean;
  onSend: (message: string) => void;
}

export function ChatInputForm({ input, setInput, sending, onSend }: ChatInputFormProps) {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSend(input);
      }}
      className="flex items-center gap-2 bg-surface border border-border p-2 rounded-2xl shadow-sm shrink-0 mb-4 focus-within:border-accent/40 focus-within:shadow-md focus-within:shadow-accent/5 transition-all"
    >
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Ask AI Agent to check alerts, draft emails, or search chat logs..."
        className="flex-1 bg-transparent border-0 px-3 py-2 text-[14px] text-text-primary placeholder:text-text-tertiary focus:ring-0 focus:outline-none"
      />
      <button
        type="submit"
        disabled={sending || !input.trim()}
        className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-tr from-[#7c3aed] to-[#9061f9] text-white hover:scale-105 active:scale-95 transition-all disabled:opacity-40 shrink-0 shadow-sm cursor-pointer"
      >
        <Send className="w-[16px] h-[16px]" strokeWidth={2.5} />
      </button>
    </form>
  );
}
