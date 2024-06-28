"use client";

import { Button } from "@/components/ui/button";
import formatPrice from "@/lib/formatPrice";
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal } from "lucide-react";
import Link from "next/link";

type Course = {
  title: string;
  priceOfPurchase: number;
  reciptUrl: string | null;
};

export const columns: ColumnDef<Course>[] = [
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Course Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "priceOfPurchase",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Purchase Price
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const price = parseFloat(row.getValue("priceOfPurchase"));
      const formatedPrice = formatPrice(price);
      return <div>{formatedPrice}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { reciptUrl } = row.original;

      return (
        <Link href={reciptUrl || ""} target="_blank">
          <Button>View reciept</Button>
        </Link>
      );
    },
  },
];
