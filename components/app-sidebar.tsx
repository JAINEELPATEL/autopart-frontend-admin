"use client";

import {
  BarChart3,
  Users,
  ShoppingCart,
  MessageSquare,
  HelpCircle,
  Settings,
  Car,
  FileText,
  Shield,
  LogOut,
  User,
  Bell,
  Sun,
  Moon,
  Loader2,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTheme } from "next-themes";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useDispatch, useSelector } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { useRouter } from "next/navigation";
import { logout, getCurrentAdmin } from "@/store/slices/authSlice";
import { useEffect, useState } from "react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import React from "react";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: BarChart3,
  },
  {
    title: "Sellers",
    url: "/sellers",
    icon: Users,
  },
  {
    title: "Buyers",
    url: "/buyers",
    icon: ShoppingCart,
  },
  {
    title: "Enquiries",
    url: "/enquiries",
    icon: Car,
  },
  {
    title: "Quotations",
    url: "/quotations",
    icon: FileText,
  },
  {
    title: "Messages",
    url: "/messages",
    icon: MessageSquare,
  },
  {
    title: "Support Tickets",
    url: "/tickets",
    icon: HelpCircle,
  },
];

export function AppSidebar() {
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();
  const { admin, isAuthenticated, loading } = useSelector(
    (state: RootState) => state.auth
  );
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const pathname = usePathname();
  const { setTheme } = useTheme();

  // Fetch admin details on component mount if authenticated but no admin data
  useEffect(() => {
    if (isAuthenticated && !admin && !loading) {
      dispatch(getCurrentAdmin());
    }
  }, [isAuthenticated, admin, loading, dispatch]);
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await dispatch(logout()).unwrap();
      router.push("/auth/login");
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Generate initials from admin name
  const getAdminInitials = () => {
    if (!admin?.name) return "AD";
    return admin.name
      .split(" ")
      .map((name) => name.charAt(0))
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Get admin display name
  const getAdminDisplayName = () => {
    if (!admin?.name) return "Admin User";
    return admin.name;
  };

  // Get admin display email
  const getAdminDisplayEmail = () => {
    if (!admin?.email) return "admin@example.com";
    return admin.email;
  };

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="flex items-center gap-3 px-4 py-3">
          <Shield className="h-8 w-8 text-primary" />
          <div>
            <h2 className="text-lg font-bold">Insight</h2>
            <p className="text-xs text-muted-foreground">Vehicle Parts Admin</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarSeparator />
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Main Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={pathname === item.url}>
                    <Link href={item.url}>
                      <item.icon className="h-5 w-5" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <div className="px-4 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-9 w-9">
                {/* <AvatarImage
                  src="/placeholder.svg?height=36&width=36"
                  alt="Admin"
                /> */}
                <AvatarImage
                  src={"/placeholder.svg?height=36&width=36"}
                  alt={getAdminDisplayName()}
                />
                <AvatarFallback>
                  {loading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    getAdminInitials()
                  )}
                </AvatarFallback>
                {/* <AvatarFallback>AD</AvatarFallback> */}
              </Avatar>
              <div>
                <p className="text-sm font-medium">
                  {loading ? "Loading..." : getAdminDisplayName()}
                </p>
                <p className="text-xs text-muted-foreground">
                  {loading ? "..." : getAdminDisplayEmail()}
                </p>
              </div>
            </div>
            <div className="flex gap-1">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Bell className="h-4 w-4" />
                    <span className="sr-only">Notifications</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem>New seller registration</DropdownMenuItem>
                  <DropdownMenuItem>Urgent support ticket</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <Settings className="h-4 w-4" />
                    <span className="sr-only">Settings</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Light
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Dark
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={handleLogout}
                    disabled={isLoggingOut}
                  >
                    {isLoggingOut ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Logging out...
                      </>
                    ) : (
                      <>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                      </>
                    )}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
