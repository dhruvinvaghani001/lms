import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { Menu } from "lucide-react";
import React from "react";
import CourseSidebar from "./CourseSidebar";

interface MobileCourseSidebarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progress: number | null;
}

const MobileCourseSidebar = ({
  course,
  progress,
}: MobileCourseSidebarProps) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="inline md:hidden" />
      </SheetTrigger>
      <SheetContent className="w-56 p-0" side="left">
        <CourseSidebar course={course} progress={progress} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileCourseSidebar;
