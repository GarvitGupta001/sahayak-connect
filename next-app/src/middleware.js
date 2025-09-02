import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

export async function middleware(request) {
    try {
        const token =
            request.cookies.get("token")?.value ||
            request.headers.get("Authorization")?.split(" ")[1];

        if (!token) {
            return NextResponse.json(
                {
                    success: false,
                    status: "UNAUTHORISED",
                    message: "Token Not Found",
                },
                {
                    status: 401,
                }
            );
        }

        const secret = new TextEncoder().encode(process.env.JWT_SECRET);
        const { payload: decoded } = await jwtVerify(token, secret);

        const headers = new Headers(request.headers);
        headers.set("user", JSON.stringify(decoded));

        return NextResponse.next({
            request: {
                headers: headers,
            },
        });
    } catch (error) {
        console.log(error);
        return NextResponse.json(
            {
                success: false,
                status: "UNAUTHORISED",
                message: "Invalid Token",
            },
            {
                status: 401,
            }
        );
    }
}

export const config = {
    matcher: "/api/user-details/:path*",
};
