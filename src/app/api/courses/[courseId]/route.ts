import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { courseId } = params;
    const reqBody = await request.json();
    const { title } = reqBody;

    if (!userId) {
      return NextResponse.json(
        { message: " Unauthorised user" },
        { status: 401 }
      );
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId: userId,
      },
      data: reqBody,
    });
    if (!course) {
      return NextResponse.json(
        { message: "course update error!" },
        { status: 500 }
      );
    }

    if (course.userId !== userId) {
      return NextResponse.json(
        { message: " Unauthorised user" },
        { status: 401 }
      );
    }

    return NextResponse.json({ message: "course update" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server Error!" },
      { status: 500 }
    );
  }
}
