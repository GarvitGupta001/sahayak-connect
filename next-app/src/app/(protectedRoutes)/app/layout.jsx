"use client";

import { useRef, useEffect } from "react";
import Header from "@/components/Header";
import Navbar from "@/components/Navbar";

export default function AppLayout({ children }) {
    return (
        <div className="flex flex-col justify-between h-[100vh]">
            <div className="h-[100%] flex flex-col">
                <Header />
                {children}
            </div>
            <Navbar />
        </div>
    );
}
