import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const reqBody = await request.json();
    const { userId } = auth();
    const { title } = reqBody;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthenticated User!" },
        { status: 401 }
      );
    }
    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });
    if (!course) {
      return NextResponse.json(
        { message: "internal server Error!" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Course Created!", data: course },
      { status: 200 }
    );
  } catch (error) {
    console.log("COURSE CREATION ERROR :", error);
    return NextResponse.json(
      { message: "INternal server Error!" },
      { status: 500 }
    );
  }
}
