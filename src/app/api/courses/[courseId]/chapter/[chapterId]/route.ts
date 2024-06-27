import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

// const mux = new Mux({
//   tokenId: process.env.MUX_TOKEN_ID,
//   tokenSecret: process.env.MUX_TOKEN_SECRET,
// });

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
  api_key: process.env.CLOUDINARY_API_KEY!,
  api_secret: process.env.CLOUDINARY_API_SECRET!,
});

export async function PATCH(
  request: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { courseId, chapterId } = params;
    const { userId } = auth();
    const reqBody = await request.json();

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
    if (!reqBody.videoUrl) {
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
    }

    if (reqBody.videoUrl) {
      try {
        const chapter = await db.chapter.update({
          where: {
            id: chapterId,
            courseId: courseId,
          },
          data: {
            videoUrl: reqBody.videoUrl,
          },
        });
        if (!chapter) {
          return NextResponse.json(
            { message: "chapter updated Failed!" },
            { status: 500 }
          );
        }

        const existingCloudinaryData = await db.cloudinaryData.findFirst({
          where: {
            chapterId: params.chapterId,
          },
        });

        if (existingCloudinaryData) {
          await cloudinary.uploader.destroy(existingCloudinaryData?.publicId!);
          await db.cloudinaryData.delete({
            where: {
              id: existingCloudinaryData.id,
            },
          });
        }

        await db.cloudinaryData.create({
          data: {
            chapterId: params.chapterId,
            assetId: reqBody.assetId,
            publicId: reqBody.publicId,
            playbackUrl: reqBody.playbackUrl,
          },
        });
      } catch (error) {
        return NextResponse.json(
          { message: "Internal server Error" },
          { status: 500 }
        );
      }
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

export async function DELETE(
  request: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const { userId } = auth();
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
        { message: "Unauthenticated user!" },
        { status: 401 }
      );
    }

    const chapter = await db.chapter.findFirst({
      where: {
        id: params.chapterId,
      },
      include: {
        cloudinaryData: {},
      },
    });

    if (chapter?.videoUrl) {
      await cloudinary.uploader.destroy(chapter.cloudinaryData?.assetId || "");
    }

    await db.chapter.delete({
      where: {
        id: params.chapterId,
      },
    });

    const publishedChapterInCourse = await db.chapter.findMany({
      where: {
        courseId: params.courseId,
        isPublished: true,
      },
    });

    if (!publishedChapterInCourse.length) {
      await db.course.update({
        where: {
          id: params.courseId,
        },
        data: {
          isPublished: false,
        },
      });
    }

    return NextResponse.json({ message: "chapter ddeleted!" }, { status: 200 });
  } catch (error) {
    console.log("delete chapter error :", error);
    return NextResponse.json(
      { message: "course not deleted!" },
      { status: 500 }
    );
  }
}
