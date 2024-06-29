"use client";
import React from "react";
import MobileSidebar from "./MobileSidebar";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { ModeToggle } from "@/components/ui/them-toggle";
import SearchInput from "./SearchInput";
import { cn } from "@/lib/utils";

type Props = {};

const NavBar = (props: Props) => {
  const pathname = usePathname();
  const isTeacherPage = pathname?.startsWith("/teacher");
  const isPLayerPage = pathname?.includes("/chapter");
  const isSearchPage = pathname === "/search";

  return (
    <>
      <nav
        className={cn(
          "h-full p-4 border-b  bg-primary-foreground flex items-center  justify-between md:justify-end   z-10",
          isSearchPage && "justify-between md:justify-between"
        )}
      >
        <MobileSidebar />
        {isSearchPage && (
          <>
            <SearchInput />
          </>
        )}

        <div className="flex gap-2">
          {isTeacherPage ? (
            <Link href="/">
              <Button variant="ghost" className="flex gap-2">
                <LogOut width={22} />
                Exit
              </Button>
            </Link>
          ) : (
            <Link href="/teacher/courses">
              <Button variant="ghost">Teacher Mode</Button>
            </Link>
          )}
          <ModeToggle />
          <UserButton />
        </div>
      </nav>
    </>
  );
};

export default NavBar;
