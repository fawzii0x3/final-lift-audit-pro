import { type PropsWithChildren } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "./AppSidebar";

export function AppLayout({ children }: PropsWithChildren) {
  return (
    <SidebarProvider>
      <header className="h-12 flex items-center justify-between border-b bg-background px-4">
        <div className="flex items-center space-x-3">
          <SidebarTrigger />
        </div>
      </header>

      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <main className="flex-1 p-6">{children}</main>
      </div>
    </SidebarProvider>
  );
}
