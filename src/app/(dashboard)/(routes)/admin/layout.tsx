import isAdmin from "@/lib/isAdmin";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { redirect } from "next/navigation";
import React from "react";

export const metadata: Metadata = {
  title: "Admin Daashboard",
  description: "Admin dashboard",
};

const layout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (!userId) {
    redirect("/");
  }

  if (!isAdmin(userId)) {
    redirect("/");
  }

  return <>{children}</>;
};

export default layout;
