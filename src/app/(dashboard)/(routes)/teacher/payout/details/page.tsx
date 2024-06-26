import React from "react";
import ContactForm from "./_components/ContactForm";
import BankDetailForm from "./_components/BankDetailForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MoveLeft } from "lucide-react";

const page = async () => {
  const { userId } = auth();
  if (!userId) {
    redirect("/");
  }
  const contact = await db.contactDetail.findFirst({
    where: {
      userId: userId,
    },
  });

  const bank = await db.bankDetail.findFirst({
    where: {
      userId: userId,
    },
  });

  return (
    <div className="p-6 py-10">
      <div>
        <Link href="/teacher/payout">
          <Button variant="ghost" className="flex items-center gap-4">
            <MoveLeft /> Back To Payout
          </Button>
        </Link>
      </div>
      <div className="flex flex-col md:flex-row gap-4 w-full mt-4">
        <div className="w-full md:w-1/2">
          <ContactForm
            name={contact?.name}
            email={contact?.email}
            mobilenumber={contact?.contact}
            isUpdate={contact == null ? false : true}
          />
        </div>
        <div className="w-full md:w-1/2">
          <BankDetailForm
            name={bank?.name}
            ifsc={bank?.ifsc}
            accountNumber={bank?.accountNumber}
            isUpdate={bank == null ? false : true}
          />
        </div>
      </div>
    </div>
  );
};

export default page;
