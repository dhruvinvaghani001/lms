import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID,
  tokenSecret: process.env.MUX_TOKEN_SECRET,
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

    if (reqBody.videoUrl) {
      try {
        const existingMuxdata = await db.muxData.findFirst({
          where: {
            chapterId: params.chapterId,
          },
        });

        if (existingMuxdata) {
          await mux.video.assets.delete(existingMuxdata.assetId);
          await db.muxData.delete({
            where: {
              id: existingMuxdata.id,
            },
          });
        }

        const asset = await mux.video.assets.create({
          input: reqBody.videoUrl,
          playback_policy: ["public"],
          encoding_tier: "baseline",
        });

        await db.muxData.create({
          data: {
            chapterId: params.chapterId,
            assetId: asset.id,
            playbackId: asset.playback_ids?.[0]?.id,
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
