"use client";
import GlassCard from "./GlassCard";
import Link from "next/link";

/*
 schemes can be:
   - string (plain text)
   - { schemes: [{scheme_id, scheme_name?}], rawIds: [...], note }
*/
const ChatSuccess = ({ schemes }) => {
    if (schemes.length === 0) {
        return (
            <GlassCard className="max-w-[80%] text-slate-800 text-sm leading-relaxed space-y-2">
                <p className="text-xs text-slate-500">No schemes returned.</p>
            </GlassCard>
        );
    }

    return (
        <div className="flex flex-col gap-3">
            {schemes.map((s) => {
                const info = s.details || s.benefits || s.documents || "";
                const snippet =
                    info.length > 180 ? info.slice(0, 177) + "…" : info;
                return (
                    <Link key={s.scheme_id} href={`/scheme/${s.scheme_id}`}>
                        <GlassCard className="max-w-[80%] text-slate-800 text-sm leading-relaxed space-y-1">
                            <div className="text-base font-semibold text-slate-900">
                                {s.scheme_name || "Scheme"}
                            </div>
                            {snippet && (
                                <p className="text-xs text-slate-500 leading-snug">
                                    {snippet}
                                </p>
                            )}
                        </GlassCard>
                    </Link>
                );
            })}
        </div>
    );
};

export default ChatSuccess;
