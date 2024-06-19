import { db } from "@/lib/db";
import React from "react";
import CategoryList from "./_components/CategoryList";
import { getCourses } from "@/actions/get-courses";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import CourseList from "./_components/CourseList";

interface SearchPageProps {
  searchParams: {
    title: string;
    categoryId: string;
  };
}

const SearchPage = async ({ searchParams }: SearchPageProps) => {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const courses = await getCourses({ userId: userId, ...searchParams });
  return (
    <div>
      <div>
        <CategoryList items={categories} />
      </div>
      <div className="p-6">
        <CourseList items={courses} />
      </div>
    </div>
  );
};

export default SearchPage;
