"use client";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { Trash } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface ChapterActionProps {
  courseId: string;
  isPublished: boolean;
  disabled: boolean;
}

const CourseAction = ({
  courseId,
  isPublished,
  disabled,
}: ChapterActionProps) => {
  const router = useRouter();
  const onPublish = async () => {
    try {
      let response = null;
      if (isPublished) {
        response = await axios.patch(`/api/courses/${courseId}/unpublish`);
      } else {
        response = await axios.patch(`/api/courses/${courseId}/publish`);
      }
      toast.success(response.data.message);
      router.refresh();
    } catch (error:any) {
      console.log("publish error:");
      toast.error(error?.response?.data?.message);
    }
  };

  const onDelete = async () => {
    try {
      const resposne = await axios.delete(`/api/courses/${courseId}`);
      console.log(resposne);

      toast.success(resposne?.data?.message);
      router.push("/teacher/courses");
      router.refresh();
    } catch (error:any) {
      console.log("delete chapter error:", error);
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        disabled={disabled}
        onClick={onPublish}
        variant="outline"
        id="publishbuton"
      >
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

export default CourseAction;
