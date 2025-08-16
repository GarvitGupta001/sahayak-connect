import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/model/user.model";
import {
    personalDetailsSchema,
    demographicsSchema,
    educationSchema,
    incomeSchema,
    locationSchema,
} from "@/schemas/userInfoSchema";
import { z } from "zod";

export async function POST(request) {
    try {
        const { personalDetails, demographics, education, income, location } =
            await request.json();
        const personalDetailsResult =
            personalDetailsSchema.safeParse(personalDetails);
        const demographicsResult = demographicsSchema.safeParse(demographics);
        const educationResult = educationSchema.safeParse(education);
        const incomeResult = incomeSchema.safeParse(income);
        const locationResult = locationSchema.safeParse(location);
        if (
            !personalDetailsResult.success ||
            !demographicsResult.success ||
            !educationResult.success ||
            !incomeResult.success ||
            !locationResult.success
        ) {
            console.log(personalDetailsResult.error);
            console.log(demographicsResult.error);
            console.log(educationResult.error);
            console.log(incomeResult.error);
            console.log(locationResult.error);
        }
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
