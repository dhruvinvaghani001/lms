"use client";
import { Loader2, Lock } from "lucide-react";
import React, { useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import { cn } from "@/lib/utils";

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
          onEnded={() => {}}
          autoPlay
        />
      )}
    </div>
  );
};

export default VideoPlayer;
