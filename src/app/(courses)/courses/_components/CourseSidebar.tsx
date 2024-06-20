import { logo } from "@/assets";
import {
  BarChartHorizontal,
  BookDashed,
  Compass,
  List,
  PanelsLeftBottom,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import ChapterIteam from "./ChapterIteam";
import UserProgressBar from "@/components/UserProgressBar";

interface CourseSidebar {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progress: number | null;
}

const CourseSidebar = async ({ course, progress }: CourseSidebar) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const purchase = await db.purchase.findUnique({
    where: {
      userId_courseId: {
        userId,
        courseId: course.id,
      },
    },
  });

  return (
    <div className="w-56 h-screen border-r overflow-y-auto shadow-sm scrollbar-thin">
      <div className="flex flex-col justify-center items-start py-4">
        <div className="logo flex justify-start px-4">
          <Image src={logo} width={140} alt="logo" />
        </div>
        <div className="logo flex flex-col justify-start px-4 mt-10 text-xl font-semibold">
          {course.title}
        </div>
        {purchase && <UserProgressBar value={22} />}
        <div className="flex flex-col justify-start items-start w-full mt-8 pb-10">
          {course.chapters.map((chapter) => {
            return (
              <ChapterIteam
                key={chapter.id}
                id={chapter.id}
                label={chapter.title}
                isCompleted={!!chapter.userProgress?.[0]?.isCompleted}
                courseId={course.id}
                isLocked={!chapter.isFree && !purchase}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CourseSidebar;
