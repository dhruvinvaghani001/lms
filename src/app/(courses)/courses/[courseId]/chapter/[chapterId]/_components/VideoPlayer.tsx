"use client";
import { Loader2, Lock } from "lucide-react";
import React, { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/lib/utils";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";

interface VideoPlayerProps {
  isLocked: boolean;
  playbackId: string | undefined | null;
  courseId: string;
  chapterId: string;
  nextChapterId?: string;
  completeOnEnd: boolean;
  title: string | undefined;
}

const VideoPlayer = ({
  playbackId,
  isLocked,
  courseId,
  chapterId,
  nextChapterId,
  title,
  completeOnEnd,
}: VideoPlayerProps) => {
  const [ready, setReady] = useState(false);
  const router = useRouter();

  const onEnd = async () => {
    try {
      if (completeOnEnd) {
        const response = axios.patch(
          `/api/courses/${courseId}/chapter/${chapterId}/progress`,
          {
            isCompleted: true,
          }
        );
      }
      router.refresh();
      if (nextChapterId) {
        router.push(`/courses/${courseId}/chapter/${nextChapterId}`);
      }
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="relative aspect-video">
      {!ready && !isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Loader2 />
        </div>
      )}
      {isLocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted">
          <Lock />
        </div>
      )}
      {!isLocked && (
        <MuxPlayer
          playbackId={playbackId || ""}
          title={title}
          className={cn(!ready && "hidden")}
          onCanPlay={() => setReady(true)}
          onEnded={onEnd}
          autoPlay
        />
      )}
    </div>
  );
};

export default VideoPlayer;
