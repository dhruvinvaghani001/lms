"use client";
import { logo } from "@/assets";
import {
  ArrowRightLeft,
  BarChartHorizontal,
  BookDashed,
  Compass,
  List,
  PanelsLeftBottom,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { cn } from "@/lib/utils";
import SideBarLink from "./SideBarLink";

type Props = {};

const guetsRoutes = [
  {
    icon: PanelsLeftBottom,
    name: "Dashboard",
    href: "/",
  },
  {
    icon: Compass,
    name: "Explore",
    href: "/search",
  },
  {
    icon: ArrowRightLeft,
    name: "Transactions",
    href: "/transaction",
  },
];

const teacherRoutes = [
  {
    icon: List,
    name: "Course",
    href: "/teacher/courses",
  },
  {
    icon: BarChartHorizontal,
    name: "Analytics",
    href: "/teacher/analytics",
  },
];

const SideBar = (props: Props) => {
  const pathname = usePathname();

  const routes = pathname.startsWith("/teacher") ? teacherRoutes : guetsRoutes;
  return (
    <div className="w-56 h-screen border-r overflow-y-auto shadow-sm">
      <div className="flex flex-col justify-center items-start py-4">
        <div className="logo flex justify-start px-4">
          <Image src={logo} width={140} alt="logo" />
        </div>
        <div className="links flex flex-col justify-start items-start w-full mt-8">
          {routes.map((link, index) => {
            return (
              <SideBarLink
                key={index}
                icon={link.icon}
                name={link.name}
                href={link.href}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SideBar;
