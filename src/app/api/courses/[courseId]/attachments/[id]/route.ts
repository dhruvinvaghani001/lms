import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string; id: string } }
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
        userId: userId,
        id: params.courseId,
      },
    });

    if (!courseOwner) {
      return NextResponse.json(
        { message: "Unauthenticated User" },
        { status: 401 }
      );
    }

    const attachments = await db.attachment.delete({
      where: {
        id: params.id,
        courseId: params.courseId,
      },
    });

    return NextResponse.json(
      { message: "attchmnet deleted!" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Internal server Error!" },
      { status: 500 }
    );
  }
}
