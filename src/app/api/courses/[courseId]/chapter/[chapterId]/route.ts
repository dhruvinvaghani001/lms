import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { courseId, chapterId } = params;
    const { userId } = auth();
    const reqBody = await request.json();
    console.log("hellko");
    if (!userId) {
      return NextResponse.json(
        { message: "Unauhenticated User!" },
        { status: 401 }
      );
    }
    const courseOwner = await db.course.findUnique({
      where: {
        userId: userId,
        id: params.courseId,
      },
    });

    if (!courseOwner) {
      return NextResponse.json(
        { message: "Unauthenticated user!" },
        { status: 401 }
      );
    }

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
        courseId: courseId,
      },
      data: reqBody,
    });

    if (!chapter) {
      return NextResponse.json(
        { message: "chapter updated Failed!" },
        { status: 500 }
      );
    }
    return NextResponse.json({ message: "chapter updated!" }, { status: 200 });
  } catch (error) {
    console.log(":error", error);
    console.log("chapter update Error!");
    return NextResponse.json(
      { message: "Internal server Error!" },
      { status: 500 }
    );
  }
}
