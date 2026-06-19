export function CalendarAction({ m, editingActionId, editPayload, setEditPayload }: any) {
  return (
    <>
      <div><span className="text-text-tertiary font-semibold">Summary:</span> {editingActionId === m.id ? <input className="w-full mt-1 px-2 py-1.5 border border-border-soft rounded-md outline-none focus:border-accent/50 bg-surface-raised" value={editPayload.summary || ''} onChange={e => setEditPayload({...editPayload, summary: e.target.value})} /> : (m.action.payload as any).summary}</div>
      <div><span className="text-text-tertiary font-semibold">Time:</span> {editingActionId === m.id ? <input className="w-full mt-1 px-2 py-1.5 border border-border-soft rounded-md outline-none focus:border-accent/50 bg-surface-raised" value={editPayload.startTime || ''} onChange={e => setEditPayload({...editPayload, startTime: e.target.value})} /> : new Date((m.action.payload as any).startTime).toLocaleString()}</div>
      {(editingActionId === m.id || (m.action.payload as any).description) && (
        <div className="mt-2 bg-surface-raised p-3 border border-border-soft rounded-lg text-text-secondary whitespace-pre-wrap font-medium">
          {editingActionId === m.id ? <textarea className="w-full bg-transparent border-none rounded outline-none min-h-[60px] resize-y text-text-primary" value={editPayload.description || ''} onChange={e => setEditPayload({...editPayload, description: e.target.value})} /> : (m.action.payload as any).description}
        </div>
      )}
    </>
  );
}
