"use client";

import Navbar from "@/components/Navbar";

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-white via-slate-50 to-blue-50">
            <Navbar />
            <main className="pt-24 pb-6 max-w-5xl mx-auto px-4 sm:px-6 flex flex-col h-[calc(100vh-6rem)]">
                {children}
            </main>
        </div>
    );
}
