"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ProtectWrapper({ children }) {
    const router = useRouter();

    const token = localStorage.getItem("token") || "";

    useEffect(() => {
        if (!token) {
            router.push("/sign-in");
        }
    }, []);

    return <>{children}</>;
}
