import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Noto_Sans_Lepcha } from "next/font/google";
import { redirect } from "next/navigation";
import React from "react";

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
  });

  console.log(purchases);

  return (
    <div className="p-6">
      {purchases.map((item) => {
        return (
          <Card key={item.id} className="w-fit">
            <CardHeader>{item.course.title}</CardHeader>
            <CardContent>pay Amount : $ {item.purchasePrice}</CardContent>
            <CardContent>
              <a href={item.receiptUrl} target="_blank">
                Recipt Download
              </a>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default TransactionPage;
