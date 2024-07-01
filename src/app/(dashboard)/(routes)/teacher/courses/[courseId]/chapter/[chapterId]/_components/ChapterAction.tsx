"use client";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { redirect, useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface ChapterActionProps {
  courseId: string;
  chapterId: string;
  isPublished: Boolean;
  disabled: boolean;
}

const ChapterAction = ({
  courseId,
  chapterId,
  isPublished,
  disabled,
}: ChapterActionProps) => {
  const router = useRouter();

  const onPublish = async () => {
    try {
      let response = null;
      if (isPublished) {
        response = await axios.patch(
          `/api/courses/${courseId}/chapter/${chapterId}/unpublish`
        );
      } else {
        response = await axios.patch(
          `/api/courses/${courseId}/chapter/${chapterId}/publish`
        );
      }
      toast.success(response?.data.message);
      router.refresh();
    } catch (error:any) {
      toast.error(error?.response?.data?.message);
    }
  };

  const onDelete = async () => {
    try {
      const resposne = await axios.delete(
        `/api/courses/${courseId}/chapter/${chapterId}`
      );
      console.log(resposne);

      toast.success(resposne?.data?.message);
      router.refresh();
      router.push(`/teacher/courses/${courseId}/`);
    } catch (error) {
      toast.error("Somethign went wrong!");
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button disabled={disabled} onClick={onPublish} variant="outline">
        {" "}
        {isPublished ? "UnPublish" : "Publish"}
      </Button>
      <ConfirmModal onConfirm={onDelete}>
        <Button variant="default">
          <Trash></Trash>
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default ChapterAction;
