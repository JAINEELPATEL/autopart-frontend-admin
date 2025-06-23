"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/store";
import { getCurrentAdmin } from "@/store/slices/authSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { AppSidebar } from "@/components/app-sidebar";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated, token } = useSelector(
    (state: RootState) => state.auth
  );

  // Check if current path is an auth page
  const isAuthPage = pathname?.startsWith("/auth/");

  useEffect(() => {
    const checkAuth = async () => {
      // If we're on an auth page and already authenticated, redirect to home
      if (isAuthPage && isAuthenticated) {
        router.push("/");
        return;
      }

      // If we're not on an auth page and there's no token, redirect to login
      if (!isAuthPage && !token) {
        router.push("/auth/login");
        return;
      }

      // If we have a token and we're not on an auth page, verify the token
      if (!isAuthPage && token) {
        try {
          await dispatch(getCurrentAdmin()).unwrap();
        } catch (error) {
          router.push("/auth/login");
          return;
        }
      }

      setIsLoading(false);
    };

    checkAuth();
  }, [dispatch, router, token, isAuthPage, isAuthenticated, pathname]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="space-y-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <Skeleton className="h-4 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>
    );
  }

  // If we're on an auth page, render children without sidebar
  if (isAuthPage) {
    return <>{children}</>;
  }

  // If we're authenticated, render children with sidebar
  if (isAuthenticated) {
    return (
      <div className="flex min-h-screen w-full overflow-x-hidden">
        <AppSidebar />
        <main className="flex-1 overflow-x-auto">{children}</main>
      </div>
    );
  }

  // This should never happen as we redirect in useEffect
  return null;
}
