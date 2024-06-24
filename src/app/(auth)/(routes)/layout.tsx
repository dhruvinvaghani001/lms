import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Continue with LMS",
  description: "authenticate your self to continue yout journey with lms",
};
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex justify-center items-center">{children}</div>
  );
};

export default AuthLayout;
