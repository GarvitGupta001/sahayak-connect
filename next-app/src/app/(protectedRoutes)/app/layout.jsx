"use client";

import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

export default function AppLayout({ children }) {
    return (
        <>
            <Header />
            {children}
            <Navbar />
        </>
    );
}
