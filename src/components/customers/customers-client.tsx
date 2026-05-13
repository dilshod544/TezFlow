"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PlusIcon, SearchIcon, UserIcon, PhoneIcon, MapPinIcon } from "@/components/icons";
import { formatPhoneNumber, formatDate, getInitials, cn } from "@/utils";
import { motion, AnimatePresence } from "framer-motion";

interface CustomersClientProps {
  initialCustomers: any[];
}

export function CustomersClient({ initialCustomers }: CustomersClientProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCustomers, setFilteredCustomers] = useState(initialCustomers);

  useEffect(() => {
    if (searchTerm) {
      const filtered = initialCustomers.filter((customer) =>
        customer.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        customer.phone.includes(searchTerm) ||
        customer.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCustomers(filtered);
    } else {
      setFilteredCustomers(initialCustomers);
    }
  }, [searchTerm, initialCustomers]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Customers</h1>
          <p className="text-muted-foreground mt-1">
            Maintain your customer database and history
          </p>
        </div>
        <Link href="/dashboard/customers/new">
          <Button className="gap-2 shadow-md">
            <PlusIcon className="w-4 h-4" />
            Add Customer
          </Button>
        </Link>
      </div>

      {/* Search */}
      <Card className="border-none shadow-lg bg-card/50 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search by name, phone or email..."
              value={searchTerm}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTerm(e.target.value)}
              className="pl-9 bg-background/50 border-none shadow-inner"
            />
          </div>
        </CardContent>
      </Card>

      {/* Customers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredCustomers.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full py-20 text-center"
            >
              <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                <UserIcon className="w-10 h-10 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-bold">No customers found</h3>
              <p className="text-muted-foreground">Try adjusting your search or add a new customer.</p>
            </motion.div>
          ) : (
            filteredCustomers.map((customer, index) => (
              <motion.div
                key={customer.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link href={`/dashboard/customers/${customer.id}`}>
                  <Card className="h-full border-none shadow-md hover:shadow-xl transition-all hover:-translate-y-1 group">
                    <CardContent className="pt-6">
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-bold text-lg group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                          {getInitials(`${customer.firstName} ${customer.lastName}`)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-bold text-lg truncate group-hover:text-primary transition-colors">
                            {customer.firstName} {customer.lastName}
                          </h3>
                          <div className="flex flex-col gap-1 mt-2">
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <PhoneIcon className="w-3 h-3" />
                              <span>{formatPhoneNumber(customer.phone)}</span>
                            </div>
                            {customer.email && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground truncate">
                                <span className="w-3 text-center">@</span>
                                <span className="truncate">{customer.email}</span>
                              </div>
                            )}
                            {customer.city && (
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <MapPinIcon className="w-3 h-3" />
                                <span>{customer.city}, {customer.country || "Uzbekistan"}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                    <div className="px-6 pb-6 mt-auto">
                      <div className="pt-4 border-t border-border flex items-center justify-between text-xs text-muted-foreground">
                        <span>Added {formatDate(customer.createdAt)}</span>
                        <span className="font-medium text-primary">View Profile →</span>
                      </div>
                    </div>
                  </Card>
                </Link>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
