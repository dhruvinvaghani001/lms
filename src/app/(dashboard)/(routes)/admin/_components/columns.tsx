"use client";

import { Button } from "@/components/ui/button";
import { Status } from "@prisma/client";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal, PencilIcon } from "lucide-react";
import Link from "next/link";

export type PayoutReqeust = {
  id: string;
  amount: number;
  status: Status;
  userId: string;
};

export const columns: ColumnDef<PayoutReqeust>[] = [
  {
    accessorKey: "userId",
    header: "userId",
  },
  {
    accessorKey: "amount",
    header: "Amount",
  },
  {
    accessorKey: "status",
    header: "Staus",
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { id } = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="">
              <span className="sr-only">Open Menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <Link href={`/admin/payout/${id}`}>
              <DropdownMenuItem className="flex gap-4">
                <PencilIcon className="h-4 w-4" />
                Edit
              </DropdownMenuItem>
            </Link>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];
