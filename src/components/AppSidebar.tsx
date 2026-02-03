import { LogOut, RefreshCw } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import { useRole } from "@/hooks/useRole";
import { Badge } from "@/components/ui/badge";

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

// Badge data type
interface SidebarBadge {
  text?: string;
  subtext?: string;
  variant?: "success" | "default";
  count?: number;
  label?: string;
  upsell?: string;
}

// Student-specific sidebar data with badges
const studentSidebarData = {
  profile: {
    name: "Alex Rivera",
    badge: "Pro Student",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=Alex",
  },
  badges: {
    "/student/attendance": { text: "94%", subtext: "Auto-sync active", variant: "success" } as SidebarBadge,
    "/student/notifications": { count: 2 } as SidebarBadge,
    "/student/wallet": { text: "Paid", subtext: "Next due: March 15" } as SidebarBadge,
    "/student/certificates": { count: 2, label: "earned" } as SidebarBadge,
    "/student/packages": { upsell: "Advance AI Mastery" } as SidebarBadge,
  } as Record<string, SidebarBadge>,
};

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { role, navigation, displayInfo } = useRole();

  const handleLogout = () => {
    sessionStorage.removeItem("selectedRole");
    navigate("/");
  };

  // Get badge info for a nav item
  const getBadgeForPath = (path: string) => {
    if (role !== "student") return null;
    return studentSidebarData.badges[path as keyof typeof studentSidebarData.badges] || null;
  };

  // Render badge based on type
  const renderBadge = (badgeData: any, isCollapsed: boolean) => {
    if (!badgeData) return null;

    if (badgeData.count !== undefined) {
      return (
        <span className="relative flex h-5 min-w-5 items-center justify-center">
          <span className="absolute inline-flex rounded-full h-2.5 w-2.5 bg-destructive animate-pulse" />
          {!isCollapsed && (
            <Badge variant="destructive" className="ml-2 text-xs h-5 min-w-5 flex items-center justify-center">
              {badgeData.count}
            </Badge>
          )}
        </span>
      );
    }

    if (badgeData.text && !isCollapsed) {
      return (
        <div className="flex flex-col items-end ml-auto">
          <Badge 
            variant={badgeData.variant === "success" ? "default" : "secondary"}
            className={`text-xs ${badgeData.variant === "success" ? "bg-primary/10 text-primary" : ""}`}
          >
            {badgeData.text}
          </Badge>
          {badgeData.subtext && (
            <span className="text-[10px] text-muted-foreground flex items-center gap-1 mt-0.5">
              <RefreshCw className="w-2.5 h-2.5" />
              {badgeData.subtext}
            </span>
          )}
        </div>
      );
    }

    if (badgeData.upsell && !isCollapsed) {
      return (
        <Badge variant="outline" className="text-xs border-primary/30 text-primary ml-auto">
          ⭐ New
        </Badge>
      );
    }

    return null;
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
        {/* Profile Section (Student only) */}
        {role === "student" && !isCollapsed && (
          <div className="px-3 py-4 mb-2 rounded-lg bg-gradient-to-br from-primary/5 to-accent/10 border border-primary/10">
            <div className="flex items-center gap-3">
              <img 
                src={studentSidebarData.profile.avatar}
                alt={studentSidebarData.profile.name}
                className="w-10 h-10 rounded-full border-2 border-primary/20"
              />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {studentSidebarData.profile.name}
                </p>
                <Badge variant="secondary" className="text-xs bg-primary/10 text-primary mt-0.5">
                  {studentSidebarData.profile.badge}
                </Badge>
              </div>
            </div>
          </div>
        )}

        {/* Role indicator for non-students */}
        {role !== "student" && !isCollapsed && (
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
              {navigation.mainNav.map((item) => {
                const badgeData = getBadgeForPath(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                    >
                      <NavLink
                        to={item.url}
                        end={item.url === navigation.baseUrl}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors group"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {renderBadge(badgeData, isCollapsed)}
                          </>
                        )}
                        {isCollapsed && badgeData?.count && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                            {badgeData.count}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
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
              {navigation.secondaryNav.map((item) => {
                const badgeData = getBadgeForPath(item.url);
                return (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                    >
                      <NavLink
                        to={item.url}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors relative"
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className="w-5 h-5 shrink-0" />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {renderBadge(badgeData, isCollapsed)}
                          </>
                        )}
                        {isCollapsed && badgeData?.count && (
                          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                            {badgeData.count}
                          </span>
                        )}
                      </NavLink>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer with user info */}
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          {role === "student" ? (
            <img 
              src={studentSidebarData.profile.avatar}
              alt="Profile"
              className="w-9 h-9 rounded-full shrink-0"
            />
          ) : (
            <div className={`w-9 h-9 rounded-full ${displayInfo.color}/10 flex items-center justify-center shrink-0`}>
              <span className="text-sm font-medium text-primary">
                {displayInfo.label.charAt(0)}
              </span>
            </div>
          )}
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">
                {role === "student" ? studentSidebarData.profile.name : "Alex Johnson"}
              </p>
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
