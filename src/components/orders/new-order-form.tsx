"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createOrder } from "@/actions/orders";
import { generateOrderNumber, formatCurrency } from "@/utils";
import { TrashIcon, PlusIcon, Loader2 } from "lucide-react";

const orderSchema = z.object({
  customerId: z.string().min(1, "Customer is required"),
  orderNumber: z.string(),
  status: z.enum(["PENDING", "PROCESSING", "SHIPPED", "DELIVERED", "CANCELLED"]),
  deliveryAddress: z.string().optional(),
  notes: z.string().optional(),
  items: z.array(z.object({
    productName: z.string().min(1, "Product name is required"),
    quantity: z.number().min(1, "Min quantity is 1"),
    unitPrice: z.number().min(0, "Min price is 0"),
    totalPrice: z.number(),
  })).min(1, "At least one item is required"),
});

type OrderFormValues = z.infer<typeof orderSchema>;

interface NewOrderFormProps {
  customers: any[];
}

export function NewOrderForm({ customers }: NewOrderFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<OrderFormValues>({
    resolver: zodResolver(orderSchema),
    defaultValues: {
      orderNumber: generateOrderNumber(),
      status: "PENDING",
      items: [{ productName: "", quantity: 1, unitPrice: 0, totalPrice: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "items",
  });

  const items = watch("items");

  // Update total price for each item when quantity or price changes
  useEffect(() => {
    items.forEach((item, index) => {
      const total = (item.quantity || 0) * (item.unitPrice || 0);
      if (item.totalPrice !== total) {
        setValue(`items.${index}.totalPrice`, total);
      }
    });
  }, [items, setValue]);

  const subtotal = items.reduce((acc, item) => acc + (item.totalPrice || 0), 0);
  const tax = subtotal * 0.1; // 10% tax example
  const total = subtotal + tax;

  const onSubmit = async (data: OrderFormValues) => {
    try {
      setIsSubmitting(true);
      await createOrder({
        ...data,
        totalAmount: subtotal,
        tax: tax,
        discount: 0,
        finalAmount: total,
      });
      router.push("/dashboard/orders");
    } catch (error) {
      console.error("Error creating order:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pb-20">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Info */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Items & Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <Label>Order Items</Label>
                {fields.map((field, index) => (
                  <div key={field.id} className="grid grid-cols-12 gap-3 items-end border-b border-border pb-4 last:border-0">
                    <div className="col-span-5 space-y-2">
                      <Label className="text-xs">Product Name</Label>
                      <Input {...register(`items.${index}.productName`)} placeholder="Item name" />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="text-xs">Qty</Label>
                      <Input type="number" {...register(`items.${index}.quantity`, { valueAsNumber: true })} />
                    </div>
                    <div className="col-span-2 space-y-2">
                      <Label className="text-xs">Price</Label>
                      <Input type="number" {...register(`items.${index}.unitPrice`, { valueAsNumber: true })} step="0.01" />
                    </div>
                    <div className="col-span-2 text-right py-2">
                      <Label className="text-xs">Total</Label>
                      <p className="font-bold py-1 text-sm">{formatCurrency(items[index]?.totalPrice || 0)}</p>
                    </div>
                    <div className="col-span-1">
                      <Button 
                        type="button" 
                        variant="ghost" 
                        size="icon" 
                        className="text-red-500 hover:text-red-700 hover:bg-red-50"
                        onClick={() => remove(index)}
                        disabled={fields.length === 1}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  className="w-full mt-2"
                  onClick={() => append({ productName: "", quantity: 1, unitPrice: 0, totalPrice: 0 })}
                >
                  <PlusIcon className="w-4 h-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-2 pt-4 border-t border-border">
                <Label htmlFor="deliveryAddress">Delivery Address</Label>
                <textarea
                  id="deliveryAddress"
                  {...register("deliveryAddress")}
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Enter full shipping address..."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Internal Notes</Label>
                <textarea
                  id="notes"
                  {...register("notes")}
                  className="w-full min-h-[80px] rounded-md border border-input bg-background px-3 py-2 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  placeholder="Any special instructions..."
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <Card className="border-none shadow-lg">
            <CardHeader>
              <CardTitle>Customer & Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="customerId">Select Customer</Label>
                <select
                  id="customerId"
                  {...register("customerId")}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">Select a customer...</option>
                  {customers.map((customer) => (
                    <option key={customer.id} value={customer.id}>
                      {customer.firstName} {customer.lastName} ({customer.phone})
                    </option>
                  ))}
                </select>
                {errors.customerId && <p className="text-xs text-red-500">{errors.customerId.message}</p>}
                <Link href="/dashboard/customers/new" className="text-xs text-primary hover:underline block mt-1">
                  + Create new customer
                </Link>
              </div>

              <div className="space-y-2">
                <Label>Order Number</Label>
                <Input {...register("orderNumber")} readOnly className="bg-muted" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Initial Status</Label>
                <select
                  id="status"
                  {...register("status")}
                  className="w-full px-3 py-2 rounded-md border border-input bg-background text-sm outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="PENDING">Pending</option>
                  <option value="PROCESSING">Processing</option>
                  <option value="SHIPPED">Shipped</option>
                </select>
              </div>

              <div className="pt-6 border-t border-border space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tax (10%)</span>
                  <span>{formatCurrency(tax)}</span>
                </div>
                <div className="flex justify-between font-bold text-lg pt-2 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{formatCurrency(total)}</span>
                </div>
              </div>

              <Button type="submit" className="w-full mt-6" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Create Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </form>
  );
}
