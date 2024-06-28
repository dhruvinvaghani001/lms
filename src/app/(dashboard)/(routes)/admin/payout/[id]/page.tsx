import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import React from "react";
import PayoutAction from "./_components/PayoutAction";
import { redirect } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Status } from "@prisma/client";

const page = async ({ params }: { params: { id: string } }) => {
  const payoutRequest = await db.payoutRequest.findUnique({
    where: {
      id: params.id,
    },
  });

  if (
    payoutRequest?.status === Status.Faild ||
    payoutRequest?.status === Status.Success
  ) {
    redirect("/admin");
  }

  const teacherId = payoutRequest?.userId;
  if (!teacherId) {
    redirect("/");
  }

  const contact = await db.contactDetail.findUnique({
    where: {
      userId: teacherId,
    },
  });

  const bank = await db.bankDetail.findUnique({
    where: {
      userId: teacherId,
    },
  });

  return (
    <div className="p-6">
      <div className="details flex items-center w-full gap-8 mb-6">
        <Card className="p-6 w-1/2">
          <CardHeader className="text-2xl font-bold">Contact Detail</CardHeader>
          <CardContent>
            <label>Contact Name</label>
            <Input
              value={contact?.name}
              disabled={true}
              className="border-2 border-primary mt-1"
            />
          </CardContent>
          <CardContent>
            <label>Contact Email</label>
            <Input
              value={contact?.email}
              disabled={true}
              className="border-2 border-primary mt-1"
            />
          </CardContent>
          <CardContent>
            <label>Contact Number</label>
            <Input
              value={contact?.contact}
              disabled={true}
              className="border-2 border-primary mt-1"
            />
          </CardContent>
        </Card>
        <Card className="p-6 w-1/2">
          <CardHeader className="text-2xl font-bold">Bank Detail</CardHeader>
          <CardContent>
            <label>Account Holder Name</label>
            <Input
              value={bank?.name}
              disabled={true}
              className="border-2 border-primary mt-1"
            />
          </CardContent>
          <CardContent>
            <label>Bank IFSC Code</label>
            <Input
              value={bank?.ifsc}
              disabled={true}
              className="border-2 border-primary mt-1"
            />
          </CardContent>
          <CardContent>
            <label>Bank Account Number</label>
            <Input
              value={bank?.accountNumber}
              disabled={true}
              className="border-2 border-primary mt-1"
            />
          </CardContent>
        </Card>
      </div>

      <PayoutAction
        bank={bank!}
        contact={contact!}
        payoutRequestId={params.id}
        payoutRequestAmount={payoutRequest.amount}
      />
    </div>
  );
};

export default page;
