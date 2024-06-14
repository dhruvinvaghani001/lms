"use client";
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import z from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookCheck, Pen, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';

import Link from 'next/link';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Chapter } from '@prisma/client';
import { Badge } from '@/components/ui/badge';

interface ChapterFormProps {
    chapters: Chapter[],
    courseId: string,
}


const formSchema = z.object({
    title: z.string().min(1, {
        message: "chapter title should be valid!",
    }),
})

const ChapterForm = ({ chapters, courseId }: ChapterFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditting] = useState(false);

    const toggleEdit = () => {
        setIsEditting(prev => !prev);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: ""
        }
    })

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post(`/api/courses/${courseId}/chapter`, values);
            toast.success(response.data.message);
            console.log(response);
            toggleEdit();
            router.refresh();
        } catch (error: any) {
            console.log("chapter Added!", error);
            toast.error(error?.message);
        }
    }

    return (
        <div>
            <Card className='w-full'>
                <div className='bg-card rounded-md p-4'>
                    <div className='flex justify-between gap-2 items-center'>
                        Course Chapters
                        <Button variant="ghost" className='flex gap-2' onClick={toggleEdit}>
                            {
                                isEditing && <>Cancel</>
                            }
                            {
                                !isEditing && <> <PlusCircle />
                                    Add Chapter</>
                            }
                        </Button>
                    </div>
                    <div className="form mt-2">
                        {

                            chapters.length > 0 && <div className='mb-3 flex flex-col gap-2'>{chapters.map((chapter, index) => {
                                return <div key={index} className='flex bg-muted items-center p-2 px-4 rounded-lg justify-between' >
                                    <div className='flex items-center gap-2'>
                                        <BookCheck width={20} />
                                        {chapter.title}
                                    </div>
                                    <div className='flex items-center gap-2'>
                                        {
                                            chapter.isPublished ? <Badge variant="default">Published</Badge> : <Badge variant="default">Draft</Badge>
                                        }
                                        <Link href={`/teacher/courses/${courseId}/chapter/${chapter.id}`}>
                                            <Pen width={18} />
                                        </Link>
                                    </div>
                                </div>
                            })}</div>
                        }
                        {
                            isEditing && <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="title"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input disabled={isSubmitting} placeholder="e.g introduction" {...field} />
                                                </FormControl>
                                                <FormDescription>
                                                    What will be name of your chapters ?
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className=''>
                                        <Button disabled={isSubmitting || !isValid} type="submit">Add</Button>
                                    </div>
                                </form>
                            </Form>
                        }
                    </div>
                </div>
            </Card >
        </div >
    )
}

export default ChapterForm