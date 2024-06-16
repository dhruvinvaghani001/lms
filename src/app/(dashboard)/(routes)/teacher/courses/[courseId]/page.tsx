import { db } from '@/lib/db'
import React from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { Backpack, LayoutDashboard, MoveLeft } from 'lucide-react'
import TitleForm from './_components/TitleForm'
import DescriptionForm from './_components/DescriptionForm'
import ImageForm from './_components/ImageForm'
import CategoryForm from './_components/CategoryForm'
import PriceForm from './_components/PriceForm'
import AttchmentForm from './_components/AttachmentForm'
import ChapterForm from './_components/ChapterForm'
import CourseAction from './_components/CourseAction'
import { Course } from '@prisma/client'
import Link from 'next/link'
import { Button } from '@/components/ui/button'



const page = async ({ params }: { params: { courseId: string } }) => {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }


    const course = await db.course.findUnique({
        where: {
            id: params.courseId
        },
        include: {
            attachmenst: {
                orderBy: {
                    createdAt: "desc",
                }
            },
            chapters: {
                orderBy: {
                    position: "asc",
                }
            }
        }
    })

    const categories = await db.category.findMany({
        orderBy: {
            name: "asc"
        }
    })

    if (!course || course.userId != userId) {
        redirect("/");
    }

    const requiredFields = [
        course.title,
        course.description,
        course.categoryId,
        course.imageUrl,
        course.price,
    ]
    const totalFields = requiredFields.length;
    const completedFields = requiredFields.filter((item) => item !== null).length;

    const isCompleted = requiredFields.every(Boolean);

    console.log(completedFields);

    return (
        <div className=''>
            <div className="container mt-28">
                <div className="course__title flex items-center justify-between">
                    <div>
                        <div>
                            <Button variant="ghost">
                                <Link href="/teacher/courses/" className='flex gap-4 items-center justify-normal
                                '> <MoveLeft></MoveLeft> Back to courses page </Link>
                            </Button>

                        </div>
                        <h1 className='text-2xl font-bold mt-8'>Course Setup</h1>
                        <p className="text-base font-semibold mt-1">complete all fields <span>{`(${completedFields}/${totalFields})`}</span></p>
                    </div>
                    <CourseAction disabled={!isCompleted} isPublished={course.isPublished || false} courseId={params.courseId} />
                </div>
                <div className="updated mt-8">

                    <div className='gap-2 md:grid md:grid-cols-2 md:gap-6'>
                        <div>

                            <div className="flex items-center gap-2 mb-8">
                                <LayoutDashboard />
                                <h2 className='text-xl'>Customize your Course</h2>

                            </div>
                            <div className='flex gap-8 flex-col'>
                                <TitleForm title={course.title} courseId={course.id} />
                                <DescriptionForm description={course.description} courseId={course.id} />
                                <ImageForm imageUrl={course.imageUrl} courseId={course.id} />
                                <CategoryForm courseId={course.id} options={categories.map((category) => {
                                    return { label: category.name, value: category.id }
                                })} categoryId={course?.categoryId} />
                            </div>
                        </div>
                        <div>
                            <div className="flex items-center gap-2 mb-8">
                                <LayoutDashboard />
                                <h2 className='text-xl'>Customize your Course</h2>
                            </div>
                            <div className='flex gap-8 flex-col'>
                                <ChapterForm chapters={course.chapters} courseId={course.id} />
                                <PriceForm courseId={course.id} price={course.price} />
                                <AttchmentForm courseId={course.id} attachments={course.attachmenst} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default page;

