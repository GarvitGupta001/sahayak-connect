import { NextResponse } from "next/server";

// Proxy to external ML tunnel to avoid CORS / network issues client-side
const ML_ENDPOINT = process.env.ML_ENDPOINT;

export async function POST(request) {
    try {
        const body = await request.json();
        const prompt = body.prompt || "";
        if (!prompt.trim()) {
            return NextResponse.json(
                { success: false, error: "Prompt required" },
                { status: 400 }
            );
        }
        console.log(ML_ENDPOINT);
        const res = await fetch(ML_ENDPOINT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ prompt }),
        });
        if (!res.ok) {
            return NextResponse.json(
                { success: false, error: "Upstream ML error" },
                { status: res.status }
            );
        }
        const data = await res.json();
        return NextResponse.json({ ...data });
    } catch (e) {
        return NextResponse.json(
            {
                success: false,
                error: e.message,
            },
            { status: 500 }
        );
    }
}
