import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

type Props = {};

const page = (props: Props) => {
  return (
    <div className="p-6">
      <Link href="/teacher/payout/details">
        <Button>Submit details</Button>
      </Link>
    </div>
  );
};

export default page;
