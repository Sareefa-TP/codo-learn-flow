import { useState, useEffect } from "react";
import { LogOut, RefreshCw, ChevronDown } from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useNavigate, useLocation } from "react-router-dom";
import Logo from "@/components/Logo";
import { useRole } from "@/hooks/useRole";
import { Badge } from "@/components/ui/badge";
import { studentData } from "@/data/studentData";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
  SidebarMenuSubButton,
  SidebarFooter,
  SidebarHeader,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

// Badge data type
interface SidebarBadge {
  text?: string;
  subtext?: string;
  variant?: "success" | "default";
  count?: number;
  label?: string;
  upsell?: string;
}

// Create dynamic sidebar badges from studentData
const getStudentBadges = (): Record<string, SidebarBadge> => ({
  "/student/attendance": {
    text: `${studentData.attendance.percentage}%`,
    subtext: studentData.attendance.provider,
    variant: "success"
  },
  "/student/notifications": {
    count: studentData.notifications.filter(n => !n.is_read).length
  },
  "/student/my-course": {
    upsell: "Advanced Mastery"
  },
});

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { role, navigation, displayInfo } = useRole();

  // Initialize open groups based on current URL
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>(() => {
    const initialState: Record<string, boolean> = {};

    // Find if current path is a child of any mainNav item
    navigation.mainNav.forEach(item => {
      if (item.children) {
        const isActiveChild = item.children.some(child =>
          location.pathname.startsWith(child.url) ||
          (child.url === navigation.baseUrl && location.pathname === navigation.baseUrl)
        );
        if (isActiveChild) {
          initialState[item.title] = true;
        }
      }
    });

    return initialState;
  });

  // Watch for route changes to keep relevant menus open
  useEffect(() => {
    setOpenGroups(prev => {
      const newState = { ...prev };
      let changed = false;

      navigation.mainNav.forEach(item => {
        if (item.children) {
          const isActiveChild = item.children.some(child =>
            location.pathname.startsWith(child.url) ||
            (child.url === navigation.baseUrl && location.pathname === navigation.baseUrl)
          );
          if (isActiveChild && !prev[item.title]) {
            newState[item.title] = true;
            changed = true;
          }
        }
      });

      return changed ? newState : prev;
    });
  }, [location.pathname, navigation.mainNav, navigation.baseUrl]);

  const handleLogout = () => {
    sessionStorage.removeItem("selectedRole");
    navigate("/");
  };

  // Get badge info for a nav item
  const getBadgeForPath = (path: string) => {
    if (role !== "student") return null;
    const badges = getStudentBadges();
    return badges[path] || null;
  };

  // Render badge based on type
  const renderBadge = (badgeData: SidebarBadge | null, isCollapsed: boolean) => {
    if (!badgeData) return null;

    if (badgeData.count !== undefined && badgeData.count > 0) {
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
      {/* Header with logo toggle */}
      <SidebarHeader className="p-0 border-b border-sidebar-border">
        <button
          onClick={toggleSidebar}
          className={cn(
            "flex items-center justify-center w-full hover:bg-primary/5 transition-colors group/logo overflow-hidden h-12"
          )}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center shrink-0 group-hover/logo:scale-110 transition-transform">
              <span className="text-primary-foreground font-semibold text-sm">C</span>
            </div>
          ) : (
            <Logo size="sm" />
          )}
        </button>
      </SidebarHeader>

      <SidebarContent className={cn(isCollapsed ? "p-0" : "p-2")}>
        {/* Main navigation */}
        <SidebarGroup className={cn(isCollapsed && "p-0")}>
          <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
            Main Menu
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className={cn(isCollapsed ? "gap-5 items-center" : "gap-1")}>
              {navigation.mainNav.map((item) => {
                const badgeData = getBadgeForPath(item.url);

                // ── Collapsible group (items with children) ──────────────
                if (item.children && item.children.length > 0) {
                  const isOpen = !!openGroups[item.title];
                  return (
                    <Collapsible
                      key={item.title}
                      open={isOpen}
                      onOpenChange={(open) =>
                        setOpenGroups(prev => ({ ...prev, [item.title]: open }))
                      }
                    >
                      <SidebarMenuItem className={isCollapsed ? "w-full flex justify-center" : ""}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className={cn(
                              "flex items-center rounded-xl transition-colors w-full",
                              isCollapsed ? "justify-center h-12 w-full p-0 !size-auto flex-col" : "gap-3 px-3 py-2.5"
                            )}
                          >
                            <item.icon className={cn("shrink-0", isCollapsed ? "w-5 h-5" : "w-5 h-5")} />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1 text-left">{item.title}</span>
                                <ChevronDown
                                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                    }`}
                                />
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent>
                          <SidebarMenuSub>
                            {item.children.map(child => (
                              <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink
                                    to={child.url}
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg transition-colors text-sm"
                                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                                  >
                                    <child.icon className={cn("shrink-0", isCollapsed ? "w-4 h-4" : "w-4 h-4")} />
                                    {!isCollapsed && <span>{child.title}</span>}
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            ))}
                          </SidebarMenuSub>
                        </CollapsibleContent>
                      </SidebarMenuItem>
                    </Collapsible>
                  );
                }

                // ── Flat item (no children) — original rendering ─────────
                return (
                  <SidebarMenuItem key={item.title} className={isCollapsed ? "w-full flex justify-center" : ""}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        isCollapsed && "h-12 w-full p-0 flex items-center justify-center !size-auto"
                      )}
                    >
                      <NavLink
                        to={item.url}
                        end={item.url === navigation.baseUrl}
                        className={cn(
                          "flex items-center rounded-xl transition-colors group relative",
                          isCollapsed ? "justify-center h-full w-full p-0" : "gap-3 px-3 py-2.5"
                        )}
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                      >
                        <item.icon className={cn("shrink-0 w-5 h-5")} />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1">{item.title}</span>
                            {renderBadge(badgeData, isCollapsed)}
                          </>
                        )}
                        {isCollapsed && badgeData?.count && badgeData.count > 0 && (
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
        {navigation.secondaryNav.length > 0 && (
          <SidebarGroup className={cn(isCollapsed ? "mt-2 p-0" : "mt-4")}>
            {role !== "tutor" && (
              <SidebarGroupLabel className={isCollapsed ? "sr-only" : ""}>
                More
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className={cn(isCollapsed ? "gap-5 items-center" : "gap-1")}>
                {navigation.secondaryNav.map((item) => {
                  const badgeData = getBadgeForPath(item.url);
                  return (
                    <SidebarMenuItem key={item.title} className={isCollapsed ? "w-full flex justify-center" : ""}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={cn(
                          isCollapsed && "h-12 w-full p-0 flex items-center justify-center !size-auto"
                        )}
                      >
                        <NavLink
                          to={item.url}
                          className={cn(
                            "flex items-center rounded-xl transition-colors relative",
                            isCollapsed ? "justify-center h-full w-full p-0" : "gap-3 px-3 py-2.5"
                          )}
                          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground font-medium"
                        >
                          <item.icon className={cn("shrink-0 w-5 h-5")} />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1">{item.title}</span>
                              {renderBadge(badgeData, isCollapsed)}
                            </>
                          )}
                          {isCollapsed && badgeData?.count && badgeData.count > 0 && (
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
        )}
      </SidebarContent>

      {/* Footer with user info */}
      <SidebarFooter className="p-3 border-t border-sidebar-border">
        <div
          onClick={() => navigate(role === "superadmin" ? "/super-admin/profile" : `/${role}/profile`)}
          className="flex items-center gap-3 p-2 rounded-xl hover:bg-sidebar-accent transition-all cursor-pointer group/profile"
        >
          {role === "student" ? (
            <img
              src={studentData.profile.avatar}
              alt="Profile"
              className="w-9 h-9 rounded-full shrink-0 border border-transparent group-hover/profile:border-primary/30 transition-colors"
            />
          ) : (
            <div className={`w-9 h-9 rounded-full ${displayInfo.color}/10 flex items-center justify-center shrink-0 group-hover/profile:bg-primary/20 transition-colors`}>
              <span className="text-sm font-medium text-primary">
                {displayInfo.label.charAt(0)}
              </span>
            </div>
          )}
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate group-hover/profile:text-primary transition-colors">
                {role === "student" ? studentData.profile.name : "Alex Johnson"}
              </p>
              <p className="text-xs text-muted-foreground truncate">{displayInfo.label}</p>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleLogout();
              }}
              className="p-2 hover:bg-primary/10 rounded-lg transition-colors text-muted-foreground hover:text-primary"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
