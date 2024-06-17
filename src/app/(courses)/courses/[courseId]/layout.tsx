import React from "react";
import NavBar from "../../../(dashboard)/_components/NavBar";
import SideBar from "../../../(dashboard)/_components/SideBar";
import CourseSidebar from "../_components/CourseSidebar";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { getUserProgress } from "@/actions/get-userprogress";
import CourseNavBar from "../_components/CourseNavbar";
import CourseNavbar from "../_components/CourseNavbar";
interface CourseLayoutProps {
  children: React.ReactNode;
  params: { courseId: string };
}

const CourseLayout = async ({ children, params }: CourseLayoutProps) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      chapters: {
        where: {
          isPublished: true,
        },
        include: {
          userProgress: {
            where: {
              userId,
            },
          },
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

  const userProgressPercentage = await getUserProgress({
    courseId: params.courseId,
    userId,
  });

  return (
    <main className="h-full md:flex">
      <section className="hidden h-full  md:flex fixed">
        <CourseSidebar course={course} progress={userProgressPercentage} />
      </section>
      <section className="w-full md:w-[calc(100%_-_224px)] md:ml-56">
        <div className="h-[80px] fixed inset-y-0  w-full  md:w-[calc(100%_-_224px)] z-50">
          <CourseNavbar course={course} progress={userProgressPercentage} />
        </div>
        <main className="mt-[80px] h-[calc(100%_-_80px)]">{children}</main>
      </section>
    </main>
  );
};

export default CourseLayout;
