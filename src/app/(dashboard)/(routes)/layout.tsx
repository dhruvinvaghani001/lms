import SideBar from "@/app/(dashboard)/_components/SideBar";
import React from "react";
import NavBar from "../_components/NavBar";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Teacher Dashboard",
  description: "teacher dashborad to make course and publish",
};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full md:flex">
      <section className="hidden h-full  md:flex fixed">
        <SideBar />
      </section>
      <section className="w-full md:w-[calc(100%_-_224px)] md:ml-56">
        <div className="h-[80px] fixed inset-y-0  w-full  md:w-[calc(100%_-_224px)] z-50">
          <NavBar />
        </div>
        <main className="mt-[80px] h-[calc(100%_-_80px)] pb-10">
          {children}
        </main>
      </section>
    </main>
  );
};

export default DashboardLayout;
