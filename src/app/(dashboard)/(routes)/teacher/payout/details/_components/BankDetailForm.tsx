"use client";
import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Button } from "@/components/ui/button";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

const formSchema = z.object({
  name: z.string().min(1, { message: "name is required" }),
  ifsc: z.string().length(11, { message: "ifsc should be 11 digits" }),
  accountNumber: z
    .string()
    .min(8, { message: "account should be length of 8 to 30!" }),
});

interface BankDetailFormProps {
  name?: string;
  ifsc?: string;
  accountNumber?: string;
  isUpdate: boolean;
}

const BankDetailForm = ({
  name,
  ifsc,
  accountNumber,
  isUpdate,
}: BankDetailFormProps) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: name,
      ifsc: ifsc,
      accountNumber: accountNumber,
    },
  });
  console.log(isUpdate);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      let response;
      if (isUpdate) {
        response = await axios.patch("/api/bankdetail", values);
      } else {
        response = await axios.post("/api/bankdetail", values);
      }
      toast.success(response.data.message);
      router.refresh();
      // router.push("/teacher/payout");
    } catch (error) {
      console.log(error);
      toast.error("something went wrong!");
    }
  }

  return (
    <Card>
      <CardHeader className="text-xl font-bold">Bank Details</CardHeader>
      <CardContent>
        <div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Account Holder Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Account holder name" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="ifsc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank IFSC Code</FormLabel>
                    <FormControl>
                      <Input placeholder="IFSC Code" {...field} />
                    </FormControl>
                    <FormDescription>valid IFSC code</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="accountNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Bank Account Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Account Number" {...field} />
                    </FormControl>
                    <FormDescription>
                      please enter carefully Bank acccount Number!
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

export default BankDetailForm;
