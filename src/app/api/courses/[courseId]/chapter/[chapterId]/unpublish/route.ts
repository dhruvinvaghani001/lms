import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return NextResponse.json(
        { message: "Unauthneticated User" },
        { status: 401 }
      );
    }
    const courseOwner = await db.course.findUnique({
      where: {
        userId,
        id: params.courseId,
      },
    });

    if (!courseOwner) {
      return NextResponse.json(
        { message: "Unautheticated User!" },
        { status: 403 }
      );
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: params.chapterId,
      },
    });
    const cloudinarayData = await db.cloudinaryData.findUnique({
      where: {
        chapterId: params.chapterId,
      },
    });

    const updatedChapter = await db.chapter.update({
      where: {
        id: params.chapterId,
        courseId: params.courseId,
      },
      data: {
        isPublished: false,
      },
    });

    if (!updatedChapter) {
      return NextResponse.json(
        { message: "Internal server Error!" },
        { status: 500 }
      );
    }

    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    console.log("published chapters");
    console.log(publishedChapters);

    if (publishedChapters.length === 0) {
      await db.course.update({
        where: {
          userId,
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
      return NextResponse.json(
        {
          message:
            "Chapter Unpublished due to not any published Chapter Course also UnPublished",
        },
        { status: 200 }
      );
    }

    return NextResponse.json(
      { message: "chapter Published!" },
      { status: 200 }
    );
  } catch (error: any) {
    console.log("Error in publishing chapter !", error);
    return NextResponse.json(
      { message: "Internal server Error!" },
      { status: 500 }
    );
  }
}
