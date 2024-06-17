"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import { Button } from "@/components/ui/button";
import { PlusCircle, File, X, XCircle, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";

import toast from "react-hot-toast";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";
import FielUpload from "@/components/FielUpload";
import Image from "next/image";
import { Attachment } from "@prisma/client";

interface AttchmentFormProps {
  attachments: Attachment[];
  courseId: string;
}

const formSchema = z.object({
  url: z.string().min(1),
});

const AttchmentForm = ({ attachments, courseId }: AttchmentFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditting] = useState(false);
  const [deleteId, setdeleteId] = useState<string | null>(null);

  const toggleEdit = () => {
    setIsEditting((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      url: "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  // to add attachments to course
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.post(
        `/api/courses/${courseId}/attachments`,
        values
      );
      toast.success(response.data.message);
      console.log(response);
      toggleEdit();
      router.refresh();
    } catch (error:any) {
      console.log("title update error", error);
      toast.error(error?.message);
    }
  };

  // delete attachments
  const onDelete = async (id: string) => {
    try {
      const response = await axios.delete(
        `/api/courses/${courseId}/attachments/${id}`
      );
      toast.success(response.data.message);
      console.log(response);
      router.refresh();
    } catch (error:any) {
      console.log(error);
      toast.error(error?.message);
    }
  };

  return (
    <div>
      <Card className="w-full">
        <div className="bg-card rounded-md p-4">
          <div className="flex justify-between gap-2 items-center">
            Course Attachments
            <Button variant="ghost" className="flex gap-2" onClick={toggleEdit}>
              {isEditing && <>Cancel</>}
              {!isEditing && (
                <>
                  <PlusCircle />
                  Add a file
                </>
              )}
            </Button>
          </div>
          <div className="form mt-2">
            {!isEditing && attachments.length === 0 && (
              <p className="text-sm mt-2">No attachments yet</p>
            )}
            {!isEditing && attachments.length > 0 && (
              <div className="mt-4">
                <div className="flex flex-col gap-3">
                  {attachments.map((attach, index) => {
                    return (
                      <div
                        className="p-2 bg-muted rounded-lg flex justify-between"
                        key={index}
                      >
                        <div className="flex items-center gap-4">
                          {" "}
                          <File />
                          {attach.name}
                        </div>
                        {deleteId === attach.id && <Loader2 />}
                        {deleteId !== attach.id && (
                          <XCircle
                            onClick={() => {
                              setdeleteId(attach.id);
                              onDelete(attach.id);
                            }}
                          />
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            {isEditing && (
              <FielUpload
                endpoint="courseAttachment"
                onChange={(url) => {
                  if (url) {
                    onSubmit({ url: url });
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

export default AttchmentForm;
