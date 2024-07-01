"use client";
import React, { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import z from "zod";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import { Card } from "@/components/ui/card";

import toast from "react-hot-toast";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";

import formatPrice from "@/lib/formatPrice";

interface PriceFormProps {
  price: number | null | undefined;
  courseId: string;
}

const formSchema = z.object({
  price: z.coerce.number(),
});

const PriceForm = ({ price, courseId }: PriceFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditting] = useState(false);

  const toggleEdit = () => {
    setIsEditting((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      price: price || undefined,
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      toast.success(response.data.message);
      toggleEdit();
      router.refresh();
    } catch (error:any) {
      toast.error(error?.response?.data?.message);
    }
  };

  return (
    <div>
      <Card className="w-full">
        <div className="bg-card rounded-md p-4">
          <div className="flex justify-between gap-2 items-center">
            Course Selling Price
            <Button variant="ghost" className="flex gap-2" onClick={toggleEdit}>
              {isEditing && <>Cancel</>}
              {!isEditing && (
                <>
                  {" "}
                  <PenLine />
                  Edit Price
                </>
              )}
            </Button>
          </div>
          <div className="form mt-2">
            {!isEditing && <>{(price && formatPrice(price)) || "No price"}</>}
            {isEditing && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="price"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Input
                            type="number"
                            disabled={isSubmitting}
                            placeholder="e.g $15.00"
                            {...field}
                          />
                        </FormControl>
                        <FormDescription>
                          At which cost you want to sell this course ?
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="">
                    <Button disabled={isSubmitting || !isValid} type="submit">
                      Save
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default PriceForm;
