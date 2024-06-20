import React from "react";
import StatsCard from "./_components/StatsCard";
import { DollarSign, LineChart } from "lucide-react";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import Chart from "./_components/Chart";

const page = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const data = await db.course.findMany({
    where: {
      userId: userId,
    },
    include: {
      purchase: {},
    },
  });

  const mappedData = data.map((dt) => {
    return { name: dt.title, Revenue: dt.purchase.length * dt.price! };
  });

  console.log(mappedData);

  return (
    <div className="p-6">
      <div className="stats_card flex gap-4">
        <StatsCard count={220} icon={DollarSign} label="Total Revenue" />
        <StatsCard count={220} icon={LineChart} label="Total Sales" />
      </div>
      <div className="max-w-4xl overflow-auto mt-10">
        <Chart mappedData={mappedData} />
      </div>
    </div>
  );
};

export default page;
