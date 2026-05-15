"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogoIcon } from "@/components/icons";
import { Users, Shield } from "lucide-react";

export default function SignupPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900 p-4">
      <div className="w-full max-w-2xl space-y-8">
        {/* Logo / Branding */}
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-lg bg-primary text-primary-foreground mb-4">
            <LogoIcon className="w-6 h-6" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">TezFlow</h1>
          <p className="text-muted-foreground mt-2">
            Manage orders and customers for Telegram sellers
          </p>
        </div>

        {/* Signup Options */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Admin/Manager Signup */}
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Shield className="w-6 h-6 text-primary" />
                <CardTitle>Sign Up for Admins</CardTitle>
              </div>
              <CardDescription>
                Create a business account and manage your sales team
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Perfect for business owners and managers who want to:
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Create your own company/brand</li>
                <li>✓ Manage sales team members</li>
                <li>✓ View all sales statistics</li>
                <li>✓ Track employee performance</li>
              </ul>
              <Link href="/signup/admin" className="block">
                <Button className="w-full">Get Started as Admin</Button>
              </Link>
            </CardContent>
          </Card>

          {/* Worker Signup */}
          <Card className="border-2 hover:border-primary/50 transition-colors">
            <CardHeader>
              <div className="flex items-center gap-2 mb-2">
                <Users className="w-6 h-6 text-blue-600" />
                <CardTitle>Sign Up for Workers</CardTitle>
              </div>
              <CardDescription>
                Join a company and start managing sales
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">
                For team members (Managers & Sales):
              </p>
              <ul className="text-sm space-y-2 text-muted-foreground">
                <li>✓ Join an existing company</li>
                <li>✓ Managers can create sales accounts</li>
                <li>✓ Track your sales performance</li>
                <li>✓ Manage customer orders</li>
              </ul>
              <Link href="/signup/worker" className="block">
                <Button variant="outline" className="w-full">Sign Up as Worker</Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Login Link */}
        <div className="text-center">
          <p className="text-sm text-muted-foreground">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
