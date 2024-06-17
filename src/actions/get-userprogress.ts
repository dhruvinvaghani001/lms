import { db } from "@/lib/db";

export async function getUserProgress({
  courseId,
  userId,
}: {
  courseId: string;
  userId: string;
}) {
  try {
    const publishedChapters = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      },
      select: {
        id: true,
      },
    });

    const publishedChaptersIds = publishedChapters.map((chapter) => chapter.id);

    const completedChaptersCount = await db.userProgress.count({
      where: {
        userId: userId,
        chapterId: {
          in: publishedChaptersIds,
        },
        isCompleted: true,
      },
    });

    const progressPercentage =
      (completedChaptersCount / publishedChaptersIds.length) * 100;
    return progressPercentage;
  } catch (error) {
    console.log("get userprogress error!", error);
    return null;
  }
}
