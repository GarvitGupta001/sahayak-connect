import { NextRequest, NextResponse } from "next/server";
import connectDB from "@/lib/dbConnect";
import User from "@/model/user.model";
import { signInSchema } from "@/schemas/signInSchema";
import jwt from "jsonwebtoken";
import { z } from "zod";

export async function POST(request: NextRequest) {
  const { phone, password } = await request.json();
  const result = signInSchema.safeParse({ phone, password });

  if (!result.success) {
    const errors = {
      phone: z.treeifyError(result.error).properties?.phone?.errors[0] || "",
      password:
        z.treeifyError(result.error).properties?.password?.errors[0] || "",
    };

    return NextResponse.json(
      {
        success: false,
        message: "INVALID_CREDENTIALS",
        error: errors,
      },
      {
        status: 400,
      }
    );
  }

  try {
    connectDB();
    const user = await User.findOne({ phone: phone });
    if (!user) {
      const user = new User({
        phone: phone,
        password: password,
      });
      await user.save();
      const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || "");
      return NextResponse.json(
        {
          success: true,
          message: "USER_CREATED",
          token: token,
          user: {
            phone: user.phone,
            profileComplete: user.profileComplete,
          },
        },
        {
          status: 201,
        }
      );
    } else {
      if (await user.comparePassword(password)) {
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET || "");
        return NextResponse.json(
          {
            success: true,
            message: "USER_LOGGED_IN",
            token: token,
            user: {
              phone: user.phone,
              profileComplete: user.profileComplete,
            },
          },
          {
            status: 200,
          }
        );
      }
      return NextResponse.json(
        {
          success: false,
          message: "INVALID_CREDENTIALS",
          error: {
            phone: "Invalid phone number or password",
            password: "Invalid phone number or password",
          },
        },
        {
          status: 401,
        }
      );
    }
  } catch (error) {
    console.log("Error signing in", error);
    return NextResponse.json(
      {
        success: false,
        message: "UNEXPECTED_ERROR",
        error: error,
      },
      {
        status: 500,
      }
    );
  }
}
