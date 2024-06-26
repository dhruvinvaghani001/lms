import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthenticated User" },
        { status: 401 }
      );
    }
    const reqBody = await request.json();
    const payoutRequest = await db.payoutRequest.create({
      data: {
        amount: reqBody.amount,
        userId: userId,
        status: "Pending",
      },
    });
    if (!payoutRequest) {
      return NextResponse.json(
        { message: "internal server error!" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Payout request send to admin!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("payout requets error", error);
    return NextResponse.json(
      { message: "internal server errror!" },
      { status: 500 }
    );
  }
}
