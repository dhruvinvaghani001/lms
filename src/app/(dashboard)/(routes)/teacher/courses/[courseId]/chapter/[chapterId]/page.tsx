import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { LayoutDashboard, Lock, MoveLeft, Video } from "lucide-react";
import { redirect } from "next/navigation";
import React from "react";
import TitleForm from "./_components/TitleForm";
import DescriptionForm from "./_components/DescriptionForm";
import IsFreeForm from "./_components/IsFreeForm";
import ChapterVideoForm from "./_components/ChapterVideoForm";
import Banner from "@/components/Banner";
import { Button } from "@/components/ui/button";
import ChapterAction from "./_components/ChapterAction";
import Link from "next/link";
import { PageNavigation } from "./_components/BreadCrumb";

const Chapterpage = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const course = await db.course.findUnique({
    where: {
      id: params.courseId,
    },
    select: {
      title: true,
    },
  });

  const chapter = await db.chapter.findUnique({
    where: {
      id: params.chapterId,
      courseId: params.courseId,
    },
    include: {
      cloudinaryData: true,
    },
  });

  if (!chapter) {
    redirect(`/teacher/courses`);
  }

  console.log(chapter);

  const requiredFields = [chapter.title, chapter.description, chapter.videoUrl];
  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter((item) => item !== null).length;

  const isComplete = requiredFields.every(Boolean);

  return (
    <div className="mb-10">
      {!chapter.isPublished && (
        <Banner label="This chapter is not published" variant="warning" />
      )}
      <div className="container mt-28">
        <div>
          <Button variant="ghost">
            <Link
              href={`/teacher/courses/${params.courseId}`}
              className="flex gap-4 items-center justify-normal
                                "
            >
              <MoveLeft></MoveLeft> Back to course setup{" "}
            </Link>
          </Button>
          <div className="mt-4">
            <PageNavigation
              courseId={params.courseId}
              courseName={course?.title!}
              chapterName={chapter.title}
            />
          </div>
        </div>
        <div className="course__title flex flex-col items-start gap-4 md:gap-0 md:flex-row md:items-center justify-between mt-4">
          <div>
            <h1 className="text-2xl font-bold">Chapter Setup</h1>
            <p className="text-base font-semibold mt-1">
              complete all fields{" "}
              <span>{`(${completedFields}/${totalFields})`}</span>
            </p>
          </div>
          <ChapterAction
            disabled={!isComplete}
            courseId={params.courseId}
            chapterId={params.chapterId}
            isPublished={chapter.isPublished}
          />
        </div>
        <div className="updated mt-10">
          <div className="gap-2 md:grid md:grid-cols-2 md:gap-6">
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-card-foreground rounded-full">
                  <LayoutDashboard className="text-card" />
                </div>
                <h2 className="text-xl">Customize Chapter</h2>
              </div>
              <div className="flex gap-8 flex-col">
                <TitleForm
                  chapterId={params.chapterId}
                  courseId={params.courseId}
                  title={chapter?.title}
                />
                <DescriptionForm
                  chapterId={params.chapterId}
                  courseId={params.courseId}
                  description={chapter?.description}
                />
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-card-foreground rounded-full">
                    <Lock className="text-card" />
                  </div>
                  <h2 className="text-xl">Chapter Access</h2>
                </div>
                <IsFreeForm
                  chapterId={params.chapterId}
                  courseId={params.courseId}
                  isFree={chapter?.isFree}
                />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-8">
                <div className="p-2 bg-card-foreground rounded-full">
                  <Video className="text-card" />
                </div>
                <h2 className="text-xl">Chapter Video</h2>
              </div>
              <div className="flex gap-8 flex-col">
                <ChapterVideoForm
                  courseId={params.courseId}
                  chapterId={params.chapterId}
                  videoUrl={chapter.videoUrl}
                  cloudinrayData={chapter?.cloudinaryData || null}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chapterpage;
