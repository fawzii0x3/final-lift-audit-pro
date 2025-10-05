import {
  LayoutDashboard,
  ClipboardList,
  Users,
  UserCog,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { use } from "react";
import { AuthContext } from "../auth/context.tsx";
import { NavLink } from "react-router";
const navigationItems = [
  {
    title: "Tableau de bord",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Inspections",
    url: "/inspections",
    icon: ClipboardList,
  },
  {
    title: "Clients",
    url: "/clients",
    icon: Users,
  },
  {
    title: "Techniciens",
    url: "/technicians",
    icon: UserCog,
  },
];
export function AppSidebar() {
  const { state } = useSidebar();
  const { signOut } = use(AuthContext);
  const getNavCls = ({ isActive }: { isActive: boolean }) =>
    isActive
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium shadow-sm border-l-2 border-sidebar-primary"
      : "hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground transition-all duration-200";
  const isCollapsed = state === "collapsed";
  return (
    <Sidebar
      className={`${isCollapsed ? "w-32" : "w-64"} transition-all duration-300 ease-in-out shadow-lg border-r border-sidebar-border`}
      collapsible="icon"
    >
      <SidebarTrigger className="m-3 self-end hover:bg-sidebar-accent/50 transition-colors duration-200 rounded-md" />

      <SidebarContent className="px-2">
        {/* Branding Section */}
        {!isCollapsed && (
          <div className="p-4 border-b border-sidebar-border/50 mb-1">
            <div className="flex items-center space-x-3">
              <div className="flex flex-col">
                <span className="font-semibold text-sidebar-foreground text-sm">
                  Pont Roulant
                </span>
                <span className="text-xs text-sidebar-foreground/70">
                  Inspection System
                </span>
              </div>
            </div>
          </div>
        )}

        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {navigationItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild className="relative">
                    <NavLink
                      to={item.url}
                      end
                      className={({ isActive }) =>
                        `flex items-center px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${getNavCls(
                          {
                            isActive,
                          },
                        )}`
                      }
                    >
                      <item.icon
                        className={`h-5 w-5 ${!isCollapsed ? "mr-3" : ""} transition-colors duration-200`}
                      />
                      {!isCollapsed && (
                        <span className="transition-opacity duration-200">
                          {item.title}
                        </span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Sign Out Section */}
        <div className="mt-auto p-3 border-t border-sidebar-border/50">
          <Button
            variant="outline"
            size="sm"
            onClick={signOut}
            className={`w-full justify-start bg-transparent border-destructive/20 text-destructive hover:bg-destructive/10 hover:border-destructive/30 transition-all duration-200 ${isCollapsed ? "px-0" : ""}`}
          >
            <LogOut className={`h-4 w-4 ${!isCollapsed ? "mr-2" : ""}`} />
            {!isCollapsed && <span className="font-medium">Déconnexion</span>}
          </Button>
        </div>
      </SidebarContent>
    </Sidebar>
  );
}
