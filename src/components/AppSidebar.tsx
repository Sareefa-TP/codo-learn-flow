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
});

export function AppSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state, toggleSidebar, isMobile, setOpenMobile } = useSidebar();
  const isCollapsed = state === "collapsed";
  const { role, navigation, displayInfo } = useRole();
  const navButtonBase =
    "group/menu-item flex items-center rounded-xl border border-transparent transition-all duration-300 hover:border-sidebar-border/70 hover:bg-sidebar-accent/70 hover:shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring focus-visible:ring-offset-2 focus-visible:ring-offset-sidebar data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground data-[active=true]:border-sidebar-border/80 data-[active=true]:shadow-sm";

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

  // Close the mobile sheet after navigation for smoother UX.
  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false);
    }
  }, [isMobile, location.pathname, setOpenMobile]);

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
          <span className="absolute inline-flex rounded-full h-2.5 w-2.5 bg-destructive animate-pulse shadow-[0_0_0_3px_hsl(var(--background))]" />
          {!isCollapsed && (
            <Badge variant="destructive" className="ml-2 text-xs h-5 min-w-5 rounded-full px-1.5 font-semibold flex items-center justify-center">
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
            className={`text-[11px] rounded-full ${badgeData.variant === "success" ? "bg-primary/10 text-primary border border-primary/20" : ""}`}
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
        <Badge variant="outline" className="text-[11px] rounded-full border-primary/30 text-primary ml-auto bg-primary/5">
          ⭐ New
        </Badge>
      );
    }

    return null;
  };

  return (
    <Sidebar
      collapsible="icon"
      className="border-x border-sidebar-border/70 bg-gradient-to-b from-sidebar via-sidebar to-sidebar/95 shadow-[inset_1px_0_0_hsl(var(--sidebar-border)/0.38),inset_-1px_0_0_hsl(var(--sidebar-border)/0.7),0_18px_44px_hsl(160_25%_6%_/_0.22)] backdrop-blur supports-[backdrop-filter]:bg-sidebar/90"
    >
      {/* Header with logo toggle */}
      <SidebarHeader className="border-b border-sidebar-border/70 p-2 md:p-2.5">
        <button
          onClick={toggleSidebar}
          className={cn(
            "group/logo flex w-full items-center justify-center overflow-hidden rounded-xl px-2 transition-all duration-300",
            isCollapsed ? "h-14 md:h-[3.75rem]" : "h-[5.25rem] md:h-[5.5rem]",
            !isCollapsed && "border border-sidebar-border/70 bg-transparent",
            isCollapsed && "border-transparent bg-transparent"
          )}
          title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
          {isCollapsed ? (
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-sidebar-accent/30 transition-transform duration-300 group-hover/logo:scale-105">
              <img
                src="/favicon.ico"
                alt="CODO"
                className="h-5 w-5 object-contain"
              />
            </div>
          ) : (
            <div className="flex h-full w-full items-center justify-center rounded-2xl bg-transparent px-3 py-2 shadow-soft">
              <div className="flex w-full max-w-[13.5rem] flex-col items-center justify-center text-center">
                <Logo tone="light" size="sm" className="w-full justify-center drop-shadow-[0_2px_12px_hsl(145_60%_55%_/_0.18)]" />
                <p className="mt-1 truncate text-center text-[8.5px] uppercase tracking-[0.12em] text-sidebar-foreground/55 sm:text-[9px]">
                  CODO AI Innovations
                </p>
              </div>
            </div>
          )}
        </button>
      </SidebarHeader>

      <SidebarContent className={cn(isCollapsed ? "p-1.5" : "p-2.5 md:p-3")}>
        {/* Main navigation */}
        <SidebarGroup className={cn(isCollapsed && "px-0")}>
          {role !== "advisor" && (
            <SidebarGroupLabel className={cn(isCollapsed ? "sr-only" : "px-3 text-[11px] uppercase tracking-[0.08em] text-muted-foreground/80")}>
              Main Menu
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className={cn(isCollapsed ? "gap-2 items-center px-0.5" : "gap-1.5")}>
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
                      <SidebarMenuItem className={isCollapsed ? "flex justify-center" : ""}>
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton
                            tooltip={item.title}
                            className={cn(
                              navButtonBase,
                              "w-full",
                              isCollapsed ? "h-10 w-10 justify-center rounded-xl p-0 !size-auto" : "gap-3 px-3 py-2.5"
                            )}
                          >
                            <item.icon className={cn("shrink-0", isCollapsed ? "w-5 h-5" : "w-5 h-5")} />
                            {!isCollapsed && (
                              <>
                                <span className="flex-1 text-left text-sm font-medium">{item.title}</span>
                                <ChevronDown
                                  className={`w-4 h-4 shrink-0 text-muted-foreground transition-transform duration-200 ${isOpen ? "rotate-180" : ""
                                    }`}
                                />
                              </>
                            )}
                          </SidebarMenuButton>
                        </CollapsibleTrigger>

                        <CollapsibleContent className="pt-1">
                          <SidebarMenuSub className="ml-4 border-l border-sidebar-border/60 pl-2">
                            {item.children.map(child => (
                              <SidebarMenuSubItem key={child.title}>
                                <SidebarMenuSubButton asChild>
                                  <NavLink
                                    to={child.url}
                                    className="flex items-center gap-2 rounded-lg border border-transparent px-3 py-2 text-sm transition-all duration-300 hover:border-sidebar-border/60 hover:bg-sidebar-accent/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sidebar-ring"
                                    activeClassName="bg-sidebar-accent text-sidebar-accent-foreground border-sidebar-border/80 shadow-sm font-medium"
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
                  <SidebarMenuItem key={item.title} className={isCollapsed ? "flex justify-center" : ""}>
                    <SidebarMenuButton
                      asChild
                      tooltip={item.title}
                      className={cn(
                        navButtonBase,
                        isCollapsed && "h-10 w-10 rounded-xl p-0 flex items-center justify-center !size-auto"
                      )}
                    >
                      <NavLink
                        to={item.url}
                        end={item.url === navigation.baseUrl}
                        className={cn(
                          "flex items-center rounded-xl transition-all duration-200 group relative",
                          isCollapsed ? "h-full w-full justify-center p-0" : "gap-3 px-3 py-2.5"
                        )}
                        activeClassName="bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border/80 shadow-sm font-medium"
                      >
                        <item.icon className={cn("shrink-0 w-5 h-5")} />
                        {!isCollapsed && (
                          <>
                            <span className="flex-1 text-sm font-medium">{item.title}</span>
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
          <SidebarGroup className={cn(isCollapsed ? "mt-2 px-0" : "mt-5")}>
            {role !== "tutor" && (
              <SidebarGroupLabel className={cn(isCollapsed ? "sr-only" : "px-3 text-[11px] uppercase tracking-[0.08em] text-muted-foreground/80")}>
                More
              </SidebarGroupLabel>
            )}
            <SidebarGroupContent>
              <SidebarMenu className={cn(isCollapsed ? "gap-2 items-center px-0.5" : "gap-1.5")}>
                {navigation.secondaryNav.map((item) => {
                  const badgeData = getBadgeForPath(item.url);
                  return (
                    <SidebarMenuItem key={item.title} className={isCollapsed ? "flex justify-center" : ""}>
                      <SidebarMenuButton
                        asChild
                        tooltip={item.title}
                        className={cn(
                          navButtonBase,
                          isCollapsed && "h-10 w-10 rounded-xl p-0 flex items-center justify-center !size-auto"
                        )}
                      >
                        <NavLink
                          to={item.url}
                          className={cn(
                            "flex items-center rounded-xl transition-all duration-200 relative",
                            isCollapsed ? "h-full w-full justify-center p-0" : "gap-3 px-3 py-2.5"
                          )}
                          activeClassName="bg-sidebar-accent text-sidebar-accent-foreground border border-sidebar-border/80 shadow-sm font-medium"
                        >
                          <item.icon className={cn("shrink-0 w-5 h-5")} />
                          {!isCollapsed && (
                            <>
                              <span className="flex-1 text-sm font-medium">{item.title}</span>
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
      <SidebarFooter
        className={cn(
          "border-t border-sidebar-border/70 pb-[max(0.75rem,env(safe-area-inset-bottom))]",
          isCollapsed ? "p-2" : "p-3"
        )}
      >
        <div
          onClick={() => navigate(role === "superadmin" ? "/super-admin/profile" : `/${role}/profile`)}
          className={cn(
            "group/profile flex cursor-pointer items-center rounded-2xl border border-sidebar-border/70 bg-sidebar-accent/70 transition-all duration-200",
            isCollapsed ? "mx-auto h-10 w-10 justify-center p-0" : "gap-3 p-2.5"
          )}
        >
          {role === "student" ? (
            <img
              src={studentData.profile.avatar}
              alt="Profile"
              className="w-10 h-10 rounded-full shrink-0 border border-primary/30 transition-colors"
            />
          ) : (
            <div className={`w-10 h-10 rounded-full ${displayInfo.color}/10 flex items-center justify-center shrink-0 bg-primary/20 transition-colors border border-primary/15`}>
              <span className="text-sm font-semibold text-primary">
                {displayInfo.label.charAt(0)}
              </span>
            </div>
          )}
          {!isCollapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate text-primary transition-colors">
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
              className="p-2 hover:bg-primary/10 rounded-xl transition-colors text-muted-foreground hover:text-primary border border-transparent hover:border-primary/20"
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
