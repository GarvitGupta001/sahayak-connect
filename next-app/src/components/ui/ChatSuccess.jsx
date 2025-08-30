"use client";
import GlassCard from './GlassCard';

const ChatSuccess = ({ message }) => {
    return (
        <GlassCard className="max-w-[80%] text-slate-800 text-sm leading-relaxed">
            <p className="whitespace-pre-wrap">{message}</p>
        </GlassCard>
    );
};

export default ChatSuccess;