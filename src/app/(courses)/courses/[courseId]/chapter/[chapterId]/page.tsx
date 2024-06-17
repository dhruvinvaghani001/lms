import getChapter from "@/actions/get-chapter";
import Banner from "@/components/Banner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import VideoPlayer from "./_components/VideoPlayer";
import { Button } from "@/components/ui/button";
import { CheckCircle, PlusCircle } from "lucide-react";
import formatPrice from "@/lib/formatPrice";
import Preview from "@/app/(dashboard)/(routes)/teacher/courses/[courseId]/chapter/[chapterId]/_components/Preview";

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
  console.log("hello");
  console.log(attchmensts);
  return (
    <div className="pb-16 px-4">
      {userProgrss?.isCompleted && (
        <Banner variant="success" label="you alredy completed this chapter" />
      )}
      {isLocked && (
        <Banner
          variant="warning"
          label="you need to purchase this course to watch it!"
        />
      )}
      <div className="max-w-4xl mx-auto py-10 px-4 md:px-0 md:max-w-3xl">
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
        <div className="flex items-center justify-between mt-4">
          {purchase ? (
            <>
              <p className="text-xl font-bold ">{chapter?.title}</p>
              <Button variant="default" className="flex items-center gap-2">
                <CheckCircle />
                Mark as completed
              </Button>
            </>
          ) : (
            <>
              <p className="text-xl font-bold ">{chapter?.title}</p>
              <Button variant="default">
                Enroll For {formatPrice(course?.price || 0)}
              </Button>
            </>
          )}
        </div>
        <div className="mt-10">
          <p className="text-lg mb-4 font-semibold">Description</p>
          <Preview value={chapter?.description || ""} />
        </div>
        <div>
          {!!attchmensts?.length && (
            <>
              <p className="text-lg  font-semibold">Course Attachments</p>
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
