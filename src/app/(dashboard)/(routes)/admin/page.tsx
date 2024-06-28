import React from "react";
import { columns } from "./_components/columns";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { DataTable } from "./../admin/_components/DataTable";

type Props = {};

const page = async () => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  const payoutRequestData = await db.payoutRequest.findMany({
    orderBy: { createdAt: "desc" },
  });

  const data = await Promise.all(
    payoutRequestData.map(async (item) => {
      const contact = await db.contactDetail.findUnique({
        where: {
          userId: item.userId,
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
      <DataTable columns={columns} data={data}></DataTable>
    </div>
  );
};

export default page;
