import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  {
    params,
  }: {
    params: { courseId: string };
  }
) {
  try {
    const { userId } = auth();
    const { title } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthenticated User!" },
        { status: 401 }
      );
    }

    const chapter = await db.chapter.create({
      data: {
        title: title,
        courseId: params.courseId,
      },
    });
    console.log(chapter);
    if (!chapter) {
      return NextResponse.json(
        {
          message: "chapter creation error!",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: "chapter Added!" }, { status: 200 });
  } catch (error) {
    console.log("chapter creation error", error);
    return NextResponse.json(
      { message: "Internal server Error!" },
      { status: 500 }
    );
  }
}
