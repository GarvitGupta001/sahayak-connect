'use client'

import GlassCard from './GlassCard';
const ChatError = () => {
    return (
        <GlassCard className="max-w-[80%] bg-red-50/80 border-red-200 text-red-600 text-sm font-medium">
            Something went wrong. Please try again.
        </GlassCard>
    );
};

export default ChatError;