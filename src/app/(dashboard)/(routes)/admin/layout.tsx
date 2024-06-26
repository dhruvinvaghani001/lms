import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  const { userId } = auth();

  if (userId !== "user_2hgq3KSE0iNrPkeTIfaFX0aW1bT") {
    redirect("/");
  }

  return <>{children}</>;
};

export default layout;
