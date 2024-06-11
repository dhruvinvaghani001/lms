"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SideBarLink {
  icon: LucideIcon;
  name: string;
  href: string;
}

const SideBarLink = ({ icon: Icon, name, href }: SideBarLink) => {
  const pathname = usePathname();

  const isaActive = (pathname === "/" && href === "/") || pathname === href;
  return (
    <>
      <Link
        href={href}
        className={cn(
          "px-4 flex gap-2 w-full py-4 duration-400 hover:bg-muted font-bold text-slate-500",
          isaActive && "bg-border hover:bg-secondary border-r-4 border-primary"
        )}
      >
        <Icon width={20} />
        {name}
      </Link>
    </>
  );
};

export default SideBarLink;
