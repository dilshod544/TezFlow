"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { updateUserSettings } from "@/actions/settings";
import { Loader2, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SettingsClientProps {
  initialSettings: {
    name: string | null;
    email: string;
    phone: string | null;
    telegramBotToken: string | null;
    telegramChatId: string | null;
  };
}

export function SettingsClient({ initialSettings }: SettingsClientProps) {
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: initialSettings.name || "",
    phone: initialSettings.phone || "",
    telegramBotToken: initialSettings.telegramBotToken || "",
    telegramChatId: initialSettings.telegramChatId || "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSuccess(false);
    try {
      await updateUserSettings(formData);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error("Error saving settings:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="p-6 space-y-8 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
          <p className="text-muted-foreground mt-1">
            Manage your account and Telegram integration
          </p>
        </div>
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex items-center gap-2 text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-200"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span className="text-sm font-medium">Settings saved!</span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="grid gap-8">
        {/* Profile Settings */}
        <Card className="border-none shadow-lg">
          <CardHeader>
            <CardTitle>Profile Settings</CardTitle>
            <CardDescription>
              Update your personal information used in the CRM.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="bg-muted/30 border-none shadow-inner"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    value={initialSettings.email}
                    disabled
                    className="bg-muted border-none cursor-not-allowed"
                  />
                  <p className="text-[10px] text-muted-foreground">Email cannot be changed.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={handleChange}
                    disabled={isSaving}
                    className="bg-muted/30 border-none shadow-inner"
                  />
                </div>
              </div>

              <Button type="submit" disabled={isSaving} className="shadow-md">
                {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                Save Profile
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* Telegram Integration */}
        <Card className="border-none shadow-lg bg-gradient-to-br from-card to-blue-50/30 dark:to-blue-900/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Telegram Integration
            </CardTitle>
            <CardDescription>
              Receive real-time order notifications on your Telegram account.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="telegramBotToken">Telegram Bot Token</Label>
                <Input
                  id="telegramBotToken"
                  name="telegramBotToken"
                  type="password"
                  placeholder="123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11"
                  value={formData.telegramBotToken}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="bg-muted/30 border-none shadow-inner"
                />
                <p className="text-xs text-muted-foreground">
                  Get your bot token from <a href="https://t.me/BotFather" target="_blank" className="text-primary hover:underline">@BotFather</a> on Telegram.
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="telegramChatId">Telegram Chat ID</Label>
                <Input
                  id="telegramChatId"
                  name="telegramChatId"
                  placeholder="123456789"
                  value={formData.telegramChatId}
                  onChange={handleChange}
                  disabled={isSaving}
                  className="bg-muted/30 border-none shadow-inner"
                />
                <p className="text-xs text-muted-foreground">
                  Your personal Telegram chat ID. Use <a href="https://t.me/userinfobot" target="_blank" className="text-primary hover:underline">@userinfobot</a> to find it.
                </p>
              </div>

              <div className="pt-4 flex items-center gap-4">
                <Button type="submit" disabled={isSaving} className="bg-primary shadow-md">
                  {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
                  Save Telegram Settings
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => alert("Notification test logic would go here!")}>
                  Test Notification
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="border-2 border-red-500/20 bg-red-50/5 dark:bg-red-900/5">
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>
              Actions that will permanently affect your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-background rounded-lg border border-red-200">
              <div>
                <p className="font-bold">Delete Account</p>
                <p className="text-xs text-muted-foreground">All data, orders, and customers will be permanently removed.</p>
              </div>
              <Button variant="destructive" size="sm">
                Delete Everything
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
