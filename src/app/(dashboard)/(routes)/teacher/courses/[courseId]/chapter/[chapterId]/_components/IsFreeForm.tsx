"use client";
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import z from "zod";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { PenLine } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Checkbox } from "@/components/ui/checkbox"


interface IsFreeFormProps {
    isFree: boolean,
    courseId: string,
    chapterId: string,
}

const formSchema = z.object({
    isFree: z.boolean(),
})


const IsFreeForm = ({ courseId, chapterId, isFree }: IsFreeFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditting] = useState(false);

    const toggleEdit = () => {
        setIsEditting(prev => !prev);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            isFree: isFree
        }
    })

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}/chapter/${chapterId}`, values);
            toast.success(response.data.message);
            console.log(response);
            toggleEdit();
            router.refresh();
        } catch (error: any) {
            console.log("chapter update error", error);
            toast.error(error?.message);
        }
    }

    return (
        <div>
            <Card className='w-full'>
                <div className='bg-card rounded-md p-4'>
                    <div className='flex justify-between gap-2 items-center'>
                        Chpater Access
                        <Button variant="ghost" className='flex gap-2' onClick={toggleEdit}>
                            {
                                isEditing && <>Cancel</>
                            }
                            {
                                !isEditing && <> <PenLine />
                                    Edit Access</>
                            }
                        </Button>
                    </div>
                    <div className="form mt-2">
                        {
                            !isEditing && <>{isFree ? "Free" : "Paid"}</>
                        }
                        {

                            isEditing && <Form {...form}>
                                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                    <FormField
                                        control={form.control}
                                        name="isFree"
                                        render={({ field }) => (
                                            <FormItem>
                                                <div className='flex items-center gap-4'>
                                                    <FormControl>
                                                        <Checkbox
                                                            checked={field.value}
                                                            onCheckedChange={field.onChange}
                                                        />
                                                    </FormControl>
                                                    <FormLabel>
                                                        Use different settings for my mobile devices
                                                    </FormLabel>
                                                </div>
                                                <FormDescription>
                                                    if you wan to make free this chapter then please mark chekbox !
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

export default IsFreeForm;

