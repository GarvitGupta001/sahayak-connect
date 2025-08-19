import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request) {
    try {
        const { token } = await request.json();
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return NextResponse.json({ success: true, decoded }, { status: 200 });
    } catch (error) {
        return NextResponse.json(
            { success: false, error: "Invalid token" },
            { status: 401 }
        );
    }
}
