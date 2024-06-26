import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import React from "react";
import PayoutAction from "./_components/PayoutAction";
import { redirect } from "next/navigation";

const page = async ({ params }: { params: { id: string } }) => {
  const payoutRequest = await db.payoutRequest.findUnique({
    where: {
      id: params.id,
    },
  });

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
      <PayoutAction
        bank={bank!}
        contact={contact!}
        payoutRequestId={params.id}
      />
    </div>
  );
};

export default page;
