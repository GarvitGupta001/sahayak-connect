import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/model/user.model";
import UserInfo from "@/model/userInfo.model";

export async function POST(request, { params }) {
    try {
        connectDB();
        const { userID } = await params;
        const { personalDetails, demographics, education, income, location } =
            await request.json();
        console.log(personalDetails, demographics, education, income, location);
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
        if (user.profileComplete) {
            return NextResponse.json(
                {
                    success: false,
                    status: "PROFILE_ALREADY_COMPLETE",
                    message: "Profile already complete",
                },
                {
                    status: 400,
                }
            );
        }
        const userInfo = new UserInfo({
            userID: userID,
            name: personalDetails.name,
            email: personalDetails.email,
            age: personalDetails.age,
            gender: personalDetails.gender,
            preferredLanguage: personalDetails.preferredLanguage,
            demographics: demographics,
            education: education,
            income: income,
            location: location,
        });
        await userInfo.save();
        user.profileComplete = true;
        await user.save();
        return NextResponse.json(
            {
                success: true,
                status: "SUCCESS",
                message: "User info saved successfully",
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                status: "UNEXPECTED_ERROR",
                message: "Error saving use info",
            },
            {
                status: 500,
            }
        );
    }
}

export async function GET(request, { params }) {
    try {
        const { userID } = await params;
        connectDB();
        const userInfo = await UserInfo.findOne({ userID: userID });
        if (!userInfo) {
            return NextResponse.json(
                {
                    success: false,
                    status: "USER_INFO_NOT_FOUND",
                    message: "User info not found",
                },
                {
                    status: 404,
                }
            );
        }
        const personalDetails = {
            name: userInfo.name,
            email: userInfo.email,
            age: userInfo.age,
            gender: userInfo.gender,
            preferredLanguage: userInfo.preferredLanguage,
        };
        return NextResponse.json(
            {
                success: true,
                status: "SUCCESS",
                message: "User info fetched successfully",
                personalDetails: personalDetails,
                demographics: userInfo.demographics,
                education: userInfo.education,
                income: userInfo.income,
                location: userInfo.location,
            },
            {
                status: 200,
            }
        );
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                status: "UNEXPECTED_ERROR",
                message: "Error saving use info",
            },
            {
                status: 500,
            }
        );
    }
}
