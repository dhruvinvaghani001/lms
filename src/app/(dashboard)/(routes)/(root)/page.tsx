import CourseList from "../search/_components/CourseList";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { getPurchaseCourses } from "@/actions/get-puchase-course";
import { CheckCircle, Clock2 } from "lucide-react";
import StatsCard from "./_components/StatsCard";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Student Dashboard",
  description: "Dashboard for students",
};

export default async function Dashboard() {
  const { userId } = auth();

  if (!userId) {
    redirect("/sign-in");
  }
  const purchaseCourses = await getPurchaseCourses({ userId });
  const completedCount = purchaseCourses.filter(
    (iteam) => iteam.progress == 100
  ).length;
  const inProgressCount = purchaseCourses.filter((item) => item.progress != 100)
    .length;

  return (
    <div className="p-6 pb-10">
      <div className="progress_status flex flex-col items-start justify-center  gap-4  md:flex-row md:items-center md:justify-start">
        <StatsCard label="In Progress" count={inProgressCount} icon={Clock2} />
        <StatsCard
          label="Completed"
          count={completedCount}
          icon={CheckCircle}
        />
      </div>
      <div className="mt-10">{<CourseList items={purchaseCourses} />}</div>
    </div>
  );
}
