"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import { ImageIcon, PenLine, PlusCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

import toast from "react-hot-toast";

import axios from "axios";
import { useRouter } from "next/navigation";
import FielUpload from "@/components/FielUpload";
import Image from "next/image";

interface ImageFormProps {
  imageUrl: string | null;
  courseId: string;
}

const formSchema = z.object({
  imageUrl: z.string().min(1, {
    message: "image is required!",
  }),
});

const ImageForm = ({ imageUrl, courseId }: ImageFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditting] = useState(false);

  const toggleEdit = () => {
    setIsEditting((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: imageUrl || "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      toast.success(response.data.message);
      console.log(response);
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div>
      <Card className="w-full">
        <div className="bg-card rounded-md p-4">
          <div className="flex justify-between gap-2 items-center">
            Course Image
            <Button variant="ghost" className="flex gap-2" onClick={toggleEdit}>
              {isEditing && <>Cancel</>}
              {!isEditing && !imageUrl && (
                <>
                  <PlusCircle />
                  Add A Image
                </>
              )}
              {!isEditing && imageUrl && (
                <>
                  <PenLine />
                  Edit Image
                </>
              )}
            </Button>
          </div>
          <div className="form mt-2">
            {!isEditing && !imageUrl && (
              <div className="flex items-center justify-center h-60 bg-slate-200 rounded-md">
                <ImageIcon className="h-10 w-10 text-slate-500" />
              </div>
            )}
            {!isEditing && imageUrl && (
              <div className="relative w-full aspect-video rounded-md overflow-hidden ">
                <Image
                  fill
                  src={imageUrl}
                  alt="course image"
                  className="object-cover"
                />
              </div>
            )}
            {isEditing && (
              <FielUpload
                endpoint="courseImage"
                onChange={(url) => {
                  if (url) {
                    onSubmit({ imageUrl: url });
                  }
                }}
              />
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ImageForm;
