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
    <Card className="py-2 px-4 flex items-center gap-4">
      <div className="icon p-2 bg-muted rounded-full flex items-center justify-center">
        <Icon
          width={34}
          height={34}
          color={label == "Completed" ? "green" : "red"}
        />
      </div>
      <div>
        <p>{label}</p>
        <p className="font-semibold"> $ {count} </p>
      </div>
    </Card>
  );
};

export default StatsCard;
