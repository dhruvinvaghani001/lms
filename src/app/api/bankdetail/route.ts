import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthnticated user" },
        { status: 401 }
      );
    }

    const reqBody = await request.json();

    const bank = await db.bankDetail.create({
      data: { userId, ...reqBody },
    });
    if (!bank) {
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "contact details saved!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("contact deatils store error", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthnticated user" },
        { status: 401 }
      );
    }

    const reqBody = await request.json();

    const updateBank = await db.bankDetail.update({
      where: {
        userId: userId,
      },
      data: reqBody,
    });
    if (!updateBank) {
      return NextResponse.json(
        { message: "Internal server error" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "contact details saved!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("contact deatils store error", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
