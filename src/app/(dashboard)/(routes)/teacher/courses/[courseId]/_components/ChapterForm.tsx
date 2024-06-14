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
    const [items, setItems] = useState(chapters);
    const [loading, setLoading] = useState(false);

    let isOrderChanged = false;
    for (let index = 0; index < chapters.length; index++) {
        if (chapters[index].id !== items[index].id) {
            isOrderChanged = true;
        }
    }


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

    const savePosition = async () => {
        try {
            setLoading(true);
            const response = await axios.patch(`/api/courses/${courseId}/position`, { chapters: items });
            toast.success(response.data?.message);
            router.refresh();
        } catch (error: any) {
            console.log("Eror while reordring", error);
            toast.error(error?.message);
        } finally {
            setLoading(false);
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
                        {chapters.length > 0 && <DragableChapterList courseId={courseId} items={items} setItems={setItems} />}
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
                        <div className='text-primary mt-3 flex items-center justify-between'>
                            <p className='font-normal'>Drag and Drop to reorder Chapters</p>
                            {
                                chapters.length >= 2 && <Button variant="default" disabled={!isOrderChanged || loading} onClick={savePosition}>Save order</Button>
                            }
                        </div>
                    </div>
                </div>
            </Card >
        </div >
    )
}

export default ChapterForm