import { NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/model/user.model";

export async function GET(request, { params }) {
    try {
        connectDB();
        const { userID } = await params;
        const user = await User.findById(userID);
        if (!user) {
            return NextResponse.json(
                {
                    success: false,
                    status: "USER_NOT_FOUND",
                    message: "User not found",
                },
                {
                    status: 404,
                }
            );
        }
        return NextResponse.json({
            success: true,
            status: "SUCCESS",
            message: "User fetched successfully",
            user: {
                _id: user._id,
                phone: user.phone,
                profileComplete: user.profileComplete,
            },
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                status: "UNEXPECTED_ERROR",
                message: "Error fetching user",
            },
            {
                status: 500,
            }
        );
    }
}
