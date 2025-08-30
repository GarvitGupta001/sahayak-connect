import connectDB from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import SchemeModel from "@/model/scheme.model";
// Ensure MongoDB connection

export async function GET(request) {
    try {
        connectDB();
        const { searchParams } = new URL(request.url);
        const searchText = searchParams.get("q") || "";
        const categoryFilter = searchParams.get("category") || "";
        const page = parseInt(searchParams.get("page") || "1");

        // Build case-insensitive regex for text search
        const searchRegex = new RegExp(searchText, "i");

        // Construct filter query
        const filter = {};

        // Add category filter if specified
        if (categoryFilter) {
            filter.schemeCategory = categoryFilter;
        }

        // Add text search across multiple fields if search text provided
        if (searchText) {
            filter.$or = [
                { scheme_name: searchRegex },
                { details: searchRegex },
                { benefits: searchRegex },
                { documents: searchRegex },
                { tags: { $in: [searchRegex] } },
            ];
        }

        const totalSchemes = await SchemeModel.countDocuments(filter);

        const schemes = await SchemeModel.find(filter)
            .skip((page - 1) * 10)
            .limit(10)
            .exec();

        return NextResponse.json({
            success: true,
            message: "SUCCESS",
            count: totalSchemes,
            data: schemes,
            currentPage: page,
            totalPages: Math.ceil(totalSchemes / 10),
            isFirstPage: page === 1,
            isLastPage: page === Math.ceil(totalSchemes / 10),
        });
    } catch (error) {
        console.error("Search API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
