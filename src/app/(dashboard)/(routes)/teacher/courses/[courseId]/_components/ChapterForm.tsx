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
import { Reorder } from 'framer-motion';
import DragableChapterList from './DragableChapterList';

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
    const [items, setItems] = useState([...chapters]);

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
            form.reset();
        } catch (error: any) {
            console.log("chapter Added!", error);
            toast.error(error?.message);
        }
    }

    const ch = chapters.map((chap) => chap.id);

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
                        {/* {

                            chapters.length > 0 && <div className='mb-3 flex flex-col gap-2'> <Reorder.Group axis="y" values={items} onReorder={setItems} className='flex flex-col gap-2'>
                                {

                                    items.map((chapter, index) => {
                                        return <Reorder.Item key={index} value={chapter}><div className='flex bg-muted items-center p-2 px-4 rounded-lg justify-between' >
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
                                        </Reorder.Item>
                                    })}

                            </Reorder.Group>
                            </div>
                        } */}
                        <DragableChapterList chapters={chapters} courseId={courseId} />
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

                                            </FormItem>
                                        )}
                                    />
                                    <div className=''>
                                        <Button disabled={isSubmitting || !isValid} type="submit">Add</Button>
                                    </div>
                                </form>
                            </Form>
                        }
                        <div className='text-primary mt-3'>
                            <p className='font-normal'>Drag and Drop to reorder Chapters</p>
                        </div>
                    </div>
                </div>
            </Card >
        </div >
    )
}

export default ChapterForm