"use client";
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import z from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PenLine } from 'lucide-react';
import { Card } from '@/components/ui/card';

import Link from 'next/link';
import toast from 'react-hot-toast';
import { db } from '@/lib/db';
import axios from 'axios';
import { useRouter } from 'next/navigation';

interface TitleFormProps {
    title: string,
    courseId: string,
    chapterId: string,
}


const formSchema = z.object({
    title: z.string().min(1, {
        message: "chapter title should be valid!",
    }),
})

const TitleForm = ({ title, courseId, chapterId }: TitleFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditting] = useState(false);

    const toggleEdit = () => {
        setIsEditting(prev => !prev);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: title
        }
    })

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}/chapter/${chapterId}`, values);
            toast.success(response.data.message);
            toggleEdit();
            router.refresh();
        } catch (error: any) {
            toast.error(error?.message);
        }
    }

    return (
        <div>
            <Card className='w-full'>
                <div className='bg-card rounded-md p-4'>
                    <div className='flex justify-between gap-2 items-center'>
                        Chpater Title
                        <Button variant="ghost" className='flex gap-2' onClick={toggleEdit}>
                            {
                                isEditing && <>Cancel</>
                            }
                            {
                                !isEditing && <> <PenLine />
                                    Edit Title</>
                            }
                        </Button>
                    </div>
                    <div className="form mt-2">
                        {
                            !isEditing && <>{title}</>
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
                                                    what is name of yout chapter?
                                                </FormDescription>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <div className=''>
                                        <Button disabled={isSubmitting || !isValid} type="submit">Save</Button>
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

export default TitleForm