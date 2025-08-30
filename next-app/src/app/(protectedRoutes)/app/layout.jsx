"use client";

import Navbar from "@/components/Navbar";
import Header from "@/components/Header";

export default function AppLayout({ children }) {
    return (
        <div className="min-h-screen w-full bg-gradient-to-b from-white via-slate-50 to-blue-50 flex flex-col">
            <Header />
            <main className="flex-1 pb-24 pt-2 max-w-5xl mx-auto w-full px-4 sm:px-6 flex flex-col">
                {children}
            </main>
            <Navbar />
        </div>
    );
}
