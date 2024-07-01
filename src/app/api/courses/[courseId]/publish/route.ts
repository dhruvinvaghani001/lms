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

    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (
      !courseOwner.description ||
      !courseOwner.imageUrl ||
      !courseOwner.title ||
      !courseOwner.price ||
      publishedChapters.length === 0
    ) {
      return NextResponse.json(
        { message: "All fields are required!" },
        { status: 500 }
      );
    }
    const coursePubish = await db.course.update({
      where: {
        id: params.courseId,
        userId,
      },
      data: {
        isPublished: true,
      },
    });
    if (!coursePubish) {
      return NextResponse.json(
        { message: "Internal server Error" },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "Course Published!" }, { status: 200 });
  } catch (error) {
    console.log("Course PUblish Error!");
    return NextResponse.json(
      { message: "Internal server Error!" },
      { status: 500 }
    );
  }
}
