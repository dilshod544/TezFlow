import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { redirect } from "next/navigation";
import { getAnalyticsOverview } from "@/actions/stats";
import { AnalyticsClient } from "@/components/analytics/analytics-client";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const analytics = await getAnalyticsOverview();

  return <AnalyticsClient data={analytics} />;
}
