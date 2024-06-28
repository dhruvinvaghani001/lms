import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";
import StatsCard from "../analytics/_components/StatsCard";
import { Wallet, WalletCards } from "lucide-react";
import { auth } from "@clerk/nextjs/server";
import { ChartData } from "../analytics/page";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import MakePayoutReqeust from "./_components/MakePayoutReqeust";
import { DataTable } from "../../admin/_components/DataTable";
import { columns } from "./_components/Columns";

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

  const payoutRequestData = await db.payoutRequest.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const PayoutTabledata = await Promise.all(
    payoutRequestData.map(async (item) => {
      const contact = await db.contactDetail.findUnique({
        where: {
          userId,
        },
      });
      return {
        id: item.id,
        name: contact?.name!,
        amount: item.amount,
        status: item.status,
      };
    })
  );

  return (
    <div className="p-6">
      <Link href="/teacher/payout/details">
        <Button variant="default">Submit Bank & Contact Details</Button>
      </Link>
      <div className="mt-8 mb-6 flex gap-4">
        <StatsCard
          label="Total withdraw"
          count={totalPayout}
          icon={WalletCards}
        />
        <StatsCard label="Wallet" count={wallet} icon={Wallet} />
      </div>

      <div className="mt-16">
        <MakePayoutReqeust wallet={wallet} />
        <DataTable columns={columns} data={PayoutTabledata}></DataTable>
      </div>
    </div>
  );
};

export default page;
