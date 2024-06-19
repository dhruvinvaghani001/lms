import getChapter from "@/actions/get-chapter";
import Banner from "@/components/Banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import VideoPlayer from "./_components/VideoPlayer";
import Preview from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapter/[chapterId]/_components/Preview";
import EnrollButton from "./_components/EnrollButton";
import CourseProgressButton from "./_components/CourseProgressButton";

const page = async ({
  params,
}: {
  params: { courseId: string; chapterId: string };
}) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }

  const {
    chapter,
    course,
    muxData,
    attchmensts,
    nextChapter,
    userProgrss,
    purchase,
  } = await getChapter({
    courseId: params.courseId,
    chapterId: params.chapterId,
    userId,
  });

  const isLocked = !chapter?.isFree && !purchase;
  const completeOnEnd = !!purchase && !userProgrss?.isCompleted;

  return (
    <div className="pb-16">
      {userProgrss?.isCompleted && (
        <Banner variant="success" label="you alredy completed this chapter" />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="you need to purchase this course to watch it!"
        />
      )}
      <div className="max-w-4xl mx-auto py-10 px-4 lg:px-0 md:max-w-3xl">
        <div className="">
          <VideoPlayer
            isLocked={isLocked}
            playbackId={muxData?.playbackId}
            courseId={params.courseId}
            chapterId={params.chapterId}
            nextChapterId={nextChapter?.id}
            completeOnEnd={completeOnEnd}
            title={chapter?.title}
          />
        </div>
        <div className="flex flex-col md:flex-row items-start space-y-4  md:items-center justify-between mt-4 ">
          <p className="text-xl font-bold ">{chapter?.title}</p>
          {purchase && (
            <CourseProgressButton
              courseId={params.courseId}
              chapterId={params.chapterId}
              isCompleted={!!userProgrss?.isCompleted}
              nextChapterId={nextChapter?.id}
            />
          )}
          {!purchase && course?.price && (
            <EnrollButton price={course?.price} courseId={params.courseId} />
          )}
        </div>
        <div className="mt-10">
          <p className="text-lg  font-semibold">Description</p>
          <Preview value={chapter?.description || ""} />
        </div>
        <div>
          {!!attchmensts?.length && (
            <>
              <p className="text-lg font-semibold">Course Attachments</p>
              <p className="mb-4">
                click below links to open a attchments in new tab
              </p>
              {attchmensts?.map((attachment) => (
                <a
                  href={attachment.url}
                  target="_blank"
                  key={attachment.id}
                  className="text-sky-600"
                >
                  <p> {attachment.name}</p>
                </a>
              ))}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
