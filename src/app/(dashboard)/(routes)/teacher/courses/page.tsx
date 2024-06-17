import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import React from "react";
import { DataTable } from "./_components/CourseTable";
import { columns } from "./_components/Columns";
import { redirect } from "next/navigation";
import { PlusCircle } from "lucide-react";

const page = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const courses = await db.course.findMany({
    where: {
      userId: userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="">
      <div className="main__section p-10 flex flex-col  gap-4">
        <Link href="/teacher/create" className="w-fit">
          <Button
            variant="default"
            className="bg-secondary-foreground flex items-center
                    gap-2"
          >
            <PlusCircle /> Create New
          </Button>
        </Link>
        <div>
          <DataTable columns={columns} data={courses} />
        </div>
      </div>
    </div>
  );
};

export default page;
