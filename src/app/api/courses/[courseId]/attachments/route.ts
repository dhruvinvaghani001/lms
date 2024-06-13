import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(
  request: Request,
  { params }: { params: { courseId: string } }
) {
  try {
    const reqBody = await request.json();
    const { userId } = auth();
    const { url } = reqBody;

    if (!userId) {
      return NextResponse.json(
        { message: "Unauthenticated User!" },
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
        { message: "Unauthenticated User!" },
        { status: 401 }
      );
    }

    const attachemnts = await db.attachment.create({
      data: {
        url,
        name: url.split("/").pop(),
        courseId: params.courseId,
      },
    });

    if (!attachemnts) {
      return NextResponse.json(
        { message: "Course attachemnts not created!" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "course attachmnets added!" },
      { status: 200 }
    );
  } catch (error) {
    console.log("COURSE Attchemnts ERROR :", error);
    return NextResponse.json(
      { message: "Internal server Error!" },
      { status: 500 }
    );
  }
}
