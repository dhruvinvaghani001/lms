import { Card } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import React from "react";

interface StatsCardProps {
  label: string;
  count: number;
  icon: LucideIcon;
}

const StatsCard = ({ label, count, icon: Icon }: StatsCardProps) => {
  return (
    <Card className="p-4 md:py-2 px-4 flex items-center gap-4">
      <div className="icon p-2 bg-muted rounded-full flex items-center justify-center">
        <Icon
          width={34}
          height={34}
          color={label == "Total Sales" ? "red" : "#136F63"}
        />
      </div>
      <div>
        <p>{label}</p>
        <p className="font-semibold">
          {" "}
          {label == "Total Sales" ? "" : "$"}
          {count}{" "}
        </p>
      </div>
    </Card>
  );
};

export default StatsCard;
