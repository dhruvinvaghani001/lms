"use client";

import { Button } from "@/components/ui/button";
import { Status } from "@prisma/client";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import formatPrice from "@/lib/formatPrice";

export type PayoutReqeust = {
  id: string;
  amount: number;
  status: Status;
  name: string;
};

export const columns: ColumnDef<PayoutReqeust>[] = [
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Teacher Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Amount
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("amount"));
      const formatedPrice = formatPrice(price);
      return <div>{formatedPrice}</div>;
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const { status } = row.original;

      return (
        <Badge
          variant={
            status === Status.Faild
              ? "destructive"
              : status === Status.Success
              ? "success"
              : "default"
          }
        >
          {status}
        </Badge>
      );
    },
  },
];
