"use client";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { Button } from "@/components/ui/button";
import { BankDetail, ContactDetail } from "@prisma/client";
import axios from "axios";
import React from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface PayoutActionProps {
  bank: BankDetail;
  contact: ContactDetail;
  payoutRequestId: string;
  payoutRequestAmount: number;
}

const PayoutAction = ({
  bank,
  contact,
  payoutRequestId,
  payoutRequestAmount,
}: PayoutActionProps) => {
  const router = useRouter();

  const onAccept = async () => {
    try {
      const response = await axios.patch(
        `/api/admin/payout/${payoutRequestId}`,
        { amount: payoutRequestAmount, bank: bank, contact: contact }
      );
      toast.success(response.data.message);
      router.push("/admin");
      router.refresh();
    } catch (error) {
      toast.error("Something went Wrong!");
      router.push("/admin");
      router.refresh();
    }
  };
  const onReject = async () => {
    try {
      const response = await axios.patch(
        `/api/admin/payout/${payoutRequestId}/reject`
      );
      toast.success(response.data.message);
      router.push("/admin");
      router.refresh();
    } catch (error) {
      toast.error("Something Went Wrong");
      router.push("/admin");
      router.refresh();
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
