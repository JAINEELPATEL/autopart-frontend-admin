import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AppSidebar } from "@/components/app-sidebar";
import { Providers } from "./providers";
import { ProtectedRoute } from "@/components/protected-route";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Admin Dashboard - Vehicle Parts Marketplace",
  description: "Admin panel for managing buyers, sellers, and transactions",
  generator: "v0.dev",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          <ProtectedRoute>
            {/* AppSidebar will be rendered by the protected route component */}
            {children}
          </ProtectedRoute>
        </Providers>
      </body>
    </html>
  );
}
