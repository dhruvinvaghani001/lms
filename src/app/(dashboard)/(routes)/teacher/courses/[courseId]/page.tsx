import { db } from '@/lib/db'
import React from 'react'
import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { LayoutDashboard } from 'lucide-react'
import TitleForm from './_components/TitleForm'
import DescriptionForm from './_components/DescriptionForm'

type Props = {}

const page = async ({ params }: { params: { courseId: string } }) => {
    const { userId } = auth();

    if (!userId) {
        redirect("/sign-in");
    }


    const course = await db.course.findUnique({
        where: {
            id: params.courseId
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


    console.log(completedFields);

    return (
        <div className=''>
            <div className="container mt-28">
                <div className="course__title">
                    <h1 className='text-2xl font-bold '>Course Setup</h1>
                    <p className="text-base font-semibold mt-1">complete all fields <span>{`(${completedFields}/${totalFields})`}</span></p>
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
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    )
}

export default page;