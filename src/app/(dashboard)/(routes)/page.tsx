"use client";
import { Menu, Sheet } from "lucide-react";
import SideBar from "@/app/(dashboard)/_components/SideBar";
import {
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";


export default function Home() {
  return (
    <div>
      <UserButton />
    </div>
  );
}
