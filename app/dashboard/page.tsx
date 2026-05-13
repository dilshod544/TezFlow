import { getServerSession } from "next-auth";
import { authOptions } from "@/config/auth";
import { getDashboardStats } from "@/actions/stats";
import { getOrders } from "@/actions/orders";
import { DashboardContent } from "@/components/dashboard/dashboard-content";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const { stats, chartData } = await getDashboardStats();
  const allOrders = await getOrders();
  const recentOrders = allOrders.slice(0, 5);

  return (
    <DashboardContent 
      stats={stats} 
      chartData={chartData} 
      recentOrders={recentOrders}
      userName={session.user?.name || "User"}
    />
  );
}
