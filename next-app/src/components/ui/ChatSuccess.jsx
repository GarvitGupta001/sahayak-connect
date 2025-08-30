"use client";
import GlassCard from './GlassCard';

/*
 message can be:
   - string (plain text)
   - { schemes: [{scheme_id, scheme_name?}], rawIds: [...], note }
*/
const ChatSuccess = ({ message }) => {
    const isObject = message && typeof message === 'object' && !Array.isArray(message);
    if (!isObject) {
        return (
            <GlassCard className="max-w-[80%] text-slate-800 text-sm leading-relaxed">
                <p className="whitespace-pre-wrap">{String(message)}</p>
            </GlassCard>
        );
    }

    const { schemes = [], rawIds = [], note } = message;

    if (schemes.length === 0) {
        return (
            <GlassCard className="max-w-[80%] text-slate-800 text-sm leading-relaxed space-y-2">
                {note && <p className="text-xs text-slate-500 leading-snug">{note}</p>}
                <p className="text-xs text-slate-500">No schemes returned.</p>
                {rawIds.length > 0 && (
                    <p className="text-[10px] text-slate-400">{rawIds.length} IDs returned.</p>
                )}
            </GlassCard>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {note && (
                <GlassCard className="max-w-[80%] text-xs text-slate-600 bg-white/60">
                    {note}
                </GlassCard>
            )}
            {schemes.map(s => {
                const info = s.details || s.benefits || s.documents || '';
                const snippet = info.length > 180 ? info.slice(0, 177) + '…' : info;
                return (
                    <GlassCard
                        key={s.scheme_id}
                        className="max-w-[80%] text-slate-800 text-sm leading-relaxed space-y-1"
                    >
                        <div className="text-base font-semibold text-slate-900">
                            {s.scheme_name || 'Scheme'}
                        </div>
                        {snippet && (
                            <p className="text-xs text-slate-500 leading-snug">{snippet}</p>
                        )}
                    </GlassCard>
                );
            })}
        </div>
    );
};

export default ChatSuccess;