"use client";
import { ConfirmModal } from "@/components/modal/ConfirmModal";
import { Button } from "@/components/ui/button";
import axios from "axios";
import { CreditCard } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import toast from "react-hot-toast";

interface MakePayoutrequestProps {
  wallet: number;
}

const MakePayoutReqeust = ({ wallet }: MakePayoutrequestProps) => {
  const router = useRouter();
  const onMakePayoutRequest = async () => {
    try {
      const response = await axios.post("/api/payout", { amount: wallet });
      toast.success(response.data.message);
      router.refresh();
    } catch (error:any) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div>
      <ConfirmModal onConfirm={onMakePayoutRequest}>
        <Button className="flex gap-2 items-center">
          <CreditCard /> Make Payout request
        </Button>
      </ConfirmModal>
    </div>
  );
};

export default MakePayoutReqeust;
