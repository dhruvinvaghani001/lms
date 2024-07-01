"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { CheckCircle, XCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface CourseProgressButtonProps {
  courseId: string;
  chapterId: string;
  isCompleted: boolean;
  nextChapterId?: string;
}

const CourseProgressButton = ({
  courseId,
  chapterId,
  isCompleted,
  nextChapterId,
}: CourseProgressButtonProps) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.patch(
        `/api/courses/${courseId}/chapter/${chapterId}/progress`,
        {
          isCompleted: !isCompleted,
        }
      );
      if (!isCompleted && nextChapterId) {
        router.push(`/courses/${courseId}/chapter/${nextChapterId}`);
        router.refresh();
      }
      toast.success("Progress updated");
      router.refresh();
    } catch (error) {
      toast.error("Something Went Wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Button
        onClick={onClick}
        variant={isCompleted ? "outline" : "success"}
        className="flex items-center gap-2"
        disabled={isLoading}
      >
        {isCompleted && (
          <>
            Not complete <XCircle />
          </>
        )}
        {!isCompleted && (
          <>
            Mark as completed <CheckCircle />
          </>
        )}
      </Button>
    </div>
  );
};

export default CourseProgressButton;
