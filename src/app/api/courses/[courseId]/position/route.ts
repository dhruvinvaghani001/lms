import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Chapter } from "@prisma/client";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const { userId } = auth();
    const { chapters } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthenticated User!" },
        { status: 401 }
      );
    }

    const courseOwner = await db.course.findUnique({
      where: {
        id: params.courseId,
        userId: userId,
      },
    });

    if (!courseOwner) {
      return NextResponse.json(
        { message: "Unauthenticated User!" },
        { status: 401 }
      );
    }

    chapters.forEach(async (chapter: Chapter, index: number) => {
      const updatedChapter = await db.chapter.update({
        where: {
          id: chapter.id,
        },
        data: {
          position: index + 1,
        },
      });
    });

    return NextResponse.json(
      { message: "Reorderd chapters!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("Reorder ERROR", error);
    return NextResponse.json(
      { message: "Internal Server Error!" },
      { status: 500 }
    );
  }
}
