"use client";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { Button } from "@/components/ui/button";
import { BankDetail, ContactDetail } from "@prisma/client";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { Status } from "@prisma/client";
import { useRouter } from "next/navigation";

interface PayoutActionProps {
  bank: BankDetail;
  contact: ContactDetail;
  payoutRequestId: string;
}

const PayoutAction = ({
  bank,
  contact,
  payoutRequestId,
}: PayoutActionProps) => {
  const router = useRouter();

  const onAccept = async () => {
    try {
      const response = await axios.patch(
        `/api/admin/payout/${payoutRequestId}`,
        { status: Status.Success }
      );
      router.refresh();
      toast.success(response.data.message);
    } catch (error:any) {
      console.log("onaccept some thing went wwrong");
      toast.error(error.response.data.message);
    }
  };
  const onReject = async () => {
    try {
      const response = await axios.patch(
        `/api/admin/payout/${payoutRequestId}`,
        { status: Status.Faild }
      );
      router.refresh();
      toast.success(response.data.message);
    } catch (error) {
      console.log("onaccept some thing went wwrong");
      toast.error(error.response.data.message);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <ConfirmModal onConfirm={onAccept}>
        <Button variant="default">Accept</Button>
      </ConfirmModal>
      <ConfirmModal onConfirm={onReject}>
        <Button variant="destructive">Reject</Button>
      </ConfirmModal>
    </div>
  );
};

export default PayoutAction;
