"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";


export default function ProtectWrapper({ children }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem("token") || "";
        if (!token) {
            router.push("/sign-in");
        } else {
            setLoading(false);
        }
    }, []);

    return <>{loading ? <Loader /> : children}</>;
}
