"use client"

import { Button } from "@/components/ui/button";
import { Course } from "@prisma/client"
import { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, PencilIcon } from "lucide-react"
import { DropdownMenu, DropdownMenuItem, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import formatPrice from "@/lib/formatPrice";

export const columns: ColumnDef<Course>[] = [
    {
        accessorKey: "title",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Title
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
    },
    {
        accessorKey: "price",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Price
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const price = parseFloat(row.getValue("price") || 0);
            const formatedPrice = formatPrice(price);
            return <div>{formatedPrice}</div>
        }
    },
    {
        accessorKey: "isPublished",
        header: ({ column }) => {
            return (
                <Button
                    variant="ghost"
                    onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
                >
                    Published
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
            )
        },
        cell: ({ row }) => {
            const { isPublished } = row.original;
            return (<Badge variant="secondary">{isPublished ? "Published" : "Draft"}</Badge>)
        }
    },
    {
        id: "actions",
        cell: ({ row }) => {
            const { id } = row.original;
            return (<DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="">
                        <span className="sr-only">Open Menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <Link href={`/teacher/courses/${id}`}>
                        <DropdownMenuItem className="flex gap-4">
                            <PencilIcon className="h-4 w-4" />
                            Edit
                        </DropdownMenuItem>
                    </Link>
                </DropdownMenuContent>
            </DropdownMenu>)
        }
    }
]
