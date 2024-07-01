import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthenticated User" },
        { status: 401 }
      );
    }
    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId,
      },
    });
    if (!courseOwner) {
      return NextResponse.json(
        { message: "Unauthenticated User" },
        { status: 401 }
      );
    }

    const courseunPubish = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: false,
      },
    });
    if (!courseunPubish) {
      return NextResponse.json(
        { message: "Internal server Error" },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Course Unpublished!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Course UnPblish Error!");
    return NextResponse.json(
      { message: "Internal server Error!" },
      { status: 500 }
    );
  }
}
