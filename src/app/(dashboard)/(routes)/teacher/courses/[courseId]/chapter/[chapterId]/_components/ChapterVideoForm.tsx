"use client";
import React, { useState } from 'react';
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form";
import z from "zod";

import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import { ImageIcon, PenLine, PlusCircle, Video } from 'lucide-react';
import { Card } from '@/components/ui/card';
import MuxPlayer from '@mux/mux-player-react';

import toast from 'react-hot-toast';

import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Textarea } from '@/components/ui/textarea';
import FielUpload from '@/components/FielUpload';
import Image from 'next/image';
import { MuxData } from '@prisma/client';

interface ChapterVideoForm {
    videoUrl: string | null,
    courseId: string,
    chapterId: string,
    muxData: MuxData | null;
}


const formSchema = z.object({
    videoUrl: z.string().min(1, {
        message: "image is required!",
    }),
})

const ChapterVideoForm = ({ videoUrl, courseId, chapterId, muxData }: ChapterVideoForm) => {
    const router = useRouter();
    const [isEditing, setIsEditting] = useState(false);

    const toggleEdit = () => {
        setIsEditting(prev => !prev);
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            videoUrl: videoUrl || ""
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
            console.log("Chapter update error", error);
            toast.error(error?.message);
        }
    }

    return (
        <div>
            <Card className='w-full'>
                <div className='bg-card rounded-md p-4'>
                    <div className='flex justify-between gap-2 items-center'>
                        Chapter Video
                        <Button variant="ghost" className='flex gap-2' onClick={toggleEdit}>
                            {
                                isEditing && <>Cancel</>
                            }
                            {
                                !isEditing && !videoUrl && <><PlusCircle />Add A Video</>
                            }
                            {
                                !isEditing && videoUrl && <><PenLine />Edit Video</>
                            }
                        </Button>
                    </div>
                    <div className="form mt-2">
                        {
                            !isEditing && !videoUrl && <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                                <Video className='h-10 w-10 text-slate-500' />
                            </div>
                        }
                        {
                            !isEditing && videoUrl && <><MuxPlayer playbackId={muxData?.playbackId || undefined} /></>
                        }
                        {
                            isEditing && <FielUpload
                                endpoint='chapterVideo'
                                onChange={(url) => {
                                    if (url) {
                                        onSubmit({ videoUrl: url })
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

export default ChapterVideoForm;