import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Continue with LMS",
  description: "authenticate your self to continue yout journey with lms",
  openGraph: {
    images: [
      "https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/8e3859178674563.6672a0a942de1.jpg",
    ],
  },
};
const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-screen flex justify-center items-center">{children}</div>
  );
};

export default AuthLayout;
