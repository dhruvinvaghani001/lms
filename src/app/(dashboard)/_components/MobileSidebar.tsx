"use client";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import React from "react";
import SideBar from "./SideBar";

type Props = {};

const MobileSidebar = (props: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Menu className="inline md:hidden" />
      </SheetTrigger>
      <SheetContent className="w-56 p-0" side="left">
        <SideBar />
      </SheetContent>
    </Sheet>
  );
};

export default MobileSidebar;
