import connectDB from "@/lib/dbConnect";
import { NextResponse } from "next/server";
import SchemeModel from "@/model/scheme.model";

// GET /api/schemes
// Query params:
//   id: exact scheme_id to fetch single scheme
//   q: text search
//   category: category filter
//   page: pagination (default 1)
//   sort: field to sort by (default scheme_id)
//   order: asc|desc (default asc)
export async function GET(request) {
    try {
        await connectDB();
        const { searchParams } = new URL(request.url);
        const id = searchParams.get("id");
        const searchText = searchParams.get("q") || "";
        const categoryFilter = searchParams.get("category") || "";
        const page = parseInt(searchParams.get("page") || "1", 10);
        const sortField = searchParams.get("sort") || "scheme_id";
        const sortOrder =
            (searchParams.get("order") || "asc").toLowerCase() === "desc"
                ? -1
                : 1;

        // If single id param present, return single scheme (ignore other filters)
        if (id) {
            const scheme = await SchemeModel.findOne({ scheme_id: id }).lean();
            if (!scheme) {
                return NextResponse.json(
                    { success: false, message: "Scheme not found" },
                    { status: 404 }
                );
            }
            return NextResponse.json({ success: true, scheme });
        }

        const filter = {};

        if (categoryFilter) {
            // schemeCategory is an array; match if provided category is in array
            filter.schemeCategory = { $in: [categoryFilter] };
        }

        if (searchText) {
            const searchRegex = new RegExp(searchText, "i");
            filter.$or = [
                { scheme_name: searchRegex },
                { details: searchRegex },
                { benefits: searchRegex },
                { documents: searchRegex },
                { tags: { $in: [searchRegex] } },
            ];
        }

        const PAGE_SIZE = 10;
        const totalSchemes = await SchemeModel.countDocuments(filter);
        const schemes = await SchemeModel.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip((page - 1) * PAGE_SIZE)
            .limit(PAGE_SIZE)
            .lean();

        return NextResponse.json({
            success: true,
            message: "SUCCESS",
            count: totalSchemes,
            data: schemes,
            currentPage: page,
            totalPages: Math.ceil(totalSchemes / PAGE_SIZE),
            isFirstPage: page === 1,
            isLastPage: page === Math.ceil(totalSchemes / PAGE_SIZE),
        });
    } catch (error) {
        console.error("Schemes API Error:", error);
        return NextResponse.json(
            { success: false, error: error.message },
            { status: 500 }
        );
    }
}
