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
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { PenLine } from "lucide-react";
import { Card } from "@/components/ui/card";

import toast from "react-hot-toast";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
  categoryId: string | null;
  courseId: string;
  options: { label: string; value: string }[];
}

const formSchema = z.object({
  categoryId: z.string().min(1),
});

const CategoryForm = ({ categoryId, courseId, options }: CategoryFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditting] = useState(false);

  const toggleEdit = () => {
    setIsEditting((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      categoryId: categoryId || "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      toast.success(response.data.message);
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went Wrong!");
    }
  };

  const selectedCategory = options.find(
    (option) => option.value === categoryId
  );

  return (
    <div>
      <Card className="w-full">
        <div className="bg-card rounded-md p-4">
          <div className="flex justify-between gap-2 items-center">
            Course Category
            <Button variant="ghost" className="flex gap-2" onClick={toggleEdit}>
              {isEditing && <>Cancel</>}
              {!isEditing && (
                <>
                  {" "}
                  <PenLine />
                  Edit Category
                </>
              )}
            </Button>
          </div>
          <div className="form mt-2">
            {!isEditing && (
              <p className="italic font-semibold">
                {selectedCategory?.label || "No category"}{" "}
              </p>
            )}
            {isEditing && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Combobox options={options} {...field} />
                        </FormControl>
                        <FormDescription>
                          What will you teach in this course ?
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

export default CategoryForm;
