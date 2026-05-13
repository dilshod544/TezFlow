import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { getUserSettings } from "@/actions/settings";
import { SettingsClient } from "@/components/settings/settings-client";
import { redirect } from "next/navigation";

export default async function SettingsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const settings = await getUserSettings();

  if (!settings) {
    return <div>Error loading settings.</div>;
  }

  return <SettingsClient initialSettings={settings} />;
}
