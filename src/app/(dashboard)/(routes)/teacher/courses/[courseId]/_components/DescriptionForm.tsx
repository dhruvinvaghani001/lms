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
import { Textarea } from "@/components/ui/textarea";

interface DescriptionFormProps {
  description: string | null;
  courseId: string;
}

const formSchema = z.object({
  description: z.string().min(1, {
    message: "course description is required!",
  }),
});

const DescriptionForm = ({ description, courseId }: DescriptionFormProps) => {
  const router = useRouter();
  const [isEditing, setIsEditting] = useState(false);

  const toggleEdit = () => {
    setIsEditting((prev) => !prev);
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: description || "",
    },
  });

  const { isValid, isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/courses/${courseId}`, values);
      toast.success(response.data.message);
      console.log(response);
      toggleEdit();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong!");
    }
  };

  return (
    <div>
      <Card className="w-full">
        <div className="bg-card rounded-md p-4">
          <div className="flex justify-between gap-2 items-center">
            Course Description
            <Button variant="ghost" className="flex gap-2" onClick={toggleEdit}>
              {isEditing && <>Cancel</>}
              {!isEditing && (
                <>
                  {" "}
                  <PenLine />
                  Edit Description
                </>
              )}
            </Button>
          </div>
          <div className="form mt-4">
            {!isEditing && (
              <>
                {description || (
                  <p className="italic font-semibold">No description</p>
                )}
              </>
            )}
            {isEditing && (
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-8"
                >
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormControl>
                          <Textarea
                            disabled={isSubmitting}
                            placeholder="e.g This course about"
                            {...field}
                          />
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

export default DescriptionForm;
