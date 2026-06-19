export function EmailSendAction({ m, editingActionId, editPayload, setEditPayload }: any) {
  return (
    <>
      <div><span className="text-text-tertiary font-semibold">To:</span> {editingActionId === m.id ? <input className="w-full mt-1 px-2 py-1.5 border border-border-soft rounded-md outline-none focus:border-accent/50 bg-surface-raised" value={editPayload.to || ''} onChange={e => setEditPayload({...editPayload, to: e.target.value})} /> : (m.action.payload as any).to}</div>
      <div><span className="text-text-tertiary font-semibold">Subject:</span> {editingActionId === m.id ? <input className="w-full mt-1 px-2 py-1.5 border border-border-soft rounded-md outline-none focus:border-accent/50 bg-surface-raised" value={editPayload.subject || ''} onChange={e => setEditPayload({...editPayload, subject: e.target.value})} /> : (m.action.payload as any).subject}</div>
      <div className={`mt-2 bg-surface-raised p-3 border border-border-soft rounded-lg text-text-secondary whitespace-pre-wrap font-medium ${editingActionId === m.id ? 'focus-within:border-accent/50' : ''}`}>
        {editingActionId === m.id ? <textarea className="w-full bg-transparent border-none rounded outline-none min-h-[120px] resize-y text-text-primary" value={editPayload.body || ''} onChange={e => setEditPayload({...editPayload, body: e.target.value})} /> : (m.action.payload as any).body}
      </div>
    </>
  );
}
