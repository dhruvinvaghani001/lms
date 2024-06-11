"use client";
import React from 'react'
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import Link from 'next/link';
import toast from 'react-hot-toast';
import axios from 'axios';
import { useRouter } from 'next/navigation';


type Props = {}

const formSchema = z.object({
    title: z.string().min(1, {
        message: "course title should be valid!",
    }),
})



const CreateCoursePage = (props: Props) => {
    const router = useRouter();
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            title: "",
        }
    })

    const { isSubmitting, isValid } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.post("/api/courses", values);
            router.push(`/teacher/courses/${response?.data?.data?.id}`)
            toast.success(response.data.message);
        } catch (error: any) {
            console.log("Course creation error : [FRONTEND]", error);
            toast.error(error.response?.data.message);
        }
    }

    return (
        <div className='p-4 h-full flex justify-center items-center'>
            <div className='max-w-5xl mx-auto'>
                <div>
                    <div>
                        <h1 className='text-2xl font-semibold'>Name your course</h1>
                        <p>What whould you like to name your course ?you can change this later </p>
                    </div>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                            <FormField
                                control={form.control}
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Course Title</FormLabel>
                                        <FormControl>
                                            <Input disabled={isSubmitting} placeholder="e.g Advance web Devlopment" {...field} />
                                        </FormControl>
                                        <FormDescription>
                                            What will you teach in this course ?
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <div className='flex gap-4'>
                                <Link href="/teacher/courses"><Button type="button" variant="ghost">Cancel</Button></Link>
                                <Button disabled={isSubmitting || !isValid} type="submit">Continue</Button>

                            </div>
                        </form>
                    </Form>
                </div>
            </div>
        </div>
    )
}

export default CreateCoursePage