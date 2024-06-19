"use client";
import { Progress } from "@radix-ui/react-progress";
import React from "react";

interface UserProgressProps {
  value: number;
}

const UserProgressBar = ({ value }: UserProgressProps) => {
  return (
    <>
      <Progress value={value} />
    </>
  );
};

export default UserProgressBar;
