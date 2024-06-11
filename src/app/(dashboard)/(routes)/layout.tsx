import SideBar from "@/app/(dashboard)/_components/SideBar";
import React from "react";
import NavBar from "../_components/NavBar";

type Props = {};

const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <main className="h-full md:flex">
      <section className="hidden h-full  md:flex">
        <SideBar />
      </section>
      <section className="w-full md:w-[calc(100%_-_224px)]">
        <div className="h-[80px] fixed inset-y-0  w-full  md:w-[calc(100%_-_224px)] z-50">
          <NavBar />
        </div>
        <main className="mt-[80px] h-[calc(100%_-_80px)]">{children}</main>
      </section>
    </main>
  );
};

export default DashboardLayout;
