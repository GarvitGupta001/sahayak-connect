"use client";

import { useEffect, useState } from "react";
import Loader from "@/components/Loader";

export default function Home() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (localStorage.token) {
            window.location.href = "/app/home";
        } else {
            window.location.href = "/sign-in";
        }
        setLoading(false);
    }, []);

    return <>{loading ? <Loader /> : null}</>;
}
