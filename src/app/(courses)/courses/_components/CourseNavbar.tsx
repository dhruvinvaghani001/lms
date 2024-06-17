import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/ui/them-toggle";
import { cn } from "@/lib/utils";
import { UserButton } from "@clerk/nextjs";
import { Chapter, Course, UserProgress } from "@prisma/client";
import { LogOut } from "lucide-react";
import Link from "next/link";
import React from "react";
import MobileCourseSidebar from "./MobileCourseSidebar";
interface CourseNavbarProps {
  course: Course & {
    chapters: (Chapter & {
      userProgress: UserProgress[] | null;
    })[];
  };
  progress: number | null;
}

const CourseNavbar = ({ course, progress }: CourseNavbarProps) => {
  return (
    <>
      <nav
        className={cn(
          "h-full p-4 border-b  bg-primary-foreground flex items-center  justify-between   z-10 md:justify-end"
        )}
      >
        <MobileCourseSidebar course={course} progress={progress} />
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="ghost" className="flex gap-2">
              <LogOut width={22} />
              Exit
            </Button>
          </Link>

          <ModeToggle />
          <UserButton />
        </div>
      </nav>
    </>
  );
};

export default CourseNavbar;
