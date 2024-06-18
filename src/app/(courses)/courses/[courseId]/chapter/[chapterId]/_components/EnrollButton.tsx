"use client";
import { Button } from "@/components/ui/button";
import formatPrice from "@/lib/formatPrice";
import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";

interface EnrollButtonProps {
  price: number | null;
  courseId: string;
}

const EnrollButton = ({ price, courseId }: EnrollButtonProps) => {
  const [isLoading, setIsLoading] = useState(false);

  const onClick = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post(`/api/courses/${courseId}/checkout`);
      console.log(response);
      window.location.assign(response.data.url);
    } catch (error) {
      toast.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Button variant="default" onClick={onClick} disabled={isLoading}>
        Enroll For {formatPrice(price || 0)}
      </Button>
    </>
  );
};

export default EnrollButton;
