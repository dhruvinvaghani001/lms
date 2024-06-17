import { Category, Course } from "@prisma/client";
import React from "react";
import CourseCard from "./CourseCard";

type courseWithProgressWithCategory = Course & {
  category: Category | null;
  chapters: { id: string }[];
  progress: number | null;
};

interface CourseListProps {
  items: courseWithProgressWithCategory[];
}

const CourseList = ({ items }: CourseListProps) => {
  return (
    <>
      <div className="flex text-foreground justify-center ">
        {items.length === 0 && <>Course Not Found</>}
      </div>
      <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4">
        {items &&
          items.map((item) => (
            <CourseCard
              key={item.id}
              id={item.id}
              title={item.title}
              imageUrl={item.imageUrl}
              numberOfChapter={item.chapters.length}
              price={item.price}
              progress={item.progress}
              category={item?.category?.name}
            />
          ))}
      </div>
    </>
  );
};

export default CourseList;
