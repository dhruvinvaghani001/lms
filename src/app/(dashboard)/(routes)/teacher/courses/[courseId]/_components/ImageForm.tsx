"use client";
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import z from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ImageIcon, PenLine, PlusCircle } from 'lucide-react';
import { Card } from '@/components/ui/card';


import toast from 'react-hot-toast';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import FielUpload from '@/components/FielUpload';
import Image from 'next/image';

interface ImageFormProps {
    imageUrl: string | null,
    courseId: string,
}


const formSchema = z.object({
    imageUrl: z.string().min(1, {
        message: "image is required!",
    }),
})

const ImageForm = ({ imageUrl, courseId }: ImageFormProps) => {
    const router = useRouter();
    const [isEditing, setIsEditting] = useState(false);

    const toggleEdit = () => {
        setIsEditting(prev => !prev);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            imageUrl: imageUrl || ""
        }
    })

    const { isValid, isSubmitting } = form.formState;

    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            const response = await axios.patch(`/api/courses/${courseId}`, values);
            toast.success(response.data.message);
            console.log(response);
            toggleEdit();
            router.refresh();
        } catch (error: any) {
            console.log("title update error", error);
            toast.error(error?.message);
        }
    }

    return (
        <div>
            <Card className='w-full'>
                <div className='bg-card rounded-md p-4'>
                    <div className='flex justify-between gap-2 items-center'>
                        Course Image
                        <Button variant="ghost" className='flex gap-2' onClick={toggleEdit}>
                            {
                                (!isEditing && imageUrl) == true ? <>
                                    <PenLine />
                                    Edit Image</> : <><PlusCircle />Add an Image</>
                            }
                        </Button>
                    </div>
                    <div className="form mt-2">
                        {
                            !isEditing && (!imageUrl && <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                                <ImageIcon className='h-10 w-10 text-slate-500' />
                            </div>)
                        }
                        {
                            !isEditing && (imageUrl && <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                                <Image src={imageUrl} alt="courseImage" width={100} height={100} className='h-full w-full object-cover' />
                            </div>)
                        }
                        {
                            isEditing && <FielUpload
                                endpoint='courseImage'
                                onChange={(url) => {
                                    if (url) {
                                        onSubmit({ imageUrl: url })
                                    }
                                }}
                            />
                        }
                    </div>
                </div>
            </Card >
        </div >
    )
}

export default ImageForm