import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import SchemeModel from "@/model/scheme.model";

// Helper function to escape special characters for regex
function escapeRegex(string) {
    return string.replace(/[-\/\\^$*+?.()|[\]{}]/g, "\\$&");
}

export async function GET(request) {
    try {
        await connectDB();

        // Use optional chaining to safely access searchParams
        const search = request.nextUrl.searchParams.get("search");

        let query = {};

        if (search) {
            const sanitizedSearch = escapeRegex(search);
            query = { scheme_name: { $regex: sanitizedSearch, $options: "i" } };
        }

        const schemes = await SchemeModel.find(query);

        return NextResponse.json({ success: true, schemes });
    } catch (error) {
        console.error("Error fetching schemes:", error);
        return NextResponse.json(
            { success: false, message: "Failed to fetch schemes." },
            { status: 500 }
        );
    }
}