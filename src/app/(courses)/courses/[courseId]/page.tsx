import React from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";

const page = async ({ params }: { params: { courseId: string } }) => {
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
      isPublished: true,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  if (!course) {
    redirect("/");
  }

  return redirect(
    `/courses/${params.courseId}/chapter/${course.chapters[0].id}`
  );
};

export default page;
