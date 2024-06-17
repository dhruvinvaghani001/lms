"use client";
import { CheckCircle, Lock, PlayCircle } from "lucide-react";
import React from "react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";

interface ChapterIteamProps {
  id: string;
  label: string;
  isCompleted: boolean;
  courseId: string;
  isLocked: boolean;
}
const ChapterIteam = ({
  id,
  courseId,
  isLocked,
  isCompleted,
  label,
}: ChapterIteamProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const Icon = isLocked ? Lock : isCompleted ? CheckCircle : PlayCircle;

  const isActive = pathname?.includes(id);

  const onClick = () => {
    router.push(`/courses/${courseId}/chapter/${id}`);
  };

  return (
    <button
      className={cn(
        "px-4 flex gap-2 w-full py-4 duration-400 hover:bg-muted font-bold text-slate-500",
        isActive && "bg-border hover:bg-secondary border-r-4 border-primary",
        isCompleted && "text-emerald-700"
      )}
      onClick={onClick}
    >
      <div className="flex items-center gap-x-2 py-4">
        <Icon width={20} />
        {label.substring(0, 15)}...
      </div>
    </button>
  );
};

export default ChapterIteam;
