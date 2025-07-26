"use client";

import { SidebarInset, SidebarTrigger } from "../../components/ui/sidebar";
import { Blocks } from "lucide-react";

export default function BlogsPage() {
  return (
    <SidebarInset>
      <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b bg-background px-6">
        <div className="flex items-center gap-2">
          <Blocks className="h-6 w-6 " />
          <h1 className="text-xl font-semibold">Blogs</h1>
        </div>
      </header>

      <div className="p-6">
        <div className="text-muted-foreground text-sm">
          This is the blogs management page.
        </div>
      </div>
    </SidebarInset>
  );
}