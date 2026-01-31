import { LogOut, User } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate } from "react-router-dom";
import Logo from "@/components/Logo";
import { useRole } from "@/hooks/useRole";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";

export function AppSidebar() {
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { role, navigation, displayInfo } = useRole();

  const handleLogout = () => {
    sessionStorage.removeItem("selectedRole");
    navigate("/");
  };

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border">
      {/* Header with logo */}
      <SidebarHeader className="p-4 border-b border-sidebar-border">
        {isCollapsed ? (
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground font-semibold text-sm">C</span>
          </div>
        ) : (
          <Logo size="sm" />
        )}
      </SidebarHeader>

      <SidebarContent className="p-2">
        {/* Role indicator */}
        {!isCollapsed && (
          <div className="px-3 py-2 mb-2">
            <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium ${displayInfo.color} text-white`}>
              <span>{displayInfo.label} Portal</span>
            </div>
          </div>
        )}

        {/* Main navigation */}
        <SidebarGroup>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.mainNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      end={item.url === navigation.baseUrl}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Secondary navigation */}
        <SidebarGroup className="mt-4">
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            More
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.secondaryNav.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    tooltip={item.title}
                  >
                    <NavLink
                      to={item.url}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                      activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                    >
                      <item.icon className="w-5 h-5 shrink-0" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user info */}
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className={`w-9 h-9 rounded-full ${displayInfo.color}/10 flex items-center justify-center shrink-0`}>
            <User className="w-4 h-4 text-primary" />
          </div>
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Alex Johnson</p>
              <p className="text-xs text-muted-foreground truncate">{displayInfo.label}</p>
            </div>
          )}
          {!isCollapsed && (
            <button 
              onClick={handleLogout}
              className="p-2 hover:bg-sidebar-accent rounded-lg transition-colors text-muted-foreground hover:text-foreground"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
