import { db } from "@/lib/db";
import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import {
  Atom,
  BadgeDollarSign,
  Clapperboard,
  Folders,
  Layers,
  LayoutDashboard,
  MoveLeft,
} from "lucide-react";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import ImageForm from "./_components/ImageForm";
import CategoryForm from "./_components/CategoryForm";
import PriceForm from "./_components/PriceForm";
import AttchmentForm from "./_components/AttachmentForm";
import ChapterForm from "./_components/ChapterForm";
import CourseAction from "./_components/CourseAction";
import { Course } from "@prisma/client";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { PageNavigation } from "./_components/BreadCrumb";

const page = async ({ params }: { params: { courseId: string } }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    include: {
      attachmenst: {
        orderBy: {
          createdAt: "desc",
        },
      },
      chapters: {
        orderBy: {
          position: "asc",
        },
      },
    },
  });

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  if (!course || course.userId != userId) {
    redirect("/");
  }

  const requiredFields = [
    course.title,
    course.description,
    course.categoryId,
    course.imageUrl,
    course.price,
  ];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter((item) => item !== null).length;

  const isCompleted = requiredFields.every(Boolean);

  console.log(completedFields);

  return (
    <div className="">
      <div className="container mt-28">
        <div>
          <Button variant="ghost">
            <Link
              href="/teacher/courses/"
              className="flex gap-4 items-center justify-normal
                                "
            >
              <MoveLeft></MoveLeft> Back to courses page{" "}
            </Link>
          </Button>
          <div className="mt-4">
            <PageNavigation courseName={course.title} />
          </div>
        </div>
        <div className="course__title">
          <div className="flex flex-col items-start md:flex-row md:items-center justify-between gap-4 md:gap-0">
            <div>
              <h1 className="text-2xl font-bold mt-8">Course Setup</h1>
              <p className="text-base font-semibold mt-1">
                complete all fields{" "}
                <span>{`(${completedFields}/${totalFields})`}</span>
              </p>
            </div>

            <CourseAction
              disabled={!isCompleted}
              isPublished={course.isPublished || false}
              courseId={params.courseId}
            />
          </div>
        </div>
        <div className="updated mt-8">
          <div className="flex flex-col gap-8 xl:grid xl:grid-cols-2 xl:gap-6">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-card-foreground rounded-full">
                  <LayoutDashboard className="text-card" />
                </div>
                <h2 className="text-xl">Customize your Course</h2>
              </div>
              <div className="flex gap-8 flex-col ">
                <TitleForm title={course.title} courseId={course.id} />
                <DescriptionForm
                  description={course.description}
                  courseId={course.id}
                />
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-card-foreground rounded-full">
                    <Clapperboard className="text-card" />
                  </div>
                  <h2 className="text-xl">Course Image</h2>
                </div>
                <ImageForm imageUrl={course.imageUrl} courseId={course.id} />
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-card-foreground rounded-full">
                    <Atom className="text-card" />
                  </div>
                  <h2 className="text-xl">Course Category</h2>
                </div>
                <CategoryForm
                  courseId={course.id}
                  options={categories.map((category) => {
                    return { label: category.name, value: category.id };
                  })}
                  categoryId={course?.categoryId}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-card-foreground rounded-full">
                  <Layers className="text-card" />
                </div>
                <h2 className="text-xl">Course Chapters</h2>
              </div>
              <div className="flex gap-8 flex-col">
                <ChapterForm chapters={course.chapters} courseId={course.id} />
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-card-foreground rounded-full">
                    <BadgeDollarSign className="text-card" />
                  </div>
                  <h2 className="text-xl">Selling Price</h2>
                </div>
                <PriceForm courseId={course.id} price={course.price} />
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-card-foreground rounded-full">
                    <Folders className="text-card" />
                  </div>
                  <h2 className="text-xl">Course Attchments</h2>
                </div>
                <AttchmentForm
                  courseId={course.id}
                  attachments={course.attachmenst}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
