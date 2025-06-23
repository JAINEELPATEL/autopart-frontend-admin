"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "@/store/slices/dashboardSlice";
import { RootState } from "@/src/store";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import {
  Users,
  ShoppingCart,
  MessageSquare,
  HelpCircle,
  AlertTriangle,
  Bell,
  Search,
  ChevronDown,
  Car,
  FileText,
  Loader2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DashboardChart } from "@/components/dashboard-chart";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { stats, loading, error } = useSelector(
    (state: RootState) => state.dashboard
  );
  const router = useRouter();
  useEffect(() => {
    dispatch(fetchDashboardStats() as any);
  }, [dispatch]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen w-full overflow-hidden">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }
  if (error) return <div>Error: {error}</div>;
  if (!stats) return null;

  // Stats
  const percent = stats.percentChanges;
  const statCards = [
    {
      title: "Total Sellers",
      value: stats.totalSellers,
      change: `${percent.sellers > 0 ? "+" : ""}${percent.sellers}%`,
      icon: Users,
      color: "bg-blue-500/10",
      textColor: "text-blue-500",
    },
    {
      title: "Total Buyers",
      value: stats.totalBuyers,
      change: `${percent.buyers > 0 ? "+" : ""}${percent.buyers}%`,
      icon: ShoppingCart,
      color: "bg-green-500/10",
      textColor: "text-green-500",
    },
    {
      title: "Active Enquiries",
      value: stats.activeEnquiries,
      change: `${percent.enquiries > 0 ? "+" : ""}${percent.enquiries}%`,
      icon: MessageSquare,
      color: "bg-orange-500/10",
      textColor: "text-orange-500",
    },
    {
      title: "Open Tickets",
      value: stats.openTickets,
      change: `${percent.tickets > 0 ? "+" : ""}${percent.tickets}%`,
      icon: HelpCircle,
      color: "bg-red-500/10",
      textColor: "text-red-500",
    },
  ];

  // Recent Activity
  const recentActivity = [
    {
      type: "seller",
      action: "New seller registration",
      user:
        stats.recentActivity.recentSellers[0]?.company_name ||
        stats.recentActivity.recentSellers[0]?.name,
      time: stats.recentActivity.recentSellers[0]?.created_at
        ? new Date(
            stats.recentActivity.recentSellers[0].created_at
          ).toLocaleString()
        : "",
    },
    {
      type: "enquiry",
      action: "New enquiry submitted",
      user: stats.recentActivity.recentEnquiry[0]?.id,
      time: stats.recentActivity.recentEnquiry[0]?.created_at
        ? new Date(
            stats.recentActivity.recentEnquiry[0].created_at
          ).toLocaleString()
        : "",
    },
    {
      type: "quotation",
      action: "Quotation sent",
      user: stats.recentActivity.recentQuotation[0]?.id,
      time: stats.recentActivity.recentQuotation[0]?.created_at
        ? new Date(
            stats.recentActivity.recentQuotation[0].created_at
          ).toLocaleString()
        : "",
    },
    {
      type: "ticket",
      action: "Support ticket created",
      user: stats.recentActivity.recentTicket[0]?.id,
      time: stats.recentActivity.recentTicket[0]?.created_at
        ? new Date(
            stats.recentActivity.recentTicket[0].created_at
          ).toLocaleString()
        : "",
    },
    {
      type: "seller",
      action: "Seller verification completed",
      user:
        stats.recentActivity.recentVerification[0]?.company_name ||
        stats.recentActivity.recentVerification[0]?.name,
      time: stats.recentActivity.recentVerification[0]?.created_at
        ? new Date(
            stats.recentActivity.recentVerification[0].created_at
          ).toLocaleString()
        : "",
    },
  ];

  // Seller Verification
  const sellerVerification = stats.sellerVerification;

  // Top Sellers
  const topSellers = stats.topSellers;

  // System Alerts
  const systemAlerts = stats.systemAlerts;

  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <SidebarTrigger className="-ml-2" />
          <h1 className="text-xl font-semibold">Dashboard</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search..."
              className="w-64 rounded-full bg-muted pl-8 focus-visible:ring-primary"
            />
          </div>
          {/* <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-1">
                <span>Today</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Today</DropdownMenuItem>
              <DropdownMenuItem>Yesterday</DropdownMenuItem>
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>This month</DropdownMenuItem>
              <DropdownMenuItem>Last month</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu> */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <span className="absolute right-1 top-1 flex h-2 w-2 rounded-full bg-red-500"></span>
          </Button>
        </div>
      </header>

      <div className="p-6">
        <div className="mb-6 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {statCards.map((stat: any, i: any) => (
            <div key={i} className="insight-stat-card">
              <div className={`insight-stat-icon ${stat.color}`}>
                <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
              </div>
              <div className="mt-2 text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  {stat.title}
                </div>
                <div
                  className={`text-sm ${
                    stat.change.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {stat.change}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mb-6 grid gap-6 lg:grid-cols-3">
          <div className="insight-card lg:col-span-2">
            <div className="insight-card-header">
              <h2 className="insight-card-title">Marketplace Activity</h2>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm">
                    This Month <ChevronDown className="ml-2 h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>This Week</DropdownMenuItem>
                  <DropdownMenuItem>This Month</DropdownMenuItem>
                  <DropdownMenuItem>This Quarter</DropdownMenuItem>
                  <DropdownMenuItem>This Year</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
            <div className="insight-card-content">
              <div className="h-[300px] w-full">
                <DashboardChart
                  marketplaceActivity={stats.marketplaceActivity}
                />
              </div>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-card-header">
              <h2 className="insight-card-title">Recent Activity</h2>
              {/* <Button variant="ghost" size="sm" className="text-primary">
                View All
              </Button> */}
            </div>
            <div className="insight-card-content">
              <div className="space-y-5">
                {recentActivity.map((activity, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <div
                      className={`mt-0.5 flex h-9 w-9 items-center justify-center rounded-full ${
                        activity.type === "seller"
                          ? "bg-blue-100 text-blue-600"
                          : activity.type === "enquiry"
                          ? "bg-green-100 text-green-600"
                          : activity.type === "quotation"
                          ? "bg-orange-100 text-orange-600"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {activity.type === "seller" ? (
                        <Users className="h-4 w-4" />
                      ) : activity.type === "enquiry" ? (
                        <Car className="h-4 w-4" />
                      ) : activity.type === "quotation" ? (
                        <FileText className="h-4 w-4" />
                      ) : (
                        <HelpCircle className="h-4 w-4" />
                      )}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium">{activity.action}</p>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        by {activity.user}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div className="insight-card">
            <div className="insight-card-header">
              <h2 className="insight-card-title">Seller Verification</h2>
              <Badge variant="outline" className="text-blue-600">
                {sellerVerification.pendingVerification} Pending
              </Badge>
            </div>
            <div className="insight-card-content space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Pending Verification</span>
                  <span className="font-medium">
                    {sellerVerification.pendingVerification}
                  </span>
                </div>
                <Progress
                  value={Math.min(
                    100,
                    (sellerVerification.pendingVerification /
                      (sellerVerification.pendingVerification +
                        sellerVerification.verifiedSellers +
                        sellerVerification.bannedSellers)) *
                      100
                  )}
                  className="h-2 bg-blue-100"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Verified Sellers</span>
                  <span className="font-medium">
                    {sellerVerification.verifiedSellers}
                  </span>
                </div>
                <Progress
                  value={Math.min(
                    100,
                    (sellerVerification.verifiedSellers /
                      (sellerVerification.pendingVerification +
                        sellerVerification.verifiedSellers +
                        sellerVerification.bannedSellers)) *
                      100
                  )}
                  className="h-2 bg-green-100"
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Banned Sellers</span>
                  <span className="font-medium">
                    {sellerVerification.bannedSellers}
                  </span>
                </div>
                <Progress
                  value={Math.min(
                    100,
                    (sellerVerification.bannedSellers /
                      (sellerVerification.pendingVerification +
                        sellerVerification.verifiedSellers +
                        sellerVerification.bannedSellers)) *
                      100
                  )}
                  className="h-2 bg-red-100"
                />
              </div>
              <Button
                className="w-full"
                onClick={() => router.push("/sellers")}
              >
                Process Verifications
              </Button>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-card-header">
              <h2 className="insight-card-title">Top Sellers</h2>
              <Button
                variant="ghost"
                size="sm"
                className="text-primary"
                onClick={() => router.push("/sellers")}
              >
                View All
              </Button>
            </div>
            <div className="insight-card-content">
              <div className="space-y-4">
                {topSellers.map((seller: any, i: any) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border">
                        <AvatarFallback>
                          {seller.name?.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{seller.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="text-yellow-500">★</span>{" "}
                          {seller.quotes_count}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {seller.quotes_count} quotes
                    </div>
                  </div>
                ))}
                {/* {[
                  { name: "AutoParts Pro", rating: 4.9, quotations: 145 },
                  { name: "SpareParts Hub", rating: 4.8, quotations: 132 },
                  { name: "CarParts Direct", rating: 4.7, quotations: 118 },
                  { name: "Auto Store Plus", rating: 4.6, quotations: 97 },
                ].map((seller, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9 border">
                        <AvatarFallback>
                          {seller.name.substring(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium">{seller.name}</p>
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <span className="text-yellow-500">★</span>{" "}
                          {seller.rating}
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {seller.quotations} quotes
                    </div>
                  </div>
                ))} */}
              </div>
            </div>
          </div>

          <div className="insight-card">
            <div className="insight-card-header">
              <div className="flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 text-yellow-500" />
                <h2 className="insight-card-title">System Alerts</h2>
              </div>
              <Badge variant="outline" className="text-yellow-600">
                {systemAlerts.warnings} Warnings
              </Badge>
            </div>
            <div className="insight-card-content space-y-4">
              {systemAlerts.map((alert: any, i: any) => (
                <div
                  key={i}
                  className={`rounded-lg border p-4 ${
                    alert.type === "warning"
                      ? "border-yellow-200 bg-yellow-50 dark:border-yellow-900/50 dark:bg-yellow-900/20"
                      : "border-blue-200 bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/20"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="h-4 w-4 text-yellow-600" />
                    <h3 className="font-medium text-yellow-800 dark:text-yellow-300">
                      {alert.message}
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                    {alert.details}
                  </p>
                </div>
              ))}
              {/* <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-900/50 dark:bg-yellow-900/20">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <h3 className="font-medium text-yellow-800 dark:text-yellow-300">
                    High enquiry volume
                  </h3>
                </div>
                <p className="mt-1 text-sm text-yellow-700 dark:text-yellow-400">
                  Enquiry volume is 23% higher than normal. Consider adding more
                  staff.
                </p>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                  <span className="text-sm">Pending verifications</span>
                  <Badge variant="outline" className="text-blue-600">
                    Info
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                  <span className="text-sm">Server performance</span>
                  <Badge variant="outline" className="text-green-600">
                    Good
                  </Badge>
                </div>
                <div className="flex items-center justify-between rounded-md bg-muted/50 p-2">
                  <span className="text-sm">Database storage</span>
                  <Badge variant="outline" className="text-yellow-600">
                    75%
                  </Badge>
                </div>
              </div> */}

              <Button variant="outline" className="w-full">
                View All Alerts
              </Button>
            </div>
          </div>
        </div>
      </div>
    </SidebarInset>
  );
}
