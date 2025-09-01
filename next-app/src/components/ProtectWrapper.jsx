"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Loader from "@/components/Loader";
import { useUserContext } from "@/hooks/useUserContext";


export default function ProtectWrapper({ children }) {
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    const { user } = useUserContext();

    useEffect(() => {
        const token = localStorage.getItem("token") || "";
        if (!token || !user) {
            router.push("/sign-in");
        } else {
            setLoading(false);
        }
    }, []);

    return <>{loading ? <Loader /> : children}</>;
}
