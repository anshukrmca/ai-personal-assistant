export function EmailReadAction({ m }: any) {
  return (
    <>
      <div><span className="text-text-tertiary font-semibold">From:</span> {(m.action.payload as any).from}</div>
      <div><span className="text-text-tertiary font-semibold">Subject:</span> <span className="font-bold">{(m.action.payload as any).subject}</span></div>
      <div className="mt-2 bg-[#EA4335]/10 p-4 border border-[#EA4335]/20 rounded-xl text-text-primary whitespace-pre-wrap font-medium shadow-sm relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#EA4335] rounded-l-xl"></div>
        {(m.action.payload as any).snippet}
      </div>
    </>
  );
}
