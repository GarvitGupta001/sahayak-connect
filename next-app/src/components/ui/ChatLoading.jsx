"use client";
import GlassCard from './GlassCard';

const ChatLoading = () => {
    return (
        <GlassCard className="inline-flex items-center gap-2 text-slate-500 text-xs font-medium max-w-[80%]">
            <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
            Thinking...
        </GlassCard>
    );
};

export default ChatLoading;
