import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { columns } from "./_components/Column";
import { DataTable } from "../teacher/courses/_components/CourseTable";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Transactions",
  description: "all transactions by students",
};

const TransactionPage = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const purchases = await db.purchase.findMany({
    where: {
      userId,
    },
    include: {
      course: {
        select: {
          title: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const data = purchases.map((item) => {
    return {
      title: item.course.title,
      priceOfPurchase: item.purchasePrice,
      reciptUrl: item.receiptUrl,
    };
  });

  return (
    <div className="p-6">
      <DataTable columns={columns} data={data} />
    </div>
  );
};

export default TransactionPage;
