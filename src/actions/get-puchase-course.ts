import { getUserProgress } from "./get-userprogress";
import { db } from "@/lib/db";

export const getPurchaseCourses = async ({ userId }: { userId: string }) => {
  try {
    const purchaseCourses = await db.purchase.findMany({
      where: {
        userId: userId,
      },
      include: {
        course: {
          include: {
            chapters: {
              select: {
                id: true,
              },
            },
            category: true,
          },
        },
      },
    });
    const purchasecourses = purchaseCourses.map((pc) => {
      return pc.course;
    });
    const items = await Promise.all(
      purchasecourses.map(async (pc) => {
        const progress = await getUserProgress({
          courseId: pc.id,
          userId: userId,
        });
        return { ...pc, progress: progress };
      })
    );
    return items;
  } catch (error) {
    console.log("get purchse course error", error);
    return [];
  }
};
