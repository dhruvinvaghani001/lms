import React from "react";
import StatsCard from "./_components/StatsCard";
import {
  CandlestickChart,
  CircleDollarSign,
  DollarSign,
  LineChart,
} from "lucide-react";
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

export type ChartData = {
  name: string;
  revenue: number;
  numberOfStudents: number;
};

const page = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const purchaseData = await db.course.findMany({
    where: {
      userId: userId,
    },
    include: {
      purchase: {
        select: {
          purchasePrice: true,
        },
      },
    },
  });

  const data: ChartData[] = purchaseData.map((item) => {
    return {
      name: item.title,
      revenue: item.purchase.reduce((acc, it) => {
        return acc + it.purchasePrice;
      }, 0),
      numberOfStudents: item.purchase.length,
    };
  });

  const totalRevenue = data.reduce((acc, course) => {
    return acc + course.revenue;
  }, 0);

  const totalSales = data.reduce((acc, course) => {
    return acc + course.numberOfStudents;
  }, 0);

  return (
    <div className="p-6">
      <div className="stats_card flex flex-col gap-4  md:flex-row md:items-center md:justify-start">
        <StatsCard
          count={totalRevenue}
          icon={CircleDollarSign}
          label="Total Revenue"
        />
        <StatsCard
          count={totalSales}
          icon={CandlestickChart}
          label="Total Sales"
        />
      </div>
      <div className="mt-10 w-full md:w-3/4 h-[350px] ">
        {totalRevenue > 0 && totalSales > 0 && <Chart data={data} />}
      </div>
    </div>
  );
};

export default page;
