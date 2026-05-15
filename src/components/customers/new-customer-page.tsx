"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { createCustomer } from "@/actions/customers";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

const customerSchema = z.object({
  firstName: z.string().min(2, "First name is required"),
  lastName: z.string().min(2, "Last name is required"),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
  phone: z.string().min(10, "Valid phone number is required"),
  address: z.string().optional(),
  notes: z.string().optional(),
});

type CustomerFormValues = z.infer<typeof customerSchema>;

export function NewCustomerPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerFormValues>({
    resolver: zodResolver(customerSchema),
  });

  const onSubmit = async (data: CustomerFormValues) => {
    try {
      setIsSubmitting(true);
      await createCustomer(data);
      router.push("/dashboard/customers");
    } catch (error) {
      console.error("Error creating customer:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="flex items-center gap-4 mb-8">
          <Button variant="ghost" onClick={() => router.back()} className="rounded-full w-10 h-10 p-0">
            ←
          </Button>
          <h1 className="text-3xl font-bold tracking-tight">Add New Customer</h1>
        </div>

        <Card className="border-none shadow-xl">
          <CardHeader>
            <CardTitle>Customer Details</CardTitle>
            <CardDescription>Enter the information of your new customer.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" {...register("firstName")} className={errors.firstName ? "border-red-500" : ""} />
                  {errors.firstName && <p className="text-xs text-red-500">{errors.firstName.message}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" {...register("lastName")} className={errors.lastName ? "border-red-500" : ""} />
                  {errors.lastName && <p className="text-xs text-red-500">{errors.lastName.message}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <Input id="phone" {...register("phone")} placeholder="+998 90 123 45 67" className={errors.phone ? "border-red-500" : ""} />
                {errors.phone && <p className="text-xs text-red-500">{errors.phone.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email (Optional)</Label>
                <Input id="email" type="email" {...register("email")} />
                {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Address (Optional)</Label>
                <Input id="address" {...register("address")} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <textarea
                  id="notes"
                  {...register("notes")}
                  className="w-full min-h-[100px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>

              <div className="pt-4 flex gap-3">
                <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" className="flex-1" disabled={isSubmitting}>
                  {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Create Customer
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
