"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  email: z.string().email({ message: "Email is required!" }),
  contact: z
    .string()
    .length(10, { message: "contact number shhould be 10 digit!" }),
});

interface ContactFormProps {
  name?: string;
  email?: string;
  mobilenumber?: string;
  isUpdate: boolean;
}

const ContactForm = ({
  name,
  email,
  mobilenumber,
  isUpdate,
}: ContactFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      email: email,
      contact: mobilenumber,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let response;
      if (isUpdate) {
        response = await axios.patch("/api/contact", values);
      } else {
        response = await axios.post("/api/contact", values);
      }
      toast.success(response.data.message);
      router.refresh();
      // router.push("/teacher/payout");
    } catch (error:any) {
      console.log(error);
      toast.error("something went wrong!");
    }
  }

  return (
    <Card>
      <CardHeader className="text-xl font-bold">Contact Details</CardHeader>
      <CardContent>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact Name</FormLabel>
                    <FormControl>
                      <Input placeholder="name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g email" {...field} />
                    </FormControl>
                    <FormDescription>this should be valid</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="contact"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Contact</FormLabel>
                    <FormControl>
                      <Input placeholder="e.g 9173658555" {...field} />
                    </FormControl>
                    <FormDescription>
                      contact number should be valid and active
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Submit</Button>
            </form>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContactForm;
