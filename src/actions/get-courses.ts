import { db } from "@/lib/db";
import { getUserProgress } from "./get-userprogress";

export async function getCourses({
  userId,
  categoryId,
  title,
}: {
  userId: string;
  categoryId: string;
  title: string;
}) {
  try {
    const courses = await db.course.findMany({
      where: {
        categoryId: categoryId,
        title: {
          contains: title,
        },
        isPublished: true,
      },
      include: {
        category: true,
        chapters: {
          where: {
            isPublished: true,
          },
          select: {
            id: true,
          },
        },
        purchase: {
          where: {
            userId: userId,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });
    const courseWithUserProgress = await Promise.all(
      courses.map(async (course) => {
        if (course.purchase.length === 0) {
          return { ...course, progress: null };
        }
        const progressPercentage = await getUserProgress({
          userId: userId,
          courseId: course.id,
        });
        return { ...course, progress: progressPercentage };
      })
    );

    return courseWithUserProgress;
  } catch (error) {
    console.log("Get courses Error:", error);
    return [];
  }
}
