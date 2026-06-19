export function WhatsAppReadAction({ m }: any) {
  return (
    <>
      <div><span className="text-text-tertiary font-semibold">From:</span> {(m.action.payload as any).from}</div>
      <div className="mt-2 bg-[#25D366]/10 p-4 border border-[#25D366]/20 rounded-xl text-text-primary whitespace-pre-wrap font-medium shadow-sm relative">
        <div className="absolute top-0 left-0 w-1 h-full bg-[#25D366] rounded-l-xl"></div>
        {(m.action.payload as any).snippet}
      </div>
    </>
  );
}
