import { db } from '@/lib/db';
import { auth } from '@clerk/nextjs/server';
import { LayoutDashboard, MoveLeft } from 'lucide-react'
import { redirect } from 'next/navigation';
import React from 'react'
import TitleForm from './_components/TitleForm';
import DescriptionForm from './_components/DescriptionForm';
import IsFreeForm from './_components/IsFreeForm';
import ChapterVideoForm from './_components/ChapterVideoForm';
import Banner from '@/components/Banner';
import { Button } from '@/components/ui/button';
import ChapterAction from './_components/ChapterAction';
import Link from 'next/link';



const Chapterpage = async ({ params }: { params: { courseId: string, chapterId: string } }) => {

    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }

    const chapter = await db.chapter.findUnique({
        where: {
            id: params.chapterId,
            courseId: params.courseId,
        },
        include: {
            muxData: {


            }
        }
    })


    if (!chapter) {
        redirect(`/teacher/courses`);
    }

    console.log(chapter);

    const requiredFields = [
        chapter.title,
        chapter.description,
        chapter.videoUrl,
    ]
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter((item) => item !== null).length;

    const isComplete = requiredFields.every(Boolean);


    return (
        <div className='mb-10'>
            {!chapter.isPublished && <Banner label="This chapter is not published" variant="warning" />}
            <div className="container mt-28">
                <div className="course__title flex items-center justify-between">
                    <div>
                        <div>
                            <Button variant="ghost">
                                <Link href={`/teacher/courses/${params.courseId}`} className='flex gap-4 items-center justify-normal
                                '> <MoveLeft></MoveLeft> Back to course setup </Link>
                            </Button>

                        </div>
                        <h1 className='text-2xl font-bold mt-10'>Chapter Setup</h1>
                        <p className="text-base font-semibold mt-1">complete all fields <span>{`(${completedFields}/${totalFields})`}</span></p>
                    </div>
                    <ChapterAction disabled={!isComplete} courseId={params.courseId} chapterId={params.chapterId} isPublished={chapter.isPublished} />
                </div>
                <div className="updated mt-8">

                    <div className='gap-2 md:grid md:grid-cols-2 md:gap-6'>
                        <div>
                            <div className="flex items-center gap-2 mb-8">
                                <LayoutDashboard />
                                <h2 className='text-xl'>Customize your Chapter</h2>
                            </div>
                            <div className='flex gap-8 flex-col'>
                                <TitleForm chapterId={params.chapterId} courseId={params.courseId} title={chapter?.title} />
                                <DescriptionForm chapterId={params.chapterId} courseId={params.courseId} description={chapter?.description} />
                                <IsFreeForm chapterId={params.chapterId} courseId={params.courseId} isFree={chapter?.isFree} />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-8">
                                <LayoutDashboard />
                                <h2 className='text-xl'>Customize your Course</h2>
                            </div>
                            <div className='flex gap-8 flex-col'>
                                <ChapterVideoForm courseId={params.courseId} chapterId={params.chapterId} videoUrl={chapter.videoUrl} muxData={chapter.muxData || null} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Chapterpage