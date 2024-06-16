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

export async function DELETE(
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

    await db.course.delete({
      where: {
        id: params.courseId,
      },
    });

    return NextResponse.json({ message: "course deleted!" }, { status: 200 });
  } catch (error) {
    console.log("course delete!", error);
    return NextResponse.json(
      { message: "course deleted error!" },
      { status: 500 }
    );
  }
}
