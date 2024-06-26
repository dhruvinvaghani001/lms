import { db } from "@/lib/db";
import { Attachment, Chapter } from "@prisma/client";

interface GetChapterProps {
  userId: string;
  courseId: string;
  chapterId: string;
}

export default async function getChapter({
  userId,
  courseId,
  chapterId,
}: GetChapterProps) {
  try {
    const purchase = await db.purchase.findUnique({
      where: {
        userId_courseId: {
          userId,
          courseId,
        },
      },
    });

    const course = await db.course.findUnique({
      where: {
        isPublished: true,
        id: courseId,
      },
      select: {
        price: true,
      },
    });

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        isPublished: true,
      },
    });

    if (!chapter || !course) {
      throw new Error("courses not found !");
    }

    let muxData = null;
    let attchmensts: Attachment[] = [];
    let nextChapter: Chapter | null = null;

    if (purchase) {
      attchmensts = await db.attachment.findMany({
        where: {
          courseId: courseId,
        },
      });
    }

    if (chapter.isFree || purchase) {
      muxData = await db.muxData.findUnique({
        where: {
          chapterId: chapterId,
        },
      });
      nextChapter = await db.chapter.findFirst({
        where: {
          courseId: courseId,
          isPublished: true,
          position: {
            gt: chapter?.position!,
          },
        },
        orderBy: {
          position: "asc",
        },
      });
    }

    const userProgress = await db.userProgress.findUnique({
      where: {
        userId_chapterId: {
          userId,
          chapterId,
        },
      },
    });
    return {
      chapter: chapter,
      course: course,
      muxData: muxData,
      attchmensts: attchmensts,
      nextChapter: nextChapter,
      userProgrss: userProgress,
      purchase: purchase,
    };
  } catch (error) {
    console.log("get chapter error", error);
    return {
      chapter: null,
      muxData: null,
      attchmnets: null,
      nextChapter: null,
      userProgress: null,
      purchase: null,
    };
  }
}
