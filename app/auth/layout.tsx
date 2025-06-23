import type { ReactNode } from "react";
import { Inter } from "next/font/google";
import { Providers } from "../providers";
import "../globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "Admin Authentication - Vehicle Parts Marketplace",
  description: "Login or signup to access the admin dashboard",
  generator: "v0.dev",
};

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <Providers>
      <main className={inter.className + " flex-1"}>{children}</main>
    </Providers>
  );
}
