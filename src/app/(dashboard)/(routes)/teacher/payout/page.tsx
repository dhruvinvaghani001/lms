import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import StatsCard from "../analytics/_components/StatsCard";
import { Wallet } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { ChartData } from "../analytics/page";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import MakePayoutReqeust from "./_components/MakePayoutReqeust";

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

  const payoutAmount = await db.payoutRequest.findMany({
    where: {
      userId: userId,
      status: "Success",
    },
    select: {
      amount: true,
    },
  });

  const totalPayout = payoutAmount.reduce((acc, pay) => acc + pay.amount, 0);

  const wallet = totalRevenue - totalPayout;

  return (
    <div className="p-6">
      <Link href="/teacher/payout/details">
        <Button>Submit details</Button>
      </Link>
      <div className="w-1/4 mt-4 mb-6">
        <StatsCard label="Wallet" count={wallet} icon={Wallet} />
      </div>
      <MakePayoutReqeust wallet={wallet} />
    </div>
  );
};

export default page;
